import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ChatListItem } from "@/components/messages/ChatListItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { conversationService } from "@/services/conversationService";
import { messageService } from "@/services/messageService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatWithDetails {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
  isGroup: boolean;
}

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
    subscribeToConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userConvs = await conversationService.getUserConversations(user.id);
      
      const chatsData = await Promise.all(
        userConvs.map(async (uc: any) => {
          const conv = uc.conversation;
          const messages = await messageService.getMessages(conv.id, 1);
          const unreadCount = await conversationService.getUnreadCount(conv.id);

          return {
            id: conv.id,
            name: conv.name || "Unknown",
            avatar: conv.avatar_url || "",
            lastMessage: messages[0]?.content || "No messages yet",
            timestamp: messages[0] 
              ? new Date(messages[0].created_at).toLocaleDateString()
              : "",
            unreadCount: unreadCount,
            isPinned: uc.is_pinned,
            isGroup: conv.is_group,
          };
        })
      );

      setChats(chatsData);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const channel = conversationService.subscribeToConversations(user.id, () => {
        loadConversations();
      });

      return () => {
        supabase.removeChannel(channel);
      };
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadConversations();
      return;
    }

    try {
      const results = await messageService.searchMessages(searchQuery);
      // Group results by conversation
      const conversationIds = [...new Set(results.map((r: any) => r.conversation_id))];
      
      const searchChats = await Promise.all(
        conversationIds.map(async (convId: string) => {
          const conv = await conversationService.getConversation(convId);
          const relevantMsg = results.find((r: any) => r.conversation_id === convId);
          
          return {
            id: conv.id,
            name: conv.name || "Unknown",
            avatar: conv.avatar_url || "",
            lastMessage: relevantMsg?.content || "",
            timestamp: new Date(relevantMsg?.created_at).toLocaleDateString(),
            unreadCount: 0,
            isPinned: false,
            isGroup: conv.is_group,
          };
        })
      );

      setChats(searchChats);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        loadConversations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredChats = chats.filter((chat) => {
    switch (activeTab) {
      case "unread":
        return chat.unreadCount > 0;
      case "pinned":
        return chat.isPinned;
      case "groups":
        return chat.isGroup;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header title="Messages" />
      <PageContainer className="pb-20">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chat List */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                id={chat.id}
                name={chat.name}
                avatar={chat.avatar}
                lastMessage={chat.lastMessage}
                timestamp={chat.timestamp}
                unreadCount={chat.unreadCount}
                isPinned={chat.isPinned}
                isGroup={chat.isGroup}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {searchQuery ? "Try a different search term" : "Start a new conversation to get started"}
              </p>
            </div>
          )}
        </div>
      </PageContainer>
      <BottomNavigation />
    </div>
  );
};

export default Messages;
