import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Global handler to surface OAuth errors and clean the URL
const OAuthErrorHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Helper to parse both search (?a=b) and hash (#a=b)
    const parseParams = (input: string) => {
      const str = input.startsWith("#") ? input.slice(1) : input.startsWith("?") ? input.slice(1) : input;
      return new URLSearchParams(str);
    };

    const searchParams = parseParams(location.search);
    const hashParams = parseParams(location.hash);

    const error = searchParams.get("error") || hashParams.get("error");
    const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");

    if (error) {
      const message =
        error === "invalid_client"
          ? "Google Sign-In is misconfigured (invalid client). Please verify OAuth credentials in the backend."
          : errorDescription || "Authentication error. Please try again.";

      toast({
        title: "Sign-in error",
        description: message,
        variant: "destructive",
      });

      // Clean the URL and route users to the Auth page for a clear retry
      navigate("/auth", { replace: true });
    }
  }, [location.hash, location.search, navigate, toast]);

  return null;
};

export default OAuthErrorHandler;
