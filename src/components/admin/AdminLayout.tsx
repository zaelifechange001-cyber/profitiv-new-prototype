import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminLayout() {
  const { isAdmin, isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Alert className="max-w-md border-destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <strong>Access Denied</strong>
            <p className="mt-2">You don't have permission to access the admin dashboard. This area is restricted to administrators only.</p>
            <a href="/dashboard" className="text-primary hover:underline mt-4 inline-block">
              Return to Dashboard
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[hsl(var(--bg-1))] via-[hsl(var(--bg-2))] to-[#1b1b40]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-white/10 flex items-center px-6 backdrop-blur-sm bg-black/20">
            <SidebarTrigger className="text-white" />
            <div className="ml-4 flex items-center gap-3">
              <h1 className="text-xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
                Profitiv
              </h1>
              <span className="text-sm text-white/60">Admin Dashboard</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
