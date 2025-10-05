-- Phase 1: Critical Security Fixes (Fixed)

-- 1. Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  action_type text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id),
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit log (read-only for admins, no user modifications)
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Update profiles RLS to prevent users from modifying financial fields
-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create policy that allows users to update only non-financial fields
CREATE POLICY "Users can update own profile non-financial fields"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND available_balance = (SELECT available_balance FROM public.profiles WHERE user_id = auth.uid())
    AND total_earned = (SELECT total_earned FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update all profile fields"
  ON public.profiles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Create secure function for admin balance adjustments
CREATE OR REPLACE FUNCTION public.admin_adjust_balance(
  _target_user_id uuid,
  _amount numeric,
  _operation text,
  _description text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  
  -- Validate amount
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: must be positive';
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
  
  -- Log audit trail
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
      'description', _description
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
$$;

-- 4. Secure user_subscriptions table
CREATE POLICY "Only admins can create subscriptions"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Secure withdrawal_requests with balance validation function
CREATE OR REPLACE FUNCTION public.create_withdrawal_request(
  _amount numeric,
  _method text
)
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
  
  IF _amount < 5 THEN
    RAISE EXCEPTION 'Minimum withdrawal amount is $5';
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