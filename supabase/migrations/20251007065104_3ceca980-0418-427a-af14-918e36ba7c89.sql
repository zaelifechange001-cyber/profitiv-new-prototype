-- Update existing courses to reward cash (usd) instead of TIV
UPDATE public.courses 
SET reward_type = 'usd' 
WHERE reward_type = 'tiv';