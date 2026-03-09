import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tinashe Osewe — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 100px",
          background: "#080808",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 40 }}>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#f2ede8", letterSpacing: "0.05em" }}>
            TO
          </span>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#e8960c" }}>.</span>
        </div>

        <div style={{ fontSize: 52, fontWeight: 700, color: "#f2ede8", lineHeight: 1.2, marginBottom: 24 }}>
          Tinashe Osewe
        </div>

        <div style={{ fontSize: 28, color: "#7a7570", lineHeight: 1.5, maxWidth: 800 }}>
          Software engineer building AI-powered products end to end.
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["FastAPI", "Next.js", "LangChain", "Swift", "TypeScript"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid #292929",
                color: "#7a7570",
                fontSize: 18,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
