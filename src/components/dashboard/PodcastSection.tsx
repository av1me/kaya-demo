import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, Calendar, Info, FileText, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format, isSameWeek, subWeeks, startOfWeek } from "date-fns";
import { SlackAPI } from "@/lib/api";
import { generateAudio } from "@/lib/elevenLabs";
import { ScriptTemplate, getAvailableTemplates } from "@/lib/podcastGenerator";

interface PodcastSectionProps {
  selectedWeek: Date;
  onWeekChange?: (week: Date) => void;
}

export const PodcastSection = ({
  selectedWeek,
  onWeekChange
}: PodcastSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate>(ScriptTemplate.EXECUTIVE);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const currentWeek = startOfWeek(new Date('2025-06-23'), {
    weekStartsOn: 1
  });
  const isCurrentWeek = isSameWeek(selectedWeek, currentWeek, {
    weekStartsOn: 1
  });

  // Use API to get podcast data
  const [podcastData, setPodcastData] = useState<any>(null);
  const [isLoadingPodcast, setIsLoadingPodcast] = useState(true);

  useEffect(() => {
    const loadPodcastData = async () => {
      setIsLoadingPodcast(true);
      try {
        const exportPath = '/slack-export/Labfox Slack export Jun 18 2025 - Jul 18 2025';
        const weekString = `${selectedWeek.getFullYear()}-W${Math.ceil((selectedWeek.getTime() - new Date(selectedWeek.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        
        const response = await SlackAPI.getPodcastData(exportPath, weekString);
        if (response.success && response.data) {
          setPodcastData(response.data);
        }
      } catch (error) {
        console.error('Error loading podcast data:', error);
        setPodcastData(null);
      } finally {
        setIsLoadingPodcast(false);
      }
    };

    loadPodcastData();
  }, [selectedWeek]);

  useEffect(() => {
    if (podcastData && podcastData.episode) {
      setScript(podcastData.episode.script);
    } else {
      setScript(null);
    }
  }, [podcastData]);

  // Safety check to prevent undefined errors
  if (isLoadingPodcast) {
    return (
      <Card className="shadow-card border-0 h-full rounded-3xl">
        <CardHeader>
          <CardTitle>Weekly Podcast</CardTitle>
          <CardDescription>Your personalized organizational health insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 bg-white rounded-3xl">
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading podcast data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!podcastData || !podcastData.episode || !podcastData.recent) {
    return (
      <Card className="shadow-card border-0 h-full rounded-3xl">
        <CardHeader>
          <CardTitle>Weekly Podcast</CardTitle>
          <CardDescription>Your personalized organizational health insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 bg-white rounded-3xl">
          <div className="text-center py-8 text-muted-foreground">
            <p>No podcast data available for this week</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentEpisode = podcastData.episode;
  const recentEpisodes = podcastData.recent;

  return (
    <Card className="shadow-card border-0 h-full rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="flex items-center gap-2 cursor-help">
                    Weekly Podcast
                    {isCurrentWeek && (
                      <Badge variant="secondary" className="bg-gradient-primary text-white bg-blue-500">
                        New
                      </Badge>
                    )}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>A personalized 3–5 minute briefing recorded by Noma, breaking down what's happening in your team and why. Each Monday, she highlights trends drawn from your team's digital behavior, with insights across burnout, communication, workload, and speed.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription className="mt-2">
              Your personalized organizational health insights
            </CardDescription>
          </div>
          
          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose podcast script style</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as ScriptTemplate)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Script Style" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTemplates().map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 bg-white rounded-3xl">
        {/* Current Episode */}
        <div className={`${isCurrentWeek ? 'bg-gradient-podcast' : 'bg-gradient-to-l from-slate-300 to-slate-400'} rounded-2xl p-6 py-[19px] px-[16px]`}>
          {/* API Key Warning */}
          {!import.meta.env.VITE_ELEVENLABS_API_KEY && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-100 text-sm">
                <strong>🔑 ElevenLabs API Key Required:</strong> To hear the podcast audio, set your API key:
                <br />
                <code className="bg-yellow-500/30 px-2 py-1 rounded text-xs">
                  export VITE_ELEVENLABS_API_KEY="your_key_here"
                </code>
                <br />
                Get your key from <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer" className="underline">elevenlabs.io</a>
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <Button
              size="icon"
              className="rounded-full bg-white/20 hover:bg-white/30 text-white"
              onClick={async () => {
                if (isPlaying) {
                  audioRef.current?.pause();
                  setIsPlaying(false);
                } else {
                  if (audioUrl) {
                    // Resume existing audio
                    audioRef.current?.play();
                    setIsPlaying(true);
                  } else if (script && !isGeneratingAudio) {
                    // Generate new audio
                    console.log('🎙️ Starting audio generation for script:', script.substring(0, 100) + '...');
                    setIsGeneratingAudio(true);
                    
                    try {
                      const audioBlob = await generateAudio(script);
                      if (audioBlob) {
                        console.log('🎙️ Audio generated successfully, size:', audioBlob.size);
                        const url = URL.createObjectURL(audioBlob);
                        setAudioUrl(url);
                        
                        // Create new audio element and set up event handlers
                        const audio = new Audio(url);
                        audio.onloadedmetadata = () => {
                          console.log('🎙️ Audio metadata loaded, duration:', audio.duration);
                          audio.play().then(() => {
                            setIsPlaying(true);
                            console.log('🎙️ Audio playback started');
                          }).catch(error => {
                            console.error('🎙️ Audio playback failed:', error);
                            setIsPlaying(false);
                          });
                        };
                        
                        audio.onerror = (error) => {
                          console.error('🎙️ Audio error:', error);
                          setIsPlaying(false);
                        };
                        
                        audio.onended = () => {
                          console.log('🎙️ Audio playback ended');
                          setIsPlaying(false);
                        };
                        
                        audioRef.current = audio;
                      } else {
                        console.error('🎙️ Failed to generate audio blob');
                        alert('Failed to generate audio. Please check your ElevenLabs API key.');
                      }
                    } catch (error) {
                      console.error('🎙️ Audio generation error:', error);
                      alert('Error generating audio: ' + (error as Error).message);
                    } finally {
                      setIsGeneratingAudio(false);
                    }
                  } else if (!script) {
                    console.error('🎙️ No script available for audio generation');
                    alert('No podcast script available for this week.');
                  }
                }
              }}
              disabled={isGeneratingAudio}
            >
              {isGeneratingAudio ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            {script && (
              <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white" onClick={() => setIsScriptDialogOpen(true)}>
                <FileText className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{currentEpisode.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-3 h-3" />
                  {currentEpisode.date}
                </span>
                <span className="text-gray-300">{currentEpisode.duration}</span>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="text-slate-50">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar placeholder */}
          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
            <div className="bg-white h-1 rounded-full w-1/3"></div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-1">
          <h4 className="mb-2 text-base font-semibold">This Week's Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentEpisode.summary}
          </p>
        </div>

        {/* Recent Episodes */}
        <div className="border-t pt-4 px-1">
          <h4 className="mb-3 font-semibold">Recent Episodes</h4>
          <div className="space-y-1">
            {recentEpisodes.map((episode, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1.5 hover:bg-accent/50 rounded-2xl px-2 -mx-2 cursor-pointer transition-colors"
                onClick={() => {
                  if (onWeekChange) {
                    const episodeWeek = startOfWeek(subWeeks(currentWeek, index + 1), { weekStartsOn: 1 });
                    onWeekChange(episodeWeek);
                  }
                }}
              >
                <div>
                  <p className="text-sm font-medium text-slate-600">{episode.title}</p>
                  <p className="text-xs text-muted-foreground">{episode.date}</p>
                </div>
                <span className="text-xs text-muted-foreground">{episode.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <AlertDialog open={isScriptDialogOpen} onOpenChange={setIsScriptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Podcast Script</AlertDialogTitle>
            <AlertDialogDescription>
              This is the generated script for the podcast.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{script}</pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsScriptDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};