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
        body: "Each listing is evaluated against fifteen independent quality signals in a pluggable scoring engine: value (z-score normalised against neighbourhood and bedroom comparables), transit access (MTA GTFS stops weighted by route density), crime exposure (NYPD complaint data with severity weighting), noise (311 complaints within 300m), building violations, parks proximity, schools, rent stabilisation status, flood risk, and more.",
      },
      {
        title: "Personalised ranking",
        body: "Users set their own priorities across five quality categories. Top-priority groups receive higher weight multipliers, and the final score is computed as a weighted dot product at query time — the scoring pipeline runs once, personalisation is applied per user on the fly.",
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
      "The hardest problem wasn’t data ingestion or scoring — it was deciding what not to include. Every data source carries noise. The discipline of requiring every schema field to feed a scoring model kept the system honest and the interface clean.",
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
        body: "Abstract interface with built-in adapters for OpenAI, Anthropic, Ollama, and Google Gemini. A factory and model registry selects the right adapter at runtime. Users can inject their own model function — zero vendor lock-in at every level, including the reasoning layer which can use a separate, cost-optimised model for retrieval decisions.",
      },
      {
        title: "Hybrid memory retrieval",
        body: "Combines semantic search (ChromaDB dense vectors) with keyword search (BM25) via an ensemble retrieval strategy. Results are interleaved and deduplicated. The hybrid approach consistently outperforms either method alone in conversational recall benchmarks.",
      },
      {
        title: "Four-tier contextual memory",
        body: "Four independent recall mechanisms, from fastest to deepest: recent dialogue buffer, keyword recall over past exchanges, semantic similarity over full session history, and graph-based retrieval ready to connect to the knowledge pipeline. The combination of keyword and semantic search over history is a meaningful improvement over window-only approaches.",
      },
      {
        title: "Structured knowledge ingestion",
        body: "Concurrent extraction pipeline (thread pool, up to 4 workers) with sentence-boundary-aware overlapping batches. Extracts typed entities (Character, Work, Event, Place, Concept, Principle) and their relationships in structured JSON. Fully idempotent — deterministic segment IDs mean re-ingestion is always safe.",
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
      "Building provider-agnostic from day one forced much cleaner abstractions. The adapter pattern paid off immediately when switching between models for cost optimisation — the conversation logic never needed to change.",
  },
  {
    slug: "concierge",
    title: "Concierge",
    tagline: "Tell it what you want. It finds the table.",
    description:
      "An AI-powered reservation assistant for high-demand restaurants. Describe your ideal dinner in natural language — neighbourhood, party size, time preferences — and the system monitors availability continuously, notifying you the moment a match opens.",
    liveUrl: "https://resy-polling-api.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["LangChain", "LangGraph", "FastAPI", "GPT-4.1-mini", "ReAct Agent", "PostgreSQL", "SQLAlchemy"],
    stats: [
      { label: "Agent tool functions", value: "6+" },
      { label: "Monitoring modes", value: "3" },
      { label: "Constraint types supported", value: "5+" },
      { label: "Data encryption", value: "AES-128" },
    ],
    heroGradient: "from-amber-500/20 via-transparent to-transparent",
    overview:
      "Concierge is a conversational AI agent that understands natural-language dining preferences and works in the background to act on them. Say ‘dinner for two in the West Village, Friday or Saturday, not too late’ — it interprets the constraints, sets up continuous monitoring, and alerts you when something opens.",
    problem:
      "Tables at sought-after restaurants appear and disappear unpredictably. Manual refreshing is tedious and rarely fast enough. Concierge replaces that with an always-on intelligent agent that understands nuanced preferences and acts the moment opportunity appears.",
    features: [
      {
        title: "Conversational AI agent",
        body: "Full conversational reasoning loop powered by GPT-4.1-mini with LangChain and LangGraph. Maintains conversation history with structured message sanitisation — strips orphan messages, resolves broken exchange sequences. Context is injected as ephemeral system instructions with venue-specific hints. Internal reasoning is preserved for continuity but hidden from the user interface.",
      },
      {
        title: "Natural language interpretation",
        body: "Parses free-form conversation into structured scheduling rules — weekday patterns, date ranges, explicit overrides, and time windows. Handles complex constraints like ‘Friday or Saturday, but not next weekend, between 7 and 9.’ All scheduling logic is resolved into concrete date-time checks before monitoring begins.",
      },
      {
        title: "Intelligent availability monitoring",
        body: "Monitors for the exact moment a restaurant releases new availability, then checks at high frequency for a configurable window. Designed for venues where tables are claimed within seconds of release.",
      },
      {
        title: "Encrypted credential management",
        body: "User credentials encrypted at rest with Fernet symmetric encryption (AES-128-CBC). Credential identifiers stored in the database; secrets decrypted only at the moment of use. Supports both local and production database backends.",
      },
      {
        title: "Adaptive monitoring intensity",
        body: "Three monitoring modes — eager (every two minutes), standard (every five), and relaxed (every fifteen). Concurrent venue checking with thread pooling. Monitoring jobs persist across service restarts via database-backed job management.",
      },
    ],
    techStack: [
      { category: "AI Agent", items: ["LangChain", "LangGraph", "GPT-4.1-mini", "ReAct architecture", "StructuredTool"] },
      { category: "Backend", items: ["FastAPI", "Uvicorn", "SQLAlchemy", "SQLite / PostgreSQL", "python-dateutil"] },
      { category: "Security", items: ["Fernet symmetric encryption", "cryptography lib", "Credential store"] },
      { category: "Infrastructure", items: ["Docker", "Render", "render.yaml one-click deploy"] },
    ],
    lessons:
      "The most subtle challenge was message sanitisation for the AI reasoning loop — conversation history can accumulate broken exchange sequences that cause downstream failures. Building a robust sanitiser that runs before every inference call made the agent dramatically more reliable.",
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
      "Cook Mode required the most iteration — the challenge wasn’t the voice recognition, it was making the experience feel natural in a kitchen where your hands are occupied and you’re under time pressure. Forcing myself to actually cook with it caught a dozen UX issues that code review never would.",
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
