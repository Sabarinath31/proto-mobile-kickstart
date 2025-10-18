import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  category_id: string | null;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_from_message_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export const taskService = {
  async getTasks(userId: string, isCompleted?: boolean) {
    let query = supabase
      .from("tasks")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (isCompleted !== undefined) {
      query = query.eq("is_completed", isCompleted);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getTodayTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("user_id", userId)
      .eq("is_completed", false)
      .gte("due_date", today.toISOString())
      .lt("due_date", tomorrow.toISOString())
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getTask(taskId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("id", taskId)
      .single();

    if (error) throw error;
    return data;
  },

  async createTask(task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const taskData: any = {
      ...task,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;
  },

  async toggleComplete(taskId: string) {
    const { data: task } = await supabase
      .from("tasks")
      .select("is_completed")
      .eq("id", taskId)
      .single();

    if (!task) throw new Error("Task not found");

    const { data, error } = await supabase
      .from("tasks")
      .update({ is_completed: !task.is_completed })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  async createCategory(name: string, color: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        name,
        color,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(categoryId: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
  },

  subscribeToTasks(userId: string, callback: (task: Task) => void) {
    return supabase
      .channel(`tasks:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Task)
      )
      .subscribe();
  },
};
