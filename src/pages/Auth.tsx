import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleMagicLink = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding");
    }, 1500);
  };
  const handlePasswordAuth = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding");
    }, 1000);
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
            <Tabs defaultValue="magic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="magic">Magic Link</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
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
                  {isLoading ? "Signing in..." : <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>}
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                New to Kaya?{" "}
                <button className="text-primary hover:underline font-medium">
                  Create account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Auth;