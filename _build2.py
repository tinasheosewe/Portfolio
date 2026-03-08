#!/usr/bin/env python3
"""Writes homepage + case study page."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def w(path: str, content: str) -> None:
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(content)
    print(f"✓  {path}")

# ─────────────────────────────────────────────────────────────────────────────
# app/page.tsx  — awwwards-style homepage
# ─────────────────────────────────────────────────────────────────────────────
w("app/page.tsx", """"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { projects } from "@/lib/projects";

// ── Animated headline word by word ──────────────────────────────────────────
function AnimWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span style={{ overflow: "hidden", display: "inline-block", marginRight: "0.22em" }}>
      <motion.span
        display="inline-block"
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
const MARQUEE_ITEMS = ["FastAPI","Next.js","LangGraph","Swift","RAG","ChromaDB","PostgreSQL","Framer Motion","Python","TypeScript","GPT-4o","LangChain","SQLAlchemy","Docker"];

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

function ProjectRow({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "28px 0",
          display: "grid",
          gridTemplateColumns: "60px 1fr auto",
          alignItems: "center",
          gap: 24,
          transition: "padding .3s ease",
          paddingLeft: hovered ? 20 : 0,
          paddingRight: hovered ? 8 : 0,
        }}
      >
        {/* Number */}
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
          {num}
        </span>

        {/* Title + tags */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: hovered ? accentMap[project.slug] ?? "var(--accent)" : "var(--text-primary)",
              transition: "color .25s ease",
            }}>
              {project.title}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 400 }}>
              {project.tagline}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {project.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{ fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow + status */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 120 }}>
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
          <span style={{
            fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase",
            color: project.status === "live" ? "#4ade80" : project.status === "ios" ? "#a78bfa" : "var(--accent)",
          }}>
            {project.statusLabel}
          </span>
        </div>
      </motion.div>
    </Link>
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

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const words = ["Full-stack", "engineer.", "AI", "products.", "Shipped."];

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactForm) });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setFormError("Something went wrong. Email me at tinashe.osewe@gmail.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Amber radial glow top-right */}
        <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,150,12,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Available pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "5px 14px", borderRadius: 100, border: "1px solid var(--border-mid)", background: "var(--bg-card)" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", display: "inline-block" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--text-secondary)", textTransform: "uppercase" }}>Available for work</span>
          </motion.div>

          {/* Big headline */}
          <h1 style={{ fontSize: "clamp(48px, 8.5vw, 120px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", margin: "0 0 32px" }}>
            <div>{words.slice(0, 2).map((w, i) => <AnimWord key={i} word={w} delay={0.35 + i * 0.08} />)}</div>
            <div>
              {words.slice(2, 4).map((w, i) => <AnimWord key={i} word={w} delay={0.5 + i * 0.08} />)}
              <span style={{ color: "var(--accent)" }}>
                <AnimWord word={words[4]} delay={0.68} />
              </span>
            </div>
          </h1>

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

          {/* Scroll hint */}
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
      <section id="projects" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Selected Work</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Things I&apos;ve built.</h2>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.7 }}>
            End-to-end systems — from LLM pipelines to native iOS apps. Each one shipped and live.
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
              <ProjectRow project={project} index={i} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { value: 14700, suffix: "+", label: "NYC listings processed daily" },
            { value: 15, label: "Scoring dimensions" },
            { value: 4, label: "LLM providers supported" },
            { value: 4, label: "Live products shipped" },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none", paddingLeft: i > 0 ? 40 : 0 }}>
              <Stat value={s.value} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>About</p>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, margin: "0 0 28px" }}>
                I build things<br />that work.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.95rem", margin: "0 0 18px" }}>
                Full-stack engineer with deep experience across the entire stack — Python backends, React frontends, native iOS, and AI systems. I care about the architecture as much as the shipping.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.95rem", margin: 0 }}>
                My work spans LLM pipelines (RAG, agents, knowledge graphs), data engineering (ETL, scoring engines, geospatial), scraping infrastructure, and native iOS development.
              </p>
            </motion.div>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              {[
                { label: "Languages", value: "Python · TypeScript · Swift" },
                { label: "Frameworks", value: "FastAPI · Next.js · SwiftUI · LangChain" },
                { label: "AI / ML", value: "LangGraph · RAG · ChromaDB · BM25 · GPT-4o" },
                { label: "Data", value: "PostgreSQL · SQLite · SQLAlchemy" },
                { label: "Infrastructure", value: "Docker · Render · Vercel · XcodeGen" },
              ].map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid var(--border)", gap: 24 }}
                >
                  <span style={{ fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "right" }}>{value}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ borderTop: "1px solid var(--border)", padding: "100px 40px 120px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Contact</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 14px" }}>Let&apos;s talk.</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>Open to full-time engineering roles, interesting contracts, and hard problems.</p>
          </motion.div>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "28px", borderRadius: 16, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", color: "#4ade80", textAlign: "center" }}>
              Message sent. I&apos;ll get back to you soon.
            </motion.div>
          ) : (
            <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <button type="submit" disabled={sending} style={{ marginTop: 4, padding: "15px 32px", borderRadius: 100, background: "var(--accent)", color: "#080808", fontWeight: 700, fontSize: "0.875rem", border: "none", transition: "opacity .2s", opacity: sending ? 0.65 : 1 }}>
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 52 }}>
            <a href="https://linkedin.com/in/tinasheosewe" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href="mailto:tinashe.osewe@gmail.com" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Mail size={15} /> tinashe.osewe@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "24px 40px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()} Tinashe Osewe</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Built with Next.js</span>
      </footer>
    </main>
  );
}
""")

print("\\n✓ All page files written.")
