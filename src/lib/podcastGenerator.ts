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
  teamMetrics?: any; // Add team health metrics
  insights?: any[]; // Add raw insights
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
  const script = `
---
**TITLE:** Kaya CEO Weekly Briefing
**EPISODE_WEEK:** ${payload.weekIdentifier}
**GENERATION_DATE:** ${generationDate}
**DURATION:** 3-4 minutes

**(Professional intro music fades in)**

**NARRATOR:** [tone: confident, executive] Welcome to your Kaya CEO Weekly Briefing for ${payload.weekIdentifier}. This is your data-driven overview of organizational health and team performance.

---
**EXECUTIVE SUMMARY**

**NARRATOR:** This week's key insight: ${payload.primaryTheme}. Let me break down what this means for your organization.

**CORE METRICS:**
${payload.analyticsData.keyMetrics.map(metric => 
  `• ${metric.name}: ${metric.value} (${metric.trend} ${metric.comparison})`
).join('\n')}

---
**CRITICAL FINDINGS**

**NARRATOR:** ${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `🚨 **Alert:** ${payload.analyticsData.anomaly} requires immediate attention.` : 
  "✅ **Status:** No critical issues detected this week."
}

**TEAM DYNAMICS:**
• **Trending Topic:** ${payload.slackData.trendingTopic}
• **Key Decision:** ${payload.slackData.keyDecision}
• **Team Sentiment:** ${payload.slackData.teamSentiment}

---
**STRATEGIC RECOMMENDATIONS**

**NARRATOR:** Based on this week's data, here are your priority actions:

**1. IMMEDIATE (This Week):** ${payload.recommendations.recommendation1}
**2. STRATEGIC (Next 2 Weeks):** ${payload.recommendations.recommendation2}

**BUSINESS IMPACT:** These actions align with the principle of '${payload.whitePaper.relevantPrinciple}' from our research on "${payload.whitePaper.title}".

---
**FORWARD OUTLOOK**

**NARRATOR:** Looking ahead, expect to see metric shifts in ${payload.analyticsData.funnelPerformance}. Monitor ${payload.slackData.crossTeamCollaboration} for early indicators of success.

**NEXT BRIEFING:** We'll reconvene next week with updated metrics and progress tracking.

**(Professional outro music fades in)**

**NARRATOR:** This concludes your Kaya CEO Weekly Briefing. The data is clear, the path forward is defined. Make it a productive week.

**(Music fades out)**
`;

  return script.trim();
}

// Casual, team-friendly script
function generateCasualScript(payload: PodcastPayload, generationDate: string): string {
  const script = `
---
**TITLE:** Kaya Team Chat
**EPISODE_WEEK:** ${payload.weekIdentifier}
**GENERATION_DATE:** ${generationDate}
**DURATION:** 4-5 minutes

**(Upbeat intro music)**

**HOST:** [tone: friendly, conversational] Hey team! Welcome to another episode of Kaya Team Chat. I'm your host, and today we're diving into what happened in week ${payload.weekIdentifier}.

---
**WHAT'S THE BUZZ?**

**HOST:** So, the big story this week is ${payload.primaryTheme}. Pretty interesting stuff!

**THE NUMBERS:**
${payload.analyticsData.keyMetrics.map(metric => 
  `• ${metric.name} is showing ${metric.value} - that's ${metric.trend} ${metric.comparison}`
).join('\n')}

**HOST:** ${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `Oh, and heads up - we've got something to watch: ${payload.analyticsData.anomaly}` : 
  "Good news - no red flags this week!"
}

---
**TEAM TALK**

**HOST:** Now for the fun part - what's everyone chatting about on Slack?

**HOT TOPICS:**
• Everyone's talking about: ${payload.slackData.trendingTopic}
• Big decision made: ${payload.slackData.keyDecision}
• Team mood: ${payload.slackData.teamSentiment}

**HOST:** Love seeing that ${payload.slackData.crossTeamCollaboration} happening!

---
**WHAT'S NEXT?**

**HOST:** Alright, here's what we're doing about it:

**ACTION ITEM 1:** ${payload.recommendations.recommendation1}
**ACTION ITEM 2:** ${payload.recommendations.recommendation2}

**HOST:** These tie back to our research on "${payload.whitePaper.title}" - specifically the idea that '${payload.whitePaper.relevantPrinciple}'.

---
**WRAP UP**

**HOST:** That's the scoop for week ${payload.weekIdentifier}! 

**QUICK RECAP:**
• Main theme: ${payload.primaryTheme}
• Key action: ${payload.recommendations.recommendation1}
• Watch for: ${payload.analyticsData.funnelPerformance}

