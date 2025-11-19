import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Eye, AlertTriangle } from "lucide-react";

interface VerificationRecord {
  id: string;
  user_id: string;
  email_verified: boolean;
  phone_number: string;
  phone_verified: boolean;
  id_verification_status: string;
  id_document_front_url: string;
  id_document_back_url: string;
  id_selfie_url: string;
  id_submitted_at: string;
  id_rejection_reason: string;
  address_verification_status: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  address_submitted_at: string;
  address_rejection_reason: string;
  overall_status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const { data: verificationData, error } = await supabase
        .from('user_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      if (verificationData && verificationData.length > 0) {
        const userIds = verificationData.map(v => v.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        // Merge profiles with verifications
        const merged = verificationData.map(v => ({
          ...v,
          profiles: profileData?.find(p => p.user_id === v.user_id) || { full_name: 'Unknown', email: 'Unknown' }
        }));
        setVerifications(merged as any);
      } else {
        setVerifications([]);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, type: 'id' | 'address') => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_approve_verification', {
        _user_id: userId,
        _verification_type: type
      });

      if (error) throw error;

      toast.success((data as any)?.message || `${type.toUpperCase()} verification approved`);
      fetchVerifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve verification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId: string, type: 'id' | 'address', reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_reject_verification', {
        _user_id: userId,
        _verification_type: type,
        _reason: reason
      });

      if (error) throw error;

      toast.success((data as any)?.message || `${type.toUpperCase()} verification rejected`);
      setRejectionReason("");
      fetchVerifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject verification');
    } finally {
      setActionLoading(false);
    }
  };

  const getSignedDocumentUrl = async (path: string, userId: string, docType: string) => {
    try {
      if (!path || path.startsWith('placeholder_')) {
        return null; // Skip placeholder URLs
      }

      // Check if we already have a valid cached URL
      if (documentUrls[path]) {
        return documentUrls[path];
      }

      // Generate signed URL (15 minute expiry)
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .createSignedUrl(path, 900);

      if (error) throw error;

      // Log document access
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('verification_access_log')
          .insert({
            user_id: userId,
            accessed_by: user.id,
            document_type: docType,
            document_path: path
          });
      }

      // Cache the URL
      setDocumentUrls(prev => ({ ...prev, [path]: data.signedUrl }));
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  };

  const viewDocument = async (path: string, userId: string, docType: string) => {
    const url = await getSignedDocumentUrl(path, userId, docType);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Unable to view document');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Incomplete</Badge>;
    }
  };

  const pendingVerifications = verifications.filter(
    v => v.id_verification_status === 'pending' || v.address_verification_status === 'pending'
  );

  const approvedVerifications = verifications.filter(v => v.overall_status === 'approved');
  const rejectedVerifications = verifications.filter(v => v.overall_status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Verifications</h2>
          <p className="text-white/60">Review and approve user verification requests</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">{pendingVerifications.length}</p>
                <p className="text-xs text-white/60">Pending Review</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="pending" className="data-[state=active]:bg-white/10">
            Pending ({pendingVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white/10">
            Approved ({approvedVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white/10">
            Rejected ({rejectedVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
            All ({verifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Pending Verifications</CardTitle>
              <CardDescription className="text-white/60">
                Review and approve user documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">Phone</TableHead>
                    <TableHead className="text-white/70">ID Status</TableHead>
                    <TableHead className="text-white/70">Address Status</TableHead>
                    <TableHead className="text-white/70">Submitted</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVerifications.map((verification) => (
                    <TableRow key={verification.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {(verification.profiles as any)?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {(verification.profiles as any)?.email}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {verification.phone_verified ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {verification.phone_number}
                          </span>
                        ) : (
                          <span className="text-white/40">Not verified</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(verification.id_verification_status)}</TableCell>
                      <TableCell>{getStatusBadge(verification.address_verification_status)}</TableCell>
                      <TableCell className="text-white/80">
                        {new Date(verification.id_submitted_at || verification.address_submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 bg-white/5 hover:bg-white/10"
                                onClick={() => setSelectedVerification(verification)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Verification Details</DialogTitle>
                                <DialogDescription className="text-white/60">
                                  Review user documents and approve or reject
                                </DialogDescription>
                              </DialogHeader>
                              {selectedVerification && (
                                <div className="space-y-6">
                                  {/* ID Verification Section */}
                                  {selectedVerification.id_verification_status === 'pending' && (
                                    <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                      <h3 className="font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                        ID Verification
                                      </h3>
                                      <div className="space-y-2">
                                        <p className="text-sm text-white/60 mb-3">Review uploaded documents:</p>
                                        <div className="flex flex-col gap-2">
                                          {selectedVerification.id_document_front_url && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => viewDocument(
                                                selectedVerification.id_document_front_url,
                                                selectedVerification.user_id,
                                                'id_front'
                                              )}
                                              className="justify-start"
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              View ID Front
                                            </Button>
                                          )}
                                          {selectedVerification.id_document_back_url && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => viewDocument(
                                                selectedVerification.id_document_back_url,
                                                selectedVerification.user_id,
                                                'id_back'
                                              )}
                                              className="justify-start"
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              View ID Back
                                            </Button>
                                          )}
                                          {selectedVerification.id_selfie_url && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => viewDocument(
                                                selectedVerification.id_selfie_url,
                                                selectedVerification.user_id,
                                                'selfie'
                                              )}
                                              className="justify-start"
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              View Selfie
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="id-reason">Rejection Reason (if rejecting)</Label>
                                        <Textarea
                                          id="id-reason"
                                          placeholder="e.g., Document is blurry, ID expired, etc."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          className="bg-white/5 border-white/10"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleApprove(selectedVerification.user_id, 'id')}
                                          disabled={actionLoading}
                                          className="bg-green-500 hover:bg-green-600"
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                          Approve ID
                                        </Button>
                                        <Button
                                          onClick={() => handleReject(selectedVerification.user_id, 'id', rejectionReason)}
                                          disabled={actionLoading}
                                          variant="destructive"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject ID
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Address Verification Section */}
                                  {selectedVerification.address_verification_status === 'pending' && (
                                    <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                      <h3 className="font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                        Address Verification
                                      </h3>
                                      <div className="space-y-2 text-sm">
                                        <p className="text-white/80">
                                          {selectedVerification.address_line1}<br />
                                          {selectedVerification.address_line2 && `${selectedVerification.address_line2}\n`}
                                          {selectedVerification.city}, {selectedVerification.state} {selectedVerification.zip_code}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="address-reason">Rejection Reason (if rejecting)</Label>
                                        <Textarea
                                          id="address-reason"
                                          placeholder="e.g., Address cannot be verified, document invalid, etc."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          className="bg-white/5 border-white/10"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleApprove(selectedVerification.user_id, 'address')}
                                          disabled={actionLoading}
                                          className="bg-green-500 hover:bg-green-600"
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                          Approve Address
                                        </Button>
                                        <Button
                                          onClick={() => handleReject(selectedVerification.user_id, 'address', rejectionReason)}
                                          disabled={actionLoading}
                                          variant="destructive"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Address
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Approved Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">Phone</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Approved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedVerifications.map((verification) => (
                    <TableRow key={verification.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {(verification.profiles as any)?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/80">{(verification.profiles as any)?.email}</TableCell>
                      <TableCell className="text-white/80">{verification.phone_number}</TableCell>
                      <TableCell>{getStatusBadge(verification.overall_status)}</TableCell>
                      <TableCell className="text-white/80">
                        {new Date(verification.id_submitted_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Rejected Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">ID Status</TableHead>
                    <TableHead className="text-white/70">Address Status</TableHead>
                    <TableHead className="text-white/70">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedVerifications.map((verification) => (
                    <TableRow key={verification.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {(verification.profiles as any)?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/80">{(verification.profiles as any)?.email}</TableCell>
                      <TableCell>{getStatusBadge(verification.id_verification_status)}</TableCell>
                      <TableCell>{getStatusBadge(verification.address_verification_status)}</TableCell>
                      <TableCell className="text-white/80 text-sm">
                        {verification.id_rejection_reason || verification.address_rejection_reason || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">All Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">User</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">Phone</TableHead>
                    <TableHead className="text-white/70">Overall Status</TableHead>
                    <TableHead className="text-white/70">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.map((verification) => (
                    <TableRow key={verification.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {(verification.profiles as any)?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/80">{(verification.profiles as any)?.email}</TableCell>
                      <TableCell className="text-white/80">
                        {verification.phone_verified ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {verification.phone_number}
                          </span>
                        ) : (
                          <span className="text-white/40">Not verified</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(verification.overall_status)}</TableCell>
                      <TableCell className="text-white/80">
                        {new Date(verification.id_submitted_at || verification.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
