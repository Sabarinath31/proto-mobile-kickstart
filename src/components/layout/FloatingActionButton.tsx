import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const FloatingActionButton = ({ 
  onClick, 
  className,
  icon = <Plus className="h-6 w-6" />
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110",
        className
      )}
    >
      {icon}
    </Button>
  );
};
