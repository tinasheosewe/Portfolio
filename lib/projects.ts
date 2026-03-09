export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  liveUrl?: string;
  status: "live" | "ios" | "coming-soon";
  statusLabel: string;
  tags: string[];
  stats: { label: string; value: string }[];
  heroGradient: string;
  overview: string;
  problem: string;
  features: { title: string; body: string }[];
  techStack: { category: string; items: string[] }[];
  lessons: string;
}

export interface SecondaryProject {
  title: string;
  description: string;
  tags: string[];
  accent: string;
}

export const projects: Project[] = [
  {
    slug: "apthunt",
    title: "AptHunt",
    tagline: "NYC apartment intelligence. Only the listings worth seeing.",
    description:
      "An apartment intelligence platform that scores NYC rental listings across fifteen quality dimensions — from transit access to flood risk — and surfaces only the results worth seeing.",
    liveUrl: "https://apthunt-web.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["FastAPI", "Next.js 16", "React 19", "Python", "SQLite", "Geospatial", "NYC Open Data"],
    stats: [
      { label: "Quality dimensions per listing", value: "15" },
      { label: "Full sync time", value: "~4 min" },
      { label: "Block-level precision", value: "153 m" },
    ],
    heroGradient: "from-amber-500/20 via-transparent to-transparent",
    overview:
      "New York's rental market rewards time spent scrolling, not good judgment. AptHunt changes that — it pulls in rental data from public sources, scores every listing across fifteen quality dimensions, and shows you only the ones worth seeing. The result is a dramatically smaller, higher-quality set of options so renters can make confident decisions in hours, not weeks.",
    problem:
      "Finding a good apartment in New York shouldn't require weeks of searching. Listings go stale fast, prices tell you nothing without context, and every platform is designed to keep you scrolling. AptHunt gives renters an objective way to evaluate any listing — and filters out everything that doesn't meet the bar.",
    features: [
      {
        title: "Automated data pipeline",
        body: "Listing data stays current without manual intervention. The pipeline syncs from public NYC data sources on a schedule, retries on failure with exponential backoff, and skips listings it's already processed — keeping results fresh and accurate at all times.",
      },
      {
        title: "Multi-dimensional quality scoring",
        body: "Every listing gets a quality score across fifteen real-world factors: price relative to neighbourhood comparables, subway proximity, crime rates, noise levels, building violations, park access, school quality, and more. The scoring engine is pluggable — adding a new dimension is a single function.",
      },
      {
        title: "Personalised ranking",
        body: "Different renters care about different things. Users weight five quality categories by importance and results re-rank in real time. The scoring pipeline runs once — personalisation is applied per user on the fly, so the system stays fast regardless of scale.",
      },
      {
        title: "Intelligent comparables",
        body: "Surfaces similar listings for easy comparison, plus an 'Also Consider' engine that finds options matching on four quality dimensions but outperforming on a fifth — helping users discover great apartments they'd otherwise never find.",
      },
      {
        title: "Neighbourhood quality index",
        body: "Maps neighbourhood quality at block level across the entire city. Crime density, noise complaints, building violations, park proximity, flood risk, and development trends are aggregated per ~153 m cell — giving users a street-level picture of any location before they visit.",
      },
      {
        title: "Unified data model",
        body: "Every data field in the system serves a scoring function — cosmetic data is excluded by design. Listings from any source normalise into one canonical schema, so the intelligence layer is completely source-agnostic and new sources plug in without changes.",
      },
    ],
    techStack: [
      { category: "Backend", items: ["FastAPI", "Uvicorn", "SQLite (WAL mode)", "Pydantic"] },
      { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "React-Leaflet", "Recharts", "Framer Motion"] },
      { category: "Data", items: ["NYC Open Data (Socrata SODA)", "MTA GTFS", "NYPD Complaints", "DOB/PLUTO", "NYC Parks"] },
      { category: "Geospatial", items: ["pygeohash (precision-7)", "Haversine distance", "Socrata radius queries"] },
      { category: "Infrastructure", items: ["Docker", "Render"] },
    ],
    lessons:
      "The unlock was making fifteen different quality signals directly comparable — crime rates in incidents per year, transit in walking minutes, noise in complaint density. Building a normalisation layer that converts every source into a common scale turned a pile of disparate datasets into a composable scoring engine. Good data architecture beats more data every time.",
  },
  {
    slug: "persona",
    title: "Persona",
    tagline: "Give it someone's documents. It becomes them.",
    description:
      "A conversational AI platform that builds a digital persona from someone's documents. Feed it notes, writing, records — anything about a person — and the AI adopts their knowledge, patterns, and voice. It doesn't just retrieve facts; it embodies the person.",
    liveUrl: "https://chatbot-ui-rn18.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["FastAPI", "LangChain", "ChromaDB", "Next.js", "PostgreSQL", "Neo4j", "RAG", "BM25"],
    stats: [
      { label: "AI providers supported", value: "4+" },
      { label: "Memory tiers", value: "4" },
      { label: "Retrieval passes", value: "2" },
      { label: "Storage backends", value: "Postgres + Neo4j" },
    ],
    heroGradient: "from-violet-500/20 via-transparent to-transparent",
    overview:
      "Persona turns a collection of documents about someone into a living, conversational version of that person. Upload their writing, notes, records, communications — anything that captures who they are — and the system extracts people, events, relationships, and patterns into a structured knowledge graph. The AI doesn't just answer questions about the person; it responds as them — their knowledge becomes its memory, their patterns shape its behaviour, their voice comes through in how it speaks.",
    problem:
      "Building a realistic AI persona requires more than a prompt and a PDF. Off-the-shelf chatbots retrieve facts but don't embody a person — they sound generic regardless of input. Persona bridges that gap: structured knowledge extraction gives the AI genuine understanding of who someone is, and four layers of memory ensure it stays in character across entire conversations.",
    features: [
      {
        title: "Provider-independent AI layer",
        body: "Works with OpenAI, Anthropic, Google Gemini, and Ollama through a common interface. Switching providers is a one-line change. The retrieval and generation layers can use different models independently — so you can optimise for cost and quality separately.",
      },
      {
        title: "Hybrid memory retrieval",
        body: "Recalls past conversations using two complementary methods — semantic similarity for meaning-based recall and keyword matching for exact details — then blends the results. The hybrid approach consistently outperforms either method alone.",
      },
      {
        title: "Four-tier contextual memory",
        body: "Four recall layers, from fastest to deepest: recent conversation buffer, keyword search over past exchanges, semantic similarity across full session history, and graph-based retrieval from ingested documents. Together they give the AI far stronger memory than the typical sliding-window approach.",
      },
      {
        title: "Structured knowledge ingestion",
        body: "Upload documents about a person — writing, records, notes, anything — and the system extracts people, events, concepts, and relationships into a knowledge graph. These become the persona's memories: they shape how it responds, what it references, and how it speaks. Processing is concurrent and idempotent, so adding more material over time is seamless.",
      },
      {
        title: "Self-correcting retrieval",
        body: "Before generating an answer, a separate reasoning layer evaluates whether the retrieved context is actually sufficient. If it’s not, the system retrieves again with a refined query — reducing the chance of a confident but wrong response.",
      },
      {
        title: "Real-time streaming interface",
        body: "Responses stream token-by-token via server-sent events for a responsive, natural feel. Includes a full document management dashboard — upload, delete with automatic index rebuild, and browse with metadata.",
      },
    ],
    techStack: [
      { category: "Backend", items: ["FastAPI", "Uvicorn", "LangChain", "ChromaDB", "HuggingFace sentence-transformers", "BM25"] },
      { category: "Knowledge Graph", items: ["PostgreSQL", "SQLAlchemy", "Neo4j / Memgraph", "psycopg2", "GPT-4o-mini (JSON mode)"] },
      { category: "Frontend", items: ["Next.js 16", "React 19", "Tailwind CSS 4", "SSE streaming", "pnpm"] },
      { category: "AI Adapters", items: ["OpenAI", "Anthropic", "Ollama", "Google Gemini"] },
      { category: "Infrastructure", items: ["Docker", "Render", "Multi-stage build"] },
    ],
    lessons:
      "Retrieving less context often produces better answers. Early versions stuffed every relevant memory into the prompt and the model started hedging. The real failure mode turned out to be false retrieval — surfacing context that looks relevant but steers the answer wrong. Separating retrieval evaluation from generation evaluation was the only way to diagnose where quality was actually breaking down.",
  },
  {
    slug: "concierge",
    title: "Concierge",
    tagline: "Tell it what you want. It finds the table.",
    description:
      "An AI dining assistant that turns a natural-language request — 'dinner for two in the West Village, not too late' — into a reservation plan. Describe what you want and the agent handles the rest.",
    liveUrl: "https://resy-polling-api.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["LangChain", "LangGraph", "FastAPI", "GPT-4.1-mini", "ReAct Agent", "PostgreSQL", "SQLAlchemy"],
    stats: [
      { label: "Agent tool functions", value: "6+" },
      { label: "Scheduling constraint types", value: "5+" },
      { label: "AI model", value: "GPT-4.1-mini" },
      { label: "Architecture", value: "ReAct Agent" },
    ],
    heroGradient: "from-amber-500/20 via-transparent to-transparent",
    overview:
      "Concierge removes the effort from finding a table. Instead of searching, filtering, and refreshing, you describe what you want in plain English — 'dinner for two, Friday or Saturday, somewhere in the West Village' — and an AI agent interprets your constraints, evaluates options, and works to secure a reservation.",
    problem:
      "Getting a table at a popular restaurant is tedious. Availability changes constantly, personal preferences are hard to express in filters, and the process rewards manual effort over clear intent. Concierge replaces all of that with an agent that understands what you actually want and acts on it.",
    features: [
      {
        title: "Conversational AI agent",
        body: "Understands follow-ups, remembers what you’ve said, and asks clarifying questions when a request is ambiguous — the same way a human concierge would. Powered by GPT-4.1-mini with full conversation history across exchanges.",
      },
      {
        title: "Natural language scheduling",
        body: "Handles complex scheduling in plain English. 'Any Friday or Saturday except next weekend, between 7 and 9' gets parsed into structured constraints — weekday preferences, date ranges, time windows, and exceptions — without requiring forms or filters.",
      },
      {
        title: "Autonomous tool use",
        body: "The agent decides which actions to take during a conversation — searching for venues, checking availability, resolving scheduling conflicts, refining results — using six specialised tool functions it selects on its own based on what the conversation needs.",
      },
      {
        title: "Conversation reliability",
        body: "Stays stable over long, multi-turn conversations. A message sanitiser runs before every inference call, repairing broken exchange sequences and stripping orphan messages that would otherwise cause the AI to fail or drift.",
      },
      {
        title: "Production-grade backend",
        body: "FastAPI with SQLAlchemy for persistent state. Encrypted storage for sensitive data. Jobs survive service restarts via database-backed management. One-click deploy with Docker and Render.",
      },
    ],
    techStack: [
      { category: "AI Agent", items: ["LangChain", "LangGraph", "GPT-4.1-mini", "ReAct architecture", "StructuredTool"] },
      { category: "Backend", items: ["FastAPI", "Uvicorn", "SQLAlchemy", "SQLite / PostgreSQL", "python-dateutil"] },
      { category: "Security", items: ["Fernet symmetric encryption", "cryptography lib"] },
      { category: "Infrastructure", items: ["Docker", "Render", "render.yaml one-click deploy"] },
    ],
    lessons:
      "The agent could handle complex multi-step scheduling from week one, but staying reliable over long conversations took another month of engineering. Reliability work — sanitising orphan messages, repairing broken context, recovering from drift — had more impact than any new feature. The other hard lesson was intent parsing: “not too late” means different things to different people, so the constraint system had to be flexible enough to ask rather than assume.",
  },
  {
    slug: "pantrychef",
    title: "PantryChef",
    tagline: "Scan your pantry. AI tells you what to cook.",
    description:
      "A native iOS kitchen companion. Scan what’s in your pantry — via receipts, barcodes, or camera — and get AI-powered recipe suggestions, substitutions, and meal plans based on what you actually have.",
    status: "ios",
    statusLabel: "iOS App — TestFlight Coming Soon",
    tags: ["Swift", "SwiftUI", "GPT-4o", "Vision OCR", "SFSpeechRecognizer", "iOS 17", "Supabase"],
    stats: [
      { label: "Platform", value: "iOS 17+" },
      { label: "AI model", value: "GPT-4o" },
      { label: "Input methods", value: "4" },
      { label: "Architecture", value: "MVVM" },
    ],
    heroGradient: "from-emerald-500/20 via-transparent to-transparent",
    overview:
      "PantryChef starts from what’s already in your kitchen. Snap a photo of your fridge, scan a receipt, or scan a barcode — the app builds your pantry inventory, then uses AI to suggest recipes you can actually make right now. It tracks expiry dates, generates shopping lists, and lets you cook hands-free with voice-guided step-by-step instructions.",
    problem:
      "Recipe apps tell you what to buy. PantryChef tells you what to cook. It starts from your actual ingredients, ranks recipes by how closely they match what you have, flags items approaching expiry, and helps you use what’s already there — reducing waste and unnecessary grocery trips.",
    features: [
      {
        title: "Intelligent ingredient capture",
        body: "Four ways to build your pantry: type it in, scan a barcode, photograph a receipt, or snap a cookbook page. Expiry tracking with visual urgency indicators ensures nothing goes to waste. Every recipe card shows what percentage of ingredients you already have.",
      },
      {
        title: "AI-powered recipe intelligence",
        body: "Ask natural questions — 'What can I make tonight?', 'Use up what’s expiring', 'What can I do with leftover chicken?' — and get recipe suggestions matched to your pantry. Includes substitution suggestions with confidence ratings and recipe import from any URL.",
      },
      {
        title: "Hands-free Cook Mode",
        body: "Full-screen, step-by-step cooking with per-step timers, voice readout, and voice commands — 'next', 'repeat', 'start timer'. The dark interface is designed for kitchen conditions: readable at arm’s length with wet hands.",
      },
      {
        title: "Meal planning and waste reduction",
        body: "Plan your week with a breakfast, lunch, and dinner calendar. Shopping lists auto-generate from the plan, accounting for what’s already in your pantry — so you buy only what you need.",
      },
      {
        title: "Production-grade architecture",
        body: "MVVM with centralised state management. The storage layer is protocol-based — swapping from in-memory to Supabase requires changing a single file. Database migrations already written, automated builds via XcodeGen, and ready for TestFlight distribution.",
      },
    ],
    techStack: [
      { category: "Platform", items: ["iOS 17.0+", "Swift 5.9", "SwiftUI", "MVVM"] },
      { category: "AI / ML", items: ["OpenAI GPT-4o", "Apple Vision (OCR)", "SFSpeechRecognizer", "AVSpeechSynthesizer"] },
      { category: "Data", items: ["Open Food Facts API (barcode)", "Supabase (ready)", "In-memory storage"] },
      { category: "Build", items: ["XcodeGen", "project.yml", "TestFlight"] },
    ],
    lessons:
      "Each input method — manual entry, barcode scan, camera OCR, voice — maps to a distinct moment in the user’s day. Barcode when unpacking groceries, camera for a handwritten recipe card, voice when your hands are covered in flour. Designing around when each modality naturally occurs shaped the entire interaction model and made the multi-modal stack feel purposeful rather than gimmicky.",
  },
];

