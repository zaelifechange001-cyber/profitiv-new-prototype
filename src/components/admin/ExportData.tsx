import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export function ExportData() {
  const [dataType, setDataType] = useState("users");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and escape commas
          const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      let filename = "";

      switch (dataType) {
        case "users":
          const { data: users } = await supabase.from('profiles').select('*');
          data = users || [];
          filename = "users";
          break;
        
        case "activities":
          const { data: activities } = await supabase
            .from('user_activities')
            .select('*, profiles!user_activities_user_id_fkey(email, full_name)');
          data = activities || [];
          filename = "activities";
          break;
        
        case "withdrawals":
          const { data: withdrawals } = await supabase
            .from('withdrawal_requests')
            .select('*, profiles!withdrawal_requests_user_id_fkey(email, full_name)');
          data = withdrawals || [];
          filename = "withdrawals";
          break;
        
        case "subscriptions":
          const { data: subs } = await supabase
            .from('user_subscriptions')
            .select('*, profiles!user_subscriptions_user_id_fkey(email, full_name), subscription_plans(name, price)');
          data = subs || [];
          filename = "subscriptions";
          break;
      }

      exportToCSV(data, filename);
      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={dataType} onValueChange={setDataType}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="users">Users</SelectItem>
          <SelectItem value="activities">Activities</SelectItem>
          <SelectItem value="withdrawals">Withdrawals</SelectItem>
          <SelectItem value="subscriptions">Subscriptions</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport} disabled={loading}>
        <Download className="h-4 w-4 mr-2" />
        {loading ? "Exporting..." : "Export CSV"}
      </Button>
    </div>
  );
}
