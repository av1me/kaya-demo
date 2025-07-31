import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Noma</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Your organizational health copilot
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get weekly insights on team performance, psychological safety, and early signs of burnout—without 
              digging through dashboards. Let Noma be your guide to a healthier, more productive team.
            </p>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 h-auto"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Weekly Insights</h3>
              <p className="text-muted-foreground">
                Understand your team's behavioral patterns from Slack, Calendar, and Jira data
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Psychological Safety</h3>
              <p className="text-muted-foreground">
                Spot early signs of burnout and communication gaps before they impact performance
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Actionable Guidance</h3>
              <p className="text-muted-foreground">
                Evidence-based recommendations tailored to your team's specific challenges
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
