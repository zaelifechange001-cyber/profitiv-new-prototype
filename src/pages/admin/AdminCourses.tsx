import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookOpen, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  content_type: string;
  content_url: string;
  reward_amount: number;
  reward_type: string;
  status: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    content_type: "text",
    content_url: "",
    reward_amount: "",
    reward_type: "tiv",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("courses").insert({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        content_type: formData.content_type,
        content_url: formData.content_url,
        reward_amount: parseFloat(formData.reward_amount),
        reward_type: formData.reward_type,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        content: "",
        content_type: "text",
        content_url: "",
        reward_amount: "",
        reward_type: "tiv",
      });
      fetchCourses();
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "draft" : "active";

    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${newStatus}`,
      });

      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      draft: "secondary",
      archived: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Campaigns</h2>
          <p className="text-muted-foreground">Manage courses and quizzes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Learning Course</DialogTitle>
              <DialogDescription>Add a new learning campaign</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Content Type</Label>
                <select
                  className="w-full mt-1.5 px-3 py-2 bg-background border border-input rounded-md"
                  value={formData.content_type}
                  onChange={(e) =>
                    setFormData({ ...formData, content_type: e.target.value })
                  }
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              {formData.content_type === "text" ? (
                <div>
                  <Label>Content</Label>
                  <Textarea
                    rows={6}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div>
                  <Label>Content URL</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={formData.content_url}
                    onChange={(e) =>
                      setFormData({ ...formData, content_url: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reward Amount</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.reward_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reward_amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Reward Type</Label>
                  <select
                    className="w-full mt-1.5 px-3 py-2 bg-background border border-input rounded-md"
                    value={formData.reward_type}
                    onChange={(e) =>
                      setFormData({ ...formData, reward_type: e.target.value })
                    }
                  >
                    <option value="tiv">TIV Tokens</option>
                    <option value="usd">USD</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Course
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + Number(c.reward_amount), 0).toFixed(0)} TIV
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>All learning campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{course.content_type}</TableCell>
                  <TableCell>
                    {Number(course.reward_amount).toFixed(2)}{" "}
                    {course.reward_type.toUpperCase()}
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(course.id, course.status)}
                    >
                      {course.status === "active" ? "Pause" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
