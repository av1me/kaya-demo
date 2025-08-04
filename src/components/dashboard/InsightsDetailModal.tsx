
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Clock, MessageCircle, Target, Users, Coffee, GitBranch, Info, Shield, Zap, Brain, CheckCircle, XCircle } from "lucide-react";
import { type AnalyticsInsight, type TeamHealthMetrics } from "@/lib/analytics";

interface InsightsDetailModalProps {
  insights: AnalyticsInsight[];
  teamMetrics: TeamHealthMetrics | null;
  onClose: () => void;
}

export const InsightsDetailModal = ({
  insights,
  teamMetrics,
  onClose
}: InsightsDetailModalProps) => {
  const getIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "slack":
        return <MessageCircle className="w-4 h-4" />;
      case "calendar":
        return <Coffee className="w-4 h-4" />;
      case "jira":
        return <Target className="w-4 h-4" />;
      case "github":
        return <GitBranch className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Team Health Analysis
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of team communication patterns and health indicators based on Slack data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Health Overview */}
          {teamMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Team Health Metrics
                </CardTitle>
                <CardDescription>
                  Based on Hackman's Team Effectiveness Model and Edmondson's Psychological Safety research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Hackman's Six Conditions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Hackman's Six Conditions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Real Team</span>
                        <span className="text-xs font-medium">{(teamMetrics.realTeam * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.realTeam * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Compelling Direction</span>
                        <span className="text-xs font-medium">{(teamMetrics.compellingDirection * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.compellingDirection * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Enabling Structure</span>
                        <span className="text-xs font-medium">{(teamMetrics.enablingStructure * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.enablingStructure * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Supportive Context</span>
                        <span className="text-xs font-medium">{(teamMetrics.supportiveContext * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.supportiveContext * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Expert Coaching</span>
                        <span className="text-xs font-medium">{(teamMetrics.expertCoaching * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.expertCoaching * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Psychological Safety */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Psychological Safety</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Overall Safety</span>
                        <span className="text-xs font-medium">{(teamMetrics.psychologicalSafety * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.psychologicalSafety * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Help Seeking</span>
                        <span className="text-xs font-medium">{(teamMetrics.helpSeeking * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.helpSeeking * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Error Reporting</span>
                        <span className="text-xs font-medium">{(teamMetrics.errorReporting * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.errorReporting * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Innovation Behavior</span>
                        <span className="text-xs font-medium">{(teamMetrics.innovationBehavior * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.innovationBehavior * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Communication Patterns */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Communication Patterns</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Response Time</span>
                        <span className="text-xs font-medium">{teamMetrics.responseTime.toFixed(1)}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Message Frequency</span>
                        <span className="text-xs font-medium">{teamMetrics.messageFrequency.toFixed(1)}/user</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Collaboration Index</span>
                        <span className="text-xs font-medium">{(teamMetrics.collaborationIndex * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Network Density</span>
                        <span className="text-xs font-medium">{(teamMetrics.networkDensity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Centralization</span>
                        <span className="text-xs font-medium">{(teamMetrics.centralization * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Burnout Indicators */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Burnout Risk Factors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Overall Risk</span>
                        <span className="text-xs font-medium">{(teamMetrics.burnoutRisk * 100).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={teamMetrics.burnoutRisk * 100} 
                        className={`h-2 ${teamMetrics.burnoutRisk > 0.7 ? 'bg-red-200' : teamMetrics.burnoutRisk > 0.4 ? 'bg-yellow-200' : 'bg-green-200'}`}
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Weekend Activity</span>
                        <span className="text-xs font-medium">{(teamMetrics.weekendActivity * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.weekendActivity * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">After Hours</span>
                        <span className="text-xs font-medium">{(teamMetrics.afterHoursActivity * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.afterHoursActivity * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Stress Indicators</span>
                        <span className="text-xs font-medium">{(teamMetrics.stressIndicators * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={teamMetrics.stressIndicators * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Team Stage and Risk Level */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Team Development Stage</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 capitalize">
                      {teamMetrics.teamStage}
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Based on Tuckman's stages of team development
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-800">Risk Level</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 uppercase">
                      {teamMetrics.riskLevel}
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Based on early warning signals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Research-based analysis of team communication patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!insights || insights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No detailed insights available</p>
                    <p className="text-sm">
                      Insights will appear here once team communication data is analyzed.
                    </p>
                  </div>
                ) : (
                  insights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getToolIcon(insight.tool)}
                          <h4 className="font-semibold">{insight.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {getIcon(insight.trend)}
                          <Badge variant="outline">
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          <Badge
                            variant={insight.severity === 'critical' ? 'destructive' :
                                    insight.severity === 'warning' ? 'secondary' : 'default'}
                          >
                            {insight.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3 opacity-90">{insight.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">{insight.metric}</span>
                        <span className="text-xs text-muted-foreground">{insight.category}</span>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Recommendations:</h5>
                        <ul className="space-y-1">
                          {insight.recommendations?.map((rec, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          )) || (
                            <li className="text-sm text-muted-foreground">
                              No recommendations available
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Early Warnings */}
          {teamMetrics && teamMetrics.earlyWarnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Early Warning Signals
                </CardTitle>
                <CardDescription>
                  Critical indicators requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMetrics.earlyWarnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{warning}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
