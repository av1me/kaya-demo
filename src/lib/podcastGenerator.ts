// src/lib/podcastGenerator.ts

interface PodcastPayload {
  weekIdentifier: string;
  primaryTheme: string;
  analyticsData: {
    keyMetrics: { name: string; value: string; trend: string; comparison: string }[];
    anomaly: string;
    funnelPerformance: string;
  };
  slackData: {
    trendingTopic: string;
    keyDecision: string;
    teamSentiment: string;
    crossTeamCollaboration: string;
  };
  recommendations: {
    recommendation1: string;
    recommendation2: string;
  };
  whitePaper: {
    title: string;
    coreThesis: string;
    relevantPrinciple: string;
  };
  teamMetrics?: any;
  insights?: any[];
}

// Podcast script templates
export enum ScriptTemplate {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  STORYTELLING = 'storytelling',
  EXECUTIVE = 'executive',
  TEAM_FOCUSED = 'team_focused'
}

// Generate podcast script with customizable template
export function generatePodcastScript(
  payload: PodcastPayload, 
  template: ScriptTemplate = ScriptTemplate.PROFESSIONAL
): string {
  const generationDate = new Date().toISOString().split('T')[0];
  
  switch (template) {
    case ScriptTemplate.EXECUTIVE:
      return generateExecutiveScript(payload, generationDate);
    case ScriptTemplate.CASUAL:
      return generateCasualScript(payload, generationDate);
    case ScriptTemplate.STORYTELLING:
      return generateStorytellingScript(payload, generationDate);
    case ScriptTemplate.TEAM_FOCUSED:
      return generateTeamFocusedScript(payload, generationDate);
    default:
      return generateProfessionalScript(payload, generationDate);
  }
}

// Executive-focused script for CEO dashboard
function generateExecutiveScript(payload: PodcastPayload, generationDate: string): string {
  const script = `Welcome to your Kaya CEO Weekly Briefing for week ${payload.weekIdentifier}. This is your data-driven overview of organizational health and team performance.

This week's key insight: ${payload.primaryTheme}. Let me break down what this means for your organization.

Your core metrics this week show ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} at ${metric.value}, which is ${metric.trend} ${metric.comparison}`).join('. ')}

${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `Critical finding: ${payload.analyticsData.anomaly} requires immediate attention.` : 
  "Status: No critical issues detected this week."
}

Your team dynamics show the trending topic is ${payload.slackData.trendingTopic}. A key decision was made on ${payload.slackData.keyDecision}, and overall team sentiment is ${payload.slackData.teamSentiment}.

Based on this week's data, here are your priority actions:

First, ${payload.recommendations.recommendation1}. This needs to happen this week.

Second, ${payload.recommendations.recommendation2}. This is your strategic focus for the next two weeks.

These actions align with the principle of ${payload.whitePaper.relevantPrinciple} from our research on ${payload.whitePaper.title}.

Looking ahead, expect to see metric shifts in ${payload.analyticsData.funnelPerformance}. Monitor ${payload.slackData.crossTeamCollaboration} for early indicators of success.

This concludes your Kaya CEO Weekly Briefing. The data is clear, the path forward is defined. Make it a productive week.`;

  return script.trim();
}

// Casual, team-friendly script
function generateCasualScript(payload: PodcastPayload, generationDate: string): string {
  const script = `Hey team! Welcome to another episode of Kaya Team Chat. I'm your host, and today we're diving into what happened in week ${payload.weekIdentifier}.

So, the big story this week is ${payload.primaryTheme}. Pretty interesting stuff!

The numbers show ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} is at ${metric.value} - that's ${metric.trend} ${metric.comparison}`).join('. ')}

${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `Oh, and heads up - we've got something to watch: ${payload.analyticsData.anomaly}` : 
  "Good news - no red flags this week!"
}

Now for the fun part - what's everyone chatting about on Slack?

Everyone's talking about ${payload.slackData.trendingTopic}. A big decision was made on ${payload.slackData.keyDecision}. And the team mood is ${payload.slackData.teamSentiment}.

Love seeing that ${payload.slackData.crossTeamCollaboration} happening!

Alright, here's what we're doing about it:

Action item one: ${payload.recommendations.recommendation1}

Action item two: ${payload.recommendations.recommendation2}

These tie back to our research on ${payload.whitePaper.title} - specifically the idea that ${payload.whitePaper.relevantPrinciple}.

That's the scoop for week ${payload.weekIdentifier}! 

Quick recap: Main theme is ${payload.primaryTheme}, key action is ${payload.recommendations.recommendation1}, and watch for ${payload.analyticsData.funnelPerformance}.

Keep an eye on those metrics, and let's make next week even better!

Thanks for tuning in to Kaya Team Chat. See you next week!`;

  return script.trim();
}

// Storytelling approach
function generateStorytellingScript(payload: PodcastPayload, generationDate: string): string {
  const script = `Once upon a time, in the digital halls of Kaya, week ${payload.weekIdentifier} unfolded like a chapter in our ongoing story of growth and collaboration.

Every story begins with facts, and this week our data tells us that ${payload.primaryTheme} is the central theme of our narrative.

