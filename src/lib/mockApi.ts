// Mock API for testing dynamic data loading
import { TeamHealthMetrics, AnalyticsInsight } from './analytics';
import { generateLabfoxSpecificRecommendations } from './recommendationEngine';

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

// Mock data based on real Slack export analysis
const mockSlackData = {
  users: [
    { id: 'U123', name: 'John Doe', email: 'john@labfox.com', role: 'Developer', department: 'Engineering' },
    { id: 'U124', name: 'Jane Smith', email: 'jane@labfox.com', role: 'Product Manager', department: 'Product' },
    { id: 'U125', name: 'Bob Wilson', email: 'bob@labfox.com', role: 'Designer', department: 'Design' }
  ],
  channels: [
    { id: 'C123', name: 'general', member_count: 10, is_private: false },
    { id: 'C124', name: 'product-consulting', member_count: 5, is_private: false },
    { id: 'C125', name: 'engineering', member_count: 8, is_private: false }
  ],
  messages: [
    { user: 'U123', channel: 'C123', text: 'Good morning team!', timestamp: '2025-07-14T09:00:00.000Z' },
    { user: 'U124', channel: 'C123', text: 'Morning! Ready for the sprint review?', timestamp: '2025-07-14T09:05:00.000Z' },
    { user: 'U125', channel: 'C124', text: 'Working on the new feature', timestamp: '2025-07-14T10:00:00.000Z' },
    { user: 'U123', channel: 'C125', text: 'Code review completed', timestamp: '2025-07-14T11:00:00.000Z' },
    { user: 'U124', channel: 'C123', text: 'Great work everyone!', timestamp: '2025-07-14T17:00:00.000Z' }
  ]
};

// Mock team health metrics based on real data patterns
const mockTeamHealth: TeamHealthMetrics = {
  realTeam: 82,
  compellingDirection: 85,
  enablingStructure: 78,
  supportiveContext: 80,
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
};

// Mock insights based on real analytics
const mockInsights: AnalyticsInsight[] = [
  {
    id: 'communication-patterns',
    title: 'Healthy Communication Patterns',
    description: 'Team shows consistent communication with good response times averaging 2.5 hours.',
    severity: 'info',
    confidence: 85,
    category: 'communication',
    metrics: { responseTime: 2.5, messageFrequency: 45 }
  },
  {
    id: 'psychological-safety',
    title: 'Strong Psychological Safety',
    description: 'Team members feel comfortable sharing ideas and asking for help.',
    severity: 'info',
    confidence: 78,
    category: 'culture',
    metrics: { psychologicalSafety: 78, helpSeeking: 72 }
  },
  {
    id: 'burnout-risk',
    title: 'Low Burnout Risk',
    description: 'Burnout risk remains low at 25%, indicating healthy work-life balance.',
    severity: 'info',
    confidence: 90,
    category: 'wellbeing',
    metrics: { burnoutRisk: 25, weekendActivity: 15 }
  }
];

// Mock recommendations
const mockRecommendations = [
  {
    id: 'focus-time',
    title: 'Implement Focus Time Blocks',
    description: 'Consider implementing protected focus time to improve productivity.',
    priority: 'medium',
    impact: 'High',
    timeframe: '2 weeks',
    science: 'Research shows that protected focus time can improve productivity by 40%.',
    implementation: [
      'Schedule 2-hour focus blocks',
      'Set up automatic status updates',
      'Create focus time guidelines',
      'Monitor productivity metrics'
    ],
    successIndicators: ['Reduced interruptions', 'Higher code quality', 'Improved focus'],
    riskFactors: ['Initial resistance', 'Schedule conflicts'],
    learnMore: ['Focus Time Best Practices', 'Productivity Research']
  }
];

// Mock API responses
export const mockApiResponses = {
  // Get available weeks
  getAvailableWeeks: () => ({
    success: true,
    data: ['2025-W28', '2025-W27', '2025-W26', '2025-W25']
  }),

  // Get Slack data for a week
  getSlackData: (weekString: string) => ({
    success: true,
    data: {
      users: mockSlackData.users,
      channels: mockSlackData.channels,
      messages: mockSlackData.messages,
      weekStart: '2025-07-14T00:00:00.000Z',
      weekEnd: '2025-07-20T23:59:59.999Z',
      messageCount: mockSlackData.messages.length
    }
  }),

  // Get analytics for a week
  getAnalytics: (weekString: string) => ({
    success: true,
    data: {
      metrics: mockTeamHealth,
      insights: mockInsights,
      recommendations: mockRecommendations
    }
  }),

  // Get team health
  getTeamHealth: (weekString: string) => ({
    success: true,
    data: mockTeamHealth
  }),

  // Get insights
  getInsights: (weekString: string) => ({
    success: true,
    data: mockInsights
  }),

  // Get recommendations
  getRecommendations: (weekString: string) => ({
    success: true,
    data: mockRecommendations
  }),

  // Get podcast data
  getPodcastData: (weekString: string) => ({
    success: true,
    data: {
      episode: {
        title: 'Team Health Excellence',
        date: 'July 14, 2025',
        duration: '25 min',
        summary: 'Labfox team shows improved communication patterns with reduced response times. Weekend activity has decreased by 15%, and psychological safety scores are trending upward.',
        status: weekString === '2025-W28' ? 'new' : 'completed'
      },
      recent: [
        { title: 'Communication Optimization', date: 'July 7', duration: '23 min' },
        { title: 'Growth Phase Management', date: 'June 30', duration: '26 min' },
        { title: 'Team Integration Success', date: 'June 23', duration: '24 min' }
      ]
    }
  }),

  // Validate Slack path
  validateSlackPath: () => ({
    success: true,
    data: true
  })
};

// Mock API class that simulates the real API
export class MockLabfoxAPI {
  static async getAvailableWeeks(exportPath: string) {
    return mockApiResponses.getAvailableWeeks();
  }

  static async getSlackData(exportPath: string, weekString: string) {
    return mockApiResponses.getSlackData(weekString);
  }

  static async getAnalytics(exportPath: string, weekString: string) {
    return mockApiResponses.getAnalytics(weekString);
  }

  static async getTeamHealth(exportPath: string, weekString: string) {
    return mockApiResponses.getTeamHealth(weekString);
  }

  static async getInsights(exportPath: string, weekString: string) {
    return mockApiResponses.getInsights(weekString);
  }

  static async getRecommendations(exportPath: string, weekString: string) {
    return mockApiResponses.getRecommendations(weekString);
  }

  static async getPodcastData(exportPath: string, weekString: string) {
    return mockApiResponses.getPodcastData(weekString);
  }

  static async validateSlackPath(exportPath: string) {
    return mockApiResponses.validateSlackPath();
  }
} 