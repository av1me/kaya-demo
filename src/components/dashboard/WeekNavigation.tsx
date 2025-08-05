import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, isSameWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SlackAPI } from "@/lib/api";
import {
  getBrowserCompatibleAvailableWeeks,
  parseWeekString,
  getDataCoverageSummary,
  getMostRecentWeekWithData,
  getWeekStringFromDate
} from "@/lib/slackDataUtils";

interface WeekNavigationProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekNavigation({
  selectedWeek,
  onWeekChange
}: WeekNavigationProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load available weeks from Slack data
  useEffect(() => {
    const loadAvailableWeeks = async () => {
      try {
        // Use our enhanced utility functions for better accuracy
        const weeks = await getBrowserCompatibleAvailableWeeks();
        console.log('📊 WeekNavigation: Loaded weeks:', weeks);
        
        if (weeks.length > 0) {
          setAvailableWeeks(weeks);
          
          // Log data coverage summary for debugging
          const coverage = getDataCoverageSummary();
          console.log('📈 Data Coverage Summary:', coverage);
        } else {
          console.warn('No weeks found, using fallback');
          // Fallback to known weeks based on actual data analysis
          setAvailableWeeks(['2025-W29', '2025-W28', '2025-W27', '2025-W26']);
        }
      } catch (error) {
        console.error('Error loading available weeks:', error);
        // Fallback to known weeks based on actual data analysis
        setAvailableWeeks(['2025-W29', '2025-W28', '2025-W27', '2025-W26']);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableWeeks();
  }, []);

  // Use our utility function for consistent week parsing
  const getWeekStartDate = (weekString: string): Date => {
    return parseWeekString(weekString);
  };

  // Get current week string using our utility
  const getCurrentWeekString = (date: Date): string => {
    // Import getWeekStringFromDate directly since it's already imported at the top
    return getWeekStringFromDate(date);
  };

  // Use the most recent week with actual data as "current"
  const mostRecentWeekString = getMostRecentWeekWithData();
  const currentWeek = parseWeekString(mostRecentWeekString);
  
  const currentWeekString = getCurrentWeekString(selectedWeek);
  const isCurrentWeek = isSameWeek(selectedWeek, currentWeek, {
    weekStartsOn: 1
  });
  
  // Find available weeks that are before or equal to current week
  const availableWeekDates = availableWeeks
    .map(weekString => getWeekStartDate(weekString))
    .filter(date => date <= currentWeek)
    .sort((a, b) => b.getTime() - a.getTime()); // Sort descending (most recent first)
  
  const currentWeekIndex = availableWeekDates.findIndex(date => 
    isSameWeek(date, selectedWeek, { weekStartsOn: 1 })
  );
  
  const canGoBack = currentWeekIndex < availableWeekDates.length - 1;
  const canGoForward = currentWeekIndex > 0;

  const handlePrevious = () => {
    if (canGoBack) {
      const nextIndex = currentWeekIndex + 1;
      onWeekChange(availableWeekDates[nextIndex]);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      const prevIndex = currentWeekIndex - 1;
      onWeekChange(availableWeekDates[prevIndex]);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const weekStart = startOfWeek(date, {
        weekStartsOn: 1
      });
      // Only allow dates that are in our available weeks
      const isAvailable = availableWeekDates.some(availableDate => 
        isSameWeek(availableDate, weekStart, { weekStartsOn: 1 })
      );
      if (isAvailable) {
        onWeekChange(weekStart);
        setIsCalendarOpen(false);
      }
    }
  };

  const formatWeekRange = (date: Date) => {
    const weekStart = startOfWeek(date, {
      weekStartsOn: 1
    });
    const weekEnd = addWeeks(weekStart, 1);
    weekEnd.setDate(weekEnd.getDate() - 1);
    return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between backdrop-blur-sm p-4 border border-border/40 bg-white rounded-full">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between backdrop-blur-sm p-4 border border-border/40 bg-white rounded-full">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={handlePrevious} disabled={!canGoBack} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center min-w-[200px]">
          <p className="text-sm text-muted-foreground">
            {isCurrentWeek ? "This Week" : "Week of"}
          </p>
          <p className="font-semibold text-foreground">
            {formatWeekRange(selectedWeek)}
          </p>
          {availableWeekDates.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {currentWeekIndex + 1} of {availableWeekDates.length} available weeks
            </p>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={handleNext} disabled={!canGoForward} className={cn("h-8 w-8 p-0", !canGoForward && "opacity-30")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {!isCurrentWeek && (
          <Button variant="default" size="sm" onClick={() => onWeekChange(currentWeek)} className="h-8 px-3 text-xs">
            Go to Latest
          </Button>
        )}
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <CalendarIcon className="h-3 w-3 mr-1.5" />
              Jump to Week
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar 
              mode="single" 
              selected={selectedWeek} 
              onSelect={handleDateSelect} 
              disabled={date => {
                const weekStart = startOfWeek(date, {
                  weekStartsOn: 1
                });
                return !availableWeekDates.some(availableDate => 
                  isSameWeek(availableDate, weekStart, { weekStartsOn: 1 })
                );
              }} 
              initialFocus 
              className={cn("p-3 pointer-events-auto")} 
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}