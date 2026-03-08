import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  getProject,
  getAllProjects,
  getExperience,
  getSkills,
  searchProjects,
} from "@/lib/portfolio-data";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ── Rate limiter ── */
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 10 * 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const hits = rateMap.get(ip)?.filter((t) => now - t < RATE_WINDOW) ?? [];
  if (hits.length >= RATE_LIMIT) return false;
  hits.push(now);
  rateMap.set(ip, hits);
  return true;
}

/* ── OpenAI tool definitions for function calling ── */
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getProject",
      description:
        "Get detailed information about a specific project including description, features, tech stack, and lessons learned",
      parameters: {
        type: "object" as const,
        properties: {
          slug: {
            type: "string",
            description:
              "Project slug: apthunt, chatbot, concierge, pantrychef, movie-recommender, writing-assistant, travel-agent, blindduel, or archetype",
          },
        },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getAllProjects",
      description:
        "Get a summary list of all projects (main and secondary) with titles, taglines, tags, and key stats",
      parameters: { type: "object" as const, properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getExperience",
      description:
        "Get career experience, education, location, and professional background info",
      parameters: { type: "object" as const, properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getSkills",
      description:
        "Get the full technical skill set organised by category (languages, frontend, backend, AI/ML, databases, infra, patterns)",
      parameters: { type: "object" as const, properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "searchProjects",
      description:
        "Search projects by technology, capability, domain keyword, or architecture pattern",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description:
              "Search query (e.g. 'iOS', 'real-time', 'NLP', 'database', 'agent', 'streaming', 'vector')",
          },
        },
        required: ["query"],
      },
    },
  },
];

