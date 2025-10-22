-- Add category field to conversations table
ALTER TABLE public.conversations 
ADD COLUMN category text CHECK (category IN ('family', 'friends', 'work', 'other')) DEFAULT 'other';

-- Add index for better query performance
CREATE INDEX idx_conversations_category ON public.conversations(category);