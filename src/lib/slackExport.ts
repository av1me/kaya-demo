/**
 * Slack Export Parser and Weekly Metrics Computer (Option A)
 * Reads a local Slack export directory and computes weekly metrics + insights.
 *
 * Directory layout expected (as seen in the workspace):
 * - <root>/channels.json
 * - <root>/users.json
 * - <root>/<channel-name>/YYYY-MM-DD.json (arrays of messages/events)
 *
 * Notes:
 * - We exclude bot/system messages from human-centric metrics but still record ops/bot alerts.
 * - Week bucketing uses ISO week (YYYY-WXX). We compute with UTC dates to match current Dashboard usage.
 * - Designed for synchronous file IO in the Vite dev context via `import.meta.glob` fallback to fetch. However,
 *   since we have direct Node environment during build and tests, we use fs where available.
 */

import fs from 'node:fs';
import path from 'node:path';

export type SlackUser = {
  id: string;
  name?: string;
  deleted?: boolean;
  is_bot?: boolean;
  profile?: {
    real_name?: string;
    display_name?: string;
    email?: string;
  };
};

export type SlackChannel = {
  id: string;
  name: string;
  is_general?: boolean;
  members?: string[];
};

export type SlackFile = {
  id?: string;
  name?: string;
  mimetype?: string;
  filetype?: string;
  pretty_type?: string;
  bot_id?: string;
  user?: string;
  subject?: string;
  headers?: Record<string, unknown>;
  plain_text?: string;
};

export type SlackMessage = {
  type?: string;
  subtype?: string;
  user?: string;
  text?: string;
  ts: string; // "epoch.decimals"
  files?: SlackFile[];
  blocks?: unknown[];
  bot_id?: string;
  username?: string;
};

export type WeeklyMetrics = {
  week: string; // YYYY-WXX
  activity: {
    totalMessages: number;
    byChannel: Record<string, number>; // channelName -> count
    byUser: Record<string, number>; // userId -> count
    activeUsers: number;
  };
  participation: {
    topUsers: { userId: string; count: number }[];
    giniCoefficient: number; // simple inequality proxy
  };
  responsiveness: {
    // For simplicity in this pass: replies approximated as distinct user messages within same day for channels
    // Real thread parsing needs thread_ts/thread_replies which Slack exports include when present.
    avgFirstReplyHours: number | null;
  };
  mentionsGraph: {
    // Derived from <@Uxxxx> in text as a simple proxy
    edges: Array<{ from: string; to: string; count: number }>;
  };
  opsAlerts: Array<{
    channel: string;
    ts: string;
    summary: string;
    source: 'aws' | 'integration' | 'bot' | 'unknown';
  }>;
};

type Workspace = {
  users: Record<string, SlackUser>;
  channelsByName: Record<string, SlackChannel>;
  channelDirs: string[]; // absolute paths for channel directories
};

const HUMAN_EXCLUDED_SUBTYPES = new Set([
  'channel_join',
  'channel_leave',
  'channel_purpose',
  'channel_topic',
  'channel_name',
  'message_deleted',
]);

function readJSON<T=any>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function listDir(p: string): string[] {
  return fs.existsSync(p) ? fs.readdirSync(p) : [];
}

