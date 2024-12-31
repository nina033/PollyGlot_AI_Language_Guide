import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
	// Only process POST requests
	if (request.method !== 'POST') {
		return new Response(JSON.stringify({ error: `${request.method} method not allowed.`}), { status: 405, headers: corsHeaders })
	}

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
	    baseURL: 'https://gateway.ai.cloudflare.com/v1/a38b02a53e51c0159d32938df05472f9/ai-translator-app/openai'
    });
    


    try {
      const requestData = await request.json()
        if(requestData.type === 'translation'){
          const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: requestData.messages,
            temperature: 1.1,
            presence_penalty: 0,
            frequency_penalty: 0
          });
          const response = chatCompletion.choices[0].message;
          
          return new Response(JSON.stringify(response), { headers: corsHeaders });
        } else if (requestData.type === 'chat') { //the rest of my work for the bot starts here 
          const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: requestData.messages,
            temperature: 1.1,
            presence_penalty: 0,
            frequency_penalty: 0
          });
          const response = chatCompletion.choices[0].message;
          
          return new Response(JSON.stringify(response), { headers: corsHeaders });
        } 
        else {
          return new Response(JSON.stringify({ error: 'Invalid request type. Use "translation" or "chat".' }), { status: 400, headers: corsHeaders });
        }
    } catch(e) {
		return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  },
};