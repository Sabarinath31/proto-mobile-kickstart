import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  avatar_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface UserConversation {
  id: string;
  user_id: string;
  conversation_id: string;
  is_pinned: boolean;
  last_read_at: string | null;
  joined_at: string;
}

export const conversationService = {
  async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from("user_conversations")
      .select(`
        *,
        conversation:conversations(*)
      `)
      .eq("user_id", userId)
      .order("joined_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getConversation(conversationId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (error) throw error;
    return data;
  },

  async createConversation(
    name: string | null,
    isGroup: boolean,
    participantIds: string[],
    category: string = 'other'
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        name,
        is_group: isGroup,
        created_by: user.id,
        category,
      })
      .select()
      .single();

    if (convError) throw convError;

    const userConversations = participantIds.map((userId) => ({
      user_id: userId,
      conversation_id: conversation.id,
    }));

    const { error: ucError } = await supabase
      .from("user_conversations")
      .insert(userConversations);

    if (ucError) throw ucError;

    return conversation;
  },

  async createSampleChats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.rpc("create_sample_chats", {
      p_user_id: user.id,
    });

    if (error) throw error;
  },

  async updateConversation(conversationId: string, updates: Partial<Conversation>) {
    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", conversationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async pinConversation(conversationId: string, isPinned: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("user_conversations")
      .update({ is_pinned: isPinned })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(conversationId: string) {
    const { error } = await supabase.rpc("mark_messages_as_read", {
      p_conversation_id: conversationId,
    });

    if (error) throw error;
  },

  async markAsUnread(conversationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("user_conversations")
      .update({ last_read_at: null })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  async getUnreadCount(conversationId: string) {
    const { data, error } = await supabase.rpc("get_unread_count", {
      p_conversation_id: conversationId,
    });

    if (error) throw error;
    return data as number;
  },

  async leaveConversation(conversationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("user_conversations")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  async findOrCreateDirectConversation(otherUserId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Check if a direct conversation already exists between these two users
    const { data: existingConversations } = await supabase
      .from("user_conversations")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (existingConversations) {
      for (const uc of existingConversations) {
        const { data: otherUserConv } = await supabase
          .from("user_conversations")
          .select("conversation_id, conversations!inner(is_group)")
          .eq("conversation_id", uc.conversation_id)
          .eq("user_id", otherUserId)
          .single();

        if (otherUserConv && !otherUserConv.conversations.is_group) {
          // Found existing direct conversation
          return uc.conversation_id;
        }
      }
    }

    // Get other user's profile for conversation name
    const { data: otherProfile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("user_id", otherUserId)
      .single();

    // No existing conversation, create new one
    const conversationName = otherProfile?.display_name || otherProfile?.username || "Chat";
    
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        name: conversationName,
        is_group: false,
        created_by: user.id,
        category: "other",
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add both users to the conversation
    const { error: userConvError } = await supabase
      .from("user_conversations")
      .insert([
        { user_id: user.id, conversation_id: conversation.id },
        { user_id: otherUserId, conversation_id: conversation.id },
      ]);

    if (userConvError) throw userConvError;

    return conversation.id;
  },

  subscribeToConversations(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_conversations:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_conversations",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload)
      )
      .subscribe();
  },
};