export const secondaryProjects: SecondaryProject[] = [
  {
    title: "Movie Recommender",
    description: "Recommender system encoding films as high-dimensional vectors with nested embeddings for director and actor filmographies. Applies nearest-neighbour similarity search across text, numeric, and categorical features.",
    tags: ["Python", "Embeddings", "Nearest-Neighbour Search", "Vector Similarity"],
    accent: "#f59e0b",
  },
  {
    title: "AI Writing Assistant",
    description: "Cloud-based text editor leveraging RAG, embeddings, semantic search, and caching for context-aware editing and feedback. Overlapping chunking with TTL-based eviction and a debounced UI to minimise redundant API calls.",
    tags: ["RAG", "Semantic Search", "Embeddings", "Knowledge Graphs", "Caching"],
    accent: "#818cf8",
  },
  {
    title: "TravelAgent",
    description: "Flight comparison engine that resolves airports, dispatches searches across multiple booking platforms, and scores offers by value, duration, and layover quality.",
    tags: ["Python", "FastAPI", "Pydantic", "Amadeus API", "Kiwi API"],
    accent: "#38bdf8",
  },
  {
    title: "BlindDuel",
    description: "An iOS spatial audio game where players navigate and compete using only sound, head-gesture input, and haptic feedback. All audio assets procedurally generated.",
    tags: ["Swift", "iOS 15+", "Spatial Audio", "Core Haptics", "XcodeGen"],
    accent: "#f472b6",
  },
  {
    title: "Wavelength",
    description: "Connects to Spotify, analyses your listening patterns across audio features, and maps them to a personality archetype with colour, aesthetic, and soundtrack.",
    tags: ["Python", "FastAPI", "Spotify API", "NumPy", "OAuth 2.0"],
    accent: "#a3e635",
  },
];
