import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { CircularTimer } from "@/components/focus/CircularTimer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      toast({
        title: "Focus session complete! 🎉",
        description: "Great job! Time for a break.",
      });
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
    <div className="min-h-screen bg-background">
      <Header title="Focus Timer" />
      <PageContainer className="pb-20">
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Sessions Today</p>
            <p className="text-2xl font-bold">{sessionsCompleted}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Focus Time</p>
            <p className="text-2xl font-bold">{todayFocusTime}m</p>
          </Card>
        </div>

        {/* Mode Badge */}
        <div className="flex justify-center mb-6">
          <Badge
            variant={mode === "focus" ? "default" : "secondary"}
            className="text-sm px-4 py-2"
          >
            {mode === "focus" ? "Focus Mode" : "Break Time"}
          </Badge>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center mb-8">
          <CircularTimer
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            size={280}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            size="lg"
            onClick={isRunning ? handlePause : handleStart}
            className="w-32"
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

          <Button size="lg" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Session Length Selector */}
        {mode === "focus" && !isRunning && (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-center">Session Length</p>
            <div className="grid grid-cols-3 gap-3">
              {([25, 15, 5] as SessionType[]).map((length) => (
                <Button
                  key={length}
                  variant={sessionLength === length ? "default" : "outline"}
                  onClick={() => handleSessionChange(length)}
                  className="h-12"
                >
                  {length} min
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Task (if applicable) */}
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Current Focus</p>
          <p className="font-medium">
            {mode === "focus"
              ? "Stay focused on your current task"
              : "Take a short break and relax"}
          </p>
          {isRunning && (
            <Progress value={progress} className="h-1 mt-3" />
          )}
        </Card>

        {/* Tips Section */}
        <Card className="p-4 mt-6 bg-accent/20 border-accent">
          <p className="text-sm font-medium mb-2">💡 Focus Tip</p>
          <p className="text-sm text-muted-foreground">
            {mode === "focus"
              ? "Eliminate distractions and focus on one task at a time for better results."
              : "Use your break to stretch, hydrate, or take a short walk."}
          </p>
        </Card>
      </PageContainer>
      <BottomNavigation />
    </div>
  );
};

export default Focus;
