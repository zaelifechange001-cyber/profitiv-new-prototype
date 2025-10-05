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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OAuthErrorHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/videos" element={<EarnPage />} />
          <Route path="/spin-to-win" element={<SpinToWinPage />} />
          <Route path="/learn-earn" element={<EarnPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="/pools/video" element={<EarnPage />} />
          <Route path="/pools/collaboration" element={<EarnPage />} />
          <Route path="/pools/jackpot" element={<EarnPage />} />
          <Route path="/pools/learning" element={<EarnPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="financial" element={<AdminFinancial />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="tiv-market" element={<AdminTIVMarket />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
