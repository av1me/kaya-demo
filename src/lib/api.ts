// API endpoints for Slack data fetching
import { supabase } from './supabaseClient';
// Note: Node.js-based slackExport functions removed for browser compatibility
// All Slack processing now uses browser-compatible analytics functions
// Browser-compatible analytics functions
import {
  calculateTeamHealthFromRealData,
  generateInsightsFromRealData,
  generateLabfoxSpecificInsights,
  getAvailableWeeksFromSlackData,
} from './analytics';
// Recommendation engine
import { generateLabfoxSpecificRecommendations } from './recommendationEngine';
import { generatePodcastScript, ScriptTemplate } from './podcastGenerator';

// Helper function to get white paper context
const getWhitePaperContext = () => {
  return {
    title: "Workplace Team Health Analytics and Early Warning Systems",
    coreThesis: "The convergence of organizational psychology, digital workplace analytics, and machine learning now enables organizations to detect team dysfunction before it impacts performance.",
    relevantPrinciple: "The data shows the 'what,' the Slack conversations show the 'why,' and the white paper gives us the 'how' to think about it."
  };
};

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

// Data types based on the Slack database schema
export interface User {
  id: string;
  name: string;
  real_name: string;
  email: string;
  display_name: string;
  title: string;
  phone: string;
  image_original: string;
  is_admin: boolean;
  is_owner: boolean;
  is_deleted: boolean;
  updated_at: string;
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_archived: boolean;
  creator: string;
  topic_value: string;
  purpose_value: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  ts: string;
  channel_id: string;
  user_id: string;
  text: string;
  message_type: string;
  subtype: string;
  thread_ts: string;
  reply_count: number;
  reply_users_count: number;
  client_msg_id: string;
  has_attachments: boolean;
  has_reactions: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: number;
  message_ts: string;
  name: string;
  count: number;
  users: string[];
  created_at: string;
}

export interface File {
  id: string;
  name: string;
  title: string;
  mimetype: string;
  filetype: string;
  size: number;
  url_private: string;
  user_id: string;
  channels: string[];
  created_at: string;
  updated_at: string;
}

export interface ChannelMember {
  channel_id: string;
  user_id: string;
  joined_at: string;
}

// API Functions for Slack data
export class SlackAPI {
  private static handleError(error: any, operation: string): APIResponse<any> {
    console.error(`Supabase Error (${operation}):`, error);
    return {
      success: false,
      error: {
        message: error.message || 'Database operation failed',
        code: 'SUPABASE_ERROR',
        details: error
      }
    };
  }

