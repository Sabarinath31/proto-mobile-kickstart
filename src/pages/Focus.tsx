import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SunTimer } from "@/components/focus/SunTimer";
import { FocusModeOverlay } from "@/components/focus/FocusModeOverlay";
import { BloomCelebration } from "@/components/focus/BloomCelebration";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import skyBackground from "@/assets/illustrations/sky-background.png";

type TimerMode = "focus" | "break";
type SessionType = 25 | 15 | 5;

const Focus = () => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [sessionLength, setSessionLength] = useState<SessionType>(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [todayFocusTime, setTodayFocusTime] = useState(0);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === "focus" ? sessionLength * 60 : 5 * 60;

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "focus") {
      setSessionsCompleted((prev) => prev + 1);
      setTodayFocusTime((prev) => prev + sessionLength);
      setShowCelebration(true);
      setMode("break");
      setTimeRemaining(5 * 60);
    } else {
      toast({
        title: "Break time over",
        description: "Ready to focus again?",
      });
      setMode("focus");
      setTimeRemaining(sessionLength * 60);
    }

    if (soundEnabled && "Notification" in window) {
      new Notification("WhatsMind Focus Timer", {
        body: mode === "focus" ? "Focus session complete!" : "Break time over!",
      });
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    if (timeRemaining === totalTime && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(totalTime);
  };

  const handleSessionChange = (length: SessionType) => {
    setSessionLength(length);
    setTimeRemaining(length * 60);
    setIsRunning(false);
    setMode("focus");
  };

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <>
      <div 
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${skyBackground})` }}
      >
        <Header title="Focus Timer" />
        <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] pb-28">
          {/* Immersive centered layout */}
          <div className="w-full max-w-md mx-auto space-y-12">
            
            {/* Sun Timer - Main Focus */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <SunTimer
                timeRemaining={timeRemaining}
                totalTime={totalTime}
                size={320}
              />
              
              {/* Minimal mode indicator */}
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {mode === "focus" ? "Focus Session" : "Break Time"}
                </p>
              </div>
            </div>

          {/* Minimalist Controls - Single row */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={isRunning ? handlePause : handleStart}
              className="h-14 px-8 rounded-full text-base font-medium shadow-lg"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleReset}
              className="h-14 w-14 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-14 w-14 rounded-full"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setFocusModeActive(true)}
              className="h-14 w-14 rounded-full"
              disabled={!isRunning}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Session Length Selector - Only when not running */}
          {mode === "focus" && !isRunning && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-center text-muted-foreground">
                Session Length
              </p>
              <div className="grid grid-cols-3 gap-3">
                {([25, 15, 5] as SessionType[]).map((length) => (
                  <Button
                    key={length}
                    variant={sessionLength === length ? "default" : "outline"}
                    onClick={() => handleSessionChange(length)}
                    className="h-14 rounded-xl text-base"
                  >
                    {length} min
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Stats - Minimal and subtle */}
          {!isRunning && (
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{sessionsCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Sessions</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{todayFocusTime}m</p>
                <p className="text-xs text-muted-foreground mt-1">Focus Time</p>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
      <BottomNavigation />
    </div>

    <FocusModeOverlay 
      isActive={focusModeActive}
      onClose={() => setFocusModeActive(false)}
    />

    <BloomCelebration
      show={showCelebration}
      onClose={() => setShowCelebration(false)}
    />
    </>
  );
};

export default Focus;
