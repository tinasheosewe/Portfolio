"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { projects } from "@/lib/projects";

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

export default function CaseStudyClient({ project }: { project: Project }) {
  const accent = accentColors[project.slug] ?? "var(--accent)";
  const others = ["apthunt","chatbot","concierge","pantrychef"].filter(s => s !== project.slug);

  return (
    <main>
      {/* ── Full-bleed hero ── */}
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 40px 72px", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 55% 0%, ${accent}18 0%, transparent 60%)`, pointerEvents: "none" }} />
        {/* Huge bg number */}
        <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-60%)", fontSize: "clamp(160px,25vw,320px)", fontWeight: 900, letterSpacing: "-0.05em", color: `${accent}08`, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
          {String(["apthunt","chatbot","concierge","pantrychef"].indexOf(project.slug) + 1).padStart(2,"0")}
        </div>

        <div style={{ position: "relative", maxWidth: 1200, width: "100%" }}>
          <FadeUp>
            <Link href="/#projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", marginBottom: 40, transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <ArrowLeft size={12} /> All work
            </Link>
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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {project.stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              style={{ flex: 1, padding: "28px 24px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 700, color: accent, letterSpacing: "-0.025em", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 5 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <article style={{ maxWidth: 860, margin: "0 auto", padding: "80px 40px 120px" }}>

        {/* Overview */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>Overview</p>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.overview}</p>
        </motion.section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        {/* Problem */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>The Problem</p>
          <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.problem}</p>
        </motion.section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        {/* Features */}
        <section style={{ marginBottom: 72 }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 36 }}>
            What I Built
          </motion.p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {project.features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{ padding: "28px 32px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `3px solid ${accent}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}05 0%, transparent 50%)`, pointerEvents: "none" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ margin: "0 0 72px", borderTop: "1px solid var(--border)" }} />

        {/* Tech stack */}
        <section style={{ marginBottom: 72 }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 32 }}>
            Tech Stack
          </motion.p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
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

        {/* Lessons */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 18 }}>Lessons Learned</p>
          <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "var(--text-secondary)" }}>{project.lessons}</p>
        </motion.section>

        {/* Bottom nav */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: "13px 26px", borderRadius: 100, background: accent, color: "#080808", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Open live demo <ArrowUpRight size={14} />
            </a>
          )}
          <Link href="/#projects"
            style={{ padding: "13px 26px", borderRadius: 100, border: "1px solid var(--border-mid)", color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> All projects
          </Link>
        </div>
      </article>

      {/* ── Next project ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 32 }}>Next project</p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${others.length > 2 ? 3 : others.length}, 1fr)`, gap: 1, background: "var(--border)" }}>
            {projects.filter(p => p.slug !== project.slug).map((p) => {
              const nextAccent = accentColors[p.slug] ?? "var(--accent)";
              return (
                <Link key={p.slug} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
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
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
