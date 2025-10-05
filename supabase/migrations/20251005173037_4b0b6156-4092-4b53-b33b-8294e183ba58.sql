-- Create investment videos table
CREATE TABLE public.investment_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  description TEXT,
  investment_amount NUMERIC NOT NULL DEFAULT 0,
  goal_views INTEGER NOT NULL DEFAULT 0,
  current_views INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  reward_per_view NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_investment_videos_status ON public.investment_videos(status);

-- Enable RLS
ALTER TABLE public.investment_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view active videos
CREATE POLICY "Anyone can view active videos"
ON public.investment_videos
FOR SELECT
USING (status = 'active');

-- Admins can manage videos
CREATE POLICY "Admins can manage videos"
ON public.investment_videos
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'pdf')),
  content_url TEXT,
  reward_amount NUMERIC DEFAULT 0,
  reward_type TEXT DEFAULT 'tiv' CHECK (reward_type IN ('tiv', 'usd')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer INTEGER NOT NULL,
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user course completions table
CREATE TABLE public.user_course_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN DEFAULT false,
  reward_claimed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create community pools table
CREATE TABLE public.community_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_name TEXT NOT NULL,
  pool_type TEXT NOT NULL CHECK (pool_type IN ('video', 'collaboration', 'jackpot', 'learning')),
  description TEXT,
  goal_amount NUMERIC NOT NULL DEFAULT 0,
  current_amount NUMERIC DEFAULT 0,
  min_investment NUMERIC DEFAULT 5,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  reward_distribution JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pool participants table
CREATE TABLE public.pool_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID NOT NULL REFERENCES public.community_pools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_amount NUMERIC NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pool_id, user_id)
);

-- Create video views tracking table
CREATE TABLE public.video_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.investment_videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watch_duration INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  reward_earned NUMERIC DEFAULT 0,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses"
ON public.courses
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view quizzes"
ON public.quizzes
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage quizzes"
ON public.quizzes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for quiz questions
CREATE POLICY "Anyone can view quiz questions"
ON public.quiz_questions
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage quiz questions"
ON public.quiz_questions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user course completions
CREATE POLICY "Users can view own completions"
ON public.user_course_completions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
ON public.user_course_completions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions"
ON public.user_course_completions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for community pools
CREATE POLICY "Anyone can view open pools"
ON public.community_pools
FOR SELECT
USING (status IN ('open', 'filled'));

CREATE POLICY "Admins can manage pools"
ON public.community_pools
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for pool participants
CREATE POLICY "Users can view own participations"
ON public.pool_participants
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can join pools"
ON public.pool_participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all participants"
ON public.pool_participants
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for video views
CREATE POLICY "Users can view own video views"
ON public.video_views
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video views"
ON public.video_views
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all video views"
ON public.video_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_investment_videos_updated_at
BEFORE UPDATE ON public.investment_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_pools_updated_at
BEFORE UPDATE ON public.community_pools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Function to award course completion rewards
CREATE OR REPLACE FUNCTION public.award_course_completion(_user_id UUID, _course_id UUID, _score INTEGER, _passed BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _course RECORD;
  _result JSONB;
BEGIN
  IF _user_id IS NULL THEN
    _user_id := auth.uid();
  END IF;
  
  -- Get course details
  SELECT * INTO _course
  FROM public.courses
  WHERE id = _course_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;
  
  -- Check if already completed
  IF EXISTS (
    SELECT 1 FROM public.user_course_completions
    WHERE user_id = _user_id AND course_id = _course_id AND reward_claimed = true
  ) THEN
    RAISE EXCEPTION 'Course already completed and reward claimed';
  END IF;
  
  -- Award reward if passed
  IF _passed THEN
    IF _course.reward_type = 'tiv' THEN
      UPDATE public.profiles
      SET tiv_balance = tiv_balance + _course.reward_amount
      WHERE user_id = _user_id;
    ELSE
      UPDATE public.profiles
      SET available_balance = available_balance + _course.reward_amount
      WHERE user_id = _user_id;
    END IF;
    
    -- Log activity
    INSERT INTO public.user_activities (user_id, activity_type, description, amount)
    VALUES (
      _user_id,
      'course_completion',
      'Completed course: ' || _course.title,
      _course.reward_amount
    );
  END IF;
  
  _result := jsonb_build_object(
    'success', true,
    'passed', _passed,
    'reward_amount', CASE WHEN _passed THEN _course.reward_amount ELSE 0 END,
    'reward_type', _course.reward_type
  );
  
  RETURN _result;
END;
$$;