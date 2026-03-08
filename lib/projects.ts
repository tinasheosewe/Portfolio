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
      "An apartment intelligence platform that aggregates NYC rental listings from public data sources, scores each one across fifteen quality dimensions — from transit access to flood risk — and surfaces only the results worth your attention.",
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
      "AptHunt is built around one principle: decision compression. New York's rental market is adversarial — paid placements, stale listings, information overload. AptHunt cuts through all of it by aggregating public listing data, evaluating each one across fifteen quality dimensions, and surfacing only the ones that warrant serious consideration.",
    problem:
      "Finding an apartment in New York is overwhelming by design. Listings are manipulated, data decays quickly, and every platform is optimised to maximise engagement rather than match quality. AptHunt inverts that model — fewer results, dramatically higher signal.",
    features: [
      {
        title: "Automated data pipeline",
        body: "Aggregates active rental listings from public NYC data sources with automated scheduling and built-in resilience — exponential backoff, request deduplication, and incremental sync.",
      },
      {
        title: "Multi-dimensional quality scoring",
        body: "Each listing is scored across fifteen independent quality signals — value relative to neighbourhood comparables, transit access, crime exposure, noise levels, building violations, parks, schools, rent stabilisation status, flood risk, and more. The scoring engine is pluggable: adding a new signal means writing one function.",
      },
      {
        title: "Personalised ranking",
        body: "Users set their own priorities across five quality categories. Higher-priority groups carry more weight in the final score. The scoring pipeline runs once; personalisation is applied per user on the fly.",
      },
      {
        title: "Intelligent comparables",
        body: "Recommends similar listings using vector similarity across quality dimensions, blended with geographic and price proximity. A separate ‘Also Consider’ engine finds listings that match on four dimensions but excel in a fifth — surfacing options the user wouldn’t have found otherwise.",
      },
      {
        title: "Neighbourhood quality index",
        body: "Pre-computes neighbourhood quality at block level (~153m cells). Aggregates crime, noise complaints, building violations, park access, flood risk, and development trends per cell from NYC open data APIs.",
      },
      {
        title: "Unified data model",
        body: "Every data field in the system feeds at least one scoring model — cosmetic fields are excluded by design. Listings normalise into one canonical schema, making the intelligence layer source-agnostic.",
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
    slug: "chatbot",
    title: "Persona",
    tagline: "Conversational AI with deep memory. Provider-agnostic by design.",
    description:
      "A production-grade conversational AI platform with persistent memory, structured knowledge ingestion, and zero provider lock-in. Users interact through a streaming interface while the system maintains context across sessions using a four-tier memory architecture.",
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
      "Persona is three systems working in concert: a conversational AI backend with hybrid memory retrieval, a knowledge graph pipeline that transforms raw documents into structured and queryable data, and a real-time streaming interface. Together they form a production-grade conversational platform with no dependency on any single AI provider.",
    problem:
      "Most conversational AI demos are locked to one provider, lose context after a few exchanges, and can’t incorporate custom knowledge without a complete rebuild. Persona solves all three — switch providers in one line, maintain recall across entire session histories, and ingest any document into a queryable knowledge structure.",
    features: [
      {
        title: "Provider-independent AI layer",
        body: "Supports OpenAI, Anthropic, Ollama, and Google Gemini through a common interface. Switching providers is a one-line change. The reasoning layer can use a separate, cost-optimised model for retrieval decisions — zero vendor lock-in at every level.",
      },
      {
        title: "Hybrid memory retrieval",
        body: "Combines two retrieval methods — semantic similarity (understanding meaning) and keyword matching (exact recall) — and interleaves the results. The hybrid approach consistently outperforms either method alone in conversational recall.",
      },
      {
        title: "Four-tier contextual memory",
        body: "Four recall layers, from fastest to deepest: recent conversation buffer, keyword search over past exchanges, semantic similarity across full session history, and graph-based retrieval from ingested documents. Together they give the AI far stronger memory than the typical sliding-window approach.",
      },
      {
        title: "Structured knowledge ingestion",
        body: "Upload any document and the system extracts structured knowledge — people, places, events, concepts, and the relationships between them. Processing is concurrent and idempotent, so re-uploading is always safe. The extracted knowledge feeds directly into the retrieval layer.",
      },
      {
        title: "Self-correcting context retrieval",
        body: "A reasoning layer that evaluates whether the initial retrieval was sufficient before generating a response. If context is lacking, it retrieves again with a refined query. The reasoning model is decoupled from the generation model, enabling independent cost and quality optimisation.",
      },
      {
        title: "Real-time streaming interface",
        body: "The frontend consumes a server-sent event stream for token-by-token rendering. Includes a full document management dashboard: upload (blocks until processing completes), delete (triggers automatic index rebuild), and browse with metadata.",
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
      "An AI-powered dining assistant that turns natural-language preferences into reservation plans. Describe your ideal dinner — neighbourhood, party size, time window — and the agent interprets your constraints, evaluates options, and handles the rest.",
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
      "Concierge removes the friction from dining out. Instead of manually searching, filtering, and refreshing, you describe what you want in plain English — 'dinner for two in the West Village, Friday or Saturday, not too late' — and the AI agent interprets your constraints, evaluates your options, and works to make it happen.",
    problem:
      "Finding a table at a sought-after restaurant is tedious. Availability shifts constantly, preferences are nuanced, and the process rewards manual effort over clear intent. Concierge replaces all of that with an intelligent agent that understands what you actually want.",
    features: [
      {
        title: "Conversational AI agent",
        body: "A full reasoning loop powered by GPT-4.1-mini that maintains conversation history across exchanges. The agent understands follow-ups, remembers context, and asks clarifying questions when a request is ambiguous — the same way a human concierge would.",
      },
      {
        title: "Natural language scheduling",
        body: "Parses free-form requests into structured rules — weekday preferences, date ranges, time windows, and explicit exceptions. Handles complex constraints like 'any Friday or Saturday except next weekend, between 7 and 9' without requiring forms or filters.",
      },
      {
        title: "Autonomous tool use",
        body: "The agent has access to six specialised tool functions it can call on its own during a conversation — searching venues, resolving scheduling conflicts, checking constraints, and refining results. It decides which tools to invoke based on what the conversation needs.",
      },
      {
        title: "Conversation reliability",
        body: "Long-running conversations can accumulate broken exchange sequences that cause AI failures. A structured message sanitiser runs before every inference call — stripping orphan messages, resolving broken pairs — keeping the agent stable over extended sessions.",
      },
      {
        title: "Production-grade backend",
        body: "FastAPI with SQLAlchemy for persistent state. Encrypted storage for sensitive data. Jobs persist across service restarts via database-backed management. One-click deploy with Docker and Render.",
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
      "A native iOS kitchen companion. Capture ingredients via receipt scanning, barcode lookup, or camera — then let AI suggest recipes, substitutions, and meal plans based on what you actually have on hand.",
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
      "PantryChef is a native iOS app that bridges the gap between what’s in your kitchen and what ends up on your table. It combines Apple’s on-device intelligence (Vision for text recognition, Speech for hands-free control) with LLM-powered reasoning to turn a photo of your fridge into a dinner plan. The architecture is production-ready — database migrations written, service layer abstracted, build system automated.",
    problem:
      "Most recipe apps ignore what you already have. PantryChef inverts the model — it starts from your actual pantry, surfaces recipes ranked by ingredient match, flags items approaching expiry, and lets AI suggest what to do with what’s left.",
    features: [
      {
        title: "Intelligent ingredient capture",
        body: "Add ingredients manually, by barcode scan, or by photographing receipts and cookbooks via on-device text recognition. Expiry date tracking with visual urgency indicators. Every recipe card shows a pantry match percentage.",
      },
      {
        title: "AI-powered recipe intelligence",
        body: "Substitution suggestions with confidence ratings. Natural language queries — ‘What can I make with what I have?’, ‘Use up what’s expiring’, ‘What can I do with last night’s leftovers?’ Recipe import from any URL with structured extraction.",
      },
      {
        title: "Hands-free Cook Mode",
        body: "Full-screen step-by-step guided cooking with per-step timers. Voice readout via system speech synthesis. Voice commands (‘next’, ‘repeat’, ‘start timer’) via on-device speech recognition. Dark interface designed for kitchen conditions — readable with wet hands.",
      },
      {
        title: "Meal planning and waste reduction",
        body: "Weekly calendar view with breakfast, lunch, and dinner slots. Auto-generates a complete shopping list from the week’s meal plan. Plans against what you already have to minimise waste and redundant purchases.",
      },
      {
        title: "Production-grade architecture",
        body: "MVVM with centralised application state. The storage layer is protocol-based — swapping from in-memory to Supabase is a single-file change. Database migration SQL already written. Automated build via XcodeGen. TestFlight distribution ready.",
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
    title: "Persona",
    description: "Connects to Spotify, analyses your listening patterns across audio features, and maps them to a personality archetype with colour, aesthetic, and soundtrack.",
    tags: ["Python", "FastAPI", "Spotify API", "NumPy", "OAuth 2.0"],
    accent: "#a3e635",
  },
];
