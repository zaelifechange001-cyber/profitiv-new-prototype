import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, Upload, Mail, Phone, IdCard, MapPin } from "lucide-react";

interface VerificationStatus {
  email_verified: boolean;
  phone_verified: boolean;
  id_verification_status: string;
  address_verification_status: string;
  overall_status: string;
  phone_number?: string;
}

export function VerificationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [addressData, setAddressData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
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

    if (!data) {
      // Create initial verification record
      const { data: newVerification } = await supabase
        .from('user_verifications')
        .insert({ user_id: user.id })
        .select()
        .single();
      
      setVerification(newVerification as VerificationStatus);
    } else {
      setVerification(data as VerificationStatus);
      setPhoneNumber(data.phone_number || "");
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

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with Twilio or similar SMS provider
      // For now, generate a random OTP and store it
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('user_verifications')
        .update({
          phone_number: phoneNumber,
          phone_otp_code: otp,
          phone_otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        })
        .eq('user_id', user.id);

      toast.success(`OTP sent to ${phoneNumber} (Demo: ${otp})`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_verifications')
        .select('phone_otp_code, phone_otp_expires_at')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data.phone_otp_code !== otpCode) {
        throw new Error('Invalid OTP code');
      }

      if (new Date(data.phone_otp_expires_at!) < new Date()) {
        throw new Error('OTP expired. Please request a new one.');
      }

      await supabase
        .from('user_verifications')
        .update({
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      await supabase
        .from('verification_logs')
        .insert({
          user_id: user.id,
          action: 'Phone verified',
          verification_type: 'phone',
          status: 'approved',
        });

      toast.success('Phone verified successfully!');
      fetchVerificationStatus();
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadID = async (files: FileList | null, type: 'front' | 'back' | 'selfie') => {
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
      }

      // Validate file size (10MB max)
      if (file.size > 10485760) {
        throw new Error('File size must be less than 10MB');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Store file path (not URL) in database
      const field = type === 'front' ? 'id_document_front_url' : 
                    type === 'back' ? 'id_document_back_url' : 
                    'id_selfie_url';

      await supabase
        .from('user_verifications')
        .update({
          [field]: uploadData.path,
          id_verification_status: 'pending',
          id_submitted_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      await supabase
        .from('verification_logs')
        .insert({
          user_id: user.id,
          action: `ID ${type} uploaded`,
          verification_type: 'id',
          status: 'pending',
        });

      toast.success(`${type} uploaded successfully`);
      fetchVerificationStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddress = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('user_verifications')
        .update({
          ...addressData,
          address_verification_status: 'pending',
          address_submitted_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      await supabase
        .from('verification_logs')
        .insert({
          user_id: user.id,
          action: 'Address submitted',
          verification_type: 'address',
          status: 'pending',
        });

      toast.success('Address submitted for review!');
      fetchVerificationStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Mail className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {verification?.email_verified 
                    ? "Your email is verified" 
                    : "Check your email for verification link"}
                </p>
              </div>
              {verification?.email_verified && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            {verification?.email_verified && (
              <Button onClick={() => setCurrentStep(2)} className="w-full">
                Continue to Phone Verification
              </Button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={verification?.phone_verified}
              />
            </div>

            {!verification?.phone_verified && (
              <>
                <Button 
                  onClick={handleSendOTP} 
                  disabled={!phoneNumber || loading}
                  className="w-full"
                >
                  Send OTP Code
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otpCode.length !== 6 || loading}
                  className="w-full"
                >
                  Verify Phone
                </Button>
              </>
            )}

            {verification?.phone_verified && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>Phone verified</span>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>ID Document (Front)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadID(e.target.files, 'front')}
                  disabled={loading}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>ID Document (Back)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadID(e.target.files, 'back')}
                  disabled={loading}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Live Selfie</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadID(e.target.files, 'selfie')}
                  disabled={loading}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {verification?.id_verification_status && (
              <div className={`p-3 rounded-lg ${
                verification.id_verification_status === 'approved' ? 'bg-green-500/10 text-green-500' :
                verification.id_verification_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                Status: {verification.id_verification_status}
              </div>
            )}

            {verification?.id_verification_status === 'approved' && (
              <Button onClick={() => setCurrentStep(4)} className="w-full">
                Continue to Address Verification
              </Button>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={addressData.address_line1}
                onChange={(e) => setAddressData({ ...addressData, address_line1: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input
                id="address2"
                value={addressData.address_line2}
                onChange={(e) => setAddressData({ ...addressData, address_line2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={addressData.zip_code}
                onChange={(e) => setAddressData({ ...addressData, zip_code: e.target.value })}
              />
            </div>

            <Button 
              onClick={handleSubmitAddress} 
              disabled={!addressData.address_line1 || !addressData.city || !addressData.state || !addressData.zip_code || loading}
              className="w-full"
            >
              Submit Address
            </Button>

            {verification?.address_verification_status && (
              <div className={`p-3 rounded-lg ${
                verification.address_verification_status === 'approved' ? 'bg-green-500/10 text-green-500' :
                verification.address_verification_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                Status: {verification.address_verification_status}
              </div>
            )}
          </div>
        );
    }
  };

  const steps = [
    { number: 1, label: "Email", icon: Mail },
    { number: 2, label: "Phone", icon: Phone },
    { number: 3, label: "ID", icon: IdCard },
    { number: 4, label: "Address", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-1))] via-[hsl(var(--bg-2))] to-[#1b1b40] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Verification Center</h1>
          <p className="text-white/60">Complete all steps to unlock payouts</p>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Verification Progress</CardTitle>
            <CardDescription className="text-white/60">
              {Math.round(getProgress())}% Complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={getProgress()} className="h-2" />

            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isComplete = 
                  (step.number === 1 && verification?.email_verified) ||
                  (step.number === 2 && verification?.phone_verified) ||
                  (step.number === 3 && verification?.id_verification_status === 'approved') ||
                  (step.number === 4 && verification?.address_verification_status === 'approved');

                return (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center gap-2 cursor-pointer ${
                      currentStep === step.number ? 'text-primary' : 
                      isComplete ? 'text-green-500' : 'text-white/40'
                    }`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step.number ? 'border-primary bg-primary/20' :
                      isComplete ? 'border-green-500 bg-green-500/20' : 'border-white/20'
                    }`}>
                      {isComplete ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        {verification?.overall_status === 'pending' && (
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="pt-6">
              <p className="text-yellow-500 text-center">
                Your verification is under review (24-48 hours)
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
