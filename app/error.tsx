"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>Something went wrong</h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 420, textAlign: "center" }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          border: "1px solid var(--border-mid)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        Try again
      </button>
    </main>
  );
}
