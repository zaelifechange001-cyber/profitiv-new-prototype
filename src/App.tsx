import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EarnPage from "./pages/EarnPage";
import SpinToWinPage from "./pages/SpinToWinPage";
import MarketplacePage from "./pages/MarketplacePage";
import AffiliatePage from "./pages/AffiliatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
