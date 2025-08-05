import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, isSameWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SlackAPI } from "@/lib/api";

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
        // Use API to get available weeks
        const exportPath = '/slack-export/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const response = await SlackAPI.getAvailableWeeks(exportPath);
        
        if (response.success && response.data) {
          setAvailableWeeks(response.data);
        } else {
          console.error('API Error:', response.error);
          // Fallback to known weeks
          setAvailableWeeks(['2025-W28', '2025-W27', '2025-W26', '2025-W25']);
        }
      } catch (error) {
        console.error('Error loading available weeks:', error);
        // Fallback to known weeks
        setAvailableWeeks(['2025-W28', '2025-W27', '2025-W26', '2025-W25']);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableWeeks();
  }, []);

  // Convert week string to Date using calendar weeks (Monday start)
  const getWeekStartDate = (weekString: string): Date => {
    const [year, week] = weekString.split('-W').map(Number);
    
    // Calculate the first Monday of the year
    const firstDayOfYear = new Date(year, 0, 1);
    const firstMonday = new Date(firstDayOfYear);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    firstMonday.setDate(firstDayOfYear.getDate() + daysToAdd);
    
    // Add weeks to get the target week's Monday
    const targetMonday = new Date(firstMonday);
    targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    return targetMonday;
  };

  // Get current week string
  const getCurrentWeekString = (date: Date): string => {
    return `${date.getFullYear()}-W${Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
  };

  const currentWeek = startOfWeek(new Date('2025-07-14'), {
    weekStartsOn: 1
  });
  
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
            Go to Today
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