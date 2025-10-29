import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerLevel, zoneName, financialConcept, previousChoices } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `You are a creative storyteller for a financial literacy game for kids ages 8-14. 
Generate engaging, age-appropriate story quests that teach financial concepts through interactive scenarios.

Each quest should:
- Have a clear story with characters and conflict
- Present 2-3 choices that teach financial decision-making
- Include consequences that help kids learn
- Be fun and encouraging, never preachy
- Use simple language appropriate for the age group
- Relate to real-life situations kids understand

Return ONLY valid JSON in this exact format:
{
  "title": "Quest title",
  "story": "The story setup (2-3 sentences)",
  "financialLesson": "The key concept being taught",
  "choices": [
    {
      "text": "Choice description",
      "outcome": "What happens if they choose this",
      "coinsReward": 50,
      "xpReward": 30,
      "lessonTaught": "What they learn from this choice"
    }
  ]
}`;

    const userPrompt = `Create a quest for:
- Player Level: ${playerLevel}
- Zone: ${zoneName}
- Financial Concept: ${financialConcept}
${previousChoices ? `- Previous choices: ${previousChoices}` : ''}

Make it creative and engaging while teaching about ${financialConcept}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const questData = JSON.parse(data.choices[0].message.content);

    console.log('Generated quest:', questData);

    return new Response(JSON.stringify(questData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-quest function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
