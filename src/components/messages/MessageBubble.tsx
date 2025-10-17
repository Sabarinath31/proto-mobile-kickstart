import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
  senderName?: string;
  senderAvatar?: string;
  isGroup?: boolean;
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
}: MessageBubbleProps) => {
  const initials = senderName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("flex gap-2 mb-4", isSent ? "justify-end" : "justify-start")}>
      {!isSent && isGroup && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[75%] space-y-1", isSent && "items-end flex flex-col")}>
        {!isSent && isGroup && (
          <span className="text-xs text-muted-foreground px-3">{senderName}</span>
        )}
        
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isSent
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <p className="text-sm break-words">{content}</p>
        </div>
        
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          {isSent && (
            <span className="text-muted-foreground">
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-accent" />
              ) : isDelivered ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
      
      {isSent && isGroup && <div className="h-8 w-8" />}
    </div>
  );
};
