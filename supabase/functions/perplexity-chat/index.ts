import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    console.log('Sending request to Perplexity with message:', message);
    console.log('API Key present:', !!perplexityApiKey);
    console.log('API Key length:', perplexityApiKey.length);

    const requestBody = {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a wise and compassionate Buddhist Dharma teacher. Whenever a user shares their problem or dilemma, respond in a gentle and approachable tone. Ground your guidance in authentic Buddhist teachings, balancing practical solutions and spiritual reflection. Structure every response as: Steps: Numbered, actionable steps addressing the users concern. Reflection: A thoughtful paragraph inviting the user to contemplate the situation through Dharma principles. Scripture: Quote a relevant Buddhist sutta or teaching (Dhammapada, Sutta Pitaka, or Mahayana Sutras), explain its meaning for this context, and cite the source. Closing: Offer a kind and encouraging word, reminding the user that this advice is for support and not a substitute for professional counsel or monastic guidance. Always be pragmatic, kind, and stay grounded in the Buddhist tradition. Avoid judgment, keep answers accessible (aim for clarity at about a 9th grade reading level unless user asks for more depth), and use plain, compassionate language. If the question goes beyond Buddhist doctrine or into mental health, gently refer the user to qualified professionals or senior Dharma teachers.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status} - ${errorText}`);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Perplexity response:', data);
    
    const content = data.choices[0].message.content;
    console.log('Raw content:', content);
    
    // Parse the structured response from Perplexity
    console.log('Full content to parse:', content);
    
    // More robust parsing for different response formats
    let steps = [];
    let reflection = "";
    let scripture = {
      quote: "The present moment is the only time over which we have dominion.",
      explanation: "By focusing on what we can control right now, we find peace and clarity.",
      source: "Thich Nhat Hanh"
    };

    // Extract steps - look for numbered lists
    const stepsSection = content.match(/(?:Steps|Steps you might consider):\s*((?:\d+\..*?)(?=\n\n(?:Reflection|Scripture)|$))/is);
    if (stepsSection) {
      steps = stepsSection[1]
        .split(/\d+\.\s*\*?\*?/)
        .filter(s => s.trim())
        .map(s => s.trim().replace(/\*\*/g, '').replace(/\[.*?\]/g, ''));
    }

    // Extract reflection - look for the reflection section
    const reflectionSection = content.match(/Reflection:\s*(.*?)(?=\n\n(?:Scripture|Closing)|$)/is);
    if (reflectionSection) {
      reflection = reflectionSection[1].trim().replace(/\*\*/g, '');
    } else {
      // Fallback: try to get the first paragraph that looks like reflection
      const paragraphs = content.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.length > 100 && !paragraph.includes('Steps') && !paragraph.includes('Scripture')) {
          reflection = paragraph.trim().replace(/\*\*/g, '');
          break;
        }
      }
    }

    // Extract scripture
    const scriptureSection = content.match(/Scripture:\s*(?:The Buddha said in the Dhammapada,\s*)?["""]([^"""]+)["""].*?(?:\(([^)]+)\))?/is);
    if (scriptureSection) {
      scripture.quote = scriptureSection[1];
      if (scriptureSection[2]) {
        scripture.source = scriptureSection[2];
      }
      
      // Extract explanation
      const explanationMatch = content.match(/Scripture:.*?["""][^"""]+["""].*?This reminds us that\s*(.*?)(?=\n\n|Closing|$)/is);
      if (explanationMatch) {
        scripture.explanation = explanationMatch[1].trim().replace(/\*\*/g, '');
      }
    }

    const structuredResponse = {
      steps: steps.length > 0 ? steps : ["Take three deep breaths to center yourself", "Reflect on the situation with compassion", "Consider taking one small positive action"],
      reflection: reflection || "Take a moment to reflect on this situation with compassion and mindfulness.",
      scripture
    };

    return new Response(JSON.stringify(structuredResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in perplexity-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});