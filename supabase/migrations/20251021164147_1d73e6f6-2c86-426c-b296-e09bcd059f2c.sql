-- Fix security issues identified in Phase 9 review

-- 1. Add INSERT policy for notifications table (allow system to create notifications)
CREATE POLICY "System can create notifications for users"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- 2. Add UPDATE and DELETE policies for focus_sessions table
CREATE POLICY "Users can update their own focus sessions"
ON public.focus_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions"
ON public.focus_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- 3. Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 4. Add DELETE policy for conversations table
CREATE POLICY "Conversation creators can delete their conversations"
ON public.conversations
FOR DELETE
USING (auth.uid() = created_by);