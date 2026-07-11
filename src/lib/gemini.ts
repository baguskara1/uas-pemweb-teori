export async function callGeminiAI(prompt: string, systemPrompt?: string) {
  const res = await fetch('/api/ai/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get AI response');
  return data.result as string;
}
