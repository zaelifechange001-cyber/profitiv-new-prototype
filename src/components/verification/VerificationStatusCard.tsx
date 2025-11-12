import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerificationStatus {
  email_verified: boolean;
  phone_verified: boolean;
  id_verification_status: string;
  address_verification_status: string;
  overall_status: string;
}

export function VerificationStatusCard() {
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching verification:', error);
        return;
      }

      if (data) {
        setVerification(data as VerificationStatus);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    if (!verification) return 0;
    let completed = 0;
    if (verification.email_verified) completed++;
    if (verification.phone_verified) completed++;
    if (verification.id_verification_status === 'approved') completed++;
    if (verification.address_verification_status === 'approved') completed++;
    return (completed / 4) * 100;
  };

  const getStepsText = () => {
    if (!verification) return "0 of 4";
    let completed = 0;
    if (verification.email_verified) completed++;
    if (verification.phone_verified) completed++;
    if (verification.id_verification_status === 'approved') completed++;
    if (verification.address_verification_status === 'approved') completed++;
    return `${completed} of 4`;
  };

  if (loading) return null;

  if (!verification || verification.overall_status === 'approved') {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-white flex items-center gap-2">
              {verification.overall_status === 'pending' ? (
                <>
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Verification Under Review
                </>
              ) : verification.overall_status === 'rejected' ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Verification Rejected
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Verification Required
                </>
              )}
            </CardTitle>
            <CardDescription className="text-white/70">
              {verification.overall_status === 'pending' 
                ? "Your documents are being reviewed (24-48 hours)"
                : verification.overall_status === 'rejected'
                ? "Some documents were rejected. Please resubmit."
                : "Complete all verification steps to unlock payouts"}
            </CardDescription>
          </div>
          <Button
            onClick={() => navigate('/verification')}
            size="sm"
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            {verification.overall_status === 'incomplete' ? 'Continue' : 'View Status'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Progress</span>
            <span className="text-white font-medium">{getStepsText()} steps completed</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            {verification.email_verified ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-white/30" />
            )}
            <span className="text-white/70">Email</span>
          </div>
          <div className="flex items-center gap-2">
            {verification.phone_verified ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-white/30" />
            )}
            <span className="text-white/70">Phone</span>
          </div>
          <div className="flex items-center gap-2">
            {verification.id_verification_status === 'approved' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : verification.id_verification_status === 'pending' ? (
              <Clock className="h-4 w-4 text-yellow-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-white/30" />
            )}
            <span className="text-white/70">ID Document</span>
          </div>
          <div className="flex items-center gap-2">
            {verification.address_verification_status === 'approved' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : verification.address_verification_status === 'pending' ? (
              <Clock className="h-4 w-4 text-yellow-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-white/30" />
            )}
            <span className="text-white/70">Address</span>
          </div>
        </div>

        {verification.overall_status === 'incomplete' && (
          <p className="text-xs text-yellow-500 italic mt-2">
            ⚠️ Withdraw and payout buttons are disabled until verification is complete
          </p>
        )}
      </CardContent>
    </Card>
  );
}
