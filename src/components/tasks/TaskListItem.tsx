import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TaskListItemProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  category: string;
  isCompleted: boolean;
  fromMessage?: boolean;
  onToggle: (id: string) => void;
}

export const TaskListItem = ({
  id,
  title,
  description,
  dueDate,
  priority,
  category,
  isCompleted,
  fromMessage = false,
  onToggle,
}: TaskListItemProps) => {
  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning border-warning/30",
    high: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-5 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
        isCompleted && "opacity-50"
      )}
    >
      {/* Visual Priority Indicator - Color-coded bar */}
      <div
        className={cn(
          "w-1 h-full rounded-full flex-shrink-0 self-stretch",
          priority === "high" && "bg-destructive",
          priority === "medium" && "bg-warning",
          priority === "low" && "bg-muted"
        )}
      />

      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(id)}
        className="mt-1 flex-shrink-0"
      />

      <Link to={`/tasks/${id}`} className="flex-1 min-w-0">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "font-medium text-base leading-snug",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {title}
            </h3>
            {fromMessage && (
              <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="px-3 py-1.5 rounded-full bg-muted font-medium">{category}</span>
            {dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};
