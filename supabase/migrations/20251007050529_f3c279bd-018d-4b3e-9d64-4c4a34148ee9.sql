-- Feature #2: TIV Marketplace with admin-configurable pricing
CREATE TABLE IF NOT EXISTS public.tiv_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value numeric NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default TIV price ($2.00 = $0.02 per TIV or 200 cents per 100 TIV)
INSERT INTO public.tiv_settings (setting_key, setting_value)
VALUES ('tiv_usd_rate', 0.02)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS on tiv_settings
ALTER TABLE public.tiv_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view TIV settings
CREATE POLICY "Anyone can view TIV settings"
ON public.tiv_settings
FOR SELECT
USING (true);

-- Only admins can update TIV settings
CREATE POLICY "Admins can update TIV settings"
ON public.tiv_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Feature #4: Spin Wheel functionality
CREATE TABLE IF NOT EXISTS public.spin_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_type text NOT NULL CHECK (reward_type IN ('tiv', 'usd')),
  reward_amount numeric NOT NULL CHECK (reward_amount > 0),
  probability numeric NOT NULL CHECK (probability >= 0 AND probability <= 1),
  label text NOT NULL,
  color text NOT NULL DEFAULT '#4F46E5',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default spin rewards with proper probabilities that sum to 1.0
INSERT INTO public.spin_rewards (reward_type, reward_amount, probability, label, color, active) VALUES
('tiv', 10, 0.40, '10 TIV', '#10B981', true),
('tiv', 25, 0.25, '25 TIV', '#3B82F6', true),
('tiv', 50, 0.15, '50 TIV', '#8B5CF6', true),
('tiv', 100, 0.10, '100 TIV', '#EC4899', true),
('tiv', 250, 0.05, '250 TIV', '#F59E0B', true),
('tiv', 500, 0.03, '500 TIV', '#EF4444', true),
('tiv', 1000, 0.02, '1000 TIV', '#DC2626', true);

CREATE TABLE IF NOT EXISTS public.spin_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type text NOT NULL,
  reward_amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on spin tables
ALTER TABLE public.spin_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

-- Anyone can view active spin rewards
CREATE POLICY "Anyone can view active spin rewards"
ON public.spin_rewards
FOR SELECT
USING (active = true);

-- Admins can manage spin rewards
CREATE POLICY "Admins can manage spin rewards"
ON public.spin_rewards
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Users can view own spin history
CREATE POLICY "Users can view own spin history"
ON public.spin_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert own spin history
CREATE POLICY "Users can insert own spin history"
ON public.spin_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create spin function with 24-hour cooldown
CREATE OR REPLACE FUNCTION public.spin_wheel()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _last_spin timestamp with time zone;
  _reward RECORD;
  _random_value numeric;
  _cumulative_prob numeric := 0;
  _result jsonb;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check cooldown (24 hours)
  SELECT MAX(created_at) INTO _last_spin
  FROM public.spin_history
  WHERE user_id = _user_id;
  
  IF _last_spin IS NOT NULL AND _last_spin > (now() - interval '24 hours') THEN
    RAISE EXCEPTION 'Spin cooldown active. Try again in % hours',
      CEIL(EXTRACT(EPOCH FROM (_last_spin + interval '24 hours' - now())) / 3600);
  END IF;
  
  -- Generate random value
  _random_value := random();
  
  -- Select reward based on probability
  FOR _reward IN 
    SELECT * FROM public.spin_rewards 
    WHERE active = true 
    ORDER BY probability DESC
  LOOP
    _cumulative_prob := _cumulative_prob + _reward.probability;
    IF _random_value <= _cumulative_prob THEN
      EXIT;
    END IF;
  END LOOP;
  
  -- Award the reward
  IF _reward.reward_type = 'tiv' THEN
    UPDATE public.profiles
    SET tiv_balance = tiv_balance + _reward.reward_amount
    WHERE user_id = _user_id;
  ELSE
    UPDATE public.profiles
    SET 
      available_balance = available_balance + _reward.reward_amount,
      total_earned = total_earned + _reward.reward_amount
    WHERE user_id = _user_id;
  END IF;
  
  -- Record spin history
  INSERT INTO public.spin_history (user_id, reward_type, reward_amount)
  VALUES (_user_id, _reward.reward_type, _reward.reward_amount);
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES (
    _user_id,
    'spin_reward',
    'Spin reward: ' || _reward.reward_amount || ' ' || upper(_reward.reward_type),
    _reward.reward_amount
  );
  
  _result := jsonb_build_object(
    'success', true,
    'reward_type', _reward.reward_type,
    'reward_amount', _reward.reward_amount,
    'label', _reward.label,
    'color', _reward.color
  );
  
  RETURN _result;
