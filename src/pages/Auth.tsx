import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const handleMagicLink = async () => {
    console.log("🔐 Auth: Starting magic link login");
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        console.log("🔐 Auth: Magic link sent successfully");
        // Show success message or redirect
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Magic link error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordAuth = async () => {
    console.log("🔐 Auth: Starting password authentication");
    setIsLoading(true);
    setError("");
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        
        if (error) {
          setError(error.message);
        } else {
          console.log("🔐 Auth: Sign up successful, navigating to /dashboard");
          navigate("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        
        if (error) {
          setError(error.message);
        } else {
          console.log("🔐 Auth: Sign in successful, navigating to /dashboard");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Password auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-16 object-contain" />
          </div>
          
        </div>

        <Card className="shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <Tabs defaultValue="magic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="magic">Magic Link</TabsTrigger>
                <TabsTrigger value="password">{isSignUp ? "Sign Up" : "Password"}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="magic" className="space-y-4">
                <div className="space-y-2">
                  <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-slate-50" />
                </div>
                <Button onClick={handleMagicLink} disabled={isLoading || !email} className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity">
                  {isLoading ? "Sending magic link..." : <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Magic Link
                    </>}
                </Button>
              </TabsContent>
              
              <TabsContent value="password" className="space-y-4">
                <div className="space-y-4">
                  <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-slate-50" />
                  <Input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 bg-slate-50" />
                </div>
                <Button onClick={handlePasswordAuth} disabled={isLoading || !email || !password} className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity">
                  {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>}
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "New to Kaya?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Auth;