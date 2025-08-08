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
}

export function generatePodcastScript(payload: PodcastPayload): string {
  const generationDate = new Date().toISOString().split('T')[0];

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

**SAM:** Exactly. And it’s worth noting the team sentiment. We saw comments like "${payload.slackData.teamSentiment}", which tells us we need to be mindful of the human element behind these numbers.

---
**SEGMENT 3: Strategic Context & Forward Look**

**ALEX:** This all ties back to our foundational strategy. Sam, how does this align with our white paper on "${payload.whitePaper.title}"?

**SAM:** It’s a perfect illustration of the principle '${payload.whitePaper.relevantPrinciple}'. The data shows the 'what,' the Slack conversations show the 'why,' and the white paper gives us the 'how' to think about it.

**SAM:** Based on this, the anointment recommendations are clear. First: ${payload.recommendations.recommendation1}.

**ALEX:** And from a data perspective, we must ${payload.recommendations.recommendation2}. These are our primary action items for the coming week.

---
**Outro**
**(Outro Music Fades In)**

**ALEX:** That’s our pulse for week ${payload.weekIdentifier}. The data is clear, the actions are defined.

**SAM:** [tone: optimistic, forward-looking] Let’s make it a productive week. We’ll be back next time with the latest from the labs.

**(Music swells and fades out)**
`;

  return script.trim();
}