import { useState } from "react";
import moodSunflower from "@/assets/illustrations/mood-sunflower.png";
import moodLeaf from "@/assets/illustrations/mood-leaf.png";
import moodBud from "@/assets/illustrations/mood-bud.png";

type Mood = "happy" | "neutral" | "tired";

const moods = [
  { id: "happy" as Mood, label: "Happy", image: moodSunflower, emoji: "😊" },
  { id: "neutral" as Mood, label: "Neutral", image: moodLeaf, emoji: "😐" },
  { id: "tired" as Mood, label: "Tired", image: moodBud, emoji: "😔" },
];

export const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("neutral");

  const currentMood = moods.find((m) => m.id === selectedMood) || moods[1];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <img
          src={currentMood.image}
          alt={currentMood.label}
          className="w-24 h-24 object-contain transition-all duration-500 animate-scale-in"
        />
        <p className="text-lg font-medium">
          {currentMood.emoji} Feeling {currentMood.label}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              selectedMood === mood.id
                ? "bg-primary/10 border-2 border-primary"
                : "bg-muted/50 border-2 border-transparent hover:border-primary/50"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
