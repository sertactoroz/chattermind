import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import characters from '@/features/characters/data/characters.json';

type Body = {
  chatId: string;
  userId?: string;
  content: string;
  characterId?: string | null;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { chatId, userId, content, characterId } = body ?? {};
    if (!chatId || !content) {
      return NextResponse.json({ error: 'Missing chatId or content' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const base = process.env.NEXT_PUBLIC_GROQ_BASE; 
    if (!apiKey || !base) {
      console.error('Missing GROQ config');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1) Build system prompt from character if available
    const charDef = characterId ? (characters as any).find((c: any) => c.id === characterId) : null;
    const systemPrompt = charDef?.systemPrompt ?? 'You are a helpful AI assistant. Keep replies concise and friendly.';

    // 2) Fetch recent conversation for context (last 20 messages)
    const { data: recentMsgs, error: fetchErr } = await supabaseAdmin
      .from('messages')
      .select('sender,content,created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (fetchErr) {
      console.warn('Failed to fetch recent messages for context', fetchErr);
    }

    // Compose messages array in OpenAI chat format
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(recentMsgs) && recentMsgs.length) {
      // include last ~20 messages as user/assistant turns
      const last = recentMsgs.slice(-20);
      for (const m of last) {
        const role = m.sender === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: m.content });
      }
    }

    // finally add the new user message
    messages.push({ role: 'user', content });

    // 3) Call Groq using OpenAI-compatible chat completions endpoint
    // endpoint: `${base}/chat/completions`
    const resp = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages,
        max_tokens: 512,
        temperature: 0.7,
        // you can add other params like top_p, stop, etc.
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Groq error', txt);
      return NextResponse.json({ error: 'LLM provider error', details: txt }, { status: 502 });
    }

    const json = await resp.json();

    // Typical OpenAI-compatible response shape: choices[0].message.content
    const aiText =
      json?.choices?.[0]?.message?.content ??
      json?.choices?.[0]?.text ??
      (typeof json === 'string' ? json : null);

    if (!aiText) {
      console.warn('Empty AI response', json);
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // 4) Persist AI response using service role
    const { error: insertError } = await supabaseAdmin
      .from('messages')
      .insert([{ chat_id: chatId, sender: 'ai', content: aiText }]);

    if (insertError) {
      console.error('Failed saving AI message', insertError);
      // return success but warn (client still gets AI text)
      return NextResponse.json({ ai: aiText, warning: 'AI message save failed' }, { status: 200 });
    }

    return NextResponse.json({ ai: aiText }, { status: 200 });
  } catch (err) {
    console.error('api/chat/ai error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