function isDir(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function parseIsoWeekKey(date: Date): string {
  // ISO week number computation
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Thursday in current week decides the year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  const year = d.getUTCFullYear();
  const ww = String(weekNo).padStart(2, '0');
  return `${year}-W${ww}`;
}

function tsToDate(ts: string): Date {
  // Slack ts is a string like "1751937341.580579"
  const secs = Math.floor(Number(ts));
  const ms = Math.round((Number(ts) - secs) * 1000);
  return new Date((secs * 1000) + ms);
}

function extractMentions(text?: string): string[] {
  if (!text) return [];
  const matches = text.match(/<@([A-Z0-9]+)>/g) || [];
  return matches.map(m => m.replace(/<@|>/g, ''));
}

function isBotUser(user: SlackUser | undefined): boolean {
  if (!user) return false;
  return !!user.is_bot || user.id === 'USLACKBOT';
}

function isHumanMessage(msg: SlackMessage, userMap: Record<string, SlackUser>): boolean {
  if (msg.subtype && HUMAN_EXCLUDED_SUBTYPES.has(msg.subtype)) return false;
  if (!msg.user) return false;
  const u = userMap[msg.user];
  if (!u) return false;
  if (u.deleted) return false;
  if (isBotUser(u)) return false;
  return true;
}

function detectOpsAlert(file: SlackFile): 'aws' | 'integration' | 'bot' | 'unknown' {
  const lowerName = `${file.name || ''} ${file.pretty_type || ''} ${file.mimetype || ''} ${file.subject || ''}`.toLowerCase();
  if (lowerName.includes('aws budget') || lowerName.includes('aws') || lowerName.includes('cost alert')) {
    return 'aws';
  }
  if (file.bot_id) return 'bot';
  if (lowerName.includes('integration')) return 'integration';
  return 'unknown';
}

export function loadWorkspace(rootPath: string): Workspace {
  const usersPath = path.join(rootPath, 'users.json');
  const channelsPath = path.join(rootPath, 'channels.json');

  const usersArr = readJSON<SlackUser[]>(usersPath);
  const channelsArr = readJSON<SlackChannel[]>(channelsPath);

  const users: Record<string, SlackUser> = {};
  for (const u of usersArr) {
    users[u.id] = u;
  }

  const channelsByName: Record<string, SlackChannel> = {};
  for (const c of channelsArr) {
    channelsByName[c.name] = c;
  }

  const entries = listDir(rootPath);
  const channelDirs: string[] = [];
  for (const e of entries) {
    const p = path.join(rootPath, e);
    if (isDir(p) && !e.startsWith('.')) {
      // skip non-channel directories if they exist later; for now assume any dir is a channel dir
      channelDirs.push(p);
    }
  }

  return { users, channelsByName, channelDirs };
}

export function getAvailableWeeks(rootPath: string): string[] {
  const ws = loadWorkspace(rootPath);
  const weeks = new Set<string>();

  for (const chDir of ws.channelDirs) {
    const files = listDir(chDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      // filename YYYY-MM-DD.json
      const base = path.basename(f, '.json');
      const [y, m, d] = base.split('-').map(Number);
      if (!y || !m || !d) continue;
      const date = new Date(Date.UTC(y, m - 1, d));
      weeks.add(parseIsoWeekKey(date));
    }
  }

  return Array.from(weeks).sort();
}

function readChannelDayMessages(filePath: string): SlackMessage[] {
  try {
    return readJSON<SlackMessage[]>(filePath);
  } catch {
    return [];
  }
}

function computeGiniFromCounts(counts: number[]): number {
  // Simple Gini implementation for non-negative numbers
  const n = counts.length;
  if (n === 0) return 0;
  const sorted = counts.slice().sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;
  let cum = 0;
  for (let i = 0; i < n; i++) {
    cum += (i + 1) * sorted[i];
  }
  // Gini = (2 * cum) / (n * sum) - (n + 1) / n
  return (2 * cum) / (n * sum) - (n + 1) / n;
}

export function computeWeeklyMetrics(rootPath: string, week: string): WeeklyMetrics {
  const ws = loadWorkspace(rootPath);

  const byChannelCount: Record<string, number> = {};
  const byUserCount: Record<string, number> = {};
  const edgesMap = new Map<string, number>(); // key: from::to
  const opsAlerts: WeeklyMetrics['opsAlerts'] = [];

  let totalMessages = 0;

  // For a simple first-reply approximation, keep per day per channel timestamps by distinct users
  type DayChannel = string; // channel::YYYY-MM-DD
  const dayChannelMessages: Record<DayChannel, Array<{ ts: number; user: string }>> = {};

  for (const chDir of ws.channelDirs) {
    const channelName = path.basename(chDir);
    const files = listDir(chDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const base = path.basename(f, '.json');
      const [y, m, d] = base.split('-').map(Number);
      if (!y || !m || !d) continue;
      const date = new Date(Date.UTC(y, m - 1, d));
      const fileWeek = parseIsoWeekKey(date);
      if (fileWeek !== week) continue;

      const filePath = path.join(chDir, f);
      const messages = readChannelDayMessages(filePath);

      for (const msg of messages) {
        // Track ops alerts from files
        if (msg.files && msg.files.length > 0) {
          for (const fl of msg.files) {
            const src = detectOpsAlert(fl);
            // Record ops signals no matter what
            opsAlerts.push({
              channel: channelName,
              ts: msg.ts,
              summary: fl.subject || fl.name || 'file',
              source: src,
            });
          }
        }

        // Human-centric metrics
        if (isHumanMessage(msg, ws.users)) {
          totalMessages += 1;
          byChannelCount[channelName] = (byChannelCount[channelName] || 0) + 1;
          const u = msg.user!;
          byUserCount[u] = (byUserCount[u] || 0) + 1;

          // Mentions edges
          const mentions = extractMentions(msg.text);
          for (const to of mentions) {
            // Only include if target is a known human
            const target = ws.users[to];
            if (target && !isBotUser(target) && !target.deleted) {
              const key = `${u}::${to}`;
              edgesMap.set(key, (edgesMap.get(key) || 0) + 1);
            }
          }

          // Day-channel bucket
          const key = `${channelName}::${base}`;
          const tsNum = Math.floor(Number(msg.ts));
          if (!dayChannelMessages[key]) dayChannelMessages[key] = [];
          dayChannelMessages[key].push({ ts: tsNum, user: u });
        }
      }
    }
  }

  // Compute first-reply approximation (median hours between distinct-user messages in same day/channel)
  const deltasHours: number[] = [];
  for (const key of Object.keys(dayChannelMessages)) {
    const arr = dayChannelMessages[key].sort((a, b) => a.ts - b.ts);
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].user !== arr[i - 1].user) {
        const delta = (arr[i].ts - arr[i - 1].ts) / 3600; // seconds to hours
        if (delta >= 0) deltasHours.push(delta);
      }
    }
  }
  let avgFirstReplyHours: number | null = null;
  if (deltasHours.length > 0) {
    const sum = deltasHours.reduce((a, b) => a + b, 0);
    avgFirstReplyHours = sum / deltasHours.length;
  }

  const counts = Object.values(byUserCount);
  const gini = computeGiniFromCounts(counts);

  // Build mentions edges array
  const edges: WeeklyMetrics['mentionsGraph']['edges'] = [];
  for (const [k, count] of edgesMap) {
    const [from, to] = k.split('::');
    edges.push({ from, to, count });
  }

  // Top users
  const topUsers = Object.entries(byUserCount)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const metrics: WeeklyMetrics = {
    week,
    activity: {
      totalMessages,
      byChannel: byChannelCount,
      byUser: byUserCount,
      activeUsers: Object.keys(byUserCount).length,
    },
    participation: {
      topUsers,
      giniCoefficient: gini,
    },
    responsiveness: {
      avgFirstReplyHours,
    },
    mentionsGraph: {
      edges,
    },
    opsAlerts,
  };

  return metrics;
}

