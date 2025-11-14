-- Add annual_cap column to subscription_plans
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS annual_cap numeric;

-- Update earner subscription plans with new earning caps
UPDATE public.subscription_plans
SET 
  weekly_cap = 165,
  monthly_cap = 720,
  annual_cap = 8300
WHERE name = 'Starter' AND role = 'earner';

UPDATE public.subscription_plans
SET 
  weekly_cap = 340,
  monthly_cap = 1450,
  annual_cap = 16800
WHERE name = 'Builder' AND role = 'earner';

UPDATE public.subscription_plans
SET 
  weekly_cap = 560,
  monthly_cap = 2350,
  annual_cap = 28100
WHERE name = 'Pro' AND role = 'earner';

UPDATE public.subscription_plans
SET 
  weekly_cap = 760,
  monthly_cap = 3350,
  annual_cap = 39900
WHERE name = 'Elite' AND role = 'earner';