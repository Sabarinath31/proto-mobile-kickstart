import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: "text" | "voice" | "file";
  file_url: string | null;
  file_name: string | null;
  voice_duration: number | null;
  created_at: string;
  updated_at: string;
}

export const messageService = {
  async getMessages(conversationId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async sendMessage(
    conversationId: string,
    content: string | null,
    messageType: "text" | "voice" | "file" = "text",
    fileUrl?: string,
    fileName?: string,
    voiceDuration?: number
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        voice_duration: voiceDuration,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMessage(messageId: string, content: string) {
    const { data, error } = await supabase
      .from("messages")
      .update({ content })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMessage(messageId: string) {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) throw error;
  },

  async uploadVoiceMessage(conversationId: string, audioBlob: Blob) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileName = `${user.id}/${Date.now()}.webm`;

    const { error: uploadError } = await supabase.storage
      .from("voice-messages")
      .upload(fileName, audioBlob);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("voice-messages")
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async uploadAttachment(conversationId: string, file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("attachments")
      .getPublicUrl(fileName);

    return publicUrl;
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },
};
