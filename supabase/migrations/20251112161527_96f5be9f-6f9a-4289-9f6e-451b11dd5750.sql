-- Create verification status enum
CREATE TYPE public.verification_status AS ENUM ('incomplete', 'pending', 'approved', 'rejected');

-- Create user_verifications table
CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Email verification
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Phone verification
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT false,
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  phone_otp_code TEXT,
  phone_otp_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- ID verification
  id_document_front_url TEXT,
  id_document_back_url TEXT,
  id_selfie_url TEXT,
  id_verification_status verification_status DEFAULT 'incomplete',
  id_submitted_at TIMESTAMP WITH TIME ZONE,
  id_reviewed_at TIMESTAMP WITH TIME ZONE,
  id_reviewed_by UUID REFERENCES auth.users(id),
  id_rejection_reason TEXT,
  
  -- Address verification
  address_proof_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  address_verification_status verification_status DEFAULT 'incomplete',
  address_submitted_at TIMESTAMP WITH TIME ZONE,
  address_reviewed_at TIMESTAMP WITH TIME ZONE,
  address_reviewed_by UUID REFERENCES auth.users(id),
  address_rejection_reason TEXT,
  
  -- Overall status
  overall_status verification_status DEFAULT 'incomplete',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create verification_logs table for audit trail
CREATE TABLE public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  verification_type TEXT NOT NULL, -- 'email', 'phone', 'id', 'address'
  status verification_status NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_verifications
CREATE POLICY "Users can view own verification"
ON public.user_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification"
ON public.user_verifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verification"
ON public.user_verifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications"
ON public.user_verifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all verifications"
ON public.user_verifications
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for verification_logs
CREATE POLICY "Users can view own logs"
ON public.verification_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all logs"
ON public.verification_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert logs"
ON public.verification_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Function to update overall verification status
CREATE OR REPLACE FUNCTION public.update_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update overall status based on individual verifications
  IF NEW.email_verified = true 
     AND NEW.phone_verified = true 
     AND NEW.id_verification_status = 'approved' 
     AND NEW.address_verification_status = 'approved' THEN
    NEW.overall_status := 'approved';
  ELSIF NEW.id_verification_status = 'rejected' 
        OR NEW.address_verification_status = 'rejected' THEN
    NEW.overall_status := 'rejected';
  ELSIF NEW.id_verification_status = 'pending' 
        OR NEW.address_verification_status = 'pending' THEN
    NEW.overall_status := 'pending';
  ELSE
    NEW.overall_status := 'incomplete';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update overall status
CREATE TRIGGER update_verification_status_trigger
BEFORE UPDATE ON public.user_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_verification_status();

-- Function to check if user is verified
CREATE OR REPLACE FUNCTION public.is_user_verified(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_verifications
    WHERE user_id = _user_id
      AND overall_status = 'approved'
  )
$$;

-- Update withdrawal request function to check verification
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
  
  -- Check verification status
  IF NOT public.is_user_verified(_user_id) THEN
    RAISE EXCEPTION 'Verification required. Please complete all verification steps before withdrawing funds.';
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