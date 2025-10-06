-- Create RPC function for secure quiz submission with server-side scoring
CREATE OR REPLACE FUNCTION public.submit_quiz_answers(
  _quiz_id uuid,
  _course_id uuid,
  _answers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _quiz RECORD;
  _question RECORD;
  _correct_count integer := 0;
  _total_questions integer := 0;
  _final_score integer;
  _passed boolean;
  _course RECORD;
  _result jsonb;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get quiz details
  SELECT * INTO _quiz FROM public.quizzes WHERE id = _quiz_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;
  
  -- Get course details
  SELECT * INTO _course FROM public.courses WHERE id = _course_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;
  
  -- Check if already completed
  IF EXISTS (
    SELECT 1 FROM public.user_course_completions
    WHERE user_id = _user_id 
      AND course_id = _course_id 
      AND passed = true
  ) THEN
    RAISE EXCEPTION 'Course already completed';
  END IF;
  
  -- Calculate score by comparing answers with correct answers
  FOR _question IN 
    SELECT id, correct_answer 
    FROM public.quiz_questions 
    WHERE quiz_id = _quiz_id
  LOOP
    _total_questions := _total_questions + 1;
    
    -- Check if user's answer matches correct answer
    IF (_answers->_question.id::text)::integer = _question.correct_answer THEN
      _correct_count := _correct_count + 1;
    END IF;
  END LOOP;
  
  -- Calculate final score percentage
  IF _total_questions > 0 THEN
    _final_score := ROUND((_correct_count::numeric / _total_questions::numeric) * 100);
  ELSE
    _final_score := 0;
  END IF;
  
  -- Determine if passed
  _passed := _final_score >= _quiz.passing_score;
  
  -- Record completion
  INSERT INTO public.user_course_completions (
    user_id,
    course_id,
    quiz_id,
    score,
    passed,
    reward_claimed
  ) VALUES (
    _user_id,
    _course_id,
    _quiz_id,
    _final_score,
    _passed,
    _passed
  );
  
  -- Award reward if passed
  IF _passed THEN
    IF _course.reward_type = 'tiv' THEN
      UPDATE public.profiles
      SET tiv_balance = tiv_balance + _course.reward_amount
      WHERE user_id = _user_id;
    ELSE
      UPDATE public.profiles
      SET available_balance = available_balance + _course.reward_amount,
          total_earned = total_earned + _course.reward_amount
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
  
  -- Return result
  _result := jsonb_build_object(
    'success', true,
    'score', _final_score,
    'passed', _passed,
    'correct_count', _correct_count,
    'total_questions', _total_questions,
    'passing_score', _quiz.passing_score,
    'reward_amount', CASE WHEN _passed THEN _course.reward_amount ELSE 0 END,
    'reward_type', _course.reward_type
  );
  
  RETURN _result;
END;
$$;