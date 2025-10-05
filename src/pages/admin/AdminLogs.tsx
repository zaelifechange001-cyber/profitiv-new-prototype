import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLogs() {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select(`
            *,
            profiles!user_activities_user_id_fkey (full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setActivities(data || []);
        setFilteredActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (filterType !== "all") {
      filtered = filtered.filter(a => a.activity_type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [filterType, searchTerm, activities]);

  const getActivityBadge = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      video_watch: "default",
      course_complete: "secondary",
      pool_reward: "outline",
      spin_reward: "default",
    };
    return <Badge variant={colors[type] || "outline"}>{type.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">Track all user activities across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            <div className="flex gap-4 mt-2">
              <Input
                placeholder="Search by user or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="video_watch">Video Watch</SelectItem>
                  <SelectItem value="course_complete">Course Complete</SelectItem>
                  <SelectItem value="pool_reward">Pool Reward</SelectItem>
                  <SelectItem value="spin_reward">Spin Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{activity.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{activity.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getActivityBadge(activity.activity_type)}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    {activity.amount && (
                      <span className="font-bold text-primary">
                        +${Number(activity.amount).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(activity.created_at).toLocaleString()}
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
