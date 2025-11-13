-- Create admin-only RPC functions for verification management
CREATE OR REPLACE FUNCTION public.admin_approve_verification(
  _user_id uuid,
  _verification_type text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_id uuid;
  _result jsonb;
BEGIN
  -- Get the calling user's ID
  _admin_id := auth.uid();
  
  -- Verify admin role
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Validate verification type
  IF _verification_type NOT IN ('id', 'address') THEN
    RAISE EXCEPTION 'Invalid verification type. Must be id or address';
  END IF;
  
  -- Update verification status
  IF _verification_type = 'id' THEN
    UPDATE public.user_verifications
    SET 
      id_verification_status = 'approved',
      id_reviewed_at = now(),
      id_reviewed_by = _admin_id,
      id_rejection_reason = NULL,
      updated_at = now()
    WHERE user_id = _user_id;
  ELSE
    UPDATE public.user_verifications
    SET 
      address_verification_status = 'approved',
      address_reviewed_at = now(),
      address_reviewed_by = _admin_id,
      address_rejection_reason = NULL,
      updated_at = now()
    WHERE user_id = _user_id;
  END IF;
  
  -- Log the action
  INSERT INTO public.verification_logs (user_id, verification_type, action, status, reviewer_id)
  VALUES (_user_id, _verification_type, 'approve', 'approved', _admin_id);
  
  _result := jsonb_build_object(
    'success', true,
    'message', 'Verification approved successfully'
  );
  
  RETURN _result;
END;
$$;

-- Create admin-only RPC function for rejection
CREATE OR REPLACE FUNCTION public.admin_reject_verification(
  _user_id uuid,
  _verification_type text,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_id uuid;
  _result jsonb;
BEGIN
  -- Get the calling user's ID
  _admin_id := auth.uid();
  
  -- Verify admin role
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Validate verification type
  IF _verification_type NOT IN ('id', 'address') THEN
    RAISE EXCEPTION 'Invalid verification type. Must be id or address';
  END IF;
  
  -- Validate reason
  IF _reason IS NULL OR LENGTH(TRIM(_reason)) = 0 THEN
    RAISE EXCEPTION 'Rejection reason is required';
  END IF;
  
  -- Update verification status
  IF _verification_type = 'id' THEN
    UPDATE public.user_verifications
    SET 
      id_verification_status = 'rejected',
      id_reviewed_at = now(),
      id_reviewed_by = _admin_id,
      id_rejection_reason = _reason,
      updated_at = now()
    WHERE user_id = _user_id;
  ELSE
    UPDATE public.user_verifications
    SET 
      address_verification_status = 'rejected',
      address_reviewed_at = now(),
      address_reviewed_by = _admin_id,
      address_rejection_reason = _reason,
      updated_at = now()
    WHERE user_id = _user_id;
  END IF;
  
  -- Log the action
  INSERT INTO public.verification_logs (user_id, verification_type, action, status, reviewer_id, notes)
  VALUES (_user_id, _verification_type, 'reject', 'rejected', _admin_id, _reason);
  
  _result := jsonb_build_object(
    'success', true,
    'message', 'Verification rejected successfully'
  );
  
  RETURN _result;
END;
$$;

-- Create admin-only RPC function for updating global settings
CREATE OR REPLACE FUNCTION public.admin_update_global_settings(
  _settings jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_id uuid;
  _result jsonb;
BEGIN
  -- Get the calling user's ID
  _admin_id := auth.uid();
  
  -- Verify admin role
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Update TIV to USD rate if provided
  IF _settings ? 'tivToUsdRate' THEN
    UPDATE public.tiv_settings
    SET setting_value = (_settings->>'tivToUsdRate')::numeric,
        updated_at = now()
    WHERE setting_key = 'tiv_to_usd_rate';
  END IF;
  
  -- Update marketplace fee if provided
  IF _settings ? 'marketplaceFee' THEN
    UPDATE public.tiv_settings
    SET setting_value = (_settings->>'marketplaceFee')::numeric,
        updated_at = now()
    WHERE setting_key = 'marketplace_fee';
  END IF;
  
  -- Update withdrawal fee if provided
  IF _settings ? 'withdrawalFee' THEN
    UPDATE public.tiv_settings
    SET setting_value = (_settings->>'withdrawalFee')::numeric,
        updated_at = now()
    WHERE setting_key = 'withdrawal_fee';
  END IF;
  
  -- Log the action
  INSERT INTO public.admin_audit_log (admin_id, action_type, details)
  VALUES (
    _admin_id,
    'global_settings_update',
    jsonb_build_object('settings', _settings)
  );
  
  _result := jsonb_build_object(
    'success', true,
    'message', 'Settings updated successfully'
  );
  
  RETURN _result;
END;
$$;