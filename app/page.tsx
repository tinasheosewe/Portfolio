"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ExternalLink, Linkedin } from "lucide-react";
import { projects, secondaryProjects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

// ── Mobile hook ──────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [breakpoint]);
  return mobile;
}

// ── Animated headline word by word ──────────────────────────────────────────
function AnimWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span style={{ overflow: "hidden", display: "inline-block", marginRight: "0.22em" }}>
      <motion.span
        initial={{ y: "110%", rotate: 3 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "inline-block" }}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ── Marquee strip ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ["FastAPI","Next.js","LangGraph","Swift","RAG","ChromaDB","PostgreSQL","Python","TypeScript","Claude Opus","GPT-4o","Gemini 2.5 Pro","LangChain","Django","Flask","MongoDB","Embeddings","Semantic Search","Docker","Angular","NestJS"];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", background: "var(--bg-card)" }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} style={{ padding: "0 28px", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", borderRight: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Hover-reveal project row ─────────────────────────────────────────────────
const accentMap: Record<string, string> = {
  apthunt: "#e8960c",
  chatbot: "#a78bfa",
  concierge: "#e8960c",
  pantrychef: "#4ade80",
};

function ProjectRow({ project, index, onSelect, mobile }: { project: typeof projects[0]; index: number; onSelect: () => void; mobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => { if (e.key === "Enter") onSelect(); }}
      style={{ textDecoration: "none", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: mobile ? "20px 0" : "28px 0",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr auto" : "60px 1fr auto",
          alignItems: "center",
          gap: mobile ? 12 : 24,
          transition: "padding .3s ease",
          paddingLeft: !mobile && hovered ? 20 : 0,
          paddingRight: !mobile && hovered ? 8 : 0,
        }}
      >
        {/* Number (hidden on mobile) */}
        {!mobile && (
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
            {num}
          </span>
        )}

        {/* Title + tags */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: mobile ? 8 : 16, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: hovered ? accentMap[project.slug] ?? "var(--accent)" : "var(--text-primary)",
              transition: "color .25s ease",
            }}>
              {project.title}
            </span>
            {!mobile && (
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 400 }}>
                {project.tagline}
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {project.tags.slice(0, mobile ? 3 : 4).map(tag => (
              <span key={tag} style={{ fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow + status */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: mobile ? 0 : 120 }}>
          {!mobile && (
            <motion.div
              animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span style={{ fontSize: "0.78rem", color: accentMap[project.slug] ?? "var(--accent)", fontWeight: 600 }}>
                Case study
              </span>
              <ArrowUpRight size={14} color={accentMap[project.slug] ?? "var(--accent)"} />
            </motion.div>
          )}
          <span style={{
            fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase",
            color: project.status === "live" ? "#4ade80" : project.status === "ios" ? "#a78bfa" : "var(--accent)",
          }}>
            {project.statusLabel}
          </span>
          {mobile && <ArrowUpRight size={14} color={accentMap[project.slug] ?? "var(--accent)"} />}
        </div>
      </motion.div>
    </div>
  );
}

// ── Count-up stat ────────────────────────────────────────────────────────────
function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref} style={{ padding: "24px 0" }}>
      <div style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--accent)", lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

// ── Case study overlay (SPA) ─────────────────────────────────────────────────
const accentColors: Record<string, string> = {
  apthunt: "#e8960c",
  chatbot: "#a78bfa",
  concierge: "#e8960c",
  pantrychef: "#4ade80",
};

const FadeUp = ({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} style={style}>
    {children}
  </motion.div>
);

