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
    <div className={cn("flex gap-3 mb-6", isSent ? "justify-end" : "justify-start")}>
      {!isSent && isGroup && (
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] space-y-1.5", isSent && "items-end flex flex-col")}>
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
      
      {isSent && isGroup && <div className="h-9 w-9 flex-shrink-0" />}
    </div>
  );
};
