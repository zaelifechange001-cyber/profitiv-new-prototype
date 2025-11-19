-- Create private storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
);

-- RLS policy for uploads (users can only upload to their own folder)
CREATE POLICY "Users can upload own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for viewing (admins + doc owner only)
CREATE POLICY "Users and admins can view verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  ((storage.foldername(name))[1] = auth.uid()::text OR
   has_role(auth.uid(), 'admin'::app_role))
);

-- RLS policy for deleting (admins only or owner after 90 days)
CREATE POLICY "Admins can delete verification docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create audit logging table
CREATE TABLE IF NOT EXISTS public.verification_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  accessed_by uuid NOT NULL,
  document_type text NOT NULL,
  document_path text NOT NULL,
  accessed_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.verification_access_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view all access logs"
ON public.verification_access_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert logs
CREATE POLICY "System can insert access logs"
ON public.verification_access_log
FOR INSERT
TO authenticated
WITH CHECK (accessed_by = auth.uid());