**HOST:** Keep an eye on those metrics, and let's make next week even better!

**(Upbeat outro music)**

**HOST:** Thanks for tuning in to Kaya Team Chat. See you next week!

**(Music fades out)**
`;

  return script.trim();
}

// Storytelling approach
function generateStorytellingScript(payload: PodcastPayload, generationDate: string): string {
  const script = `
---
**TITLE:** The Kaya Story
**EPISODE_WEEK:** ${payload.weekIdentifier}
**GENERATION_DATE:** ${generationDate}
**DURATION:** 5-6 minutes

**(Gentle, storytelling music begins)**

**STORYTELLER:** [tone: warm, narrative] Once upon a time, in the digital halls of Kaya, week ${payload.weekIdentifier} unfolded like a chapter in our ongoing story of growth and collaboration.

---
**CHAPTER ONE: THE DATA SPEAKS**

**STORYTELLER:** Every story begins with facts, and this week our data tells us that ${payload.primaryTheme} is the central theme of our narrative.

**THE EVIDENCE:**
${payload.analyticsData.keyMetrics.map(metric => 
  `• ${metric.name} whispered ${metric.value}, a ${metric.trend} tale ${metric.comparison}`
).join('\n')}

**STORYTELLER:** ${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `But every good story has its plot twist - this week it was ${payload.analyticsData.anomaly}` : 
  "And like any well-crafted story, this week flowed smoothly without major disruptions"
}

---
**CHAPTER TWO: THE HUMAN ELEMENT**

**STORYTELLER:** But numbers alone don't tell the full story. Let's listen to the voices of our team.

**THE CONVERSATIONS:**
• In the digital corridors, everyone was discussing: ${payload.slackData.trendingTopic}
• A pivotal moment arrived when we decided: ${payload.slackData.keyDecision}
• The emotional temperature of our team: ${payload.slackData.teamSentiment}

**STORYTELLER:** And like characters in a story, our teams began collaborating more closely: ${payload.slackData.crossTeamCollaboration}

---
**CHAPTER THREE: THE PATH FORWARD**

**STORYTELLER:** Every story needs direction, and ours comes from the wisdom of research and the clarity of data.

**OUR NEXT STEPS:**
• **Immediate Action:** ${payload.recommendations.recommendation1}
• **Strategic Move:** ${payload.recommendations.recommendation2}

**STORYTELLER:** These actions embody the principle of '${payload.whitePaper.relevantPrinciple}' from our research on "${payload.whitePaper.title}".

---
**THE ENDING - AND THE BEGINNING**

**STORYTELLER:** As this chapter of our story closes, we look ahead to the next.

**WHAT TO EXPECT:**
• Watch for changes in: ${payload.analyticsData.funnelPerformance}
• Monitor the development of: ${payload.slackData.crossTeamCollaboration}

**STORYTELLER:** The story of Kaya continues, and each week brings new insights, new challenges, and new opportunities for growth.

**(Music swells gently)**

**STORYTELLER:** This concludes our story for week ${payload.weekIdentifier}. The data has spoken, the path is clear, and our story continues to unfold.

**(Music fades to gentle ending)**

**STORYTELLER:** Until next week, keep writing your part of the Kaya story.

**(Music ends)**
`;

  return script.trim();
}

// Team-focused script
function generateTeamFocusedScript(payload: PodcastPayload, generationDate: string): string {
  const script = `
---
**TITLE:** Kaya Team Health Pulse
**EPISODE_WEEK:** ${payload.weekIdentifier}
**GENERATION_DATE:** ${generationDate}
**DURATION:** 4-5 minutes

**(Team-focused, energetic intro music)**

**TEAM COACH:** [tone: encouraging, team-oriented] Hello Kaya team! Welcome to your weekly health check-in. This is week ${payload.weekIdentifier}, and we're here to celebrate wins and tackle challenges together.

---
**TEAM HEALTH SCAN**

**TEAM COACH:** Let's start with our team's vital signs this week:

**KEY METRICS:**
${payload.analyticsData.keyMetrics.map(metric => 
  `• ${metric.name}: ${metric.value} (${metric.trend} ${metric.comparison})`
).join('\n')}

**TEAM COACH:** ${payload.analyticsData.anomaly !== "No major anomalies" ? 
  `🚨 **Team Alert:** We need to address ${payload.analyticsData.anomaly} together.` : 
  "✅ **Great news:** No critical issues this week - your team is thriving!"
}

---
**TEAM DYNAMICS CHECK**

**TEAM COACH:** Now let's look at how we're working together:

