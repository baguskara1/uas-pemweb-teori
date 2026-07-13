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

    const MAX_PROMPT_LEN = 12000;
    const MAX_SYSTEM_LEN = 5000;
    if (prompt.length > MAX_PROMPT_LEN) {
      return NextResponse.json({ error: 'Prompt terlalu panjang' }, { status: 400 });
    }

    if (systemPrompt && typeof systemPrompt === 'string' && systemPrompt.length > MAX_SYSTEM_LEN) {
      return NextResponse.json({ error: 'System prompt too long' }, { status: 400 });
    }

    // Sanitize basic HTML tags to prevent prompt injection via markup
    const sanitizedPrompt = prompt.replace(/<[^>]*>/g, '').slice(0, MAX_PROMPT_LEN);
    const sanitizedSystemPrompt = systemPrompt 
      ? systemPrompt.replace(/<[^>]*>/g, '').slice(0, MAX_SYSTEM_LEN) 
      : undefined;

    const result = await fetchOpenRouter(sanitizedPrompt, sanitizedSystemPrompt);
    return NextResponse.json({ result });
  } catch (err) {
    console.error('[AI Route Error]:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export const POST = withRateLimit(handler);