The evidence shows ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} at ${metric.value}, a ${metric.trend} tale ${metric.comparison}`).join('. ')}

${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `But every good story has its plot twist - this week it was ${payload.analyticsData.anomaly}` : 
  "And like any well-crafted story, this week flowed smoothly without major disruptions"
}

But numbers alone don't tell the full story. Let's listen to the voices of our team.

In the digital corridors, everyone was discussing ${payload.slackData.trendingTopic}. A pivotal moment arrived when we decided ${payload.slackData.keyDecision}. The emotional temperature of our team is ${payload.slackData.teamSentiment}.

And like characters in a story, our teams began collaborating more closely: ${payload.slackData.crossTeamCollaboration}

Every story needs direction, and ours comes from the wisdom of research and the clarity of data.

Our next steps are clear. First, immediate action: ${payload.recommendations.recommendation1}. Second, strategic move: ${payload.recommendations.recommendation2}.

These actions embody the principle of ${payload.whitePaper.relevantPrinciple} from our research on ${payload.whitePaper.title}.

As this chapter of our story closes, we look ahead to the next.

Watch for changes in ${payload.analyticsData.funnelPerformance}. Monitor the development of ${payload.slackData.crossTeamCollaboration}.

The story of Kaya continues, and each week brings new insights, new challenges, and new opportunities for growth.

This concludes our story for week ${payload.weekIdentifier}. The data has spoken, the path is clear, and our story continues to unfold.

Until next week, keep writing your part of the Kaya story.`;

  return script.trim();
}

// Team-focused script
function generateTeamFocusedScript(payload: PodcastPayload, generationDate: string): string {
  const script = `Hello Kaya team! Welcome to your weekly health check-in. This is week ${payload.weekIdentifier}, and we're here to celebrate wins and tackle challenges together.

Let's start with our team's vital signs this week:

Your key metrics show ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} at ${metric.value}, which is ${metric.trend} ${metric.comparison}`).join('. ')}

${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `Team alert: We need to address ${payload.analyticsData.anomaly} together.` : 
  "Great news: No critical issues this week - your team is thriving!"
}

Now let's look at how we're working together:

The hot topic is ${payload.slackData.trendingTopic}. A big decision was made on ${payload.slackData.keyDecision}. The team vibe is ${payload.slackData.teamSentiment}. And we're seeing great ${payload.slackData.crossTeamCollaboration}.

Remember, every conversation, every decision, every collaboration shapes our team culture.

Based on this week's insights, here's what we're doing together:

This week's focus: ${payload.recommendations.recommendation1}

Next week's goal: ${payload.recommendations.recommendation2}

These actions support our research-backed approach from ${payload.whitePaper.title} - specifically the principle that ${payload.whitePaper.relevantPrinciple}.

As we wrap up this week's check-in:

We're monitoring ${payload.analyticsData.funnelPerformance}. We're building ${payload.slackData.crossTeamCollaboration}. We're growing together, as a team.

Every team member plays a role in our success. Let's make next week even better!

This is your Kaya Team Health Pulse. Keep supporting each other, keep communicating, and keep growing. See you next week!`;

  return script.trim();
}

// Professional script (original, cleaned up)
function generateProfessionalScript(payload: PodcastPayload, generationDate: string): string {
  const script = `Welcome to the Labfox Weekly Pulse. I'm Alex.

And I'm Sam. This is our definitive data debrief for week ${payload.weekIdentifier}.

Our goal is to cut through the noise and deliver the signal. This week, the data tells a clear story about ${payload.primaryTheme}.

Let's get straight to the Labfox analytics. ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} was ${metric.value}, which is a ${metric.trend} of ${metric.comparison}`).join('. ')}.

Sam, that ${payload.analyticsData.keyMetrics[0].name} seems to connect with the anomaly we saw in ${payload.analyticsData.anomaly}. Is there a causal link?

It's a strong hypothesis. The ${payload.analyticsData.anomaly} likely influenced our funnel performance, where we observed ${payload.analyticsData.funnelPerformance}.

Thanks, Alex. Data is only half the picture. Looking at our internal Slack chatter, the focus was heavily on ${payload.slackData.trendingTopic}.

We also saw a critical decision made on ${payload.slackData.keyDecision}. This seems to be a direct response to last week's findings.

That decision directly impacts our funnel performance. We should expect to see the metric shift next week as a result.

Exactly. And it's worth noting the team sentiment. We saw comments like "${payload.slackData.teamSentiment}", which tells us we need to be mindful of the human element behind these numbers.

This all ties back to our foundational strategy. Sam, how does this align with our white paper on ${payload.whitePaper.title}?

It's a perfect illustration of the principle '${payload.whitePaper.relevantPrinciple}'. The data shows the 'what,' the Slack conversations show the 'why,' and the white paper gives us the 'how' to think about it.

Based on this, the recommendations are clear. First: ${payload.recommendations.recommendation1}.

And from a data perspective, we must ${payload.recommendations.recommendation2}. These are our primary action items for the coming week.

That's our pulse for week ${payload.weekIdentifier}. The data is clear, the actions are defined.

Let's make it a productive week. We'll be back next time with the latest from the labs.`;

  return script.trim();
}

// Helper function to get available templates
export function getAvailableTemplates(): { value: ScriptTemplate; label: string; description: string }[] {
  return [
    {
      value: ScriptTemplate.EXECUTIVE,
      label: 'Executive Briefing',
      description: 'Concise, CEO-focused overview with strategic insights'
    },
    {
      value: ScriptTemplate.PROFESSIONAL,
      label: 'Professional Pulse',
      description: 'Balanced analysis with dual hosts (Alex & Sam)'
    },
    {
      value: ScriptTemplate.CASUAL,
      label: 'Team Chat',
      description: 'Casual, friendly tone for team engagement'
    },
    {
      value: ScriptTemplate.STORYTELLING,
      label: 'The Kaya Story',
      description: 'Narrative approach with storytelling elements'
    },
    {
      value: ScriptTemplate.TEAM_FOCUSED,
      label: 'Team Health Pulse',
      description: 'Team-oriented with coaching and encouragement'
    }
  ];
}