**WHAT'S HAPPENING:**
• **Hot Topic:** ${payload.slackData.trendingTopic}
• **Big Decision:** ${payload.slackData.keyDecision}
• **Team Vibe:** ${payload.slackData.teamSentiment}
• **Collaboration:** ${payload.slackData.crossTeamCollaboration}

**TEAM COACH:** Remember, every conversation, every decision, every collaboration shapes our team culture.

---
**TEAM ACTION PLAN**

**TEAM COACH:** Based on this week's insights, here's what we're doing together:

**THIS WEEK'S FOCUS:** ${payload.recommendations.recommendation1}
**NEXT WEEK'S GOAL:** ${payload.recommendations.recommendation2}

**TEAM COACH:** These actions support our research-backed approach from "${payload.whitePaper.title}" - specifically the principle that '${payload.whitePaper.relevantPrinciple}'.

---
**TEAM COMMITMENT**

**TEAM COACH:** As we wrap up this week's check-in:

**REMEMBER:**
• We're monitoring: ${payload.analyticsData.funnelPerformance}
• We're building: ${payload.slackData.crossTeamCollaboration}
• We're growing: Together, as a team

**TEAM COACH:** Every team member plays a role in our success. Let's make next week even better!

**(Team-focused outro music)**

**TEAM COACH:** This is your Kaya Team Health Pulse. Keep supporting each other, keep communicating, and keep growing. See you next week!

**(Music fades out)**
`;

  return script.trim();
}

// Professional script (original)
function generateProfessionalScript(payload: PodcastPayload, generationDate: string): string {
  const script = `
---
**TITLE:** Labfox Weekly Pulse
**EPISODE_WEEK:** ${payload.weekIdentifier}
**GENERATION_DATE:** ${generationDate}

**(Intro Music Fades In and Fades to Background)**

**ALEX:** [tone: concise, authoritative] Welcome to the Labfox Weekly Pulse. I'm Alex.

**SAM:** [tone: warm, engaging] And I'm Sam. This is our definitive data debrief for week ${payload.weekIdentifier}.

**ALEX:** Our goal is to cut through the noise and deliver the signal. This week, the data tells a clear story about ${payload.primaryTheme}.

---
**SEGMENT 1: The Numbers Deep Dive**
**(Sound Effect: Subtle data processing sound)**

**ALEX:** Let's get straight to the Labfox analytics. ${payload.analyticsData.keyMetrics.map(metric => `${metric.name} was ${metric.value}, which is a ${metric.trend} of ${metric.comparison}`).join('. ')}.

**SAM:** Alex, that ${payload.analyticsData.keyMetrics[0].name} seems to connect with the anomaly we saw in ${payload.analyticsData.anomaly}. Is there a causal link?

**ALEX:** It's a strong hypothesis. The ${payload.analyticsData.anomaly} likely influenced our funnel performance, where we observed ${payload.analyticsData.funnelPerformance}.

---
**SEGMENT 2: The Human Layer**
**(Sound Effect: Gentle keyboard typing or subtle message notification sound)**

**SAM:** Thanks, Alex. Data is only half the picture. Looking at our internal Slack chatter, the focus was heavily on ${payload.slackData.trendingTopic}.

**SAM:** We also saw a critical decision made on ${payload.slackData.keyDecision}. This seems to be a direct response to last week's findings.

**ALEX:** That decision directly impacts our funnel performance. We should expect to see the metric shift next week as a result.

**SAM:** Exactly. And it's worth noting the team sentiment. We saw comments like "${payload.slackData.teamSentiment}", which tells us we need to be mindful of the human element behind these numbers.

---
**SEGMENT 3: Strategic Context & Forward Look**

**ALEX:** This all ties back to our foundational strategy. Sam, how does this align with our white paper on "${payload.whitePaper.title}"?

**SAM:** It's a perfect illustration of the principle '${payload.whitePaper.relevantPrinciple}'. The data shows the 'what,' the Slack conversations show the 'why,' and the white paper gives us the 'how' to think about it.

**SAM:** Based on this, the anointment recommendations are clear. First: ${payload.recommendations.recommendation1}.

**ALEX:** And from a data perspective, we must ${payload.recommendations.recommendation2}. These are our primary action items for the coming week.

---
**Outro**
**(Outro Music Fades In)**

**ALEX:** That's our pulse for week ${payload.weekIdentifier}. The data is clear, the actions are defined.

**SAM:** [tone: optimistic, forward-looking] Let's make it a productive week. We'll be back next time with the latest from the labs.

**(Music swells and fades out)**
`;

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