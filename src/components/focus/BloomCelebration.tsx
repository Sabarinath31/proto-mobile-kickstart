import flowerBloom from "@/assets/illustrations/flower-bloom.png";

interface BloomCelebrationProps {
  show: boolean;
  onClose: () => void;
}

export const BloomCelebration = ({ show, onClose }: BloomCelebrationProps) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="bg-card rounded-3xl p-12 max-w-md mx-4 text-center space-y-6 animate-scale-in shadow-2xl">
        <img
          src={flowerBloom}
          alt="Blooming flower"
          className="w-32 h-32 mx-auto object-contain animate-[spin_1s_ease-in-out]"
        />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">🌸 You stayed focused!</h2>
          <p className="text-muted-foreground">Great job completing your focus session</p>
        </div>
        <button
          onClick={onClose}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
