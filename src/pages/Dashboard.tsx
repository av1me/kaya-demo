import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PodcastSection } from "@/components/dashboard/PodcastSection";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { NomaAssistant } from "@/components/dashboard/NomaAssistant";
import { ResearchSummary } from "@/components/dashboard/ResearchSummary";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { WeekNavigation } from "@/components/dashboard/WeekNavigation";
import { SlackAPI } from "@/lib/api";
import { fallbackData, errorMessages } from "@/lib/mockApi";
import { type TeamHealthMetrics } from "@/lib/analytics";
import { getMostRecentWeekWithData, parseWeekString, getWeekStringFromDate } from "@/lib/slackDataUtils";

const Dashboard = () => {
  console.log("📊 Dashboard: Component initializing");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Initialize with the most recent week that has actual data
  const [selectedWeek, setSelectedWeek] = useState(() => {
    try {
      const mostRecentWeekString = getMostRecentWeekWithData();
      console.log("📊 Dashboard: Using most recent week with data:", mostRecentWeekString);
      return parseWeekString(mostRecentWeekString);
    } catch (error) {
      console.error('📊 Dashboard: Error getting most recent week, using fallback:', error);
      // Fallback to a known week with data
      return parseWeekString('2025-W28');
    }
  });
  
  const [teamMetrics, setTeamMetrics] = useState<TeamHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load team metrics on component mount
  useEffect(() => {
    console.log("📊 Dashboard: useEffect triggered, selectedWeek:", selectedWeek);
    
    const loadTeamMetrics = async () => {
      console.log("📊 Dashboard: Starting loadTeamMetrics");
      setIsLoading(true);
      
      try {
        // Use API to get team health metrics
        const exportPath = '/slack-export/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const weekString = getWeekStringFromDate(selectedWeek);
        
        console.log("📊 Dashboard: Calling SlackAPI.getTeamHealth with:", { exportPath, weekString });
        const response = await SlackAPI.getTeamHealth(exportPath, weekString);
        console.log("📊 Dashboard: API response:", response);
        
        if (response.success && response.data) {
          console.log("📊 Dashboard: Setting team metrics from API");
          setTeamMetrics(response.data);
        } else {
          console.error('📊 Dashboard: API Error:', response.error || 'Unknown API error');
          // Use fallback data
          console.log("📊 Dashboard: Using fallback data");
          setTeamMetrics(fallbackData.teamHealth as TeamHealthMetrics);
        }
      } catch (error) {
        console.error('📊 Dashboard: Error loading team metrics:', error);
        // Use fallback data
        console.log("📊 Dashboard: Using fallback data due to error");
        setTeamMetrics(fallbackData.teamHealth as TeamHealthMetrics);
      }
      
      console.log("📊 Dashboard: Setting isLoading to false");
      setIsLoading(false);
    };

    loadTeamMetrics();
  }, [selectedWeek]);

  const handleLogout = () => {
    console.log("📊 Dashboard: Logout clicked");
    logout();
    navigate("/auth");
  };

  // Get user initials for avatar
  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  console.log("📊 Dashboard: About to render, isLoading:", isLoading, "teamMetrics:", teamMetrics);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f9' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/lovable-uploads/f8919b0a-2e40-453d-abbd-68c3b8532d76.png" alt="Kayla Logo" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-2">
              {user && (
                <div className="text-sm text-muted-foreground mr-2">
                  {user.email}
                  {user.isLabfoxUser && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Labfox
                    </span>
                  )}
                </div>
              )}
              <SettingsDialog />
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </Button>
              
              <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-gradient-secondary text-primary font-semibold">
                  {user ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="container mx-auto px-6 py-6 bg-[#f3f4f9]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="flex flex-col space-y-6 h-full">
            {/* Week Navigation */}
            <div className="relative">
              <WeekNavigation selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
            </div>
            
            {/* Weekly Podcast */}
            <div className="relative">
              <PodcastSection selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
            </div>
            
            {/* Research Summary */}
            <div className="relative">
              <ResearchSummary teamMetrics={teamMetrics} />
            </div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col space-y-6 h-full">
            {/* Weekly Insights */}
            <div className="relative">
              <InsightsSection selectedWeek={selectedWeek} />
            </div>

            {/* Recommendations - flex-1 to fill remaining space */}
            <div className="relative flex-1">
              <RecommendationsSection selectedWeek={selectedWeek} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6 h-full">
            {/* Noma Assistant */}
            <div>
              <NomaAssistant />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;