// src/app/api/chat/ai/route.ts
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
    const systemPrompt = charDef?.systemPrompt ?? 'You are a helpful AI assistant.';

    // 2) Fetch recent conversation for context (last 10 messages)
    const { data: recentMsgs, error: fetchErr } = await supabaseAdmin
      .from('messages')
      .select('sender,content,created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50); // limit for safety

    if (fetchErr) {
      console.warn('Failed to fetch recent messages for context', fetchErr);
    }

    // Compose prompt: system prompt + recent convo (optionally truncated) + new user message
    let convoContext = '';
    if (Array.isArray(recentMsgs) && recentMsgs.length) {
      // include last ~20 messages (or all if small)
      const last = recentMsgs.slice(-20);
      convoContext = last
        .map((m: any) => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n');
    }

    const promptParts = [
      `SYSTEM: ${systemPrompt}`,
      convoContext ? `CONTEXT:\n${convoContext}` : '',
      `User: ${content}`,
      'AI:'
    ].filter(Boolean).join('\n\n');

    // 3) Call Groq API (adjust per provider)
    const resp = await fetch(`${base}/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemma-1',
        input: promptParts,
        // add model params here if required, e.g. temperature, maxTokens
        // temperature: 0.8,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Groq error', txt);
      return NextResponse.json({ error: 'LLM provider error', details: txt }, { status: 502 });
    }

    const json = await resp.json();
    // parse common shapes; adjust if Groq's response shape differs
    const aiText = json?.output?.[0]?.content ?? json?.text ?? (typeof json === 'string' ? json : null);

    if (!aiText) {
      console.warn('Empty AI response', json);
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // 4) Persist AI response to DB
    const { error: insertError } = await supabaseAdmin
      .from('messages')
      .insert([{ chat_id: chatId, sender: 'ai', content: aiText }]);

    if (insertError) {
      console.error('Failed saving AI message', insertError);
      // still return ai text to client, but warn
      return NextResponse.json({ ai: aiText, warning: 'AI message saved failed' }, { status: 200 });
    }

    return NextResponse.json({ ai: aiText }, { status: 200 });
  } catch (err) {
    console.error('api/chat/ai error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
