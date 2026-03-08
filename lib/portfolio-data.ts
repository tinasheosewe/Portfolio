/* ── Portfolio data tools for the ⌘K agent loop ── */
import { projects, secondaryProjects, type Project, type SecondaryProject } from "./projects";

/* ── Experience & Education (not on the site — novel content) ── */
const experience = {
  current: {
    company: "Goldman Sachs",
    role: "Asset Management Technology Strategist",
    previousRole: "Asset Management Technology Intern (2021)",
    duration: "2021 – Present (intern 2021, full-time 2022+)",
    highlights: [
      "Enterprise generative AI platform development",
      "Multi-LLM pipeline integration and orchestration",
      "High-performance caching and data infrastructure",
      "AI guardrails, evaluation pipelines, and production reliability",
      "Legacy-to-modern architecture migrations at global scale",
      "Full-stack development across internal financial platforms",
      "Cross-team AI adoption and technical leadership",
    ],
  },
  education: {
    university: "Rensselaer Polytechnic Institute (RPI)",
    degrees: [
      "Bachelor of Science: Computer Science",
      "Bachelor of Science: Mechanical Engineering",
    ],
    location: "Troy, NY",
    years: "2018 – 2022",
  },
  location: "New York City",
  philosophy:
    "First-principles thinker. Design-conscious. Ships fast. Builds end-to-end — from database schema to pixel-level UI.",
};

/* ── Skills organised by category ── */
const skills = {
  languages: ["Python", "TypeScript", "JavaScript", "SQL", "Swift", "Java", "C++", "C", "Dart", "MATLAB"],
  frontend: ["React 19", "Next.js 16", "Angular", "SwiftUI", "Flutter", "Tailwind CSS 4", "Framer Motion", "Zustand"],
  backend: ["FastAPI", "Node.js", "NestJS", "Flask", "Django", "Uvicorn", "SQLAlchemy"],
  ai_ml: [
    "Generative AI Systems",
    "Retrieval-Augmented Generation (RAG)",
    "Prompt Engineering",
    "Semantic Search",
    "Embeddings",
    "Guardrails & Hallucination Mitigation",
    "Automated Evaluation Pipelines",
    "Multi-LLM Pipelines (Claude, GPT, Gemini)",
    "LangChain",
    "LangGraph",
    "ChromaDB",
    "BM25",
    "Structured Output",
    "Function Calling",
    "ReAct Agents",
    "Apple Vision OCR",
    "SFSpeechRecognizer",
  ],
  databases: ["PostgreSQL", "SQLite", "MongoDB", "Neo4j", "ChromaDB", "Cloud Firestore", "Supabase"],
  infra: ["Docker", "Render", "Heroku", "Git", "CI/CD", "XcodeGen"],
  data: ["NYC Open Data", "MTA GTFS", "Geospatial (pygeohash, Haversine)", "NumPy"],
  patterns: [
    "MVVM",
    "Provider/Adapter pattern",
    "Event-driven architecture",
    "Hybrid retrieval (dense + sparse)",
    "Concurrent pipelines",
    "SSE streaming",
  ],
};

/* ── Tool functions ── */

export function getProject(slug: string): string {
  const main = projects.find((p) => p.slug === slug);
  if (main) return JSON.stringify(main, null, 2);

  // Check secondary projects by slugified title
  const sec = secondaryProjects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug
  );
  if (sec) return JSON.stringify(sec, null, 2);

  return JSON.stringify({ error: `Project '${slug}' not found. Available: ${projects.map((p) => p.slug).join(", ")}, ${secondaryProjects.map((p) => p.title.toLowerCase().replace(/\s+/g, "-")).join(", ")}` });
}

export function getAllProjects(): string {
  const main = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    tags: p.tags,
    status: p.status,
    stats: p.stats,
  }));
  const secondary = secondaryProjects.map((p) => ({
    title: p.title,
    description: p.description,
    tags: p.tags,
  }));
  return JSON.stringify({ mainProjects: main, secondaryProjects: secondary }, null, 2);
}

export function getExperience(): string {
  return JSON.stringify(experience, null, 2);
}

export function getSkills(): string {
  return JSON.stringify(skills, null, 2);
}

export function searchProjects(query: string): string {
  const q = query.toLowerCase();
  const matches: (Project | SecondaryProject)[] = [];

  for (const p of projects) {
    const searchable = [
      p.title,
      p.tagline,
      p.description,
      p.overview,
      p.problem,
      ...p.tags,
      ...p.features.map((f) => f.title + " " + f.body),
      ...p.techStack.flatMap((t) => t.items),
      p.lessons,
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) matches.push(p);
  }

  for (const p of secondaryProjects) {
    const searchable = [p.title, p.description, ...p.tags].join(" ").toLowerCase();
    if (searchable.includes(q)) matches.push(p);
  }

  if (matches.length === 0) {
    return JSON.stringify({ results: [], note: `No projects matched '${query}'. Try broader terms.` });
  }

  return JSON.stringify(
    matches.map((p) => {
      if ("slug" in p) {
        return { slug: p.slug, title: p.title, tagline: p.tagline, tags: p.tags };
      }
      return { title: p.title, description: p.description, tags: p.tags };
    }),
    null,
    2
  );
}
