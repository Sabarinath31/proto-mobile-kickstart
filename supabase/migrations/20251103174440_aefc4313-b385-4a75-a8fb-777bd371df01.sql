-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Generate usernames for existing users (using email prefix + random suffix)
UPDATE public.profiles
SET username = LOWER(
  REGEXP_REPLACE(
    split_part((SELECT email FROM auth.users WHERE id = profiles.user_id), '@', 1) || 
    '_' || 
    substr(md5(random()::text), 1, 6),
    '[^a-z0-9_]', '', 'g'
  )
)
WHERE username IS NULL;

-- Make username NOT NULL after populating
ALTER TABLE public.profiles 
ALTER COLUMN username SET NOT NULL;

-- Create index for faster username searches
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Update handle_new_user function to generate username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  -- Get base username from email or metadata
  base_username := LOWER(
    REGEXP_REPLACE(
      COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
      ),
      '[^a-z0-9_]', '', 'g'
    )
  );
  
  -- Ensure username is unique by adding counter if needed
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || '_' || counter;
  END LOOP;
  
  -- Insert profile with generated username
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    final_username
  );
  
  RETURN NEW;
END;
$function$;

-- Create function to search users by username
CREATE OR REPLACE FUNCTION public.search_users(search_query text, requesting_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.username,
    p.display_name,
    p.avatar_url
  FROM public.profiles p
  WHERE p.user_id != requesting_user_id
    AND (
      p.username ILIKE '%' || search_query || '%'
      OR p.display_name ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE 
      WHEN p.username ILIKE search_query || '%' THEN 1
      WHEN p.username ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    p.username
  LIMIT 20;
END;
$function$;