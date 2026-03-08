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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#1c1c1c",
            primaryTextColor: "#f2ede8",
            primaryBorderColor: "#292929",
            lineColor: "#e8960c",
            secondaryColor: "#111111",
            tertiaryColor: "#161616",
            fontFamily: "var(--font-geist-sans), sans-serif",
          },
        });

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        console.error("[Mermaid]", e);
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="cmd-block-diagram cmd-block-diagram--error">
        <pre style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
          {chart}
        </pre>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          Diagram could not be rendered
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
