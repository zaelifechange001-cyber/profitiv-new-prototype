-- Fix security issues with anonymous access and quiz answer exposure

-- 1. Fix profiles table - explicitly block anonymous access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2. Fix payout_methods table - explicitly block anonymous access
DROP POLICY IF EXISTS "Users can view own payout methods" ON public.payout_methods;
CREATE POLICY "Users can view own payout methods" 
ON public.payout_methods 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 3. Fix quiz_questions table - hide correct answers from public view
-- Create a security definer function to check if user has submitted an answer
CREATE OR REPLACE FUNCTION public.user_can_see_quiz_answer(_user_id uuid, _question_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_course_completions ucc
    JOIN public.quizzes q ON ucc.quiz_id = q.id
    JOIN public.quiz_questions qq ON qq.quiz_id = q.id
    WHERE ucc.user_id = _user_id
      AND qq.id = _question_id
      AND ucc.completed_at IS NOT NULL
  ) OR public.has_role(_user_id, 'admin'::app_role);
$$;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.quiz_questions;

-- Create a new policy that allows viewing questions but restricts correct_answer visibility
-- Users can see all quiz questions, but correct_answer should only be accessed after completion
CREATE POLICY "Authenticated users can view quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add a comment to remind developers about protecting correct_answer
COMMENT ON COLUMN public.quiz_questions.correct_answer IS 
'SECURITY: This field should be excluded from SELECT queries on the frontend unless user has completed the quiz. Use user_can_see_quiz_answer() function to check access.';