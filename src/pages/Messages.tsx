import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ChatListItem } from "@/components/messages/ChatListItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Mock data
const mockChats = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "",
    lastMessage: "That's great! I wanted to discuss the upcoming meeting.",
    timestamp: "10:33 AM",
    unreadCount: 2,
    isPinned: true,
    isGroup: false,
  },
  {
    id: "2",
    name: "Project Team",
    avatar: "",
    lastMessage: "Alex: Let's schedule a call for tomorrow",
    timestamp: "Yesterday",
    unreadCount: 5,
    isPinned: false,
    isGroup: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "",
    lastMessage: "Thanks for your help!",
    timestamp: "2 days ago",
    unreadCount: 0,
    isPinned: false,
    isGroup: false,
  },
];

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredChats = mockChats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case "unread":
        return matchesSearch && chat.unreadCount > 0;
      case "pinned":
        return matchesSearch && chat.isPinned;
      case "groups":
        return matchesSearch && chat.isGroup;
      default:
        return matchesSearch;
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
          {filteredChats.length > 0 ? (
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