function CaseStudyOverlay({ project, onClose, onSelectProject, mobile }: { project: Project; onClose: () => void; onSelectProject: (slug: string) => void; mobile: boolean }) {
  const accent = accentColors[project.slug] ?? "var(--accent)";
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
  }, [project.slug]);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 900, background: "var(--bg)", overflowY: "auto", overflowX: "hidden" }}
    >
      {/* ── Full-bleed hero ── */}
      <section style={{ position: "relative", minHeight: mobile ? "60vh" : "70vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: mobile ? "0 20px 48px" : "0 40px 72px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 55% 0%, ${accent}18 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-60%)", fontSize: "clamp(160px,25vw,320px)", fontWeight: 900, letterSpacing: "-0.05em", color: `${accent}08`, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
          {String(["apthunt","chatbot","concierge","pantrychef"].indexOf(project.slug) + 1).padStart(2,"0")}
        </div>

        <div style={{ position: "relative", maxWidth: 1200, width: "100%" }}>
          <FadeUp>
            <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 40, transition: "color .2s", padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <ArrowLeft size={12} /> All work
            </button>
          </FadeUp>

          <FadeUp delay={0.1} style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{ fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{tag}</span>
            ))}
          </FadeUp>

          <FadeUp delay={0.18}>
            <h1 style={{ fontSize: "clamp(48px, 9vw, 110px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95, margin: "0 0 20px" }}>
              {project.title}<span style={{ color: accent }}>.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.26} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)", color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.75, margin: 0 }}>
              {project.description}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "12px 24px", borderRadius: 100, background: accent, color: "#080808", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.04em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Live Demo <ExternalLink size={13} />
                </a>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "0 20px" : "0 40px", display: "flex", flexWrap: mobile ? "wrap" : "nowrap" }}>
          {project.stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              style={{ flex: mobile ? "1 1 50%" : 1, padding: mobile ? "20px 16px" : "28px 24px", borderLeft: mobile ? (i % 2 === 1 ? "1px solid var(--border)" : "none") : (i > 0 ? "1px solid var(--border)" : "none"), borderTop: mobile && i >= 2 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 700, color: accent, letterSpacing: "-0.025em", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 5 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <article style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "48px 20px 80px" : "80px 40px 120px" }}>
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>Overview</p>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.overview}</p>
        </motion.section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>The Problem</p>
          <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.problem}</p>
        </motion.section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        <section style={{ marginBottom: 72 }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 36 }}>
            What I Built
          </motion.p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {project.features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{ padding: mobile ? "20px 18px" : "28px 32px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `3px solid ${accent}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}05 0%, transparent 50%)`, pointerEvents: "none" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        <section style={{ marginBottom: 72 }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 32 }}>
            Tech Stack
          </motion.p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {project.techStack.map((group, i) => (
              <motion.div key={group.category} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ padding: "20px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 12px" }}>{group.category}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {group.items.map(item => (
                    <span key={item} style={{ fontSize: "0.7rem", padding: "3px 9px", borderRadius: 100, background: "var(--bg)", border: "1px solid var(--border-mid)", color: "var(--text-secondary)" }}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>Lessons Learned</p>
          <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.lessons}</p>
        </motion.section>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: "13px 26px", borderRadius: 100, background: accent, color: "#080808", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Open live demo <ArrowUpRight size={14} />
            </a>
          )}
          <button onClick={onClose}
            style={{ padding: "13px 26px", borderRadius: 100, border: "1px solid var(--border-mid)", background: "none", color: "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> All projects
          </button>
        </div>
      </article>

      {/* ── Next project ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: mobile ? "48px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 32 }}>Next project</p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : `repeat(${projects.filter(p => p.slug !== project.slug).length > 2 ? 3 : projects.filter(p => p.slug !== project.slug).length}, 1fr)`, gap: 1, background: "var(--border)" }}>
            {projects.filter(p => p.slug !== project.slug).map((p) => {
              const nextAccent = accentColors[p.slug] ?? "var(--accent)";
              return (
                <div key={p.slug} role="button" tabIndex={0} onClick={() => onSelectProject(p.slug)} onKeyDown={e => { if (e.key === "Enter") onSelectProject(p.slug); }} style={{ cursor: "pointer" }}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    style={{ padding: "36px 32px", background: "var(--bg)", transition: "background .2s" }}>
                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: nextAccent, display: "block", marginBottom: 12 }}>{p.statusLabel}</span>
                    <h3 style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--text-primary)" }}>
                      {p.title}<span style={{ color: nextAccent }}>.</span>
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{p.tagline}</p>
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, color: nextAccent, fontSize: "0.78rem", fontWeight: 600 }}>
                      View case study <ArrowUpRight size={13} />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const mobile = useIsMobile();
  const words = ["Software", "engineer.", "Intelligent", "systems.", "Delivered."];

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  // Close overlay on hash change (nav clicks)
  useEffect(() => {
    const close = () => setSelectedProject(null);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactForm) });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setFormError("Something went wrong. Try reaching out via LinkedIn instead.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* ── Case study overlay ── */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyOverlay
            key={selectedProject.slug}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            mobile={mobile}
            onSelectProject={(slug) => {
              const p = projects.find(pr => pr.slug === slug);
              if (p) setSelectedProject(p);
            }}
          />
        )}
      </AnimatePresence>

      <main>
        {/* ── Hero ── */}
        <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: mobile ? "80px 20px 48px" : "100px 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,150,12,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "clamp(48px, 8.5vw, 120px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", margin: "0 0 32px" }}>
              <div>{words.slice(0, 2).map((w, i) => <AnimWord key={i} word={w} delay={0.35 + i * 0.08} />)}</div>
              <div>
                {words.slice(2, 4).map((w, i) => <AnimWord key={i} word={w} delay={0.5 + i * 0.08} />)}
                <span style={{ color: "var(--accent)" }}>
                  <AnimWord word={words[4]} delay={0.68} />
                </span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.7 }}
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 540, margin: "0 0 36px" }}
            >
              I design and build software from architecture through interface — data intelligence, AI-driven products, and native mobile applications. Four products in production, each one conceived and delivered independently.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
            >
              <a href="#projects"
                style={{ padding: "13px 28px", borderRadius: 100, background: "var(--accent)", color: "#080808", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                View work <ArrowUpRight size={15} />
              </a>
              <a href="#contact"
                style={{ padding: "13px 24px", borderRadius: 100, border: "1px solid var(--border-mid)", color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none" }}>
                Get in touch
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ position: "absolute", right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", writingMode: "vertical-rl" }}>Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--border-mid), transparent)" }}
              />
            </motion.div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <Marquee />

        {/* ── Projects ── */}
        <section id="projects" style={{ padding: mobile ? "60px 20px" : "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 16 }}
          >
            <div>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Selected Work</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Case studies.</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.7 }}>
              Full-lifecycle products — from data infrastructure to native mobile. Each one designed, built, and deployed independently.
            </p>
          </motion.div>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <ProjectRow project={project} index={i} onSelect={() => setSelectedProject(project)} mobile={mobile} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Other Work ── */}
        <section style={{ padding: mobile ? "0 20px 60px" : "0 40px 100px", maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 40 }}
          >
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Other Work</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>More projects.</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "var(--border)" }}>
            {secondaryProjects.map((sp, i) => (
              <motion.div
                key={sp.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ padding: "32px 28px", background: "var(--bg)" }}
              >
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px", color: "var(--text-primary)" }}>
                  {sp.title}<span style={{ color: sp.accent }}>.</span>
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 16px" }}>
                  {sp.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sp.tags.map(tag => (
                    <span key={tag} style={{ fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section style={{ padding: mobile ? "60px 20px" : "120px 40px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 48 }}>
              Philosophy
            </motion.p>
            <div style={{ maxWidth: 900 }}>
              {["I don\u2019t build features.", "I build systems."].map((line, i) => (
                <motion.h2 key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: "clamp(32px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, color: i === 1 ? "var(--accent)" : "var(--text-primary)" }}>
                  {line}
                </motion.h2>
              ))}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 600, marginTop: 36 }}>
                Every project begins with the structure underneath — how data flows, where boundaries belong, what the system needs to endure over time. I write software I&#39;d want to inherit two years from now.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "40px 20px" : "60px 40px", display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 0 }}>
            {[
              { value: 14700, suffix: "+", label: "NYC listings analysed" },
              { value: 15, label: "Quality dimensions per listing" },
              { value: 4, label: "AI model integrations" },
              { value: 4, label: "Products in production" },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: mobile ? (i % 2 === 1 ? "1px solid var(--border)" : "none") : (i > 0 ? "1px solid var(--border)" : "none"), paddingLeft: mobile ? (i % 2 === 1 ? 24 : 0) : (i > 0 ? 40 : 0), borderTop: mobile && i >= 2 ? "1px solid var(--border)" : "none", paddingTop: mobile && i >= 2 ? 16 : 0 }}>
                <Stat value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Process ── */}
        <section style={{ padding: mobile ? "60px 20px" : "100px 40px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 48 }}>
              Process
            </motion.p>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: 1, background: "var(--border)" }}>
              {[
                { num: "01", title: "Research", desc: "Understand the domain deeply. Study existing solutions, identify gaps, map user behaviour. Nothing gets built until the territory is clear." },
                { num: "02", title: "Architect", desc: "Design the system before writing a single line of code. Define boundaries, data flow, and interfaces. Every structural decision is deliberate and documented." },
                { num: "03", title: "Build", desc: "Implement across the entire surface \u2014 backend, frontend, infrastructure \u2014 with tests at every layer. One engineer, no seams." },
                { num: "04", title: "Ship & Iterate", desc: "Deploy, instrument, and monitor. Iterate based on how real users actually behave \u2014 not assumptions. Software that isn\u2019t running isn\u2019t finished." },
              ].map((step, i) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ padding: "36px 32px", background: "var(--bg)" }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.03em", opacity: 0.35, lineHeight: 1 }}>{step.num}</span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "16px 0 12px", color: "var(--text-primary)" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--text-secondary)", margin: 0 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" style={{ padding: mobile ? "60px 20px" : "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 40 : 80, alignItems: "start" }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>About</p>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, margin: "0 0 28px" }}>
                  Across the<br />full stack.
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.95rem", margin: "0 0 18px" }}>
                  Software engineer with deep experience across the entire product surface — Python services, React interfaces, native iOS, and AI-driven systems. I care about the architecture underneath as much as the experience on top.
                </p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.95rem", margin: 0 }}>
                  Recent work spans AI systems, data intelligence platforms, real-time infrastructure, and native mobile — each one designed, built, and deployed independently.
                </p>
              </motion.div>
            </div>
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
                {[
                  { label: "Languages", value: "Python · TypeScript · JavaScript · Swift · Java · C++ · C · SQL · Dart · MATLAB" },
                  { label: "Frameworks", value: "FastAPI · Next.js · React · Angular · Flask · Django · NestJS · SwiftUI · LangChain · Flutter" },
                  { label: "AI / ML", value: "GPT · Claude · Gemini · RAG · Prompt Engineering · Embeddings · LangGraph · Guardrails" },
                  { label: "Data", value: "PostgreSQL · MongoDB · SQLite · Cloud Firestore · SQLAlchemy · Neo4j" },
                  { label: "Infrastructure", value: "Docker · Git · CI/CD · Render · Heroku · Vercel · XcodeGen" },
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                    style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid var(--border)", gap: 24, flexDirection: mobile ? "column" : "row" }}
                  >
                    <span style={{ fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: mobile ? "left" : "right" }}>{value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" style={{ borderTop: "1px solid var(--border)", padding: mobile ? "60px 20px 80px" : "100px 40px 120px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Contact</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 14px" }}>Let&#39;s talk.</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>Available for full-time engineering roles and consulting engagements.</p>
            </motion.div>

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "28px", borderRadius: 16, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", color: "#4ade80", textAlign: "center" }}>
                Message sent. I&#39;ll get back to you soon.
              </motion.div>
            ) : (
              <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  {[["name","Name","text"],["email","Email","email"]].map(([field, ph, type]) => (
                    <input key={field} required type={type} placeholder={ph}
                      value={contactForm[field as keyof typeof contactForm]}
                      onChange={e => setContactForm({ ...contactForm, [field]: e.target.value })}
                      style={{ padding: "14px 18px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "0.875rem", outline: "none", transition: "border-color .2s" }}
                      onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border)")}
                    />
                  ))}
                </div>
                <textarea required rows={5} placeholder="What are you working on?"
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{ padding: "14px 18px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", outline: "none", fontFamily: "inherit", transition: "border-color .2s" }}
                  onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
                {formError && <p style={{ fontSize: "0.8rem", color: "#f87171" }}>{formError}</p>}
                <button type="submit" disabled={sending} style={{ marginTop: 4, padding: "15px 32px", borderRadius: 100, background: "var(--accent)", color: "#080808", fontWeight: 700, fontSize: "0.875rem", border: "none", transition: "opacity .2s", opacity: sending ? 0.65 : 1, cursor: "pointer" }}>
                  {sending ? "Sending\u2026" : "Send message"}
                </button>
              </form>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 52 }}>
              <a href="https://www.linkedin.com/in/tinasheosewe/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                <Linkedin size={15} /> LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ padding: mobile ? "24px 20px" : "24px 40px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} Tinashe Osewe</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Built with Next.js</span>
        </footer>
      </main>
    </>
  );
}
