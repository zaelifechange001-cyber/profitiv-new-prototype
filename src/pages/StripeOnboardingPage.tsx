import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { initializeStripeConnect } from "@/lib/stripe";

export default function StripeOnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    handleOnboarding();
  }, []);

  const handleOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if returning from Stripe onboarding
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (success === 'true') {
        setStatus('success');
        toast({
          title: "Success!",
          description: "Your Stripe account has been connected successfully",
        });
      } else if (error) {
        setStatus('error');
        toast({
          title: "Error",
          description: "Failed to connect Stripe account. Please try again.",
          variant: "destructive",
        });
      } else {
        // Initialize new onboarding
        const result = await initializeStripeConnect(user.id);
        if (result?.url) {
          window.location.href = result.url;
        } else {
          setStatus('error');
          toast({
            title: "Coming Soon",
            description: "Stripe Connect integration will be added soon",
          });
        }
      }
    } catch (error: any) {
      console.error('Error handling onboarding:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-16 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {loading && "Setting up your account..."}
              {status === 'success' && "Account Connected!"}
              {status === 'error' && "Connection Failed"}
            </CardTitle>
            <CardDescription>
              {loading && "Please wait while we set up your Stripe account"}
              {status === 'success' && "You can now receive payouts"}
              {status === 'error' && "There was a problem connecting your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center py-8 space-y-6">
            {loading && (
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Your Stripe account is now connected and ready to receive payments.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You can now withdraw your earnings directly to your bank account.
                  </p>
                </div>
                <Button onClick={() => navigate("/creators/dashboard")}>
                  Go to Dashboard
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-destructive" />
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    We couldn't connect your Stripe account.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This feature is coming soon. Please check back later.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/creators/dashboard")}>
                    Back to Dashboard
                  </Button>
                  <Button onClick={handleOnboarding}>
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Why Connect Stripe?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Secure and fast payouts directly to your bank</p>
            <p>✓ Industry-standard payment processing</p>
            <p>✓ Full transparency and transaction history</p>
            <p>✓ Automatic tax documentation (1099s for US creators)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
