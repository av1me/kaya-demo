import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Info } from "lucide-react";
import { PodcastSection } from "@/components/dashboard/PodcastSection";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { NomaAssistant } from "@/components/dashboard/NomaAssistant";
import { ResearchSummary } from "@/components/dashboard/ResearchSummary";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { WeekNavigation } from "@/components/dashboard/WeekNavigation";
import { MockLabfoxAPI as LabfoxAPI, fallbackData, errorMessages } from "@/lib/mockApi";
import { type TeamHealthMetrics } from "@/lib/analytics";

const Dashboard = () => {
  console.log("📊 Dashboard: Component initializing");
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(() => startOfWeek(new Date('2025-07-14'), {
    weekStartsOn: 1
  }));
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
        const exportPath = '/Users/avinashuddaraju/Downloads/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const weekString = `${selectedWeek.getFullYear()}-W${Math.ceil((selectedWeek.getTime() - new Date(selectedWeek.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        
        console.log("📊 Dashboard: Calling LabfoxAPI.getTeamHealth with:", { exportPath, weekString });
        const response = await LabfoxAPI.getTeamHealth(exportPath, weekString);
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
    navigate("/auth");
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
              <SettingsDialog />
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </Button>
              
              <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Profile" />
                <AvatarFallback className="bg-gradient-secondary text-primary font-semibold">
                  JD
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