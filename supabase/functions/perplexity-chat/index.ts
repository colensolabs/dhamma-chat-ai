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

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a wise dharma teacher providing gentle guidance. Always respond with practical steps, a short reflection, and relevant scripture with explanation. Structure your response as: **Steps:** [numbered list], **Reflection:** [paragraph], **Scripture:** "[quote]" - [explanation] (Source: [source])'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      }),
    });

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
    const stepsMatch = content.match(/\*\*Steps:\*\*\s*((?:\d+\..*(?:\n|$))*)/i);
    const reflectionMatch = content.match(/\*\*Reflection:\*\*\s*(.*?)(?=\*\*Scripture:\*\*|$)/is);
    const scriptureMatch = content.match(/\*\*Scripture:\*\*\s*"([^"]+)"\s*-\s*(.*?)\s*\(Source:\s*([^)]+)\)/is);
    
    const structuredResponse = {
      steps: stepsMatch ? 
        stepsMatch[1].split(/\d+\./).filter(s => s.trim()).map(s => s.trim()) :
        ["Reflect on your current situation", "Take a moment for mindful breathing", "Consider what actions align with your values"],
      reflection: reflectionMatch ? 
        reflectionMatch[1].trim() :
        content.substring(0, 200) + "...",
      scripture: scriptureMatch ? {
        quote: scriptureMatch[1],
        explanation: scriptureMatch[2].trim(),
        source: scriptureMatch[3]
      } : {
        quote: "The mind is everything. What you think you become.",
        explanation: "This teaching reminds us of the power of our thoughts in shaping our reality.",
        source: "Buddhist Teaching"
      }
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