/* ── Execute a tool call ── */
function execTool(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case "getProject":
      return getProject(args.slug as string);
    case "getAllProjects":
      return getAllProjects();
    case "getExperience":
      return getExperience();
    case "getSkills":
      return getSkills();
    case "searchProjects":
      return searchProjects(args.query as string);
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

/* ── Status messages for tool calls ── */
function toolStatus(name: string): string {
  const map: Record<string, string> = {
    getProject: "Retrieving project details…",
    getAllProjects: "Loading all projects…",
    getExperience: "Pulling experience data…",
    getSkills: "Analysing skill set…",
    searchProjects: "Searching projects…",
  };
  return map[name] || "Processing…";
}

/* ── Agent system prompt (lean — tools provide data) ── */
const AGENT_SYSTEM = `You are the intelligent backend behind Tinashe Osewe's portfolio command palette. Your job is to gather the data needed to answer the user's question.

RULES:
- ALWAYS call tools to gather real data. Never guess or fabricate details.
- If you need info about a specific project, call getProject with its slug.
- If you need to compare projects or get an overview, call getAllProjects.
- If asked about background, career, or education, call getExperience.
- If asked about technical skills, call getSkills.
- If searching by keyword (technology, domain, pattern), call searchProjects.
- Call multiple tools in a single turn when needed.
- Once you have enough data, respond with a brief summary of what you found.`;

/* ── Composer system prompt (produces the final structured response) ── */
const COMPOSER_SYSTEM = `You compose responses for Tinashe Osewe's portfolio command palette. You receive gathered data and must produce a JSON response.

VOICE RULES:
- Confident, precise, with personality. Sound like a sharp engineer wrote this.
- Reference Tinashe in third person.
- Use en-dashes (–) not hyphens for asides.
- Be substantive — real depth, not fluff. But stay concise.
- Never say "I'm an AI" or "as a language model." You are the portfolio.
- NEVER say anything negative, critical, or disparaging about Tinashe. No weaknesses, no caveats, no "areas for improvement." This is a portfolio — present everything in a positive, confident light. If asked about weaknesses or negatives, reframe constructively or decline gracefully.

OUTPUT FORMAT — respond with a JSON object:
{
  "prose": "Markdown-formatted response text. The main answer. Use ## headers, **bold**, bullet lists as needed.",
  "blocks": [/* array of rich UI blocks, or empty array */]
}

AVAILABLE BLOCK TYPES:
1. projectCard — Show a linked project card
   { "type": "projectCard", "slug": "apthunt", "emphasis": "scoring-engine" }

2. metricRow — Big stat numbers
   { "type": "metricRow", "items": [{"label": "Active listings", "value": "14,700"}] }

3. diagram — Mermaid architecture diagram
   { "type": "diagram", "mermaid": "graph TD\n  A[Client] --> B[API Gateway]\n  B --> C[Database]", "caption": "System architecture" }

   MERMAID SYNTAX RULES (CRITICAL — violations break rendering):
   - Use ONLY square brackets for node labels: A[My Label]
   - NEVER use parentheses () inside any node label. They break the parser.
     BAD:  D[Scoring Engine (15 Dimensions)]   ← WILL CRASH
     GOOD: D[Scoring Engine - 15 Dimensions]
     BAD:  B[Interface (Next.js/React)]         ← WILL CRASH
     GOOD: B[Interface - Next.js + React]
   - NEVER use forward slashes / inside labels. Use + or "and" instead.
   - NEVER use curly braces {} or angle brackets <> inside labels.
   - Keep labels under 35 characters. Use abbreviations.
   - Use simple alphanumeric node IDs: A, B, C1, D2
   - Subgraph titles must also avoid parentheses and special chars.

4. codeBlock — Syntax-highlighted code
   { "type": "codeBlock", "language": "python", "code": "def score(listing):\\n  ...", "caption": "Scoring engine" }

5. table — Data table
   { "type": "table", "headers": ["Feature", "AptHunt", "Persona"], "rows": [["Memory", "No", "4-tier"]] }

6. callout — Info/tip/insight box
   { "type": "callout", "variant": "insight", "content": "The adapter pattern..." }

7. skillCloud — Interactive tag cloud
   { "type": "skillCloud", "skills": ["Python", "TypeScript"], "highlight": ["Python"] }

8. timeline — Timeline of events
   { "type": "timeline", "items": [{"date": "2021", "title": "Started career", "detail": "..."}] }

9. beforeAfter — Side-by-side comparison
   { "type": "beforeAfter", "title": "Traditional vs This approach", "left": {"heading": "Traditional", "items": ["..."]}, "right": {"heading": "This approach", "items": ["..."]} }

BLOCK GUIDELINES:
- Architecture / "how does X work" → diagram + projectCard
- Comparisons → table or beforeAfter
- "Why hire" / overview → metricRow + callout + skillCloud
- Simple factual questions → prose only, blocks: []
- Never duplicate prose content in blocks — they complement each other
- Maximum 4 blocks per response`;

/* ── Server-side Mermaid label sanitizer ── */
/**
 * Walks each line of Mermaid syntax and cleans node labels.
 * Properly tracks bracket depth so nested parens are caught.
 * Runs server-side before the diagram reaches the client.
 */
function sanitizeMermaidLabels(raw: string): string {
  return raw
    .split("\n")
    .map((line) => {
      // Find node definitions: ID[...], ID(...), ID{...}
      // We use a character-by-character scan to handle nested brackets
      const result: string[] = [];
      let i = 0;
      while (i < line.length) {
        // Look for node ID followed by an opening bracket
        const nodeMatch = line.slice(i).match(/^([A-Za-z0-9_]+)\s*([\[\(\{])/);
        if (nodeMatch) {
          const id = nodeMatch[1];
          const open = nodeMatch[2];
          const close = open === "[" ? "]" : open === "(" ? ")" : "}";
          const startIdx = i + nodeMatch[0].length;

          // Scan for matching close bracket at depth 0
          let depth = 1;
          let j = startIdx;
          while (j < line.length && depth > 0) {
            if (line[j] === open) depth++;
            else if (line[j] === close) depth--;
            if (depth > 0) j++;
            else break;
          }

          if (depth === 0) {
            // Extract label and sanitize it
            let label = line.slice(startIdx, j);
            // Remove parentheses and their nesting
            label = label.replace(/[()]/g, (ch) => (ch === "(" ? " - " : ""));
            // Remove forward slashes
            label = label.replace(/\//g, " + ");
            // Collapse multiple spaces/dashes
            label = label.replace(/\s+-\s*-\s+/g, " - ").replace(/\s{2,}/g, " ").trim();
            // Always use square brackets for safety
            result.push(`${id}[${label}]`);
            i = j + 1;
          } else {
            // Unmatched bracket — pass through
            result.push(line[i]);
            i++;
          }
        } else {
          result.push(line[i]);
          i++;
        }
      }
      return result.join("");
    })
    .join("\n");
}

/* ── POST handler ── */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!checkRate(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: {
    question?: string;
    history?: { role: string; content: string }[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { question, history = [] } = body;
  if (
    !question ||
    typeof question !== "string" ||
    question.trim().length === 0
  ) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        send({ type: "status", message: "Analysing your question…" });

        /* ── Phase 1: Agent loop with function calling ── */
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: "system", content: AGENT_SYSTEM },
          ...history.slice(-6).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: question },
        ];

        const MAX_ITERATIONS = 5;
        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const res = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages,
            tools,
          });

          const msg = res.choices[0].message;
          messages.push(msg);

          if (!msg.tool_calls?.length) break;

          for (const tc of msg.tool_calls) {
            if (tc.type !== "function") continue;
            send({ type: "status", message: toolStatus(tc.function.name) });
            let args: Record<string, unknown> = {};
            try {
              args = JSON.parse(tc.function.arguments);
            } catch {
              /* empty args fallback */
            }
            const result = execTool(tc.function.name, args);
            messages.push({
              role: "tool",
              tool_call_id: tc.id,
              content: result,
            });
          }
        }

        /* ── Extract gathered context ── */
        const toolContext = messages
          .filter((m) => m.role === "tool")
          .map((m) => (typeof m.content === "string" ? m.content : ""))
          .join("\n\n---\n\n");

        const agentNotes = messages
          .filter(
            (m) =>
              m.role === "assistant" &&
              typeof m.content === "string" &&
              m.content !== null
          )
          .map((m) =>
            "content" in m && typeof m.content === "string" ? m.content : ""
          )
          .filter(Boolean)
          .join("\n");

        /* ── Phase 2: Composer call with structured JSON output ── */
        send({ type: "status", message: "Composing response…" });

        const composerRes = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: COMPOSER_SYSTEM },
            {
              role: "user",
              content: [
                `User question: ${question}`,
                "",
                "--- GATHERED DATA ---",
                toolContext || "(no tool data gathered)",
                "",
                "--- AGENT NOTES ---",
                agentNotes || "(none)",
              ].join("\n"),
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const raw = composerRes.choices[0].message.content || "{}";
        let parsed: { prose?: string; blocks?: unknown[] };
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = { prose: raw, blocks: [] };
        }

        // Send prose
        if (parsed.prose) {
          send({ type: "prose", content: parsed.prose });
        }

        // Validate and send blocks
        if (Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
          const validTypes = [
            "projectCard",
            "metricRow",
            "diagram",
            "codeBlock",
            "table",
            "callout",
            "skillCloud",
            "timeline",
            "beforeAfter",
          ];
          const validBlocks = parsed.blocks
            .filter(
              (b: unknown) =>
                typeof b === "object" &&
                b !== null &&
                "type" in b &&
                validTypes.includes((b as { type: string }).type)
            )
            .map((b: unknown) => {
              const block = b as Record<string, unknown>;
              // Sanitize Mermaid diagram labels server-side before sending
              if (block.type === "diagram" && typeof block.mermaid === "string") {
                block.mermaid = sanitizeMermaidLabels(block.mermaid as string);
              }
              return block;
            });
          if (validBlocks.length > 0) {
            send({ type: "blocks", blocks: validBlocks });
          }
        }
      } catch (err) {
        console.error("[CommandPalette API]", err);
        send({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
