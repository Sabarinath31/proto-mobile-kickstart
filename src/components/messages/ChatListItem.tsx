import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isPinned?: boolean;
  isGroup?: boolean;
  onPin?: () => void;
}

export const ChatListItem = ({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isPinned = false,
  isGroup = false,
}: ChatListItemProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      to={`/chat/${id}`}
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-accent/50",
        unreadCount > 0 && "bg-accent/20"
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-medium text-sm truncate",
              unreadCount > 0 && "font-semibold"
            )}>
              {name}
            </h3>
            {isPinned && <Pin className="h-3 w-3 text-primary fill-primary" />}
          </div>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm text-muted-foreground truncate",
            unreadCount > 0 && "font-medium text-foreground"
          )}>
            {lastMessage}
          </p>
          <div className="flex items-center gap-2 ml-2">
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 min-w-5 rounded-full px-1.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
};
