-- Function to create sample chats for a user
CREATE OR REPLACE FUNCTION create_sample_chats(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_family_conv_id uuid;
  v_friends_conv_id uuid;
  v_work_conv_id uuid;
BEGIN
  -- Create Family conversation
  INSERT INTO conversations (name, is_group, created_by, category, avatar_url)
  VALUES ('Mom', false, p_user_id, 'family', null)
  RETURNING id INTO v_family_conv_id;
  
  INSERT INTO user_conversations (user_id, conversation_id, is_pinned)
  VALUES (p_user_id, v_family_conv_id, true);
  
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
  VALUES 
    (v_family_conv_id, p_user_id, 'Hi Mom! How are you doing?', 'text'),
    (v_family_conv_id, p_user_id, 'Just checking in to see how your day went', 'text');

  -- Create Friends conversation
  INSERT INTO conversations (name, is_group, created_by, category, avatar_url)
  VALUES ('Best Friends', true, p_user_id, 'friends', null)
  RETURNING id INTO v_friends_conv_id;
  
  INSERT INTO user_conversations (user_id, conversation_id, is_pinned)
  VALUES (p_user_id, v_friends_conv_id, false);
  
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
  VALUES 
    (v_friends_conv_id, p_user_id, 'Hey everyone! Who''s up for lunch this weekend?', 'text'),
    (v_friends_conv_id, p_user_id, 'I found this great new restaurant we should try!', 'text');

  -- Create Work conversation
  INSERT INTO conversations (name, is_group, created_by, category, avatar_url)
  VALUES ('Project Team', true, p_user_id, 'work', null)
  RETURNING id INTO v_work_conv_id;
  
  INSERT INTO user_conversations (user_id, conversation_id, is_pinned)
  VALUES (p_user_id, v_work_conv_id, false);
  
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
  VALUES 
    (v_work_conv_id, p_user_id, 'Morning team! Ready for today''s standup meeting?', 'text'),
    (v_work_conv_id, p_user_id, 'I''ll share the project updates in a few minutes', 'text');
END;
$$;