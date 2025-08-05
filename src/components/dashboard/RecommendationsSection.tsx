import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Target, 
  BookOpen, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Brain,
  Zap
} from "lucide-react";
import { SlackAPI } from "@/lib/api";
import { type TeamHealthMetrics } from "@/lib/analytics";

interface RecommendationsSectionProps {
  selectedWeek: Date;
}

export const RecommendationsSection = ({ selectedWeek }: RecommendationsSectionProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [teamMetrics, setTeamMetrics] = useState<TeamHealthMetrics | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // For now, we'll use a default company ID since we need to get user's companies first
        const defaultCompanyId = 'default-company-id';
        
        // Get team metrics from API (using legacy compatibility method)
        const exportPath = '/slack-export/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const weekString = `${selectedWeek.getFullYear()}-W${Math.ceil((selectedWeek.getTime() - new Date(selectedWeek.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        const healthResponse = await SlackAPI.getTeamHealth(exportPath, weekString);
        if (healthResponse.success && healthResponse.data) {
          setTeamMetrics(healthResponse.data);
        }
        
        // Get insights from API using export path and week string
        const insightsResponse = await SlackAPI.getInsights(exportPath, weekString);
        if (insightsResponse.success && insightsResponse.data) {
          setInsights(insightsResponse.data);
        }
        
        // Get recommendations from API using export path and week string
        const recommendationsResponse = await SlackAPI.getRecommendations(exportPath, weekString);
        if (recommendationsResponse.success && recommendationsResponse.data) {
          setRecommendations(recommendationsResponse.data);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
        // Fallback to empty recommendations
        setRecommendations([]);
      }
      
      setIsLoading(false);
    };

    loadRecommendations();
  }, [selectedWeek]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Function to analyze recommendation impact based on team metrics
  const analyzeRecommendationImpact = (recommendation: any, teamMetrics: TeamHealthMetrics) => {
    // Default impact analysis
    const impact = {
      expectedImprovement: recommendation.description || "Implementation of this recommendation should improve team performance.",
      successIndicators: recommendation.successIndicators || ["Improved team metrics", "Better collaboration", "Enhanced productivity"],
      riskFactors: recommendation.riskFactors || ["Initial resistance to change", "Time investment required"],
      labfoxMetrics: null as any
    };

    // Add specific metrics analysis based on recommendation type
    if (recommendation.id === 'focus-time') {
      impact.labfoxMetrics = {
        currentValue: `${(teamMetrics.responseTime * 60).toFixed(1)} min avg response`,
        targetValue: "< 30 min response time",
        improvement: "50% faster responses"
      };
    }

    return impact;
  };

  if (isLoading) {
    return (
      <Card className="h-full">
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Analyzing team data and generating research-backed recommendations...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
              </CardTitle>
        <CardDescription>
            No recommendations available for this week
        </CardDescription>
      </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No specific recommendations for this period</p>
            <p className="text-sm">Team metrics are within healthy ranges</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
              <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Research-backed recommendations based on Labfox team data and academic frameworks
          </CardDescription>
          {teamMetrics && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Labfox Team Status</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-blue-700">Team Members:</span>
                  <div className="font-semibold">27 active (5 admins, 22 regular)</div>
                </div>
                <div>
                  <span className="text-blue-700">Channels:</span>
                  <div className="font-semibold">6 communication channels</div>
                </div>
                <div>
                  <span className="text-blue-700">Development Stage:</span>
                  <div className="font-semibold capitalize">{teamMetrics.teamStage}</div>
                </div>
                <div>
                  <span className="text-blue-700">Risk Level:</span>
                  <div className="font-semibold capitalize">{teamMetrics.riskLevel}</div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => {
              const impact = analyzeRecommendationImpact(recommendation, teamMetrics!);
              
              return (
                <div key={recommendation.id} className="border rounded-lg p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(recommendation.priority)}
                            {recommendation.priority.toUpperCase()}
                          </div>
                            </Badge>
                        </div>
                        
                      {/* Labfox Context */}
                      {recommendation.labfoxContext && (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          {recommendation.labfoxContext}
                        </p>
                      )}
                      
                      {/* Impact and Timeframe */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium">{recommendation.impact}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{recommendation.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The Science */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">THE SCIENCE</h4>
                        <p className="text-sm text-blue-800">{recommendation.science}</p>
                      </div>
                    </div>
                  </div>

                                     {/* Expected Improvement */}
                   {impact.expectedImprovement && (
                     <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                       <div className="flex items-start gap-2">
                         <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                         <div>
                           <h4 className="font-medium text-green-900 mb-1">EXPECTED IMPROVEMENT</h4>
                           <p className="text-sm text-green-800">{impact.expectedImprovement}</p>
                           {impact.labfoxMetrics && (
                             <div className="mt-2 p-2 bg-white rounded border">
                               <div className="grid grid-cols-3 gap-2 text-xs">
                                 <div>
                                   <span className="font-medium text-gray-600">Current:</span>
                                   <div className="font-semibold text-green-700">{impact.labfoxMetrics.currentValue}</div>
                                 </div>
                                 <div>
                                   <span className="font-medium text-gray-600">Target:</span>
                                   <div className="font-semibold text-blue-700">{impact.labfoxMetrics.targetValue}</div>
                                 </div>
                                 <div>
                                   <span className="font-medium text-gray-600">Improvement:</span>
                                   <div className="font-semibold text-purple-700">{impact.labfoxMetrics.improvement}</div>
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   )}

                  {/* Implementation Steps */}
                      <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      HOW TO IMPLEMENT
                    </h4>
                    <ol className="space-y-2 text-sm">
                      {recommendation.implementation.map((step: string, stepIndex: number) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                              <span>{step}</span>
                        </li>
                      ))}
                        </ol>
                      </div>
                      
                  {/* Success Indicators */}
                  {impact.successIndicators.length > 0 && (
                      <div>
                      <h4 className="font-medium mb-2 text-sm">SUCCESS INDICATORS</h4>
                      <div className="flex flex-wrap gap-2">
                        {impact.successIndicators.map((indicator, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                        </div>
                  )}

                  {/* Risk Factors */}
                  {impact.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-orange-700">RISK FACTORS</h4>
                      <div className="flex flex-wrap gap-2">
                        {impact.riskFactors.map((risk, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-orange-200 text-orange-700">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learn More */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">LEARN MORE</h4>
                    <div className="space-y-1">
                      {recommendation.learnMore.map((link: string, linkIndex: number) => (
                        <Button
                          key={linkIndex}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-2 justify-start text-left text-xs"
                        >
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {link}
                      </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};