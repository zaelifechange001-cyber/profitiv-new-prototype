import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Diagnostic from "./pages/Dashboard";
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
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminTIVMarket from "./pages/admin/AdminTIVMarket";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVerifications from "./pages/admin/AdminVerifications";
import PayoutSettings from "./pages/PayoutSettings";
import VerificationPage from "./pages/VerificationPage";
import VideosPage from "./pages/VideosPage";
import LearnEarnPage from "./pages/LearnEarnPage";
import PoolsPage from "./pages/PoolsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import CreatorsLanding from "./pages/creators/CreatorsLanding";
import CreatorDashboard from "./pages/creators/CreatorDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PayoutPolicy from "./pages/PayoutPolicy";
import KYCPolicy from "./pages/KYCPolicy";
import CampaignsPage from "./pages/CampaignsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import StripeOnboardingPage from "./pages/StripeOnboardingPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OAuthErrorHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<CreatorDashboard />} />
            <Route path="/debug" element={<Diagnostic />} />
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/spin-to-win" element={<SpinToWinPage />} />
            <Route path="/learn-earn" element={<LearnEarnPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/pools/:type" element={<PoolsPage />} />
            <Route path="/pools" element={<PoolsPage />} />
        <Route path="/payout-settings" element={<PayoutSettings />} />
        <Route path="/pricing" element={<SubscriptionsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            
            {/* Creators Routes */}
            <Route path="/creators" element={<CreatorsLanding />} />
            <Route path="/creators/dashboard" element={<CreatorDashboard />} />
            <Route path="/creators/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/stripe-onboarding" element={<StripeOnboardingPage />} />
            
            {/* Legal Routes */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/payout-policy" element={<PayoutPolicy />} />
            <Route path="/kyc-policy" element={<KYCPolicy />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="marketplace" element={<AdminTIVMarket />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
