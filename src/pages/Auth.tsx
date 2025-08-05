import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { validateEmail, checkRateLimit, updateRateLimit } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/emailService";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleMagicLink = async () => {
    console.log("🔐 Auth: Starting magic link login");
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Validate email
      const validation = validateEmail(email);
      if (!validation.isValid) {
        setError(validation.error || "Invalid email");
        return;
      }

      // Check rate limiting
      const rateLimit = checkRateLimit(email);
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime!);
        setError(`Too many attempts. Please try again after ${resetTime.toLocaleTimeString()}`);
        return;
      }

      // Send magic link
      const result = await sendMagicLinkEmail(email);
      
      if (result.success) {
        updateRateLimit(email);
        setSuccess(true);
        console.log("🔐 Auth: Magic link sent successfully");
      } else {
        setError(result.error || "Failed to send magic link");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Magic link error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  if (success) {
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
              <div className="text-center space-y-6">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✉️</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900">Magic link sent!</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      📧 Check your inbox at <strong>{email}</strong>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Email delivered successfully</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Link expires in 15 minutes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Check spam folder if not found</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSuccess(false);
                        setEmail("");
                      }}
                      className="flex-1"
                    >
                      Try different email
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setSuccess(false);
                      }}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      Resend link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-16 object-contain" />
          </div>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Kaya</CardTitle>
            <p className="text-muted-foreground">Enter your work email to get started</p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-slate-50"
                  onKeyPress={(e) => e.key === 'Enter' && handleMagicLink()}
                />
              </div>
              <Button
                onClick={handleMagicLink}
                disabled={isLoading || !email}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Sending magic link..." : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our terms of service and privacy policy.
                <br />
                Only work email addresses are accepted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Auth;