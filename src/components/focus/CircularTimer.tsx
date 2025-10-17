interface CircularTimerProps {
  timeRemaining: number;
  totalTime: number;
  size?: number;
}

export const CircularTimer = ({
  timeRemaining,
  totalTime,
  size = 280,
}: CircularTimerProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - timeRemaining / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums">
          {formatTime(timeRemaining)}
        </span>
        <span className="text-sm text-muted-foreground mt-2">
          {progress === 0 ? "Ready to start" : "Remaining"}
        </span>
      </div>
    </div>
  );
};
