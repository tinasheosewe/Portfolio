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

export const projects: Project[] = [
  {
    slug: "apthunt",
    title: "AptHunt",
    tagline: "14,700 NYC listings. We give you 3.",
    description:
      "A signal-first apartment intelligence platform that compresses New York City's entire rental market into the listings that actually matter — scored across 15 dimensions from transit to flood risk.",
    liveUrl: "https://apthunt-web.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["FastAPI", "Next.js 16", "React 19", "Python", "SQLite", "Geospatial", "NYC Open Data"],
    stats: [
      { label: "Active NYC listings ingested", value: "14,700" },
      { label: "Scoring dimensions", value: "15" },
      { label: "Full sync time", value: "~4 min" },
      { label: "GeoHash precision", value: "153 m" },
    ],
    heroGradient: "from-amber-500/20 via-transparent to-transparent",
    overview:
      "AptHunt is built around one philosophy: decision compression. The NYC rental market is adversarial — paid placements, stale listings, landlord noise. AptHunt cuts through all of it by pulling live data from every major source, running each listing through a 15-dimension scoring engine, and surfacing only the ones worth your attention.",
    problem:
      "Finding an apartment in NYC is a full-time job. Listings are gamed, data is stale, and every platform is designed to maximise eyeballs rather than signal. AptHunt is the opposite: fewer results, more intelligence.",
    features: [
      {
        title: "Reverse-engineered live scraper",
        body: "Hits StreetEasy's internal Apollo GraphQL v6 endpoint — not the public API. Pulls ~14,700 active listings in ~74 requests with per-request identity rotation (Chrome UA + OS variant + Apollo client version hash), dual-mode proxy (rotating for search, sticky for sessions), and exponential backoff.",
      },
      {
        title: "15-dimension atomic scoring engine",
        body: "15 independent scorers registered in a pluggable engine: deal (z-score normalised against neighbourhood+bedroom comp sets), transit (MTA GTFS stops weighted by routes served), crime (NYPD complaint radius queries with felony×3/misdemeanor×1.5 severity weighting), noise (311 complaints within 300m), building violations (DOB/BBL join), parks, schools, rent stabilisation, flood risk (PLUTO FIRM flags), and more.",
      },
      {
        title: "User-weighted composite scoring",
        body: "13 dimensions grouped into 5 categories. Top-2 priority groups get 3× weight, middle 2×, bottom 1×. Per-user weighting is a dot product computed at query time — the scoring pipeline runs once, weights are applied on the fly per user.",
      },
      {
        title: "Cosine-similarity comparables engine",
        body: "\"Similar listings\" uses cosine similarity over 5-dimensional group score vectors blended with Haversine geographic proximity and price proximity. \"Also Consider\" finds listings that match 4 groups but excel in a 5th — one recommendation per group.",
      },
      {
        title: "GeoHash block quality cache",
        body: "Block quality cached at pygeohash precision-7 (~153m cells). Queries Socrata SODA for crime, 311, DOB violations, parks, flood risk, and development trends per cell.",
      },
      {
        title: "Source-agnostic canonical schema",
        body: "Every schema field feeds at least one scoring model. Cosmetic fields are explicitly excluded. StreetEasy, Craigslist, Listings Project, and manual sources all map to the same canonical form — the intelligence layer is source-agnostic.",
      },
    ],
    techStack: [
      { category: "Backend", items: ["FastAPI", "Uvicorn", "SQLite (WAL mode)", "Pydantic"] },
      { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "React-Leaflet", "Recharts", "Framer Motion"] },
      { category: "Data Sources", items: ["StreetEasy Apollo GraphQL v6", "NYC Open Data (Socrata SODA)", "MTA GTFS", "NYPD Complaints", "DOB/PLUTO", "NYC Parks"] },
      { category: "Geospatial", items: ["pygeohash (precision-7)", "Haversine distance", "Socrata radius queries"] },
      { category: "Infrastructure", items: ["Docker", "Render", "Dual-mode rotating/sticky proxy", "Browser fingerprint randomisation"] },
    ],
    lessons:
      "The hardest problem wasn't scraping or scoring — it was deciding what not to include. Every data source has noise. The discipline of enforcing that every schema field feeds a scoring model kept the system honest and the UX clean.",
  },
  {
    slug: "chatbot",
    title: "Character Chatbot",
    tagline: "Any LLM. Any character. Hybrid RAG memory that actually recalls.",
    description:
      "A truly LLM-agnostic character roleplay system with hybrid retrieval (dense + BM25), four-tier hierarchical memory, an agentic multi-pass context engine, and a full knowledge graph ingestion pipeline — served via a streaming Next.js UI.",
    liveUrl: "https://chatbot-ui-rn18.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["FastAPI", "LangChain", "ChromaDB", "Next.js", "PostgreSQL", "Neo4j", "RAG", "BM25"],
    stats: [
      { label: "LLM providers supported", value: "4+" },
      { label: "Memory tiers", value: "4" },
      { label: "Retrieval passes (agentic)", value: "2" },
      { label: "Storage backends", value: "Postgres + Neo4j" },
    ],
    heroGradient: "from-violet-500/20 via-transparent to-transparent",
    overview:
      "The chatbot is three systems working in concert: a hybrid RAG chatbot backend (CHATBOT), a knowledge graph ingestion pipeline that turns raw documents into structured Postgres/Neo4j graphs (CHATBOT-KG), and a streaming Next.js UI (CHATBOT-UI). Together they form a production-grade character roleplay engine with no provider lock-in.",
    problem:
      "Most LLM chatbot demos are tied to one provider, forget context after a few turns, and can't be fed custom knowledge without a complete rewrite. This system solves all three: swap the LLM in one line, recall anything from session history via four independent memory mechanisms, and ingest arbitrary documents into a queryable knowledge graph.",
    features: [
      {
        title: "Truly LLM-agnostic architecture",
        body: "Abstract LLMWrapper interface with built-in adapters for OpenAI, Anthropic, Ollama, and Google Gemini. A factory + model registry selects the right adapter at runtime. Users inject their own LLM function — zero SDK lock-in at every level, including the agentic retrieval manager which can use a cheaper model for decisions.",
      },
      {
        title: "Hybrid retrieval engine",
        body: "HybridRetrievalEngine combines ChromaDB semantic search (dense_k=4) with BM25 keyword search (keyword_k=3) via LangChain EnsembleRetriever. Results interleaved and deduplicated. Hybrid consistently outperforms pure dense or pure keyword in conversational recall.",
      },
      {
        title: "4-tier hierarchical memory",
        body: "Recent dialogue buffer → BM25 keyword recall over past turns → semantic embedding similarity over session history → GraphRAG stub (ready to connect to the KG pipeline). The blend of BM25 + semantic over history is a non-trivial recall improvement over window-only approaches.",
      },
      {
        title: "Knowledge graph ingestion pipeline",
        body: "Concurrent LLM extraction (thread pool, max 4 workers) with sentence-boundary-aware overlapping batches. GPT-4o-mini in JSON mode extracts typed nodes (Character, Work, Event, Place, Concept, Principle) and relations. Fully idempotent — deterministic segment IDs from work_name + para_index + chunk_index mean re-ingestion is always safe.",
      },
      {
        title: "Agentic multi-pass retrieval",
        body: "AgenticRetrievalManager with configurable max_passes (default 2). Decides whether the first retrieval pass was sufficient before generation; iterates if not. Separates the agentic reasoning model from the character generation model.",
      },
      {
        title: "SSE streaming + document management UI",
        body: "Next.js frontend consumes text/event-stream for token-by-token rendering. Full document management dashboard: upload (blocks until vectorisation completes), delete (triggers auto vector rebuild), view with size/timestamp metadata.",
      },
    ],
    techStack: [
      { category: "Backend", items: ["FastAPI", "Uvicorn", "LangChain", "ChromaDB", "HuggingFace sentence-transformers", "BM25"] },
      { category: "Knowledge Graph", items: ["PostgreSQL", "SQLAlchemy", "Neo4j / Memgraph", "psycopg2", "GPT-4o-mini (JSON mode)"] },
      { category: "Frontend", items: ["Next.js 16", "React 19", "Tailwind CSS 4", "SSE streaming", "pnpm"] },
      { category: "LLM Adapters", items: ["OpenAI", "Anthropic", "Ollama", "Google Gemini"] },
      { category: "Infrastructure", items: ["Docker", "Render", "Multi-stage build"] },
    ],
    lessons:
      "Building LLM-agnostic from day one forces much better abstractions. The provider wrapper pattern paid off immediately when switching between models for cost optimisation — the character logic never needed to change.",
  },
  {
    slug: "concierge",
    title: "Concierge",
    tagline: "Tell it what you want. It finds the table.",
    description:
      "An AI-powered restaurant availability assistant. Describe your ideal dinner in natural language — the LangGraph ReAct agent interprets your constraints, monitors availability in real time, and notifies you the moment a match opens up.",
    liveUrl: "https://resy-polling-api.onrender.com/",
    status: "live",
    statusLabel: "Live",
    tags: ["LangChain", "LangGraph", "FastAPI", "GPT-4.1-mini", "ReAct Agent", "PostgreSQL", "SQLAlchemy"],
    stats: [
      { label: "Tool implementations", value: "1,074 lines" },
      { label: "Poll presets", value: "3 intensities" },
      { label: "Sniper burst interval", value: "0.5 s" },
      { label: "Credential encryption", value: "Fernet AES" },
    ],
    heroGradient: "from-amber-500/20 via-transparent to-transparent",
    overview:
      "Concierge is a conversational AI agent that understands natural language restaurant preferences and works in the background to surface availability that matches. Tell it 'dinner for 2 in the West Village, Friday or Saturday, not too late' — it parses the constraints, sets up monitoring jobs, and sends you a notification when something opens.",
    problem:
      "Availability at popular restaurants is fleeting and unpredictable. Manual refreshing is tedious and ineffective. Concierge solves this with an always-on intelligent agent that understands nuanced preferences and acts the moment opportunity appears.",
    features: [
      {
        title: "LangGraph ReAct conversational agent",
        body: "Full LangChain + LangGraph ReAct loop powered by GPT-4.1-mini. Maintains conversation history with structured message sanitisation — strips orphan tool messages, drops trailing tool_call messages without responses. Context injected as ephemeral SystemMessage with venue hints. Intermediate reasoning preserved for LLM context but stripped from the rendered UI.",
      },
      {
        title: "Natural language constraint engine",
        body: "Expands ScheduleRule objects (weekdays + date ranges + explicit include/exclude overrides + time windows) into concrete PlannedDateCheck objects. AllowedWindow is an immutable value object of minute-of-day ranges. Handles excluded/included date overrides against range+weekday patterns. All parsed from free-form conversation.",
      },
      {
        title: "Drop-time sniper mode",
        body: "Sleeps until the exact second a restaurant releases inventory (e.g. 9:00 AM ET sharp), then burst-polls at 0.5s intervals for a configurable window. Designed for first-mover advantage at high-demand venues.",
      },
      {
        title: "Encrypted credential store",
        body: "User credentials encrypted at rest with Fernet symmetric encryption (AES-128-CBC). Credential IDs stored in the database; secrets decrypted only at notification time. SQLite locally, PostgreSQL in production.",
      },
      {
        title: "Browser-impersonating HTTP client",
        body: "All API calls made via curl_cffi which mimics browser TLS fingerprints and HTTP/2 behaviour — significantly harder to detect than vanilla requests or httpx. Combined with rotating proxy for polling and sticky proxy for authenticated requests.",
      },
      {
        title: "Poll-intensity presets",
        body: "Configurable poll intensity: eager (120s), standard (300s), relaxed (900s). ThreadPoolExecutor for concurrent venue availability checks. Monitoring jobs persist across restarts via SQLAlchemy-backed JobManager.",
      },
    ],
    techStack: [
      { category: "AI Agent", items: ["LangChain", "LangGraph", "GPT-4.1-mini", "ReAct architecture", "StructuredTool"] },
      { category: "Backend", items: ["FastAPI", "Uvicorn", "SQLAlchemy", "SQLite / PostgreSQL", "python-dateutil"] },
      { category: "Security", items: ["Fernet symmetric encryption", "cryptography lib", "Credential store"] },
      { category: "HTTP", items: ["curl_cffi (TLS fingerprinting)", "Rotating + sticky proxy", "ThreadPoolExecutor"] },
      { category: "Infrastructure", items: ["Docker", "Render", "render.yaml one-click deploy"] },
    ],
    lessons:
      "The message sanitisation for the ReAct loop was the trickiest part — LangGraph's message history can accumulate orphan tool_call/tool_response pairs that break subsequent LLM calls. Building a robust sanitiser before every inference call made the agent dramatically more stable.",
  },
  {
    slug: "pantrychef",
    title: "PantryChef",
    tagline: "Scan your pantry. GPT-4o tells you what to cook.",
    description:
      "A full-featured iOS kitchen AI app. Scan receipts with Vision OCR, look up ingredients by barcode, get GPT-4o recipe suggestions and substitutions, and cook hands-free with voice-controlled Cook Mode.",
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
      "PantryChef is a native iOS kitchen management app that combines Apple's on-device AI (Vision, Speech) with GPT-4o to turn what's in your fridge into what's on your table. The architecture is built for production — Supabase-ready service layer with migration SQL included, XcodeGen build, protocol-driven storage.",
    problem:
      "Most recipe apps show you recipes regardless of what you have. PantryChef works backwards from your actual pantry, showing match percentages, flagging expiring items, and letting AI suggest what to cook with leftovers.",
    features: [
      {
        title: "Multi-source pantry input",
        body: "Add ingredients manually, by barcode scan (Open Food Facts API lookup), or by photographing receipts and cookbooks via Apple Vision OCR. Expiry date tracking with visual urgency warnings. Every recipe card shows pantry match percentage.",
      },
      {
        title: "GPT-4o AI layer",
        body: "Ingredient substitution suggestions with confidence ratings. Natural language queries: 'What can I make with what I have?', 'Use up expiring items', 'What can I do with last night's leftovers?'. Recipe import from any URL with structured extraction.",
      },
      {
        title: "Cook Mode",
        body: "Full-screen step-by-step guided cooking with per-step timers. Voice readout via AVSpeechSynthesizer. Voice commands ('next', 'repeat', 'start timer') via SFSpeechRecognizer. Dark UI designed for kitchen conditions — readable with wet hands.",
      },
      {
        title: "Meal planning",
        body: "Weekly calendar view with breakfast/lunch/dinner slots. Auto-generate a complete shopping list from the full week's meal plan. Plan against what you already have to minimise waste.",
      },
      {
        title: "Production-ready architecture",
        body: "MVVM with centralised AppState. StorageService is a protocol — swapping from in-memory to Supabase is a one-file change. Supabase migration SQL already written. XcodeGen build (no committed .xcodeproj). TestFlight distribution ready.",
      },
    ],
    techStack: [
      { category: "Platform", items: ["iOS 17.0+", "Swift 5.9", "SwiftUI", "MVVM"] },
      { category: "AI / ML", items: ["OpenAI GPT-4o", "Apple Vision (OCR)", "SFSpeechRecognizer", "AVSpeechSynthesizer"] },
      { category: "Data", items: ["Open Food Facts API (barcode)", "Supabase (ready)", "In-memory storage"] },
      { category: "Build", items: ["XcodeGen", "project.yml", "TestFlight"] },
    ],
    lessons:
      "Cook Mode required the most iteration — the challenge wasn't the voice recognition, it was making the experience feel natural in a kitchen environment where your hands are occupied and you're under time pressure. Forcing myself to actually cook with it caught a dozen UX issues that code review never would.",
  },
];
