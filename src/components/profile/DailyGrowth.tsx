interface DailyGrowthProps {
  focusSessions: number;
}

export const DailyGrowth = ({ focusSessions }: DailyGrowthProps) => {
  const maxSessions = 10;
  const growthPercentage = Math.min((focusSessions / maxSessions) * 100, 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Daily Growth Vine</p>
        <p className="text-xs text-muted-foreground">{focusSessions} sessions today</p>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
          style={{ width: `${growthPercentage}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 text-xl">
            🌿
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {focusSessions < maxSessions
          ? `${maxSessions - focusSessions} more to reach full growth today`
          : "Your vine is fully grown today! 🌟"}
      </p>
    </div>
  );
};
