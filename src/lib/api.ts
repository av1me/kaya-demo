// API endpoints for Slack data fetching
import { supabase } from './supabaseClient';
// Slack export Option A parser (Node.js only)
import {
  getAvailableWeeks as exportGetWeeks,
  computeWeeklyMetrics,
  getInsightsFromMetrics,
  getRecommendationsFromMetrics,
  getResearchSummaryFromMetrics,
} from './slackExport';
// Browser-compatible analytics functions
import {
  calculateTeamHealthFromRealData,
  generateInsightsFromRealData,
  generateLabfoxSpecificInsights,
  getAvailableWeeksFromSlackData,
} from './analytics';
// Recommendation engine
import { generateLabfoxSpecificRecommendations } from './recommendationEngine';

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
      const query = supabase
        .from('users')
        .select('*')
        .eq('is_deleted', false)
        .order('name', { ascending: true });
      const { data, error } = await query;

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
      const query = supabase
        .from('channels')
        .select('*')
        .eq('is_archived', false)
        .order('name', { ascending: true });
      const { data, error } = await query;

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
      const query = supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(limit);
      const { data, error } = await query;

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
      const query = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      const { data, error } = await query;

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
      const query = supabase
        .from('reactions')
        .select('*')
        .eq('message_ts', messageTs)
        .order('created_at', { ascending: true });
      const { data, error } = await query;

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
      const query = supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      const { data, error } = await query;

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
      const query = supabase
        .from('channel_members')
        .select('*')
        .eq('channel_id', channelId)
        .order('joined_at', { ascending: true });
      const { data, error } = await query;

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
      const query = supabase
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
      const { data, error } = await query;

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
      const builder: any = supabase
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
        `);
      const { data, error } = await builder
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
          // Use Node.js filesystem functions for absolute paths
          console.log('📁 Using Node.js filesystem functions');
          const metrics = computeWeeklyMetrics(exportPath, weekString);
          // Map to existing shape with sensible defaults
          const teamHealth = {
            realTeam: 80,
            compellingDirection: 80,
            enablingStructure: 75,
            supportiveContext: 78,
            expertCoaching: 72,
            psychologicalSafety: Math.max(60, 90 - Math.round(metrics.participation.giniCoefficient * 40)),
            helpSeeking: Math.min(90, 50 + Math.round((metrics.mentionsGraph.edges.length || 0) / 2)),
            errorReporting: 68,
            innovationBehavior: 75,
            responseTime: metrics.responsiveness.avgFirstReplyHours ?? 0,
            messageFrequency: metrics.activity.totalMessages,
            collaborationIndex: Math.min(100, 50 + Object.keys(metrics.activity.byChannel).length * 5),
            networkDensity: Object.keys(metrics.activity.byUser).length > 1
              ? Math.min(1, metrics.mentionsGraph.edges.length / (Object.keys(metrics.activity.byUser).length ** 2))
              : 0,
            centralization: Math.min(1, metrics.participation.giniCoefficient),
            burnoutRisk: 25,
            weekendActivity: 15,
            afterHoursActivity: 20,
            stressIndicators: metrics.opsAlerts.length > 0 ? 40 : 20,
            teamStage: 'performing',
            earlyWarnings: metrics.opsAlerts.length > 0 ? ['Operational alerts detected'] : [],
            riskLevel: metrics.opsAlerts.length > 0 ? 'medium' : 'low'
          };
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
        
        if (this.isWebPath(exportPath)) {
          // Use browser-compatible analytics functions for web-served paths
          console.log('📊 Using browser-compatible analytics functions');
          const weeks = await getAvailableWeeksFromSlackData(exportPath);
          // Sort descending (latest first) for UI convenience
          const sorted = weeks.slice().sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
          return { success: true, data: sorted };
        } else {
          // Use Node.js filesystem functions for absolute paths
          console.log('📁 Using Node.js filesystem functions');
          const weeks = exportGetWeeks(exportPath);
          // Sort descending (latest first) for UI convenience
          const sorted = weeks.slice().sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
          return { success: true, data: sorted };
        }
      }
      const mockWeeks = ['2025-W28', '2025-W27', '2025-W26', '2025-W25'];
      return { success: true, data: mockWeeks };
    } catch (error: any) {
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
          // Use Node.js filesystem functions for absolute paths
          console.log('📁 Using Node.js filesystem functions');
          const metrics = computeWeeklyMetrics(exportPath, weekString);
          const insights = getInsightsFromMetrics(metrics).map((i, idx) => ({
            id: `insight-${idx}`,
            title: i.title,
            description: i.detail,
            severity: 'info',
            confidence: 80,
            category: 'auto',
            metrics: {
              totalMessages: metrics.activity.totalMessages,
              avgFirstReplyHours: metrics.responsiveness.avgFirstReplyHours,
              gini: metrics.participation.giniCoefficient,
            }
          }));
          return { success: true, data: insights };
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
          // Use Node.js filesystem functions for absolute paths
          console.log('📁 Using Node.js filesystem functions');
          const metrics = computeWeeklyMetrics(exportPath, weekString);
          const recs = getRecommendationsFromMetrics(metrics).map((r, idx) => ({
            id: `rec-${idx}`,
            title: r.title,
            description: r.action,
            priority: 'medium',
            impact: 'Medium',
            timeframe: '1-2 weeks',
            science: 'Derived from team communication signals in Slack export.',
            implementation: [],
            successIndicators: [],
            riskFactors: [],
            learnMore: []
          }));
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
        // Derive a short narrative from metrics for the "episode"
        const metrics = computeWeeklyMetrics(exportPath, weekString);
        const insights = getInsightsFromMetrics(metrics);
        const summary =
          insights.map(i => `${i.title}: ${i.detail}`).slice(0, 3).join(' ');
        const mockLike = {
          episode: {
            title: 'Weekly Team Signals',
            date: weekString,
            duration: '8 min',
            summary,
            status: 'new'
          },
          recent: []
        };
        return { success: true, data: mockLike };
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
}