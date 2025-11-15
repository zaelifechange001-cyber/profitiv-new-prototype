-- Create campaigns table for creator-posted video campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  requested_views INTEGER NOT NULL DEFAULT 1000,
  current_views INTEGER NOT NULL DEFAULT 0,
  reward_per_view NUMERIC NOT NULL DEFAULT 0,
  reward_type TEXT NOT NULL DEFAULT 'tiv',
  total_budget NUMERIC NOT NULL DEFAULT 0,
  remaining_budget NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  target_audience JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create earnings_history table for detailed earnings tracking
CREATE TABLE IF NOT EXISTS public.earnings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  amount_tiv NUMERIC DEFAULT 0,
  amount_usd NUMERIC DEFAULT 0,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create campaign_participants table to track user participation
CREATE TABLE IF NOT EXISTS public.campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  total_earned_tiv NUMERIC DEFAULT 0,
  total_earned_usd NUMERIC DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Create tiv_packs table for marketplace TIV sales
CREATE TABLE IF NOT EXISTS public.tiv_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_name TEXT NOT NULL,
  amount_tiv NUMERIC NOT NULL,
  price_usd NUMERIC NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update withdrawal_requests to include more payout details
ALTER TABLE public.withdrawal_requests
  ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;

-- Add kyc_verified to user_subscriptions if not exists
ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiv_packs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
CREATE POLICY "Creators can insert own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Earners can view published campaigns"
  ON public.campaigns FOR SELECT
  USING (status = 'published' AND remaining_budget > 0);

CREATE POLICY "Admins can manage all campaigns"
  ON public.campaigns FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for earnings_history
CREATE POLICY "Users can view own earnings"
  ON public.earnings_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own earnings"
  ON public.earnings_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all earnings"
  ON public.earnings_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for campaign_participants
CREATE POLICY "Users can view own participation"
  ON public.campaign_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own participation"
  ON public.campaign_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
  ON public.campaign_participants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Creators can view their campaign participants"
  ON public.campaign_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = campaign_participants.campaign_id
      AND campaigns.creator_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all participants"
  ON public.campaign_participants FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tiv_packs
CREATE POLICY "Anyone can view active packs"
  ON public.tiv_packs FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage TIV packs"
  ON public.tiv_packs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to participate in campaign
CREATE OR REPLACE FUNCTION public.participate_in_campaign(_campaign_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _campaign RECORD;
  _result JSONB;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get campaign details
  SELECT * INTO _campaign
  FROM public.campaigns
  WHERE id = _campaign_id AND status = 'published' AND remaining_budget > 0;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campaign not available';
  END IF;
  
  -- Check if already participating
  IF EXISTS (
    SELECT 1 FROM public.campaign_participants
    WHERE campaign_id = _campaign_id AND user_id = _user_id
  ) THEN
    RAISE EXCEPTION 'Already participating in this campaign';
  END IF;
  
  -- Create participation record
  INSERT INTO public.campaign_participants (campaign_id, user_id)
  VALUES (_campaign_id, _user_id);
  
  _result := jsonb_build_object(
    'success', true,
    'campaign_id', _campaign_id,
    'message', 'Successfully joined campaign'
  );
  
  RETURN _result;
END;
$$;

-- Create function to complete campaign view
CREATE OR REPLACE FUNCTION public.complete_campaign_view(_campaign_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _campaign RECORD;
  _participant RECORD;
  _reward_amount NUMERIC;
  _result JSONB;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get campaign
  SELECT * INTO _campaign
  FROM public.campaigns
  WHERE id = _campaign_id AND status = 'published'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campaign not found';
  END IF;
  
  IF _campaign.remaining_budget <= 0 THEN
    RAISE EXCEPTION 'Campaign budget exhausted';
  END IF;
  
  -- Get or create participant record
  SELECT * INTO _participant
  FROM public.campaign_participants
  WHERE campaign_id = _campaign_id AND user_id = _user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO public.campaign_participants (campaign_id, user_id, progress)
    VALUES (_campaign_id, _user_id, 1)
    RETURNING * INTO _participant;
  ELSE
    -- Update progress
    UPDATE public.campaign_participants
    SET progress = progress + 1, last_activity_at = now()
    WHERE id = _participant.id;
  END IF;
  
  _reward_amount := _campaign.reward_per_view;
  
  -- Award reward
  IF _campaign.reward_type = 'tiv' THEN
    UPDATE public.profiles
    SET tiv_balance = tiv_balance + _reward_amount
    WHERE user_id = _user_id;
    
    UPDATE public.campaign_participants
    SET total_earned_tiv = total_earned_tiv + _reward_amount
    WHERE id = _participant.id;
  ELSE
    UPDATE public.profiles
    SET available_balance = available_balance + _reward_amount,
        total_earned = total_earned + _reward_amount
    WHERE user_id = _user_id;
    
    UPDATE public.campaign_participants
    SET total_earned_usd = total_earned_usd + _reward_amount
    WHERE id = _participant.id;
  END IF;
  
  -- Update campaign stats
  UPDATE public.campaigns
  SET 
    current_views = current_views + 1,
    remaining_budget = remaining_budget - _reward_amount,
    updated_at = now()
  WHERE id = _campaign_id;
  
  -- Log earning
  INSERT INTO public.earnings_history (user_id, campaign_id, activity_type, amount_tiv, amount_usd, description)
  VALUES (
    _user_id,
    _campaign_id,
    'campaign_view',
    CASE WHEN _campaign.reward_type = 'tiv' THEN _reward_amount ELSE 0 END,
    CASE WHEN _campaign.reward_type = 'usd' THEN _reward_amount ELSE 0 END,
    'Completed view for: ' || _campaign.title
  );
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, description, amount)
  VALUES (
    _user_id,
    'campaign_view',
    'Viewed campaign: ' || _campaign.title,
    _reward_amount
  );
  
  _result := jsonb_build_object(
    'success', true,
    'reward_amount', _reward_amount,
    'reward_type', _campaign.reward_type,
    'campaign_title', _campaign.title
  );
  
  RETURN _result;
END;
$$;

-- Seed some TIV packs
INSERT INTO public.tiv_packs (pack_name, amount_tiv, price_usd, description, featured, active)
VALUES
  ('Starter Pack', 1000, 50, 'Perfect for testing campaigns', false, true),
  ('Growth Pack', 5000, 225, 'Great for medium campaigns', true, true),
  ('Pro Pack', 15000, 600, 'Ideal for large campaigns', true, true),
  ('Enterprise Pack', 50000, 1800, 'Maximum reach and impact', false, true)
ON CONFLICT DO NOTHING;