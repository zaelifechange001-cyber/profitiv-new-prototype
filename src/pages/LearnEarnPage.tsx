import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { BookOpen, Award, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  content_type: string;
  content_url: string;
  reward_amount: number;
  reward_type: string;
}

interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description: string;
  passing_score: number;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  points: number;
}

export default function LearnEarnPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      fetchCourses();
      fetchCompletions();
    };
    checkAuth();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "active")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_course_completions")
        .select("course_id")
        .eq("user_id", user.id)
        .eq("passed", true);

      if (error) throw error;
      setCompletedCourses(new Set(data?.map(c => c.course_id) || []));
    } catch (error) {
      console.error("Error fetching completions:", error);
    }
  };

  const startCourse = async (course: Course) => {
    setSelectedCourse(course);

    // Fetch quiz for this course
    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("course_id", course.id)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      // Fetch questions (exclude correct_answer for security)
      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("id, quiz_id, question, options, points, order_index")
        .eq("quiz_id", quizData.id)
        .order("order_index", { ascending: true });

      if (questionsError) throw questionsError;
      
      const formattedQuestions = questionsData?.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      })) as QuizQuestion[];
      
      setQuestions(formattedQuestions || []);
    } catch (error) {
      console.error("Error loading quiz:", error);
      toast({
        title: "Error",
        description: "No quiz available for this course",
        variant: "destructive",
      });
    }
  };

  const submitQuiz = async () => {
    if (!selectedCourse || !quiz) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Submit quiz with server-side scoring for security
      const { data, error } = await supabase.rpc("submit_quiz_answers", {
        _quiz_id: quiz.id,
        _course_id: selectedCourse.id,
        _answers: answers,
      });

      if (error) throw error;

      const result = data as {
        success: boolean;
        score: number;
        passed: boolean;
        correct_count: number;
        total_questions: number;
        passing_score: number;
        reward_amount: number;
        reward_type: string;
      };

      setScore(result.score);

      if (result.passed) {
        toast({
          title: "Congratulations!",
          description: `You passed! +${result.reward_amount} ${result.reward_type.toUpperCase()} awarded`,
        });
        fetchCompletions();
      } else {
        toast({
          title: "Not Passed",
          description: `You scored ${result.score}%. Passing score is ${result.passing_score}%`,
          variant: "destructive",
        });
      }

      setShowResults(true);
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quiz",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setSelectedCourse(null);
    setQuiz(null);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">Learn & Earn</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Complete courses and quizzes to earn rewards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-profitiv-purple" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{courses.length}</div>
              <p className="text-foreground/60">Available Courses</p>
            </div>
            <div className="glass-card p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-profitiv-teal" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">{completedCourses.size}</div>
              <p className="text-foreground/60">Completed</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <div className="text-3xl font-bold text-gradient-hero mb-2">
                ${courses
                  .filter((c) => completedCourses.has(c.id))
                  .reduce((sum, c) => sum + Number(c.reward_amount), 0)
                  .toFixed(2)}
              </div>
              <p className="text-foreground/60">Total Rewards</p>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-foreground/60">No courses available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const completed = completedCourses.has(course.id);

                return (
                  <div key={course.id} className="earning-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-profitiv-purple transition-colors">
                          {course.title}
                        </h3>
                        {completed && <Badge variant="secondary">✓ Completed</Badge>}
                      </div>
                      <p className="text-sm text-foreground/60 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{course.content_type} Content</span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border/50">
                        <div>
                          <p className="text-xs text-foreground/60">Reward</p>
                          <p className="text-2xl font-bold text-gradient-hero">
                            ${course.reward_amount}
                          </p>
                        </div>
                        <Button
                          onClick={() => startCourse(course)}
                          disabled={completed}
                          variant="gradient"
                        >
                          {completed ? "Completed" : "Start Course"}
                        </Button>
                      </div>

                      <div className="text-xs text-foreground/60 text-center">
                        Sponsored • Free Access
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Course/Quiz Dialog */}
          <Dialog open={!!selectedCourse} onOpenChange={closeDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCourse?.title}</DialogTitle>
              <DialogDescription>{quiz?.title}</DialogDescription>
            </DialogHeader>

            {!showResults ? (
              <div className="space-y-6">
                {questions.map((question, idx) => (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-base font-medium">
                      {idx + 1}. {question.question}
                    </Label>
                    <RadioGroup
                      value={answers[question.id]?.toString()}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [question.id]: parseInt(value) })
                      }
                    >
                      {question.options.map((option: string, optIdx: number) => (
                        <div key={optIdx} className="flex items-center space-x-2">
                          <RadioGroupItem value={optIdx.toString()} id={`q${idx}-${optIdx}`} />
                          <Label htmlFor={`q${idx}-${optIdx}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <Button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="w-full"
                >
                  Submit Quiz
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-6">
                {score >= (quiz?.passing_score || 70) ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold">Congratulations!</h3>
                    <p>You passed with a score of {score}%</p>
                    <p className="text-lg font-semibold text-primary">
                      +${selectedCourse?.reward_amount} earned
                    </p>
                  </>
                ) : (
                  <>
                    <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                    <h3 className="text-2xl font-bold">Try Again</h3>
                    <p>You scored {score}%</p>
                    <p className="text-muted-foreground">
                      You need {quiz?.passing_score}% to pass
                    </p>
                  </>
                )}
                <Button onClick={closeDialog} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
