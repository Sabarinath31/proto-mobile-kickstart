import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone_number: string | null;
  notification_preferences: any;
  app_preferences: any;
  created_at: string;
  updated_at: string;
}

export interface UserSearchResult {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async deleteAvatar(avatarUrl: string) {
    const path = avatarUrl.split("/avatars/")[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from("avatars")
      .remove([path]);

    if (error) throw error;
  },

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("search_users", {
      search_query: query,
      requesting_user_id: user.id,
    });

    if (error) throw error;
    return data || [];
  },
};
