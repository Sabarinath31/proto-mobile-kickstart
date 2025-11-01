import { useEffect, useState } from "react";
import flowerSeed from "@/assets/illustrations/flower-seed.png";
import flowerSprout from "@/assets/illustrations/flower-sprout.png";
import flowerLeaf from "@/assets/illustrations/flower-leaf.png";
import flowerBloom from "@/assets/illustrations/flower-bloom.png";

interface FlowerGrowthProps {
  completionPercentage: number;
}

export const FlowerGrowth = ({ completionPercentage }: FlowerGrowthProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (completionPercentage === 0) setStage(0);
    else if (completionPercentage < 25) setStage(0);
    else if (completionPercentage < 50) setStage(1);
    else if (completionPercentage < 75) setStage(2);
    else setStage(3);
  }, [completionPercentage]);

  const flowers = [flowerSeed, flowerSprout, flowerLeaf, flowerBloom];
  const labels = ["Seed", "Sprout", "Growing", "Blooming"];

  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
      <div className="relative">
        <img
          src={flowers[stage]}
          alt={labels[stage]}
          className="w-32 h-32 object-contain transition-all duration-700 animate-scale-in"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{labels[stage]}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {completionPercentage}% Complete
        </p>
      </div>
    </div>
  );
};
