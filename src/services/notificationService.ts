import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  type: "message" | "task" | "focus" | "system";
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async getNotifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getUnreadCount(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;
    return data;
  },

  async createNotification(
    userId: string,
    type: Notification["type"],
    title: string,
    message?: string
  ) {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;
  },

  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
  },

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe();
  },
};
