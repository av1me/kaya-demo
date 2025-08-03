import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, AlertTriangle, Clock, MessageCircle, Target, Users, Coffee, GitBranch, Info, ChevronDown, ExternalLink, Slack, Calendar, GitBranch as Jira, Brain, Shield, Zap } from "lucide-react";
import { isSameWeek, startOfWeek } from "date-fns";
import { useState, useEffect } from "react";
import { InsightsDetailModal } from "./InsightsDetailModal";
import { SlackAPI } from "@/lib/api";
import { type TeamHealthMetrics, type AnalyticsInsight } from "@/lib/analytics";

interface InsightsSectionProps {
  selectedWeek: Date;
}

type ToolFilter = "all" | "slack" | "calendar" | "jira" | "github";

export const InsightsSection = ({
  selectedWeek
}: InsightsSectionProps) => {
  const [selectedTool, setSelectedTool] = useState<ToolFilter>("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState<TeamHealthMetrics | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentWeek = startOfWeek(new Date('2025-02-03'), {
    weekStartsOn: 1
  });
  const isCurrentWeek = isSameWeek(selectedWeek, currentWeek, {
    weekStartsOn: 1
  });

  const toolOptions = [{
    value: "all",
    label: "All Tools",
    icon: Info
  }, {
    value: "slack",
    label: "Slack",
    icon: MessageCircle
  }, {
    value: "calendar",
    label: "Calendar",
    icon: Calendar
  }, {
    value: "jira",
    label: "Jira",
    icon: Target
  }, {
    value: "github",
    label: "GitHub",
    icon: GitBranch
  }];

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      try {
        // For now, we'll use a default company ID since we need to get user's companies first
        // In a real implementation, you'd get the current user and their companies
        const defaultCompanyId = 'default-company-id';
        
        // Get team health metrics from API (using legacy compatibility method)
        const exportPath = '/Users/avinashuddaraju/Downloads/Labfox Slack export Jun 18 2025 - Jul 18 2025';
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
      } catch (error) {
        console.error('Error loading analytics data:', error);
        // Fallback to empty state if API fails
        setTeamMetrics(null);
        setInsights([]);
      }
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, [selectedWeek]);

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
        return <Slack className="w-4 h-4" />;
      case "calendar":
        return <Calendar className="w-4 h-4" />;
      case "jira":
        return <Target className="w-4 h-4" />;
      case "github":
        return <GitBranch className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const filteredInsights = insights.filter(insight => 
    selectedTool === "all" || insight.tool === selectedTool
  );

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Team Health Insights
                  </CardTitle>
          <CardDescription>
            Analyzing communication patterns and team dynamics...
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

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle>Team Health Insights</CardTitle>
            {teamMetrics && (
              <Badge 
                variant={teamMetrics.riskLevel === 'critical' ? 'destructive' : 
                        teamMetrics.riskLevel === 'high' ? 'secondary' : 'default'}
                className="ml-2"
              >
                {teamMetrics.riskLevel.toUpperCase()} RISK
              </Badge>
            )}
          </div>
          
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Slack className="w-4 h-4 mr-2" />
                {toolOptions.find(t => t.value === selectedTool)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {toolOptions.map((tool) => (
                <DropdownMenuItem
                  key={tool.value}
                  onClick={() => setSelectedTool(tool.value as ToolFilter)}
                  className="flex items-center gap-2"
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.label}
                </DropdownMenuItem>
              ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        <CardDescription>
          AI-powered analysis of team communication patterns and health indicators
          </CardDescription>
        </CardHeader>
        
      <CardContent className="space-y-4">
        {/* Team Health Overview */}
        {teamMetrics && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Psychological Safety</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {(teamMetrics.psychologicalSafety * 100).toFixed(0)}%
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
                    </div>
                    
            <div className="space-y-2">
                        <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Response Time</span>
                        </div>
              <div className="text-2xl font-bold text-blue-600">
                {teamMetrics.responseTime.toFixed(1)}h
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
            </div>
          </div>
        )}

        {/* Insights List */}
        <div className="space-y-3">
          {filteredInsights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No insights found for the selected filters</p>
            </div>
          ) : (
            filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => setShowDetailModal(true)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getToolIcon(insight.tool)}
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    </div>
                  <div className="flex items-center gap-1">
                    {getIcon(insight.trend)}
                    <Badge variant="outline" className="text-xs">
                      {(insight.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-2 opacity-90">{insight.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{insight.metric}</span>
                  <Badge 
                    variant={insight.severity === 'critical' ? 'destructive' : 
                            insight.severity === 'warning' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {insight.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Early Warnings */}
        {teamMetrics && teamMetrics.earlyWarnings.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-red-800">Early Warning Signals</h4>
            </div>
            <ul className="space-y-1">
              {teamMetrics.earlyWarnings.map((warning, index) => (
                <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View All Button */}
        {filteredInsights.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowDetailModal(true)}
          >
            View Detailed Analysis
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
        </CardContent>

      {showDetailModal && (
        <InsightsDetailModal
          insights={filteredInsights}
          teamMetrics={teamMetrics}
          onClose={() => setShowDetailModal(false)}
        />
      )}
      </Card>
  );
};