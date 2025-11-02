import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageInput } from "@/components/messages/MessageInput";
import { VoiceRecorder } from "@/components/messages/VoiceRecorder";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical, Phone, Video, ArrowDown, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { messageService, Message } from "@/services/messageService";
import { conversationService } from "@/services/conversationService";
import { taskService } from "@/services/taskService";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [messageToConvert, setMessageToConvert] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
    subscribeToMessages();
    getCurrentUser();

    return () => {
      // Cleanup subscriptions
    };
  }, [chatId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadChat = async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      const conv = await conversationService.getConversation(chatId);
      setConversation(conv);

      const msgs = await messageService.getMessages(chatId);
      setMessages(msgs.reverse() as Message[]);
      
      await conversationService.markAsRead(chatId);
    } catch (error) {
      console.error("Error loading chat:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!chatId) return;

    const channel = messageService.subscribeToMessages(chatId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
      
      if (newMessage.sender_id !== currentUserId) {
        conversationService.markAsRead(chatId);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  };

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

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;

    try {
      await messageService.sendMessage(chatId, content);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!chatId) return;

    try {
      setIsRecording(false);
      const voiceUrl = await messageService.uploadVoiceMessage(chatId, audioBlob);
      await messageService.sendMessage(chatId, null, "voice", voiceUrl, undefined, Math.floor(audioBlob.size / 1000));
      
      toast({
        title: "Voice message sent",
        description: "Your voice message has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending voice message:", error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive",
      });
    }
  };

  const handleConvertToTask = (messageId?: string) => {
    const targetMessageId = messageId || messages[messages.length - 1]?.id;
    const message = messages.find((m) => m.id === targetMessageId);
    
    if (message) {
      setMessageToConvert(message);
      setTaskDialogOpen(true);
    }
  };

  const handleSaveTaskFromMessage = async (taskData: any) => {
    try {
      if (!messageToConvert) return;

      await taskService.createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        due_date: taskData.dueDate,
        created_from_message_id: messageToConvert.id,
      });

      toast({
        title: "Task created",
        description: "Message converted to task successfully.",
      });
      
      setMessageToConvert(null);
    } catch (error) {
      console.error("Error converting to task:", error);
      toast({
        title: "Error",
        description: "Failed to create task from message",
        variant: "destructive",
      });
    }
  };

  const handleAttachment = async (file: File) => {
    if (!chatId) return;

    try {
      const fileUrl = await messageService.uploadAttachment(chatId, file);
      await messageService.sendMessage(chatId, null, "file", fileUrl, file.name);
      
      toast({
        title: "File sent",
        description: "Your file has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending attachment:", error);
      toast({
        title: "Error",
        description: "Failed to send file",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  const initials = conversation.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

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
              <AvatarImage src={conversation.avatar_url || ""} alt={conversation.name || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-sm">{conversation.name || "Unknown"}</h1>
              <p className="text-xs text-muted-foreground">
                {conversation.is_group ? "Group Chat" : "Direct Message"}
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
            <Button variant="ghost" size="icon" onClick={() => handleConvertToTask()}>
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
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content || ""}
                  timestamp={new Date(message.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  isSent={message.sender_id === currentUserId}
                  isRead={true}
                  isDelivered={true}
                  senderName={conversation.name}
                  senderAvatar={conversation.avatar_url}
                  isGroup={conversation.is_group}
                  onConvertToTask={() => handleConvertToTask(message.id)}
                />
              ))
            )}
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
            onAttachment={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleAttachment(file);
              };
              input.click();
            }}
          />
        )}
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSave={handleSaveTaskFromMessage}
        initialTask={messageToConvert ? {
          title: messageToConvert.content?.substring(0, 100) || "New task from message",
          description: messageToConvert.content,
        } : undefined}
      />
    </div>
  );
};

export default Chat;
