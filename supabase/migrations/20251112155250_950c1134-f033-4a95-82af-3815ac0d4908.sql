-- Add role and other missing columns to subscription_plans
ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('earner', 'creator')),
  ADD COLUMN IF NOT EXISTS weekly_cap NUMERIC,
  ADD COLUMN IF NOT EXISTS monthly_cap NUMERIC,
  ADD COLUMN IF NOT EXISTS max_campaigns INTEGER,
  ADD COLUMN IF NOT EXISTS max_target_views INTEGER,
  ADD COLUMN IF NOT EXISTS revenue_share_percent NUMERIC,
  ADD COLUMN IF NOT EXISTS payout_delay_days INTEGER;

-- Add role column to user_subscriptions
ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('earner', 'creator'));

-- Update RLS policies for subscription_plans to allow authenticated users to view
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT
  TO authenticated
  USING (true);

-- Update RLS policies for user_subscriptions
DROP POLICY IF EXISTS "Only admins can create subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Only admins can update subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can insert their own subscriptions"
  ON public.user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Clear existing plans and insert new role-based plans
DELETE FROM public.subscription_plans;

-- Insert earner subscription plans
INSERT INTO public.subscription_plans (role, name, price, weekly_cap, monthly_cap, features) VALUES
('earner', 'Starter', 25, 100, 500, 
  '["Standard campaigns & ad videos", "Basic verification (email + phone)", "Standard support", "Withdrawals via Stripe after ID verification"]'::jsonb),
('earner', 'Builder', 50, 200, 1000,
  '["All campaign types including Learn & Earn", "Limited TIV Marketplace sales", "ID + address verification required", "Fast support"]'::jsonb),
('earner', 'Pro', 75, 300, 1500,
  '["Exclusive high-value campaigns", "Priority TIV Marketplace listing", "Full KYC (ID, address, phone)", "24-hour support response"]'::jsonb),
('earner', 'Elite', 100, 450, 2250,
  '["All campaigns + early access promos", "Premium TIV Marketplace visibility", "24-hour withdrawals", "Full KYC + bank validation", "VIP same-day support"]'::jsonb);

-- Insert creator subscription plans
INSERT INTO public.subscription_plans (role, name, price, max_campaigns, max_target_views, revenue_share_percent, payout_delay_days, features) VALUES
('creator', 'Starter', 35, 5, 5000, 30, 7,
  '["Up to 5 active campaigns", "5,000 total target views", "Basic analytics", "30% Profitiv revenue share", "7-day payout delay", "Standard support"]'::jsonb),
('creator', 'Builder', 70, 10, 15000, 30, 5,
  '["Up to 10 campaigns", "15,000 target views", "Advanced analytics", "30% Profitiv revenue share", "5-day payout delay", "Fast support"]'::jsonb),
('creator', 'Pro', 105, 15, 25000, 30, 3,
  '["Up to 15 campaigns", "25,000 target views", "Advanced analytics + performance insights", "30% revenue share", "3-day payout delay", "Priority support"]'::jsonb),
('creator', 'Elite', 140, 20, 50000, 30, 1,
  '["Up to 20 campaigns", "50,000+ target views", "Full analytics + dedicated campaign manager", "30% revenue share", "24-hour payout processing", "VIP support"]'::jsonb);