"use client";
import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
}

export default function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [theme, setTheme] = useState("");

  // Watch for theme changes on <html data-theme>
  useEffect(() => {
    const el = document.documentElement;
    setTheme(el.getAttribute("data-theme") || "dark");
    const observer = new MutationObserver(() => {
      setTheme(el.getAttribute("data-theme") || "dark");
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Pre-validation: skip obviously broken charts
    if (!chart || chart.trim().length < 10) {
      setError(true);
      setErrorMsg("Diagram too short or empty");
      return;
    }

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;

        // Read current theme colors from CSS custom properties
        const s = getComputedStyle(document.documentElement);
        const v = (prop: string) => s.getPropertyValue(prop).trim();

        const bg = v("--bg") || "#080808";
        const bgCard = v("--bg-card") || "#111111";
        const bgCardHover = v("--bg-card-hover") || "#161616";
        const border = v("--border") || "#1c1c1c";
        const borderMid = v("--border-mid") || "#292929";
        const textPrimary = v("--text-primary") || "#f2ede8";
        const textSecondary = v("--text-secondary") || "#7a7570";
        const textMuted = v("--text-muted") || "#3e3b38";
        const accent = v("--accent") || "#e8960c";

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "strict",
          themeVariables: {
            // Background & surfaces
            primaryColor: border,
            secondaryColor: bgCardHover,
            tertiaryColor: bgCard,
            mainBkg: border,
            secondBkg: bgCardHover,
            // Text
            primaryTextColor: textPrimary,
            secondaryTextColor: textSecondary,
            tertiaryTextColor: textSecondary,
            // Borders & lines
            primaryBorderColor: borderMid,
            secondaryBorderColor: borderMid,
            tertiaryBorderColor: borderMid,
            lineColor: textMuted,
            // Node colors
            nodeBorder: borderMid,
            nodeTextColor: textPrimary,
            // Flowchart
            clusterBkg: bgCard,
            clusterBorder: borderMid,
            // Sequence diagram
            actorBkg: border,
            actorBorder: borderMid,
            actorTextColor: textPrimary,
            actorLineColor: textMuted,
            signalColor: textPrimary,
            signalTextColor: textPrimary,
            labelBoxBkgColor: border,
            labelBoxBorderColor: borderMid,
            labelTextColor: textPrimary,
            loopTextColor: textSecondary,
            activationBorderColor: accent,
            activationBkgColor: border,
            noteBkgColor: bgCardHover,
            noteBorderColor: borderMid,
            noteTextColor: textSecondary,
            // Class & state
            classText: textPrimary,
            // Accent for highlights
            pie1: accent,
            pie2: "#a78bfa",
            pie3: "#4ade80",
            pie4: "#38bdf8",
            pie5: "#f472b6",
            pie6: "#f59e0b",
            // Font
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "13px",
            // Background
            background: bg,
          },
        });

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        // Race render against a 8s timeout
        const renderPromise = mermaid.render(id, chart);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Diagram render timed out")), 8000)
        );

        const { svg: rendered } = await Promise.race([renderPromise, timeoutPromise]);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        console.error("[Mermaid]", e);
        if (!cancelled) {
          setError(true);
          setErrorMsg(e instanceof Error ? e.message : "Unknown render error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, theme]);

  if (error) {
    return (
      <div className="cmd-block-diagram cmd-block-diagram--error">
        <pre style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
          {chart}
        </pre>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          Diagram could not be rendered{errorMsg ? ` — ${errorMsg}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="cmd-block-diagram">
      {svg ? (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: "100%", overflow: "auto" }}
        />
      ) : (
        <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          Rendering diagram…
        </div>
      )}
      {caption && (
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
          {caption}
        </p>
      )}
    </div>
  );
}
