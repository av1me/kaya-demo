import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "podcasts",
    title: "Podcast Recommendations",
    description: "Discover personalized podcast recommendations based on your interests and listening history.",
    targetSelector: '[data-tutorial="podcasts"]',
    position: "bottom"
  },
  {
    id: "insights",
    title: "Personal Insights",
    description: "View your listening analytics, mood patterns, and personalized insights about your podcast habits.",
    targetSelector: '[data-tutorial="insights"]',
    position: "bottom"
  },
  {
    id: "recommendations",
    title: "Content Recommendations",
    description: "Get curated content suggestions and trending topics tailored to your preferences.",
    targetSelector: '[data-tutorial="recommendations"]',
    position: "bottom"
  },
  {
    id: "assistant",
    title: "Noma AI Assistant",
    description: "Chat with Noma for podcast recommendations, questions, and personalized assistance.",
    targetSelector: '[data-tutorial="assistant"]',
    position: "left"
  }
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && tutorialSteps[currentStep]) {
      const element = document.querySelector(tutorialSteps[currentStep].targetSelector) as HTMLElement;
      setHighlightElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Highlight overlay */}
      {highlightElement && (
        <div
          className="absolute border-2 border-primary rounded-2xl bg-primary/10 pointer-events-none animate-pulse"
          style={{
            top: highlightElement.offsetTop - 8,
            left: highlightElement.offsetLeft - 8,
            width: highlightElement.offsetWidth + 16,
            height: highlightElement.offsetHeight + 16,
          }}
        />
      )}

      {/* Tutorial card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Card className="w-96 bg-background/95 backdrop-blur border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-2">{currentTutorialStep.title}</h3>
            <p className="text-muted-foreground mb-6">{currentTutorialStep.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="h-8"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Skip
                </Button>
                
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="h-8"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="h-8"
                >
                  {isLastStep ? "Finish" : "Next"}
                  {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}