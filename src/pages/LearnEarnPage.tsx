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
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Learn & Earn</h1>
          <p className="text-muted-foreground">
            Complete courses and quizzes to earn rewards
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses.size}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${courses
                  .filter((c) => completedCourses.has(c.id))
                  .reduce((sum, c) => sum + Number(c.reward_amount), 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No courses available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const completed = completedCourses.has(course.id);

              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {course.title}
                      </CardTitle>
                      {completed && <Badge variant="secondary">✓ Completed</Badge>}
                    </div>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="capitalize">{course.content_type} Content</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-lg font-bold text-primary">
                          ${course.reward_amount}
                        </p>
                      </div>
                      <Button
                        onClick={() => startCourse(course)}
                        disabled={completed}
                      >
                        {completed ? "Completed" : "Start Course"}
                      </Button>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Course Investment</p>
                          <p className="text-sm font-semibold text-success">Sponsored</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="gap-2"
                        >
                          Free Access
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
  );
}
