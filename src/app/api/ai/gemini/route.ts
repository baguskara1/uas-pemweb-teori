import { type NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';

const OPENROUTER_MODEL = 'gryphe/mythomax-l2-13b';
const MAX_RETRIES = 3;

async function fetchOpenRouter(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: OPENROUTER_MODEL, messages }),
      });
      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(`OpenRouter API ${res.status}: ${errorBody}`);
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from OpenRouter');
      return text;
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  throw new Error('Max retries exceeded');
}

async function handler(request: NextRequest) {
  try {
    const { prompt, systemPrompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const result = await fetchOpenRouter(prompt, systemPrompt);
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withRateLimit(handler);
