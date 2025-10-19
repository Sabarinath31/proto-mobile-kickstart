-- Enable realtime for all tables
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.user_conversations REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_conversations;

-- Create function for full-text search on messages
CREATE OR REPLACE FUNCTION public.search_messages(search_query text, user_id_param uuid)
RETURNS TABLE (
  id uuid,
  conversation_id uuid,
  sender_id uuid,
  content text,
  message_type text,
  file_url text,
  file_name text,
  voice_duration integer,
  created_at timestamp with time zone,
  rank real
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.message_type,
    m.file_url,
    m.file_name,
    m.voice_duration,
    m.created_at,
    ts_rank(to_tsvector('english', COALESCE(m.content, '')), plainto_tsquery('english', search_query)) as rank
  FROM public.messages m
  INNER JOIN public.user_conversations uc ON uc.conversation_id = m.conversation_id
  WHERE uc.user_id = user_id_param
    AND to_tsvector('english', COALESCE(m.content, '')) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT 50;
END;
$$;

-- Create function for searching tasks
CREATE OR REPLACE FUNCTION public.search_tasks(search_query text, user_id_param uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  is_completed boolean,
  priority text,
  due_date timestamp with time zone,
  category_id uuid,
  created_from_message_id uuid,
  created_at timestamp with time zone,
  completed_at timestamp with time zone,
  rank real
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.user_id,
    t.title,
    t.description,
    t.is_completed,
    t.priority,
    t.due_date,
    t.category_id,
    t.created_from_message_id,
    t.created_at,
    t.completed_at,
    ts_rank(
      to_tsvector('english', COALESCE(t.title, '') || ' ' || COALESCE(t.description, '')), 
      plainto_tsquery('english', search_query)
    ) as rank
  FROM public.tasks t
  WHERE t.user_id = user_id_param
    AND to_tsvector('english', COALESCE(t.title, '') || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, t.created_at DESC
  LIMIT 50;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON public.messages USING gin(to_tsvector('english', COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed ON public.tasks(user_id, is_completed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_search ON public.tasks USING gin(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_user_conversations_user ON public.user_conversations(user_id, joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date ON public.focus_sessions(user_id, completed_at DESC);