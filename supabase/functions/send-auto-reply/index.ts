import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, message } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the current user from the auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get conversation participants
    const { data: participants } = await supabaseAdmin
      .from("user_conversations")
      .select("user_id")
      .eq("conversation_id", conversationId);

    if (!participants || participants.length === 0) {
      throw new Error("No participants found");
    }

    // Find a participant that is not the current user
    const otherUser = participants.find((p) => p.user_id !== user.id);
    
    if (!otherUser) {
      throw new Error("No other user found in conversation");
    }

    // Send message as the other user
    const { data: newMessage, error } = await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: otherUser.user_id,
        content: message,
        message_type: "text",
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation timestamp
    await supabaseAdmin
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return new Response(JSON.stringify({ success: true, message: newMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
