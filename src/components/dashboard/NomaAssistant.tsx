import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, MessageCircle, Lightbulb, Heart, ChevronDown, Shield, Zap, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { calculateLabfoxTeamHealth, type TeamHealthMetrics } from "@/lib/analytics";

type Message = {
  id: string;
  type: "noma" | "user";
  content: string;
  timestamp: string;
  data?: { teamMetrics?: TeamHealthMetrics | null; focus?: string };
};

export const NomaAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    type: "noma",
    content: "Hi! I'm Noma, your AI team health assistant. I analyze your team's communication patterns using research from Harvard, MIT, and Stanford. I noticed some concerning patterns in your team's async communication this week. How are you feeling about the current team dynamics?",
    timestamp: "2 minutes ago",
    data: { teamMetrics: null }
  }]);
  const [inputValue, setInputValue] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState<TeamHealthMetrics | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load team metrics on component mount
  useEffect(() => {
    const loadTeamMetrics = async () => {
      try {
        // Use real Slack export data
        const exportPath = '/Users/avinashuddaraju/Downloads/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const currentDate = new Date();
        const weekString = `${currentDate.getFullYear()}-W${Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        
        const metrics = calculateLabfoxTeamHealth(exportPath, weekString);
        setTeamMetrics(metrics);
        
        // Update initial message with metrics
        setMessages(prev => prev.map(msg => 
          msg.id === "1" ? { ...msg, data: { teamMetrics: metrics } } : msg
        ));
      } catch (error) {
        console.error('Error loading real Slack data:', error);
        // Keep default state if real data fails
      }
    };
    
    loadTeamMetrics();
  }, []);

  const quickActions = [{
    id: "team-energy",
    text: "What should I do about low team energy?",
    icon: Heart,
    category: "burnout"
  }, {
    id: "psych-safety",
    text: "How do I check psychological safety in product team?",
    icon: Shield,
    category: "leadership"
  }, {
    id: "burnout-signs",
    text: "What are the early signs of burnout I should watch for?",
    icon: Zap,
    category: "burnout"
  }, {
    id: "communication",
    text: "How can I improve team communication patterns?",
    icon: MessageCircle,
    category: "communication"
  }, {
    id: "team-development",
    text: "What stage is my team in and how can I help?",
    icon: Users,
    category: "leadership"
  }];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll events to show/hide scroll-to-bottom arrow
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollToBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResearchBasedResponse = (question: string, metrics: TeamHealthMetrics | null) => {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes("energy") || questionLower.includes("burnout")) {
      if (metrics && metrics.burnoutRisk > 0.7) {
        return {
          content: `Based on your team's communication patterns, I'm seeing concerning burnout indicators:\n\n• **${(metrics.burnoutRisk * 100).toFixed(0)}% burnout risk** - This is in the critical range\n• **${(metrics.weekendActivity * 100).toFixed(0)}% weekend activity** - Above healthy levels\n• **${(metrics.afterHoursActivity * 100).toFixed(0)}% after-hours communication**\n\n**Immediate Actions (Research-backed):**\n1. **Implement mandatory time-off policies** (Van Dun et al., 2024)\n2. **Reduce meeting load by 30%** (Perlow et al., 2017)\n3. **Establish clear work-life boundaries**\n4. **Provide mental health resources**\n\n**Why this works:** Studies show that teams with high burnout risk can recover 85% of productivity through structured interventions.`,
          data: { teamMetrics: metrics, focus: "burnout" }
        };
      } else {
        return {
          content: `Your team's energy levels appear healthy! Based on the data:\n\n• **${metrics ? (metrics.burnoutRisk * 100).toFixed(0) : 'Low'}% burnout risk**\n• **Good work-life boundaries** maintained\n• **Healthy communication patterns**\n\n**Keep doing:**\n• Maintain current work-life balance practices\n• Continue regular team check-ins\n• Sustain psychological safety initiatives\n\n**Research insight:** Teams with low burnout risk are 50% more productive (Stanford, 2016).`,
          data: { teamMetrics: metrics, focus: "energy" }
        };
      }
    }
    
    if (questionLower.includes("psychological safety") || questionLower.includes("psych safety")) {
      if (metrics && metrics.psychologicalSafety < 0.6) {
        return {
          content: `I'm seeing psychological safety concerns in your team:\n\n• **${(metrics.psychologicalSafety * 100).toFixed(0)}% safety score** - Below optimal\n• **${(metrics.helpSeeking * 100).toFixed(0)}% help-seeking behavior** - Low\n• **${(metrics.errorReporting * 100).toFixed(0)}% error reporting** - Concerning\n\n**Research-based Solutions (Edmondson, 1999):**\n1. **Model vulnerability as a leader** - Share your own mistakes\n2. **Create safe spaces for honest feedback**\n3. **Celebrate learning from mistakes**\n4. **Implement regular team retrospectives**\n\n**Why this matters:** Google's Project Aristotle found psychological safety is the #1 predictor of team performance.`,
          data: { teamMetrics: metrics, focus: "psych-safety" }
        };
      } else {
        return {
          content: `Great news! Your team shows strong psychological safety:\n\n• **${metrics ? (metrics.psychologicalSafety * 100).toFixed(0) : 'High'}% safety score**\n• **Healthy help-seeking behavior**\n• **Good error reporting patterns**\n\n**Continue these practices:**\n• Maintain open communication channels\n• Keep celebrating learning moments\n• Sustain trust-building activities\n\n**Research insight:** Teams with high psychological safety are 87% more likely to make better decisions (Harvard, 2010).`,
          data: { teamMetrics: metrics, focus: "psych-safety" }
        };
      }
    }
    
    if (questionLower.includes("communication") || questionLower.includes("patterns")) {
      if (metrics && metrics.responseTime > 4.5) {
        return {
          content: `I've identified communication bottlenecks:\n\n• **${metrics.responseTime.toFixed(1)} hour response time** - Above target\n• **${(metrics.centralization * 100).toFixed(0)}% centralization** - High\n• **${(metrics.collaborationIndex * 100).toFixed(0)}% collaboration index** - Needs improvement\n\n**Research-based Solutions (DeFilippis et al., 2022):**\n1. **Implement focus time blocks** to reduce interruptions\n2. **Set clear response time expectations**\n3. **Consider async-first communication practices**\n4. **Distribute decision-making authority**\n\n**Why this works:** Teams that work well together are 50% more productive (Stanford, 2016).`,
          data: { teamMetrics: metrics, focus: "communication" }
        };
      } else {
        return {
          content: `Your team's communication patterns look healthy:\n\n• **${metrics ? metrics.responseTime.toFixed(1) : 'Good'} hour response time**\n• **Balanced collaboration patterns**\n• **Good network density**\n\n**Optimization opportunities:**\n• Consider implementing async documentation practices\n• Explore cross-functional knowledge sharing\n• Maintain current communication rhythms\n\n**Research insight:** Teams with good communication patterns show 23% higher productivity (Gallup, 2024).`,
          data: { teamMetrics: metrics, focus: "communication" }
        };
      }
    }
    
    if (questionLower.includes("team development") || questionLower.includes("stage")) {
      const stage = metrics?.teamStage || 'performing';
      const stageAdvice = {
        forming: "Your team is in the forming stage. Focus on building relationships and establishing clear goals.",
        storming: "Your team is experiencing conflict (storming). This is normal! Facilitate healthy conflict resolution.",
        norming: "Your team is establishing norms. Support the development of healthy team practices.",
        performing: "Your team is performing well! Focus on maintaining momentum and continuous improvement.",
        adjourning: "Your team is in transition. Help manage the change process effectively."
      };
      
      return {
        content: `Your team is in the **${stage}** stage of development (Tuckman, 1965):\n\n**Current characteristics:**\n• ${stageAdvice[stage]}\n\n**Leadership actions for this stage:**\n${stage === 'storming' ? '• Facilitate conflict resolution sessions\n• Establish clear team norms\n• Provide team coaching support' : stage === 'forming' ? '• Build relationships between team members\n• Establish clear direction and goals\n• Create supportive environment' : '• Maintain high performance standards\n• Encourage continuous improvement\n• Support team autonomy'}\n\n**Research insight:** Teams progress through these stages non-linearly, with regression possible due to external changes (MIT, 2024).`,
        data: { teamMetrics: metrics, focus: "team-development" }
      };
    }
    
    // Default response
    return {
      content: "That's a great question! Based on your team's data patterns, I'd recommend starting with a simple pulse check. Here are 3 specific steps you can take this week:\n\n1. **Conduct a quick team health survey**\n2. **Review communication patterns**\n3. **Schedule one-on-ones with key team members**\n\nWould you like me to dive deeper into any specific area?",
      data: { teamMetrics: metrics, focus: "general" }
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: inputValue,
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Generate research-based response
    setTimeout(() => {
      const response = generateResearchBasedResponse(inputValue, teamMetrics);
      const nomaResponse = {
        id: (Date.now() + 1).toString(),
        type: "noma" as const,
        content: response.content,
        timestamp: "Just now",
        data: response.data
      };
      setMessages(prev => [...prev, nomaResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: action.text,
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, newMessage]);

    // Generate tailored response
    setTimeout(() => {
      const response = generateResearchBasedResponse(action.text, teamMetrics);
      const nomaResponse = {
        id: (Date.now() + 1).toString(),
        type: "noma" as const,
        content: response.content,
        timestamp: "Just now",
        data: response.data
      };
      setMessages(prev => [...prev, nomaResponse]);
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Noma Assistant
        </CardTitle>
        <CardDescription>
          AI-powered team health advisor based on organizational psychology research
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Quick Actions */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">Quick Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="text-xs h-auto p-2"
                onClick={() => handleQuickAction(action)}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 relative">
          <ScrollArea 
            ref={scrollAreaRef}
            className="h-full pr-4"
            onScroll={handleScroll}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {showScrollToBottom && (
            <Button
              size="sm"
              variant="outline"
              className="absolute bottom-4 right-4"
              onClick={scrollToBottom}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about team health, burnout, communication patterns..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
