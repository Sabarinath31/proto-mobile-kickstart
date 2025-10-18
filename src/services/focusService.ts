import { supabase } from "@/integrations/supabase/client";

export interface FocusSession {
  id: string;
  user_id: string;
  duration: number;
  task_id: string | null;
  completed_at: string;
  created_at: string;
}

export const focusService = {
  async getFocusSessions(userId: string, limit = 30) {
    const { data, error } = await supabase
      .from("focus_sessions")
      .select(`
        *,
        task:tasks(title)
      `)
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getTodayFocusTime(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("focus_sessions")
      .select("duration")
      .eq("user_id", userId)
      .gte("completed_at", today.toISOString());

    if (error) throw error;

    const totalMinutes = data.reduce((sum, session) => sum + session.duration, 0);
    return totalMinutes;
  },

  async createFocusSession(duration: number, taskId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: user.id,
        duration,
        task_id: taskId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getWeeklyStats(userId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("focus_sessions")
      .select("duration, completed_at")
      .eq("user_id", userId)
      .gte("completed_at", weekAgo.toISOString())
      .order("completed_at", { ascending: true });

    if (error) throw error;

    const dailyStats = new Map<string, number>();
    data.forEach((session) => {
      const date = new Date(session.completed_at).toLocaleDateString();
      dailyStats.set(date, (dailyStats.get(date) || 0) + session.duration);
    });

    return Array.from(dailyStats.entries()).map(([date, minutes]) => ({
      date,
      minutes,
    }));
  },
};
