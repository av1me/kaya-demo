import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getMagicToken, isLabfoxEmail, getDomainFromEmail } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      return;
    }

    // Verify the magic token
    const tokenData = getMagicToken(token);
    
    if (!tokenData) {
      setStatus('error');
      return;
    }

    if (!tokenData.isValid) {
      setStatus('expired');
      setEmail(tokenData.email);
      return;
    }

    // Token is valid, create user session
    const userEmail = tokenData.email;
    const domain = getDomainFromEmail(userEmail);
    const isLabfoxUser = isLabfoxEmail(userEmail);
    
    const user = {
      id: crypto.randomUUID(),
      email: userEmail,
      domain,
      isLabfoxUser,
      createdAt: new Date().toISOString()
    };

    // Log the user in
    login(user);
    setEmail(userEmail);
    setStatus('success');

    // Redirect based on user type
    setTimeout(() => {
      if (isLabfoxUser) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 2000);

  }, [searchParams, login, navigate]);

  const handleReturnToLogin = () => {
    navigate('/auth');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                <h2 className="text-2xl font-semibold">Verifying your link...</h2>
                <p className="text-muted-foreground">
                  Please wait while we verify your magic link.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    const isLabfoxUser = isLabfoxEmail(email);
    
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-16 object-contain" />
            </div>
          </div>

          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-semibold">Welcome to Kaya!</h2>
                <p className="text-muted-foreground">
                  Successfully verified {email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isLabfoxUser 
                    ? "Redirecting you to your dashboard..." 
                    : "Redirecting you to schedule your onboarding session..."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-16 object-contain" />
            </div>
          </div>

          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <XCircle className="w-16 h-16 text-orange-500 mx-auto" />
                <h2 className="text-2xl font-semibold">Link Expired</h2>
                <p className="text-muted-foreground">
                  Your magic link has expired for security reasons.
                </p>
                <p className="text-sm text-muted-foreground">
                  Magic links are valid for 15 minutes. Please request a new one.
                </p>
                <Button 
                  onClick={handleReturnToLogin}
                  className="mt-4 bg-gradient-primary hover:opacity-90"
                >
                  Get New Magic Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-16 object-contain" />
          </div>
        </div>

        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-semibold">Invalid Link</h2>
              <p className="text-muted-foreground">
                This magic link is invalid or has already been used.
              </p>
              <p className="text-sm text-muted-foreground">
                Please request a new magic link to continue.
              </p>
              <Button 
                onClick={handleReturnToLogin}
                className="mt-4 bg-gradient-primary hover:opacity-90"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify;