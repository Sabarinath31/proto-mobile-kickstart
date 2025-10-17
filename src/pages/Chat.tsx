import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageInput } from "@/components/messages/MessageInput";
import { VoiceRecorder } from "@/components/messages/VoiceRecorder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical, Phone, Video, ArrowDown, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockChats = {
  "1": {
    name: "Sarah Johnson",
    avatar: "",
    isOnline: true,
    isGroup: false,
  },
  "2": {
    name: "Project Team",
    avatar: "",
    isOnline: false,
    isGroup: true,
  },
};

const mockMessages = [
  {
    id: "1",
    content: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isSent: false,
    senderName: "Sarah Johnson",
  },
  {
    id: "2",
    content: "I'm good! Just working on the new project. How about you?",
    timestamp: "10:32 AM",
    isSent: true,
    isRead: true,
  },
  {
    id: "3",
    content: "That's great! I wanted to discuss the upcoming meeting.",
    timestamp: "10:33 AM",
    isSent: false,
    senderName: "Sarah Johnson",
  },
  {
    id: "4",
    content: "Sure! What time works for you?",
    timestamp: "10:35 AM",
    isSent: true,
    isDelivered: true,
  },
];

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState(mockMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = mockChats[chatId as keyof typeof mockChats];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isSent: true,
      isDelivered: false,
    };
    setMessages([...messages, newMessage]);
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
  };

  const handleSendVoice = (audioBlob: Blob) => {
    setIsRecording(false);
    toast({
      title: "Voice message sent",
      description: "Your voice message has been sent successfully.",
    });
  };

  const handleConvertToTask = () => {
    toast({
      title: "Task created",
      description: "Message converted to task successfully.",
    });
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  const initials = chat.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/messages")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-sm">{chat.name}</h1>
              <p className="text-xs text-muted-foreground">
                {chat.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleConvertToTask}>
              <CheckSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-4 pb-20"
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isSent={message.isSent}
                isRead={message.isSent && "isRead" in message ? message.isRead : false}
                isDelivered={message.isSent && "isDelivered" in message ? message.isDelivered : false}
                senderName={message.senderName}
                isGroup={chat.isGroup}
              />
            ))}
          </div>
        </ScrollArea>

        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            className="absolute bottom-24 right-4 rounded-full shadow-lg"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t">
        {isRecording ? (
          <VoiceRecorder
            onSend={handleSendVoice}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <MessageInput
            onSendMessage={handleSendMessage}
            onVoiceRecord={handleVoiceRecord}
            onAttachment={() => toast({ title: "Attachment feature coming soon" })}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
