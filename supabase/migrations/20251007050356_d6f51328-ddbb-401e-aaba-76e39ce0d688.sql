-- Update withdrawal function to use $1 minimum threshold
CREATE OR REPLACE FUNCTION public.create_withdrawal_request(_amount numeric, _method text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _current_balance numeric;
  _fee numeric;
  _net_amount numeric;
  _request_id uuid;
  _result jsonb;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate amount
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: must be positive';
  END IF;
  
  IF _amount < 1 THEN
    RAISE EXCEPTION 'Minimum withdrawal amount is $1';
  END IF;
  
  -- Get current balance
  SELECT available_balance INTO _current_balance
  FROM public.profiles
  WHERE user_id = _user_id;
  
  -- Check sufficient balance
  IF _current_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  -- Calculate fee (2% fee)
  _fee := _amount * 0.02;
  _net_amount := _amount - _fee;
  
  -- Create withdrawal request atomically
  INSERT INTO public.withdrawal_requests (user_id, amount, method, fee, net_amount)
  VALUES (_user_id, _amount, _method, _fee, _net_amount)
  RETURNING id INTO _request_id;
  
  -- Deduct from balance immediately
  UPDATE public.profiles
  SET available_balance = available_balance - _amount
  WHERE user_id = _user_id;
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES (
    _user_id,
    'withdrawal_request',
    'Withdrawal request created: ' || _method,
    -_amount
  );
  
  _result := jsonb_build_object(
    'success', true,
    'request_id', _request_id,
    'amount', _amount,
    'fee', _fee,
    'net_amount', _net_amount
  );
  
  RETURN _result;
END;
$$;

-- Enable realtime for withdrawal_requests table for admin monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE withdrawal_requests;