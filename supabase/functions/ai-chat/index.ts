import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = "chat" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // ADHD-specific system prompts
    const systemPrompts = {
      chat: `You are an ADHD-friendly AI assistant for WhatsMind. Your responses should be:
- Clear and concise (avoid long paragraphs)
- Structured with bullet points when appropriate
- Encouraging and supportive
- Focused on actionable advice
- Understanding of executive dysfunction and time blindness
Help users with productivity, task management, and staying focused.`,
      
      suggest: `You are a task suggestion assistant for ADHD users. Analyze the conversation and:
- Break down complex tasks into smaller, manageable steps
- Suggest realistic priorities based on urgency and importance
- Recommend appropriate categories (Personal, Work, Shopping, Health, etc.)
- Consider executive dysfunction when estimating task difficulty
Respond ONLY with task suggestions using the provided tool.`,
      
      prioritize: `You are a task prioritization expert for ADHD users. Help them:
- Identify which tasks truly matter today
- Recognize which tasks can wait
- Avoid overwhelming to-do lists
- Focus on 3-5 key tasks maximum per day
Be compassionate about task paralysis and decision fatigue.`,
    };

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.chat;

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    };

    // Add tool calling for task suggestions
    if (type === "suggest") {
      body.tools = [
        {
          type: "function",
          function: {
            name: "suggest_tasks",
            description: "Return 3-5 actionable task suggestions based on the conversation.",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Clear, actionable task title (max 100 chars)" },
                      description: { type: "string", description: "Brief description with context" },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      category: { type: "string", description: "Category like Personal, Work, Shopping, Health" }
                    },
                    required: ["title", "priority", "category"],
                    additionalProperties: false
                  }
                }
              },
              required: ["suggestions"],
              additionalProperties: false
            }
          }
        }
      ];
      body.tool_choice = { type: "function", function: { name: "suggest_tasks" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
