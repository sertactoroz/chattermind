import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import characters from '@/features/characters/data/characters.json';
import { loadCharacterPrompts } from '@/lib/loadCharacterPrompts';

interface CharacterData {
  id: string;
  promptKey: string;
}

// Define the special content used by the client to signal an initial message request
const INITIAL_PROMPT_SIGNAL = 'Generate the character\'s opening message to start the conversation.';

type Body = {
  chatId: string;
  userId?: string;
  content: string;
  characterId?: string | null;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    // console.log("🔵 Incoming body:", body); // Removed non-critical console.log

    const { chatId, content, characterId } = body ?? {};

    if (!chatId || !content) {
      return NextResponse.json({ error: 'Missing chatId or content' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const base = process.env.NEXT_PUBLIC_GROQ_BASE;
    if (!apiKey || !base) {
      console.error('Missing GROQ config');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Check if this request is specifically for generating the character's first message
    const isInitialPrompt = content === INITIAL_PROMPT_SIGNAL;

    // 1) Build system prompt from character definition
    // Replaced 'any' with the defined CharacterData interface
    const charDef = characterId
      ? (characters as CharacterData[]).find((c: CharacterData) => c.id === characterId)
      : null;

let finalSystemPrompt = 'You are a helpful AI assistant. Keep replies concise and friendly.';

if (charDef?.promptKey) {
  const resolvedPrompt = process.env[charDef.promptKey];

  if (resolvedPrompt) {
    finalSystemPrompt = resolvedPrompt;
  } else {
    console.warn(`⚠️ Missing env prompt for key: ${charDef.promptKey}`);
  }
}
    const brevityInstruction = " **STRICT RULE: You are a conversational language partner, NOT a writing assistant. Your replies MUST be maximum two short sentences long and MUST end with a question relevant to the user's previous statement to drive the dialogue. Do NOT provide lengthy explanations, lists, or detailed cultural notes.**";

    finalSystemPrompt += brevityInstruction;


    // If it's the initial message request, instruct the AI to start the dialogue
    if (isInitialPrompt) {
      finalSystemPrompt += " You must now initiate the conversation with your first message. Be engaging and relevant to your role. Do not include any meta-commentary, just write the opening line. ";
    }

    // console.log("🟣 Character selected:", characterId); // Removed non-critical console.log
    // console.log("🟣 System prompt resolved:", finalSystemPrompt); // Removed non-critical console.log

    // 2) Fetch recent conversation for context (last 50 messages, use the last 20 for context)
    const { data: recentMsgs, error: fetchErr } = await supabaseAdmin
      .from('messages')
      .select('sender,content,created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (fetchErr) {
      console.warn('Failed to fetch recent messages for context', fetchErr); // Kept warning for troubleshooting
    }

    // Compose messages array in OpenAI chat format
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: finalSystemPrompt } // Use the potentially modified system prompt
    ];

    if (Array.isArray(recentMsgs) && recentMsgs.length) {
      // Include last ~20 messages as user/assistant turns for context
      const last = recentMsgs.slice(-20);
      for (const m of last) {
        const role = m.sender === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: m.content });
      }
    }

    // ❗ IMPORTANT: Only add the new user message if it's NOT the initial prompt signal.
    // We prevent the "Generate the character's opening message..." text from being sent to the LLM as user input.
    if (!isInitialPrompt) {
      messages.push({ role: 'user', content });
    }

    // 3) Call Groq using OpenAI-compatible chat completions endpoint
    const resp = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-safeguard-20b",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
        // you can add other params like top_p, stop, etc.
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Groq error', txt); // Kept error for critical API failure
      return NextResponse.json({ error: 'LLM provider error', details: txt }, { status: 502 });
    }

    const json: unknown = await resp.json(); // Use unknown for initial fetch result
    2
    // Define the type for the expected JSON structure
    interface GroqResponse {
      choices: {
        message: {
          content: string;
        };
        text?: string;
      }[];
    }

    const groqJson = json as GroqResponse; // Cast to the expected structure
    // Typical OpenAI-compatible response shape: choices[0].message.content
    
    console.log("🔍 Groq raw response:", groqJson); 

    const aiText =
      groqJson?.choices?.[0]?.message?.content ??
      groqJson?.choices?.[0]?.text ??
      (typeof json === 'string' ? json : null);
      // console.log("🔺 AI RESPONSE:", aiText);

    if (!aiText) {
      console.warn('Empty AI response', json); // Kept warning for debugging empty response
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // 4) Persist AI response using service role
    const { error: insertError } = await supabaseAdmin
      .from('messages')
      // The sender is always 'ai' here, regardless of whether it's an initial message or a reply.
      .insert([{ chat_id: chatId, sender: 'ai', content: aiText }]);

    if (insertError) {
      console.error('Failed saving AI message', insertError); // Kept error for critical DB failure
      // return success but warn (client still gets AI text)
      return NextResponse.json({ ai: aiText, warning: 'AI message save failed' }, { status: 200 });
    }

    return NextResponse.json({ ai: aiText }, { status: 200 });
  } catch (err) {
    console.error('api/chat/ai error', err); // Kept error for general server errors
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}