// API endpoints for dynamic Slack data loading and analytics
import { TeamHealthMetrics, AnalyticsInsight } from './analytics';

// Base API configuration
const API_BASE = 'http://localhost:3001/api';

// Error handling types
export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

// Slack data types
export interface SlackDataRequest {
  exportPath: string;
  weekString: string;
}

export interface SlackDataResponse {
  users: any[];
  channels: any[];
  messages: any[];
  weekStart: string;
  weekEnd: string;
  messageCount: number;
}

export interface AnalyticsRequest {
  exportPath: string;
  weekString: string;
}

export interface AnalyticsResponse {
  metrics: TeamHealthMetrics;
  insights: AnalyticsInsight[];
  recommendations: any[];
}

// API Functions
export class LabfoxAPI {
  private static async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    body?: any
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'API_ERROR',
          details: error
        }
      };
    }
  }

  // Get available weeks from Slack data
  static async getAvailableWeeks(exportPath: string): Promise<APIResponse<string[]>> {
    return this.makeRequest<string[]>('/slack/weeks', 'POST', { exportPath });
  }

  // Get Slack data for a specific week
  static async getSlackData(exportPath: string, weekString: string): Promise<APIResponse<SlackDataResponse>> {
    return this.makeRequest<SlackDataResponse>('/slack/data', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Get analytics for a specific week
  static async getAnalytics(exportPath: string, weekString: string): Promise<APIResponse<AnalyticsResponse>> {
    return this.makeRequest<AnalyticsResponse>('/analytics/week', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Get team health metrics
  static async getTeamHealth(exportPath: string, weekString: string): Promise<APIResponse<TeamHealthMetrics>> {
    return this.makeRequest<TeamHealthMetrics>('/analytics/health', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Get insights for a specific week
  static async getInsights(exportPath: string, weekString: string): Promise<APIResponse<AnalyticsInsight[]>> {
    return this.makeRequest<AnalyticsInsight[]>('/analytics/insights', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Get recommendations for a specific week
  static async getRecommendations(exportPath: string, weekString: string): Promise<APIResponse<any[]>> {
    return this.makeRequest<any[]>('/analytics/recommendations', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Get podcast data for a specific week
  static async getPodcastData(exportPath: string, weekString: string): Promise<APIResponse<any>> {
    return this.makeRequest<any>('/podcast/week', 'POST', { 
      exportPath, 
      weekString 
    });
  }

  // Validate Slack export path
  static async validateSlackPath(exportPath: string): Promise<APIResponse<boolean>> {
    return this.makeRequest<boolean>('/slack/validate', 'POST', { exportPath });
  }
}

// Fallback data for when API is unavailable
export const fallbackData = {
  teamHealth: {
    realTeam: 75,
    compellingDirection: 80,
    enablingStructure: 70,
    supportiveContext: 85,
    expertCoaching: 75,
    psychologicalSafety: 78,
    helpSeeking: 72,
    errorReporting: 68,
    innovationBehavior: 75,
    responseTime: 2.5,
    messageFrequency: 45,
    collaborationIndex: 78,
    networkDensity: 0.65,
    centralization: 0.35,
    burnoutRisk: 25,
    weekendActivity: 15,
    afterHoursActivity: 20,
    stressIndicators: 30,
    teamStage: 'performing',
    earlyWarnings: [],
    riskLevel: 'low'
  },
  insights: [
    {
      id: 'communication-patterns',
      title: 'Communication Patterns Analysis',
      description: 'Team shows healthy communication patterns with good response times.',
      severity: 'info',
      confidence: 85,
      category: 'communication'
    }
  ],
  recommendations: [
    {
      id: 'focus-time',
      title: 'Implement Focus Time Blocks',
      description: 'Consider implementing protected focus time to improve productivity.',
      priority: 'medium',
      impact: 'High',
      timeframe: '2 weeks'
    }
  ]
};

// Error messages
export const errorMessages = {
  SLACK_DATA_UNAVAILABLE: 'Slack data unavailable. Please check the export path and try again.',
  ANALYTICS_CALCULATION_FAILED: 'Analytics calculation failed. Please try again or contact support.',
  NO_DATA_FOR_WEEK: 'No data available for the selected week. Please choose a different week.',
  API_UNAVAILABLE: 'API service unavailable. Using fallback data.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.'
}; 