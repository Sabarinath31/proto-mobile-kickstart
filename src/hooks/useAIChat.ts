import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseAIChatOptions {
  onError?: (error: string) => void;
  type?: "chat" | "suggest" | "prioritize";
}

export const useAIChat = ({ onError, type = "chat" }: UseAIChatOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [...messages, newUserMessage],
          type,
        },
      });

      if (error) throw error;

      const response = new Response(data);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              assistantContent += content;
              
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }

            // Handle tool calls for task suggestions
            const toolCall = parsed.choices?.[0]?.delta?.tool_calls?.[0];
            if (toolCall?.function?.arguments) {
              assistantContent += toolCall.function.arguments;
            }
          } catch (parseError) {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Process remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":")) continue;
          if (!raw.startsWith("data: ")) continue;
          
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) assistantContent += content;
          } catch {
            // Ignore partial data
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI response";
      onError?.(errorMessage);
      
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
