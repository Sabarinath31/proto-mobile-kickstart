-- Create categories table for task organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B73FF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create conversations table for chats
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  is_group BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_conversations junction table
CREATE TABLE public.user_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, conversation_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'file')),
  file_url TEXT,
  file_name TEXT,
  voice_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_from_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create focus_sessions table
CREATE TABLE public.focus_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'task', 'focus', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view their own categories"
ON public.categories FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
ON public.categories FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
ON public.categories FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_conversations
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their conversations"
ON public.conversations FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- User_conversations policies
CREATE POLICY "Users can view their conversation memberships"
ON public.user_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their conversation memberships"
ON public.user_conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their conversation settings"
ON public.user_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave conversations"
ON public.user_conversations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_conversations
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.user_conversations
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
ON public.messages FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Focus_sessions policies
CREATE POLICY "Users can view their own focus sessions"
ON public.focus_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own focus sessions"
ON public.focus_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update task completed_at timestamp
CREATE OR REPLACE FUNCTION public.update_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    NEW.completed_at = now();
  ELSIF NEW.is_completed = false AND OLD.is_completed = true THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_task_completion
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_task_completed_at();

-- Function to update last_read_at when user views conversation
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_conversation_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.user_conversations
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION public.get_unread_count(p_conversation_id UUID)
RETURNS INTEGER AS $$
DECLARE
  last_read TIMESTAMP WITH TIME ZONE;
  unread_count INTEGER;
BEGIN
  SELECT last_read_at INTO last_read
  FROM public.user_conversations
  WHERE conversation_id = p_conversation_id
  AND user_id = auth.uid();
  
  SELECT COUNT(*) INTO unread_count
  FROM public.messages
  WHERE conversation_id = p_conversation_id
  AND sender_id != auth.uid()
  AND (last_read IS NULL OR created_at > last_read);
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create storage buckets for voice messages and attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-messages', 'voice-messages', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for voice messages
CREATE POLICY "Users can view their conversation voice messages"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'voice-messages' AND
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.user_conversations uc ON m.conversation_id = uc.conversation_id
    WHERE m.file_url LIKE '%' || storage.objects.name || '%'
    AND uc.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload voice messages"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'voice-messages' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their voice messages"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'voice-messages' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for attachments
CREATE POLICY "Users can view their conversation attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'attachments' AND
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.user_conversations uc ON m.conversation_id = uc.conversation_id
    WHERE m.file_url LIKE '%' || storage.objects.name || '%'
    AND uc.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_is_completed ON public.tasks(is_completed);
CREATE INDEX idx_user_conversations_user_id ON public.user_conversations(user_id);
CREATE INDEX idx_user_conversations_conversation_id ON public.user_conversations(conversation_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_focus_sessions_user_id ON public.focus_sessions(user_id);