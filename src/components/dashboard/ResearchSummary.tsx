import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, Users, MessageCircle, Target, Brain } from "lucide-react";
import { type TeamHealthMetrics } from "@/lib/analytics";

interface ResearchSummaryProps {
  teamMetrics: TeamHealthMetrics | null;
}

export const ResearchSummary = ({ teamMetrics }: ResearchSummaryProps) => {
  if (!teamMetrics) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Research Summary
          </CardTitle>
          <CardDescription>
            Loading team health analysis...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'storming':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'forming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'norming':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'performing':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Research Summary
        </CardTitle>
        <CardDescription>
          Evidence-based team health analysis using organizational psychology research
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Psychological Safety</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {(teamMetrics.psychologicalSafety * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Based on Edmondson (1999)
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Burnout Risk</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {(teamMetrics.burnoutRisk * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Based on Van Dun et al. (2024)
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Response Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {teamMetrics.responseTime.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">
              Based on DeFilippis et al. (2022)
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Team Stage</span>
            </div>
            <div className="text-lg font-bold text-purple-600 capitalize">
              {teamMetrics.teamStage}
            </div>
            <div className="text-xs text-muted-foreground">
              Based on Tuckman (1965)
            </div>
          </div>
        </div>

        {/* Research-Based Insights */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Key Research Insights
          </h4>
          
          <div className="space-y-3">
            {/* Psychological Safety */}
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Psychological Safety</span>
                <Badge 
                  variant={teamMetrics.psychologicalSafety > 0.7 ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {teamMetrics.psychologicalSafety > 0.7 ? 'Strong' : 'Needs Attention'}
                </Badge>
              </div>
              <Progress value={teamMetrics.psychologicalSafety * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {teamMetrics.psychologicalSafety > 0.7 
                  ? "Google's Project Aristotle found this is the #1 predictor of team performance"
                  : "Teams with low psychological safety show 87% worse decision-making (Harvard, 2010)"
                }
              </p>
            </div>

            {/* Burnout Risk */}
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Burnout Risk</span>
                <Badge 
                  variant={teamMetrics.burnoutRisk > 0.7 ? 'destructive' : teamMetrics.burnoutRisk > 0.4 ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {teamMetrics.burnoutRisk > 0.7 ? 'Critical' : teamMetrics.burnoutRisk > 0.4 ? 'Moderate' : 'Low'}
                </Badge>
              </div>
              <Progress 
                value={teamMetrics.burnoutRisk * 100} 
                className={`h-2 mb-2 ${teamMetrics.burnoutRisk > 0.7 ? 'bg-red-200' : teamMetrics.burnoutRisk > 0.4 ? 'bg-yellow-200' : 'bg-green-200'}`}
              />
              <p className="text-xs text-muted-foreground">
                {teamMetrics.burnoutRisk > 0.7 
                  ? "AI-powered burnout prediction achieves 85-90% accuracy (Van Dun et al., 2024)"
                  : "Teams with low burnout risk are 50% more productive (Stanford, 2016)"
                }
              </p>
            </div>

            {/* Communication Patterns */}
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Communication Efficiency</span>
                <Badge 
                  variant={teamMetrics.responseTime > 4.5 ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {teamMetrics.responseTime > 4.5 ? 'Slow' : 'Good'}
                </Badge>
              </div>
              <Progress 
                value={Math.max(0, 100 - (teamMetrics.responseTime / 8) * 100)} 
                className="h-2 mb-2"
              />
              <p className="text-xs text-muted-foreground">
                {teamMetrics.responseTime > 4.5 
                  ? "Teams that work well together are 50% more productive (Stanford, 2016)"
                  : "Good communication patterns show 23% higher productivity (Gallup, 2024)"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Early Warning Signals */}
        {teamMetrics.earlyWarnings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Early Warning Signals
            </h4>
            <div className="space-y-2">
              {teamMetrics.earlyWarnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                  <div className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-red-800">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Level Summary */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Risk Assessment</span>
            <Badge 
              variant={teamMetrics.riskLevel === 'critical' ? 'destructive' : 
                      teamMetrics.riskLevel === 'high' ? 'secondary' : 'default'}
              className={getRiskColor(teamMetrics.riskLevel)}
            >
              {teamMetrics.riskLevel.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {teamMetrics.earlyWarnings.length} early warning signals and team health metrics
          </p>
        </div>

        {/* Team Development Stage */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Team Development Stage</span>
            <Badge className={getStageColor(teamMetrics.teamStage)}>
              {teamMetrics.teamStage.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on Tuckman's stages of team development (1965)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 