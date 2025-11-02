import { cn } from "@/lib/utils";
import { Check, CheckCheck, CheckSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
  senderName?: string;
  senderAvatar?: string;
  isGroup?: boolean;
  onConvertToTask?: () => void;
}

export const MessageBubble = ({
  content,
  timestamp,
  isSent,
  isRead = false,
  isDelivered = false,
  senderName,
  senderAvatar,
  isGroup = false,
  onConvertToTask,
}: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const initials = senderName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={cn("flex gap-3 mb-6 group", isSent ? "justify-end" : "justify-start")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isSent && isGroup && (
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] space-y-1.5 flex items-start gap-2", isSent && "items-end flex-row-reverse")}>
        <div className="flex flex-col space-y-1.5">
          {!isSent && isGroup && (
            <span className="text-xs font-medium text-muted-foreground px-4">{senderName}</span>
          )}
          
          <div
            className={cn(
              "rounded-2xl px-5 py-3 shadow-sm",
              isSent
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-card border text-foreground rounded-bl-sm"
            )}
          >
            <p className="text-[15px] leading-relaxed break-words">{content}</p>
          </div>
          
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-xs text-muted-foreground">{timestamp}</span>
            {isSent && (
              <span className="text-muted-foreground">
                {isRead ? (
                  <CheckCheck className="h-3.5 w-3.5 text-accent" />
                ) : isDelivered ? (
                  <CheckCheck className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>
            )}
          </div>
        </div>
        
        {onConvertToTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={onConvertToTask}
            title="Convert to task"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isSent && isGroup && <div className="h-9 w-9 flex-shrink-0" />}
    </div>
  );
};