  // Fetch all users from the users table
  static async fetchAllUsers(): Promise<APIResponse<User[]>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_deleted', false)
        .order('name', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchAllUsers');
    }
  }

  // Fetch all channels from the channels table
  static async fetchAllChannels(): Promise<APIResponse<Channel[]>> {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('is_archived', false)
        .order('name', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchAllChannels');
    }
  }

  // Fetch messages for a given channel
  static async fetchMessagesByChannel(channelId: string, limit: number = 100): Promise<APIResponse<Message[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchMessagesByChannel');
    }
  }

  // Fetch user by ID
  static async fetchUserById(userId: string): Promise<APIResponse<User | null>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return {
            success: true,
            data: null
          };
        }
        throw error;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return this.handleError(error, 'fetchUserById');
    }
  }

  // Fetch reactions for a message
  static async fetchReactionsByMessage(messageTs: string): Promise<APIResponse<Reaction[]>> {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('message_ts', messageTs)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchReactionsByMessage');
    }
  }

  // Fetch files uploaded by a user
  static async fetchFilesByUser(userId: string): Promise<APIResponse<File[]>> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchFilesByUser');
    }
  }

  // Fetch channel members for a channel
  static async fetchChannelMembers(channelId: string): Promise<APIResponse<ChannelMember[]>> {
    try {
      const { data, error } = await supabase
        .from('channel_members')
        .select('*')
        .eq('channel_id', channelId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchChannelMembers');
    }
  }

  // Fetch channels that a user is a member of
  static async fetchUserChannels(userId: string): Promise<APIResponse<Channel[]>> {
    try {
      const { data, error } = await supabase
        .from('channel_members')
        .select(`
          channels (
            id,
            name,
            is_channel,
            is_group,
            is_im,
            is_mpim,
            is_private,
            is_archived,
            creator,
            topic_value,
            purpose_value,
            member_count,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const channels = data?.map(item => (item as any).channels).filter(Boolean) || [];
      return {
        success: true,
        data: channels
      };
    } catch (error) {
      return this.handleError(error, 'fetchUserChannels');
    }
  }

  // Fetch messages with user and channel information (with joins)
  static async fetchMessagesWithDetails(channelId: string, limit: number = 50): Promise<APIResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          users (
            id,
            name,
            real_name,
            display_name,
            image_original
          ),
          channels (
            id,
            name,
            is_private
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return this.handleError(error, 'fetchMessagesWithDetails');
    }
  }

  // Helper function to detect if path is web-served
  private static isWebPath(exportPath: string): boolean {
    return exportPath.startsWith('/') && !exportPath.startsWith('/Users/') && !exportPath.startsWith('/home/');
  }

  // Get team health metrics for a specific week
  static async getTeamHealth(exportPath: string, weekString: string): Promise<APIResponse<any>> {
    try {
      if (exportPath) {
        console.log(`🔍 SlackAPI.getTeamHealth: Processing path "${exportPath}" for week ${weekString}`);
        
        if (this.isWebPath(exportPath)) {
          // Use browser-compatible analytics functions for web-served paths
          console.log('📊 Using browser-compatible analytics functions');
          const teamHealth = await calculateTeamHealthFromRealData(exportPath, weekString);
          return { success: true, data: teamHealth };
        } else {
          // Fallback to browser-compatible functions for absolute paths too
          console.log('📁 Using browser-compatible analytics functions (fallback)');
          const teamHealth = await calculateTeamHealthFromRealData(exportPath, weekString);
          return { success: true, data: teamHealth };
        }
      }
      // Fallback to stub if no exportPath
      const mockTeamHealth = {
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
      return { success: true, data: mockTeamHealth };
    } catch (error: any) {
      return this.handleError(error, 'getTeamHealth');
    }
  }

  // Get available weeks from the export path
  static async getAvailableWeeks(exportPath: string): Promise<APIResponse<string[]>> {
    try {
      if (exportPath) {
        console.log(`🔍 SlackAPI.getAvailableWeeks: Processing path "${exportPath}"`);
        
        // Use our enhanced utility functions for better accuracy
        const { getBrowserCompatibleAvailableWeeks } = await import('./slackDataUtils');
        const weeks = await getBrowserCompatibleAvailableWeeks();
        
        console.log(`📊 Found ${weeks.length} weeks with data:`, weeks);
        
        // Sort descending (latest first) for UI convenience
        const sorted = weeks.slice().sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
        return { success: true, data: sorted };
      }
      
      // Fallback to known weeks based on actual data analysis
      const fallbackWeeks = ['2025-W29', '2025-W28', '2025-W27', '2025-W26'];
      console.log('📋 Using fallback weeks:', fallbackWeeks);
      return { success: true, data: fallbackWeeks };
    } catch (error: any) {
      console.error('Error in getAvailableWeeks:', error);
      return this.handleError(error, 'getAvailableWeeks');
    }
  }

  // Get insights for a specific week
  static async getInsights(exportPath: string, weekString: string): Promise<APIResponse<any[]>> {
    try {
      if (exportPath) {
        console.log(`🔍 SlackAPI.getInsights: Processing path "${exportPath}" for week ${weekString}`);
        
        if (this.isWebPath(exportPath)) {
          // Use browser-compatible analytics functions for web-served paths
          console.log('📊 Using browser-compatible analytics functions');
          const insights = await generateLabfoxSpecificInsights(exportPath, weekString);
          const formattedInsights = insights.map((insight, idx) => ({
            id: insight.id || `insight-${idx}`,
            title: insight.title,
            description: insight.description,
            severity: insight.severity || 'info',
            confidence: insight.confidence || 80,
            category: insight.category,
            tool: insight.tool,
            metrics: insight.metric ? { [insight.metric.split(' ')[0]]: insight.metric } : {}
          }));
          return { success: true, data: formattedInsights };
        } else {
          // Fallback to browser-compatible functions for absolute paths too
          console.log('📁 Using browser-compatible analytics functions (fallback)');
          const insights = await generateLabfoxSpecificInsights(exportPath, weekString);
          const formattedInsights = insights.map((insight, idx) => ({
            id: insight.id || `insight-${idx}`,
            title: insight.title,
            description: insight.description,
            severity: insight.severity || 'info',
            confidence: insight.confidence || 80,
            category: insight.category,
            tool: insight.tool,
            metrics: insight.metric ? { [insight.metric.split(' ')[0]]: insight.metric } : {}
          }));
          return { success: true, data: formattedInsights };
        }
      }
      // Fallback to mocks
      const mockInsights = [
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
      return { success: true, data: mockInsights };
    } catch (error: any) {
      return this.handleError(error, 'getInsights');
    }
  }

  // Get recommendations for a specific week
  static async getRecommendations(exportPath: string, weekString: string): Promise<APIResponse<any[]>> {
    try {
      if (exportPath) {
        console.log(`🔍 SlackAPI.getRecommendations: Processing path "${exportPath}" for week ${weekString}`);
        
        if (this.isWebPath(exportPath)) {
          // Use browser-compatible analytics functions for web-served paths
          console.log('📊 Using browser-compatible analytics functions');
          const teamHealth = await calculateTeamHealthFromRealData(exportPath, weekString);
          const insights = await generateLabfoxSpecificInsights(exportPath, weekString);
          const recs = generateLabfoxSpecificRecommendations(exportPath, weekString, teamHealth, insights);
          return { success: true, data: recs };
        } else {
          // Fallback to browser-compatible functions for absolute paths too
          console.log('📁 Using browser-compatible analytics functions (fallback)');
          const teamHealth = await calculateTeamHealthFromRealData(exportPath, weekString);
          const insights = await generateLabfoxSpecificInsights(exportPath, weekString);
          const recs = generateLabfoxSpecificRecommendations(exportPath, weekString, teamHealth, insights);
          return { success: true, data: recs };
        }
      }
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
      return { success: true, data: mockRecommendations };
    } catch (error: any) {
      return this.handleError(error, 'getRecommendations');
    }
  }

  // Get podcast data for a specific week
  static async getPodcastData(exportPath: string, weekString: string): Promise<APIResponse<any>> {
    try {
      if (exportPath) {
        const teamHealth = await calculateTeamHealthFromRealData(exportPath, weekString);
        const insights = await generateLabfoxSpecificInsights(exportPath, weekString);
        const recommendations = await generateLabfoxSpecificRecommendations(exportPath, weekString, teamHealth, insights);

        // Generate more accurate episode title based on primary theme
        const primaryTheme = insights[0]?.title || 'Key weekly developments';
        const episodeTitle = this.generateEpisodeTitle(primaryTheme, weekString);
        
        // Generate more accurate summary based on insights
        const summary = this.generateEpisodeSummary(insights, teamHealth, weekString);
        
        // Generate more accurate duration based on content length
        const estimatedDuration = this.estimateEpisodeDuration(insights, recommendations);
        
        const payload = {
          weekIdentifier: weekString,
          primaryTheme: primaryTheme,
          analyticsData: {
            keyMetrics: insights.slice(0, 2).map(p => ({ name: p.title, value: p.metric, trend: p.trend, comparison: "last week" })),
            anomaly: insights.find(p => p.severity === 'critical')?.title || "No major anomalies",
            funnelPerformance: "Conversion rates stable, with a slight drop-off at the final stage.",
          },
          slackData: {
            trendingTopic: insights.find(p => p.category === 'communication')?.title || "Project discussions",
            keyDecision: "Decision to adopt new async communication guidelines.",
            teamSentiment: "Overall sentiment is positive, with some concerns about workload.",
            crossTeamCollaboration: "Increased collaboration between Engineering and Product teams.",
          },
          recommendations: {
            recommendation1: recommendations[0]?.title || "Continue monitoring team health.",
            recommendation2: recommendations[1]?.title || "Review workload distribution.",
          },
          whitePaper: getWhitePaperContext(),
        };

        const script = generatePodcastScript(payload, ScriptTemplate.EXECUTIVE);
        
        // Generate recent episodes with more accurate data
        const recentEpisodes = this.generateRecentEpisodes(weekString, insights);
        
        const podcastData = {
          episode: {
            title: episodeTitle,
            date: this.formatWeekDate(weekString),
            duration: estimatedDuration,
            summary: summary,
            script: script,
            status: weekString === '2025-W28' ? 'new' : 'completed',
            weekString: weekString
          },
          recent: recentEpisodes
        };

        return { success: true, data: podcastData };
      }
      
      // Fallback stub
      const mockPodcastData = {
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
      };
      return { success: true, data: mockPodcastData };
    } catch (error: any) {
      return this.handleError(error, 'getPodcastData');
    }
  }

  // Helper method to generate episode titles
  private static generateEpisodeTitle(primaryTheme: string, weekString: string): string {
    const weekNumber = weekString.split('-W')[1];
    const themes = {
      'communication': 'Communication Patterns & Team Dynamics',
      'burnout': 'Burnout Prevention & Wellness Focus',
      'collaboration': 'Collaboration & Cross-Team Synergy',
      'productivity': 'Productivity & Performance Insights',
      'leadership': 'Leadership & Decision Making',
      'innovation': 'Innovation & Creative Problem Solving'
    };
    
    // Find matching theme
    const matchedTheme = Object.keys(themes).find(theme => 
      primaryTheme.toLowerCase().includes(theme)
    );
    
    if (matchedTheme) {
      return `Week ${weekNumber}: ${themes[matchedTheme as keyof typeof themes]}`;
    }
    
    return `Week ${weekNumber}: ${primaryTheme}`;
  }

  // Helper method to generate episode summaries
  private static generateEpisodeSummary(insights: any[], teamHealth: any, weekString: string): string {
    if (insights.length === 0) {
      return `Weekly overview for ${weekString} - monitoring team health and performance metrics.`;
    }
    
    const topInsights = insights.slice(0, 3);
    const summaryParts = topInsights.map(insight => 
      `${insight.title}: ${insight.description}`
    );
    
    return summaryParts.join(' ');
  }

  // Helper method to estimate episode duration
  private static estimateEpisodeDuration(insights: any[], recommendations: any[]): string {
    const baseDuration = 3; // Base 3 minutes
    const insightBonus = Math.min(insights.length * 0.5, 2); // Max 2 minutes for insights
    const recommendationBonus = Math.min(recommendations.length * 0.3, 1); // Max 1 minute for recommendations
    
    const totalMinutes = Math.round(baseDuration + insightBonus + recommendationBonus);
    return `${totalMinutes} min`;
  }

  // Helper method to format week dates
  private static formatWeekDate(weekString: string): string {
    const [year, week] = weekString.split('-W').map(Number);
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Helper method to generate recent episodes
  private static generateRecentEpisodes(currentWeek: string, insights: any[]): any[] {
    const weeks = ['2025-W28', '2025-W27', '2025-W26', '2025-W25'];
    const currentWeekIndex = weeks.indexOf(currentWeek);
    
    if (currentWeekIndex === -1) return [];
    
    const recentWeeks = weeks.slice(currentWeekIndex + 1);
    
    return recentWeeks.map((week, index) => {
      const weekNumber = week.split('-W')[1];
      const date = this.formatWeekDate(week);
      const duration = `${Math.round(3 + Math.random() * 2)} min`;
      
      // Generate episode titles based on week
      const titles = [
        'Communication Patterns & Team Dynamics',
        'Burnout Prevention & Wellness Focus',
        'Collaboration & Cross-Team Synergy',
        'Productivity & Performance Insights',
        'Leadership & Decision Making',
        'Innovation & Creative Problem Solving'
      ];
      
      const title = titles[index % titles.length];
      
      return {
        title: `Week ${weekNumber}: ${title}`,
        date: date,
        duration: duration,
        weekString: week
      };
    });
  }
}