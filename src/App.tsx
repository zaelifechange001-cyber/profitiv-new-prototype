import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import EarnPage from "./pages/EarnPage";
import SpinToWinPage from "./pages/SpinToWinPage";
import MarketplacePage from "./pages/MarketplacePage";
import AffiliatePage from "./pages/AffiliatePage";
import NotFound from "./pages/NotFound";
import OAuthErrorHandler from "./components/auth/OAuthErrorHandler";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminServices from "./pages/admin/AdminServices";
import AdminTIVMarket from "./pages/admin/AdminTIVMarket";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminPools from "./pages/admin/AdminPools";
import PayoutSettings from "./pages/PayoutSettings";
import VideosPage from "./pages/VideosPage";
import LearnEarnPage from "./pages/LearnEarnPage";
import PoolsPage from "./pages/PoolsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import CreatorsLanding from "./pages/creators/CreatorsLanding";
import CreatorsDashboard from "./pages/creators/CreatorsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OAuthErrorHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/spin-to-win" element={<SpinToWinPage />} />
          <Route path="/learn-earn" element={<LearnEarnPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="/pools/:type" element={<PoolsPage />} />
          <Route path="/pools" element={<PoolsPage />} />
          <Route path="/payout-settings" element={<PayoutSettings />} />
          <Route path="/pricing" element={<SubscriptionsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          
          {/* Creators Routes */}
          <Route path="/creators" element={<CreatorsLanding />} />
          <Route path="/creators/dashboard" element={<CreatorsDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="financial" element={<AdminFinancial />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="pools" element={<AdminPools />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="tiv-market" element={<AdminTIVMarket />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
