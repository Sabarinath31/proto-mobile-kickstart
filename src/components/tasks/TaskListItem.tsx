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
        "flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md",
        isCompleted && "opacity-60"
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(id)}
        className="mt-1"
      />

      <Link to={`/tasks/${id}`} className="flex-1 min-w-0">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {title}
            </h3>
            <div className="flex items-center gap-1">
              {fromMessage && (
                <MessageSquare className="h-3 w-3 text-primary" />
              )}
              <Badge
                variant="outline"
                className={cn("text-xs h-5", priorityColors[priority])}
              >
                {priority}
              </Badge>
            </div>
          </div>

          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-accent/50">{category}</span>
            {dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};
