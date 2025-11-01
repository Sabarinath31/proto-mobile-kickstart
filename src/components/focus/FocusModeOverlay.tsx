import mountainLake from "@/assets/illustrations/mountain-lake.png";
import { BreathingCircle } from "./BreathingCircle";

interface FocusModeOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

export const FocusModeOverlay = ({ isActive, onClose }: FocusModeOverlayProps) => {
  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mountainLake})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center gap-12 px-6">
        <BreathingCircle />
        
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-white text-2xl font-light tracking-wide">
            Silence helps you grow
          </p>
          <p className="text-white/70 text-sm">
            Tap anywhere to exit
          </p>
        </div>
      </div>
    </div>
  );
};
