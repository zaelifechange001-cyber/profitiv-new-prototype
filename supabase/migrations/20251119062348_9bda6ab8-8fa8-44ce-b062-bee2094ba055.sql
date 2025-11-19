-- Enhanced validation for admin_adjust_balance function
CREATE OR REPLACE FUNCTION public.admin_adjust_balance(_target_user_id uuid, _amount numeric, _operation text, _description text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _admin_id uuid;
  _current_balance numeric;
  _new_balance numeric;
  _result jsonb;
BEGIN
  -- Get the calling user's ID
  _admin_id := auth.uid();
  
  -- Verify admin role
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Validate operation
  IF _operation NOT IN ('add', 'subtract') THEN
    RAISE EXCEPTION 'Invalid operation: must be add or subtract';
  END IF;
  
  -- Validate amount (positive and within limits)
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: must be positive';
  END IF;
  
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'Amount exceeds maximum limit of $100,000 per adjustment';
  END IF;
  
  -- Validate description
  IF _description IS NULL OR LENGTH(TRIM(_description)) = 0 THEN
    RAISE EXCEPTION 'Description is required';
  END IF;
  
  IF LENGTH(_description) > 200 THEN
    RAISE EXCEPTION 'Description must be 200 characters or less';
  END IF;
  
  -- Get current balance
  SELECT available_balance INTO _current_balance
  FROM public.profiles
  WHERE user_id = _target_user_id;
  
  IF _current_balance IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Calculate new balance
  IF _operation = 'add' THEN
    _new_balance := _current_balance + _amount;
  ELSE
    _new_balance := _current_balance - _amount;
    IF _new_balance < 0 THEN
      RAISE EXCEPTION 'Insufficient balance: operation would result in negative balance';
    END IF;
  END IF;
  
  -- Update balance atomically
  UPDATE public.profiles
  SET 
    available_balance = _new_balance,
    total_earned = CASE 
      WHEN _operation = 'add' THEN total_earned + _amount
      ELSE total_earned
    END,
    updated_at = now()
  WHERE user_id = _target_user_id;
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES (
    _target_user_id,
    'admin_adjustment',
    _description,
    CASE WHEN _operation = 'add' THEN _amount ELSE -_amount END
  );
  
  -- Log audit trail with high-value flag
  INSERT INTO public.admin_audit_log (admin_id, action_type, target_user_id, details)
  VALUES (
    _admin_id,
    'balance_adjustment',
    _target_user_id,
    jsonb_build_object(
      'operation', _operation,
      'amount', _amount,
      'previous_balance', _current_balance,
      'new_balance', _new_balance,
      'description', _description,
      'high_value', _amount > 10000
    )
  );
  
  -- Return result
  _result := jsonb_build_object(
    'success', true,
    'new_balance', _new_balance,
    'previous_balance', _current_balance
  );
  
  RETURN _result;
END;
$function$;