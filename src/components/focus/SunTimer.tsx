import { useEffect, useState } from "react";
import sunGlow from "@/assets/illustrations/sun-glow.png";

interface SunTimerProps {
  timeRemaining: number;
  totalTime: number;
  size?: number;
}

export const SunTimer = ({ timeRemaining, totalTime, size = 320 }: SunTimerProps) => {
  const progress = 1 - timeRemaining / totalTime;
  const sunPosition = progress * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Sky arc path */}
      <div className="absolute inset-0">
        <svg width={size} height={size} className="transform rotate-180">
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`M ${size * 0.1},${size * 0.9} Q ${size * 0.5},${size * 0.1} ${size * 0.9},${size * 0.9}`}
            fill="none"
            stroke="url(#skyGradient)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Moving sun */}
      <div
        className="absolute transition-all duration-1000 ease-linear"
        style={{
          left: `${10 + sunPosition * 0.8}%`,
          top: `${90 - Math.sin((sunPosition * Math.PI) / 100) * 80}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={sunGlow}
          alt="Sun"
          className="w-20 h-20 object-contain animate-[pulse_3s_ease-in-out_infinite]"
        />
      </div>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold tabular-nums tracking-tight text-primary">
          {formatTime(timeRemaining)}
        </span>
        <span className="text-sm text-muted-foreground mt-3">
          {progress === 0 ? "Ready to shine" : "Keep going"}
        </span>
      </div>
    </div>
  );
};
