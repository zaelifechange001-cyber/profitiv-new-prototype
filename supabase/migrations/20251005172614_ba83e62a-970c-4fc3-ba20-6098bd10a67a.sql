-- Create payout methods table for storing user payment accounts
CREATE TABLE public.payout_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('paypal', 'cashapp', 'bank', 'venmo')),
  account_identifier TEXT NOT NULL, -- email for PayPal/Venmo, cashtag for CashApp, account number for bank
  account_details JSONB DEFAULT '{}'::jsonb, -- additional details like routing number for bank
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_payout_methods_user_id ON public.payout_methods(user_id);

-- Enable RLS
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;

-- Users can manage their own payout methods
CREATE POLICY "Users can view own payout methods"
ON public.payout_methods
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payout methods"
ON public.payout_methods
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payout methods"
ON public.payout_methods
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payout methods"
ON public.payout_methods
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all payout methods
CREATE POLICY "Admins can view all payout methods"
ON public.payout_methods
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add auto-payout settings to profiles
ALTER TABLE public.profiles
ADD COLUMN auto_payout_enabled BOOLEAN DEFAULT false,
ADD COLUMN auto_payout_threshold NUMERIC DEFAULT 10.00,
ADD COLUMN tiv_balance NUMERIC DEFAULT 0,
ADD COLUMN tiv_to_usd_rate NUMERIC DEFAULT 0.01; -- 100 TIV = $1 by default

-- Add trigger for payout_methods updated_at
CREATE TRIGGER update_payout_methods_updated_at
BEFORE UPDATE ON public.payout_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Extend withdrawal_requests to support new payout flow
ALTER TABLE public.withdrawal_requests
ADD COLUMN payout_method_id UUID REFERENCES public.payout_methods(id),
ADD COLUMN auto_processed BOOLEAN DEFAULT false,
ADD COLUMN processing_error TEXT,
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Create function to process automatic payouts
CREATE OR REPLACE FUNCTION public.process_auto_payout(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _profile RECORD;
  _default_method RECORD;
  _request_id UUID;
  _result JSONB;
BEGIN
  -- Get user profile with auto-payout settings
  SELECT * INTO _profile
  FROM public.profiles
  WHERE user_id = _user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Check if auto-payout is enabled
  IF NOT _profile.auto_payout_enabled THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auto-payout not enabled');
  END IF;
  
  -- Check if balance meets threshold
  IF _profile.available_balance < _profile.auto_payout_threshold THEN
    RETURN jsonb_build_object('success', false, 'message', 'Balance below threshold');
  END IF;
  
  -- Get default payout method
  SELECT * INTO _default_method
  FROM public.payout_methods
  WHERE user_id = _user_id AND is_default = true AND is_verified = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'No verified default payout method');
  END IF;
  
  -- Create withdrawal request
  INSERT INTO public.withdrawal_requests (
    user_id,
    amount,
    method,
    payout_method_id,
    auto_processed,
    status
  ) VALUES (
    _user_id,
    _profile.available_balance,
    _default_method.method_type,
    _default_method.id,
    true,
    'processing'
  ) RETURNING id INTO _request_id;
  
  -- Deduct from balance
  UPDATE public.profiles
  SET available_balance = 0
  WHERE user_id = _user_id;
  
  _result := jsonb_build_object(
    'success', true,
    'request_id', _request_id,
    'amount', _profile.available_balance
  );
  
  RETURN _result;
END;
$$;

-- Create function to convert TIV to USD
CREATE OR REPLACE FUNCTION public.convert_tiv_to_usd(_user_id UUID, _tiv_amount NUMERIC)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _profile RECORD;
  _usd_amount NUMERIC;
  _result JSONB;
BEGIN
  IF _user_id IS NULL THEN
    _user_id := auth.uid();
  END IF;
  
  IF _tiv_amount <= 0 THEN
    RAISE EXCEPTION 'TIV amount must be positive';
  END IF;
  
  -- Get user profile
  SELECT * INTO _profile
  FROM public.profiles
  WHERE user_id = _user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Check if user has enough TIV
  IF _profile.tiv_balance < _tiv_amount THEN
    RAISE EXCEPTION 'Insufficient TIV balance';
  END IF;
  
  -- Calculate USD amount
  _usd_amount := _tiv_amount * _profile.tiv_to_usd_rate;
  
  -- Update balances
  UPDATE public.profiles
  SET 
    tiv_balance = tiv_balance - _tiv_amount,
    available_balance = available_balance + _usd_amount,
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES (
    _user_id,
    'tiv_conversion',
    'Converted ' || _tiv_amount || ' TIV to $' || _usd_amount,
    _usd_amount
  );
  
  _result := jsonb_build_object(
    'success', true,
    'tiv_converted', _tiv_amount,
    'usd_received', _usd_amount,
    'new_tiv_balance', (_profile.tiv_balance - _tiv_amount),
    'new_usd_balance', (_profile.available_balance + _usd_amount)
  );
  
  RETURN _result;
END;
$$;