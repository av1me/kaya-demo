import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Onboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Redirect labfox users to dashboard
    if (user?.isLabfoxUser) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleSkipForNow = () => {
    // For now, redirect to dashboard even for non-labfox users
    // In production, you might want to show a limited view or different flow
    navigate('/dashboard');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" className="h-8 object-contain" />
            <span className="text-lg font-semibold">CEO Dashboard</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Welcome Section */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span>Welcome to Kaya!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Thank you for your interest in Kaya CEO Dashboard. We're excited to help you 
                  streamline your executive workflows and gain valuable insights.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Schedule a 30-minute onboarding session</li>
                    <li>• Learn about Kaya's key features</li>
                    <li>• Customize your dashboard preferences</li>
                    <li>• Set up integrations with your tools</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Can't schedule right now? You can explore the dashboard and schedule later.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleSkipForNow}
                    className="w-full"
                  >
                    Skip for now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Scheduling Section */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Schedule Your Onboarding</CardTitle>
                <p className="text-muted-foreground">
                  Pick a time that works best for you
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[500px]">
                  <iframe
                    src="https://calendar.app.google/cptXGSFSTSDgauZk6"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    title="Schedule Onboarding Session"
                    className="rounded-lg"
                    style={{
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Having trouble with the calendar? 
                    <a 
                      href="https://calendar.app.google/cptXGSFSTSDgauZk6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Open in new tab
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Questions?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our team is here to help you get the most out of Kaya. During your onboarding session, 
                  we'll walk you through all the features and answer any questions you might have.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span>✓ Personalized setup</span>
                  <span>✓ Feature walkthrough</span>
                  <span>✓ Integration assistance</span>
                  <span>✓ Best practices</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;