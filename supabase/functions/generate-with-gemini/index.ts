
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader(Object.keys(corsHeaders)[0], corsHeaders[Object.keys(corsHeaders)[0]]);
    res.setHeader(Object.keys(corsHeaders)[1], corsHeaders[Object.keys(corsHeaders)[1]]);
    return res.status(200).end();
  }

  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const { prompt, maxTokens = 800, temperature = 0.7 } = req.body;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Error generating content' 
      });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ generatedText });
  } catch (error) {
    console.error('Error in generate-with-gemini function:', error);
    return res.status(500).json({ error: error.message });
  }
}
