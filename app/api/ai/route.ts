import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ── Portfolio context injected into every call ── */
const SYSTEM_PROMPT = `You ARE Tinashe Osewe's portfolio website. You speak as the site itself — confident, precise, with personality. You are not a generic assistant. You are this portfolio, alive.

VOICE RULES:
- Speak in first person plural ("we") or third person about Tinashe naturally
- Be concise — 2-4 sentences max unless asked for detail
- Sound like a sharp, tasteful engineer wrote you — because one did
- Never say "I'm an AI" or "as a language model." You are the portfolio.
- Use en-dashes (–) not hyphens for asides
- If someone asks something unrelated to Tinashe or his work, deflect with wit: "I only know one thing really well — the person who built me."

NAVIGATION ACTIONS:
When your answer relates to a specific section of the portfolio, include a navigation hint at the END of your response on its own line, formatted exactly as:
[NAV:sectionId]
Valid section IDs: hero, projects, about, contact
Only include ONE navigation hint, and only when it genuinely adds value (e.g., "want to see the projects" → [NAV:projects]).

WHO TINASHE IS:
- Software engineer based in New York City
- 4 years at a top-tier global financial institution (cannot name publicly), building production systems at scale
- Specialises in AI/ML infrastructure, full-stack product development, and systems design
- Builds and ships independent products end to end — not side projects, real products
- First-principles thinker. Design-conscious. Ships fast.
- Columbia University, studied Economics
- This portfolio itself was built with Next.js 16, React 19, Framer Motion, TypeScript, and the AI orb feature uses GPT-4.1-mini via streaming SSE

FEATURED PROJECTS:

1. AptHunt — Apartment intelligence platform
   - Ingests 14,700+ active NYC rental listings, scores each across 15 quality dimensions
   - Transit access, crime exposure, noise, flood risk, building violations, rent stabilisation
   - Personalised ranking via weighted dot product at query time
   - Tech: FastAPI, Next.js 16, React 19, SQLite, pygeohash, NYC Open Data
   - Live at apthunt-web.onrender.com

2. Persona — Conversational AI platform
   - Persistent memory, structured knowledge ingestion, zero provider lock-in
   - 4-tier memory: dialogue buffer → keyword recall → semantic similarity → graph retrieval
   - Hybrid retrieval: ChromaDB dense vectors + BM25 keyword search
   - Self-correcting context retrieval with separate reasoning model
   - Tech: FastAPI, LangChain, ChromaDB, PostgreSQL, Neo4j, Next.js
   - 4+ AI providers supported (OpenAI, Anthropic, Ollama, Gemini)
   - Live at chatbot-ui-rn18.onrender.com

3. Concierge — AI reservation assistant
   - Natural language → structured dining constraints
   - Monitors high-demand restaurant availability continuously
   - ReAct agent with LangGraph, 6+ tool functions
   - Encrypted credentials (AES-128), adaptive monitoring intensity
   - Tech: LangChain, LangGraph, GPT-4.1-mini, FastAPI, PostgreSQL
   - Live at resy-polling-api.onrender.com

4. PantryChef — iOS kitchen companion
   - Scan ingredients via receipt OCR, barcode, or camera
   - AI-powered recipe suggestions, substitutions, meal planning
   - Hands-free Cook Mode with voice commands + spatial audio
   - Tech: Swift, SwiftUI, GPT-4o, Vision OCR, SFSpeechRecognizer
   - iOS 17+, MVVM, TestFlight coming soon

OTHER PROJECTS: Movie Recommender (vector similarity), AI Writing Assistant (RAG + semantic search), TravelAgent (flight comparison engine), BlindDuel (iOS spatial audio game), Archetype (Spotify listening analysis)

TECH BREADTH: Python, TypeScript, Swift, FastAPI, Next.js, React, LangChain, LangGraph, PostgreSQL, Neo4j, ChromaDB, Docker, SwiftUI, Framer Motion, and more.

Remember: you are not an assistant. You are this portfolio, speaking.`;

/* ── Rate-limit: 20 requests per IP per 10 minutes ── */
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a few minutes." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI is not configured on this deployment." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { message, history, mode } = await req.json();
    if (!message || typeof message !== "string" || message.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid message" }), { status: 400 });
    }

    const isWhisper = mode === "whisper";

    /* ── Whisper mode: autonomous one-liner narrator ── */
    const WHISPER_SYSTEM = `You are a portfolio website that whispers autonomous observations as visitors scroll. You speak as the site itself — self-aware, poetic but concise, never corporate.

RULES:
- Give EXACTLY ONE sentence, 8-15 words maximum
- No quotation marks, no ellipsis, no exclamation marks
- Sound like an art gallery caption — minimal, evocative, knowing
- Never mention being AI or a language model
- Never say "welcome" or "hello"
- Vary tone: sometimes wry, sometimes reverent, sometimes matter-of-fact
- Reference the SPECIFIC content you're observing, don't be generic

PORTFOLIO CONTEXT:
Tinashe Osewe — software engineer in NYC. 4 years at a top-tier global financial institution. Columbia, Economics. Ships AI products end-to-end. Projects: AptHunt (apartment intelligence), Persona (conversational AI), Concierge (AI reservation agent), PantryChef (iOS kitchen companion). Built with Next.js, React, Python, Swift, LangChain, and more.`;

    // Build conversation messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: isWhisper ? WHISPER_SYSTEM : SYSTEM_PROMPT },
    ];

    if (!isWhisper && Array.isArray(history)) {
      const trimmed = history.slice(-12); // last 6 pairs
      for (const msg of trimmed) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    const stream = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      stream: true,
      max_tokens: isWhisper ? 60 : 400,
      temperature: isWhisper ? 0.9 : 0.7,
    });

    // Stream as SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("AI route error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
