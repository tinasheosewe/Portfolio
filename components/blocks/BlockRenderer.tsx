"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Block } from "@/lib/block-types";
import { projects } from "@/lib/projects";

const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), { ssr: false });

/* ── Stagger animation wrapper ── */
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ── Block Renderer ── */
export default function BlockRenderer({ block, index }: { block: Block; index: number }) {
  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.1 }}
      style={{ width: "100%" }}
    >
      {renderBlock(block)}
    </motion.div>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "prose":
      return <ProseBlock content={block.content} />;
    case "projectCard":
      return <ProjectCardBlock slug={block.slug} emphasis={block.emphasis} />;
    case "metricRow":
      return <MetricRowBlock items={block.items} />;
    case "diagram":
      return <MermaidDiagram chart={block.mermaid} caption={block.caption} />;
    case "codeBlock":
      return <CodeBlockBlock language={block.language} code={block.code} caption={block.caption} />;
    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} />;
    case "callout":
      return <CalloutBlock variant={block.variant} content={block.content} />;
    case "skillCloud":
      return <SkillCloudBlock skills={block.skills} highlight={block.highlight} />;
    case "timeline":
      return <TimelineBlock items={block.items} />;
    case "beforeAfter":
      return <BeforeAfterBlock title={block.title} left={block.left} right={block.right} />;
    default:
      return null;
  }
}

/* ── Prose ── */
function ProseBlock({ content }: { content: string }) {
  return (
    <div className="cmd-block-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

/* ── Project Card ── */
function ProjectCardBlock({ slug, emphasis }: { slug: string; emphasis: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  return (
    <a
      href={project.liveUrl || `#projects`}
      target={project.liveUrl ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="cmd-block-project-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {project.title}
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {project.tagline}
          </p>
        </div>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: project.status === "live" ? "var(--status-live)" : "var(--status-ios)",
            whiteSpace: "nowrap",
            padding: "3px 8px",
            borderRadius: 100,
            border: `1px solid ${project.status === "live" ? "var(--status-live)" : "var(--status-ios)"}`,
            opacity: 0.8,
          }}
        >
          {project.statusLabel}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {project.tags.slice(0, 5).map((t) => (
          <span key={t} className="cmd-tag">{t}</span>
        ))}
      </div>
      {emphasis && (
        <p style={{ margin: "8px 0 0", fontSize: "0.72rem", color: "var(--accent)", fontStyle: "italic" }}>
          \u2192 {emphasis}
        </p>
      )}
    </a>
  );
}

/* ── Metric Row ── */
function MetricRowBlock({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="cmd-block-metrics">
      {items.map((m, i) => (
        <div key={i} className="cmd-metric">
          <span className="cmd-metric-value">{m.value}</span>
          <span className="cmd-metric-label">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Code Block ── */
function CodeBlockBlock({ language, code, caption }: { language: string; code: string; caption: string }) {
  return (
    <div className="cmd-block-code">
      <div className="cmd-code-header">
        <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          {language}
        </span>
        {caption && <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{caption}</span>}
      </div>
      <pre style={{ margin: 0, overflow: "auto" }}>
        <code style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.78rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ── Table ── */
function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="cmd-block-table-wrap">
      <table className="cmd-block-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Callout ── */
function CalloutBlock({ variant, content }: { variant: "info" | "tip" | "insight"; content: string }) {
  const icons: Record<string, string> = { info: "\u2139\uFE0F", tip: "\uD83D\uDCA1", insight: "\u2728" };
  const labels: Record<string, string> = { info: "Info", tip: "Tip", insight: "Insight" };

  return (
    <div className={`cmd-block-callout cmd-block-callout--${variant}`}>
      <div className="cmd-callout-header">
        <span>{icons[variant] || "\u2139\uFE0F"}</span>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {labels[variant] || "Note"}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{content}</p>
    </div>
  );
}

/* ── Skill Cloud ── */
function SkillCloudBlock({ skills, highlight }: { skills: string[]; highlight: string[] }) {
  return (
    <div className="cmd-block-skills">
      {skills.map((s) => (
        <span key={s} className={`cmd-skill-tag ${highlight.includes(s) ? "cmd-skill-tag--active" : ""}`}>
          {s}
        </span>
      ))}
    </div>
  );
}

/* ── Timeline ── */
function TimelineBlock({ items }: { items: { date: string; title: string; detail: string }[] }) {
  return (
    <div className="cmd-block-timeline">
      {items.map((item, i) => (
        <div key={i} className="cmd-timeline-item">
          <div className="cmd-timeline-dot" />
          <div className="cmd-timeline-content">
            <span className="cmd-timeline-date">{item.date}</span>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{item.title}</strong>
            <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Before / After ── */
function BeforeAfterBlock({
  title,
  left,
  right,
}: {
  title: string;
  left: { heading: string; items: string[] };
  right: { heading: string; items: string[] };
}) {
  return (
    <div className="cmd-block-before-after">
      <h4 style={{ margin: "0 0 12px", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", textAlign: "center" }}>
        {title}
      </h4>
      <div className="cmd-ba-columns">
        <div className="cmd-ba-col cmd-ba-col--left">
          <span className="cmd-ba-heading">{left.heading}</span>
          <ul>
            {left.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="cmd-ba-divider" />
        <div className="cmd-ba-col cmd-ba-col--right">
          <span className="cmd-ba-heading">{right.heading}</span>
          <ul>
            {right.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
