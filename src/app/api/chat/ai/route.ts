import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import characters from '@/features/characters/data/characters.json';
import { loadCharacterPrompts } from '@/lib/loadCharacterPrompts';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface CharacterData {
  id: string;
  promptKey: string;
}

type Body = {
  chatId: string;
  userId?: string;
  content: string;
  characterId?: string | null;
};

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

// Client uses this exact string to request the opening message
const INITIAL_PROMPT_SIGNAL =
  "Generate the character's opening message to start the conversation.";

// Shared brevity instruction (intentionally NOT in env)
const BREVITY_INSTRUCTION = `
STRICT RULE:
You are a conversational language partner, NOT a writing assistant.
Your replies MUST be maximum two short sentences long
and MUST end with a question relevant to the user's previous statement.
Do NOT provide lengthy explanations, lists, or cultural notes.
`;

/* ------------------------------------------------------------------ */
/* Route */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    // 🔑 Load all character env prompts (server-only)
    loadCharacterPrompts();

    const body: Body = await req.json();
    const { chatId, content, characterId } = body ?? {};

    if (!chatId || !content) {
      return NextResponse.json(
        { error: 'Missing chatId or content' },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------------- */
    /* LLM config */
    /* -------------------------------------------------------------- */

    const apiKey = process.env.GROQ_API_KEY;
    const base = process.env.NEXT_PUBLIC_GROQ_BASE;

    if (!apiKey || !base) {
      console.error('❌ Missing GROQ configuration');
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    const isInitialPrompt = content === INITIAL_PROMPT_SIGNAL;

    /* -------------------------------------------------------------- */
    /* Resolve character system prompt (ENV-based) */
    /* -------------------------------------------------------------- */

    let systemPrompt =
      'You are a helpful AI assistant. Keep replies concise and friendly.';

    if (characterId) {
      const charDef = (characters as CharacterData[]).find(
        (c) => c.id === characterId
      );

      if (charDef?.promptKey) {
        const resolvedPrompt = process.env[charDef.promptKey];

        if (resolvedPrompt) {
          systemPrompt = resolvedPrompt;
        } else {
          console.warn(
            `⚠️ Missing env prompt for key: ${charDef.promptKey}`
          );
        }
      }
    }

    // Append brevity rule
    systemPrompt += `\n${BREVITY_INSTRUCTION}`;

    // Initial message instruction
    if (isInitialPrompt) {
      systemPrompt += `
You must now initiate the conversation with your first message.
Be engaging and relevant to your role.
Do NOT include meta-commentary or explanations.
`;
    }

    /* -------------------------------------------------------------- */
    /* Load recent conversation context */
    /* -------------------------------------------------------------- */

    const { data: recentMsgs, error: fetchErr } = await supabaseAdmin
      .from('messages')
      .select('sender, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (fetchErr) {
      console.warn(
        '⚠️ Failed to fetch recent messages for context',
        fetchErr
      );
    }

    const messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }> = [{ role: 'system', content: systemPrompt }];

    if (Array.isArray(recentMsgs) && recentMsgs.length > 0) {
      const lastMessages = recentMsgs.slice(-20);

      for (const msg of lastMessages) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    // Do NOT send the initial signal as user input
    if (!isInitialPrompt) {
      messages.push({ role: 'user', content });
    }

    /* -------------------------------------------------------------- */
    /* Call Groq (OpenAI-compatible) */
    /* -------------------------------------------------------------- */

    const resp = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-safeguard-20b',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('❌ Groq API error:', txt);
      return NextResponse.json(
        { error: 'LLM provider error', details: txt },
        { status: 502 }
      );
    }

    const json = await resp.json();

    const aiText =
      json?.choices?.[0]?.message?.content ??
      json?.choices?.[0]?.text ??
      null;

    if (!aiText) {
      console.warn('⚠️ Empty AI response', json);
      return NextResponse.json(
        { error: 'Empty AI response' },
        { status: 502 }
      );
    }

    /* -------------------------------------------------------------- */
    /* Persist AI message */
    /* -------------------------------------------------------------- */

    const { error: insertError } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          sender: 'ai',
          content: aiText,
        },
      ]);

    if (insertError) {
      console.error('❌ Failed to save AI message', insertError);
      return NextResponse.json(
        { ai: aiText, warning: 'AI message save failed' },
        { status: 200 }
      );
    }

    return NextResponse.json({ ai: aiText }, { status: 200 });
  } catch (err) {
    console.error('❌ api/chat/ai error', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
