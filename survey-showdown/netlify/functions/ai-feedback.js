// netlify/functions/ai-feedback.js
// Proxies AI feedback requests to the Anthropic API.
// Keeps the API key server-side so it is never exposed to the browser.
//
// Environment variable required (set in Netlify dashboard → Site settings → Environment variables):
//   ANTHROPIC_API_KEY  →  your Anthropic API key
//
// Called by game-wordbank.html via:  POST /.netlify/functions/ai-feedback

export default async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { wrong, question, correctAnswers } = body;

  if (!wrong || !question || !Array.isArray(correctAnswers)) {
    return new Response(JSON.stringify({ error: 'Missing required fields: wrong, question, correctAnswers' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt = `A student is playing a US History matching game. The survey question is: "${question}"\n\nCorrect answers for this question:\n${correctAnswers.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nThe student clicked: "${wrong}"\n\nThis is wrong — it belongs to a different topic. In 1-2 sentences, explain clearly why "${wrong}" doesn't fit this question and what topic it actually relates to. Be direct and educational, not condescending.`;

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error('Anthropic API error:', upstream.status, err);
      return new Response(JSON.stringify({ error: 'Upstream API error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await upstream.json();
    const text = data.content?.find(c => c.type === 'text')?.text || '';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/ai-feedback',
};
