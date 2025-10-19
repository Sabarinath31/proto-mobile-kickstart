import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIChat } from "@/hooks/useAIChat";

const AIChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, clearMessages } = useAIChat({
    onError: (error) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput("");
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const quickPrompts = [
    "Help me prioritize my tasks for today",
    "I'm feeling overwhelmed, what should I do?",
    "Give me tips for staying focused",
    "How can I break down a big project?",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="AI Assistant" />
      
      <PageContainer className="flex-1 flex flex-col pb-32">
        {/* Messages Area */}
        <ScrollArea className="flex-1 -mx-4 px-4">
          <div ref={scrollRef} className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  I'm here to help you stay organized and focused. Ask me about task management,
                  productivity tips, or anything ADHD-related.
                </p>
                
                <div className="w-full max-w-md space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setInput(prompt);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-secondary">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4">
          <div className="max-w-4xl mx-auto">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="mb-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear conversation
              </Button>
            )}
            
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about productivity, tasks, or focus..."
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px] shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
      
      <BottomNavigation />
    </div>
  );
};

export default AIChat;