/**
 * High-level helpers to adapt to API layer expectations
 */

export function getInsightsFromMetrics(metrics: WeeklyMetrics) {
  const insights: Array<{ title: string; detail: string }> = [];
  insights.push({
    title: 'Activity Overview',
    detail: `Total human messages: ${metrics.activity.totalMessages}. Active users: ${metrics.activity.activeUsers}.`,
  });
  if (metrics.responsiveness.avgFirstReplyHours != null) {
    insights.push({
      title: 'Responsiveness',
      detail: `Average first reply (approx): ${metrics.responsiveness.avgFirstReplyHours.toFixed(2)} hours.`,
    });
  }
  const highConcentration = metrics.participation.giniCoefficient >= 0.5;
  insights.push({
    title: 'Participation Balance',
    detail: `Gini coefficient: ${metrics.participation.giniCoefficient.toFixed(2)}${highConcentration ? ' (concentrated participation)' : ''}.`,
  });
  if (metrics.opsAlerts.length > 0) {
    const awsAlerts = metrics.opsAlerts.filter(a => a.source === 'aws').length;
    const other = metrics.opsAlerts.length - awsAlerts;
    insights.push({
      title: 'Operational Signals',
      detail: `${metrics.opsAlerts.length} alerts detected (${awsAlerts} AWS, ${other} other).`,
    });
  }
  return insights;
}

export function getRecommendationsFromMetrics(metrics: WeeklyMetrics) {
  const recs: Array<{ title: string; action: string }> = [];
  // Responsiveness rule
  if (metrics.responsiveness.avgFirstReplyHours != null && metrics.responsiveness.avgFirstReplyHours > 6) {
    recs.push({
      title: 'Accelerate Replies',
      action: 'Establish a responder rotation and define a fast-lane thread with a 4-hour SLA in key channels.',
    });
  }
  // Participation concentration
  if (metrics.participation.giniCoefficient >= 0.5) {
    recs.push({
      title: 'Broaden Participation',
      action: 'Invite short rotating updates from more team members to distribute voice across channels.',
    });
  }
  // Ops alerts present
  if (metrics.opsAlerts.some(a => a.source === 'aws')) {
    recs.push({
      title: 'Review Cloud Spend',
      action: 'Investigate AWS budget alerts and adjust thresholds or autoscaling policies; notify finance if overspending persists.',
    });
  }
  if (recs.length === 0) {
    recs.push({
      title: 'Keep Momentum',
      action: 'Current signals look healthy. Continue regular updates and timely replies.',
    });
  }
  return recs;
}

export function getResearchSummaryFromMetrics(metrics: WeeklyMetrics) {
  const items: Array<{ title: string; summary: string }> = [];
  // Example highlights
  const busiestChannel = Object.entries(metrics.activity.byChannel)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  if (busiestChannel) {
    items.push({
      title: 'Busiest Channel',
      summary: `${busiestChannel} had the highest message volume this week.`,
    });
  }
  if (metrics.opsAlerts.length > 0) {
    items.push({
      title: 'Ops Alerts',
      summary: `Detected ${metrics.opsAlerts.length} operations-related alerts across channels.`,
    });
  }
  return items;
}