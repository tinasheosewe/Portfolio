import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}>
      <h1 style={{ fontSize: "5rem", fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>404</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          border: "1px solid var(--border-mid)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          textDecoration: "none",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        Back to home
      </Link>
    </main>
  );
}
