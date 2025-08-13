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
          content: 'You are a wise dharma teacher providing gentle guidance. Always respond with practical steps, a short reflection, and relevant scripture with explanation. Structure your response as: **Steps:** [numbered list], **Reflection:** [paragraph], **Scripture:** "[quote]" - [explanation] (Source: [source])'
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
    const stepsMatch = content.match(/\*\*Steps:\*\*\s*((?:\d+\..*(?:\n|$))*)/i);
    const reflectionMatch = content.match(/\*\*Reflection:\*\*\s*(.*?)(?=\*\*Scripture:\*\*|$)/is);
    const scriptureMatch = content.match(/\*\*Scripture:\*\*\s*"([^"]+)"\s*-\s*(.*?)\s*\(Source:\s*([^)]+)\)/is);
    
    const structuredResponse = {
      steps: stepsMatch ? 
        stepsMatch[1].split(/\d+\./).filter(s => s.trim()).map(s => s.trim()) :
        ["Take three deep breaths to center yourself", "Reflect on the situation with compassion", "Consider taking one small positive action"],
      reflection: reflectionMatch ? 
        reflectionMatch[1].trim() :
        content.replace(/\*\*/g, '').substring(0, 300) + "...",
      scripture: scriptureMatch ? {
        quote: scriptureMatch[1],
        explanation: scriptureMatch[2].trim(),
        source: scriptureMatch[3]
      } : {
        quote: "The present moment is the only time over which we have dominion.",
        explanation: "By focusing on what we can control right now, we find peace and clarity.",
        source: "Thich Nhat Hanh"
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