END;
$$;

-- Update TIV transactions table to support marketplace
ALTER TABLE public.tiv_transactions ADD COLUMN IF NOT EXISTS listing_price numeric;
ALTER TABLE public.tiv_transactions ADD COLUMN IF NOT EXISTS marketplace_fee numeric DEFAULT 0;

-- Create function to list TIVs on marketplace
CREATE OR REPLACE FUNCTION public.list_tiv_on_marketplace(_amount numeric, _rate numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _current_balance numeric;
  _total_price numeric;
  _listing_id uuid;
  _result jsonb;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  IF _rate <= 0 THEN
    RAISE EXCEPTION 'Rate must be positive';
  END IF;
  
  -- Check balance
  SELECT tiv_balance INTO _current_balance
  FROM public.profiles
  WHERE user_id = _user_id;
  
  IF _current_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient TIV balance';
  END IF;
  
  _total_price := _amount * _rate;
  
  -- Create listing
  INSERT INTO public.tiv_transactions (seller_id, amount, rate, total_price, listing_price, status)
  VALUES (_user_id, _amount, _rate, _total_price, _total_price, 'pending')
  RETURNING id INTO _listing_id;
  
  -- Lock the TIVs (deduct from seller's balance)
  UPDATE public.profiles
  SET tiv_balance = tiv_balance - _amount
  WHERE user_id = _user_id;
  
  _result := jsonb_build_object(
    'success', true,
    'listing_id', _listing_id,
    'amount', _amount,
    'rate', _rate,
    'total_price', _total_price
  );
  
  RETURN _result;
END;
$$;

-- Create function to buy TIVs from marketplace
CREATE OR REPLACE FUNCTION public.buy_tiv_from_marketplace(_listing_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _buyer_id uuid;
  _listing RECORD;
  _marketplace_fee numeric;
  _seller_amount numeric;
  _result jsonb;
BEGIN
  _buyer_id := auth.uid();
  
  IF _buyer_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get listing
  SELECT * INTO _listing
  FROM public.tiv_transactions
  WHERE id = _listing_id AND status = 'pending'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found or already sold';
  END IF;
  
  IF _listing.seller_id = _buyer_id THEN
    RAISE EXCEPTION 'Cannot buy your own listing';
  END IF;
  
  -- Check buyer balance
  IF (SELECT available_balance FROM public.profiles WHERE user_id = _buyer_id) < _listing.total_price THEN
    RAISE EXCEPTION 'Insufficient USD balance';
  END IF;
  
  -- Calculate marketplace fee (2%)
  _marketplace_fee := _listing.total_price * 0.02;
  _seller_amount := _listing.total_price - _marketplace_fee;
  
  -- Transfer USD from buyer to seller
  UPDATE public.profiles
  SET available_balance = available_balance - _listing.total_price
  WHERE user_id = _buyer_id;
  
  UPDATE public.profiles
  SET available_balance = available_balance + _seller_amount
  WHERE user_id = _listing.seller_id;
  
  -- Transfer TIV to buyer
  UPDATE public.profiles
  SET tiv_balance = tiv_balance + _listing.amount
  WHERE user_id = _buyer_id;
  
  -- Update listing
  UPDATE public.tiv_transactions
  SET 
    buyer_id = _buyer_id,
    status = 'completed',
    marketplace_fee = _marketplace_fee,
    completed_at = now()
  WHERE id = _listing_id;
  
  -- Log activities
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES 
    (_buyer_id, 'tiv_purchase', 'Purchased ' || _listing.amount || ' TIV', _listing.amount),
    (_listing.seller_id, 'tiv_sale', 'Sold ' || _listing.amount || ' TIV', _seller_amount);
  
  _result := jsonb_build_object(
    'success', true,
    'amount', _listing.amount,
    'total_paid', _listing.total_price,
    'seller_received', _seller_amount
  );
  
  RETURN _result;
END;
$$;