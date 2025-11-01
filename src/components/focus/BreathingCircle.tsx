export const BreathingCircle = () => {
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute inset-4 rounded-full bg-white/30 backdrop-blur-sm animate-[pulse_4s_ease-in-out_infinite_1s]" />
      <div className="absolute inset-8 rounded-full bg-white/40 backdrop-blur-sm animate-[pulse_4s_ease-in-out_infinite_2s]" />
    </div>
  );
};
