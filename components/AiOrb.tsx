"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What makes Tinashe different?",
  "What's the most complex project here?",
  "What AI/ML experience does he have?",
];

/* ── Component ── */
export default function AiOrb() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [navHint, setNavHint] = useState<string | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  /* Auto-scroll response */
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  /* Handle navigation hints from AI */
  useEffect(() => {
    if (navHint) {
      const el = document.getElementById(navHint);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 600);
      }
      setNavHint(null);
    }
  }, [navHint]);

  /* ── Send query ── */
  const send = useCallback(async (text?: string) => {
    const msg = (text ?? query).trim();
    if (!msg || streaming) return;

    setHasInteracted(true);
    setQuery("");
    setResponse("");
    setError(null);
    setStreaming(true);

    const newHistory = [...history, { role: "user" as const, content: msg }];

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.content) {
              full += parsed.content;
              setResponse(full);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      /* Extract nav hint if present */
      const navMatch = full.match(/\[NAV:(\w+)\]/);
      if (navMatch) {
        setNavHint(navMatch[1]);
        full = full.replace(/\n?\[NAV:\w+\]/, "").trim();
        setResponse(full);
      }

      setHistory([...newHistory, { role: "assistant", content: full }]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStreaming(false);
    }
  }, [query, streaming, history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const close = () => {
    abortRef.current?.abort();
    setOpen(false);
    setStreaming(false);
  };

  return (
    <>
      {/* ── The Orb ── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="ai-orb"
        aria-label="Ask the portfolio anything"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: open ? 0 : 1,
          scale: open ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: 0,
        }}
      >
        {/* Glow ring */}
        <span className="ai-orb-glow" />
        {/* Core */}
        <span className="ai-orb-core" />
        {/* Tooltip */}
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          whileHover={{ opacity: 1, x: 0 }}
          style={{
            position: "absolute",
            right: 62,
            whiteSpace: "nowrap",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          Ask me anything
        </motion.span>
      </motion.button>

      {/* ── Overlay panel ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 9999,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                position: "fixed",
                bottom: 28,
                right: 28,
                width: "min(420px, calc(100vw - 40px))",
                maxHeight: "min(520px, calc(100vh - 80px))",
                borderRadius: 20,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
                zIndex: 10000,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                padding: "16px 20px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="ai-orb-core" style={{ width: 10, height: 10, position: "relative" }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-primary)" }}>
                    Portfolio Intelligence
                  </span>
                </div>
                <button onClick={close} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "4px" }}>
                  ✕
                </button>
              </div>

              {/* Response area */}
              <div ref={responseRef} style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                minHeight: 120,
              }}>
                {!hasInteracted && !response && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 20px" }}>
                      This portfolio is alive. Ask it anything about Tinashe, his projects, his stack, or what makes him different.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {SUGGESTED.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          style={{
                            textAlign: "left",
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid var(--border)",
                            background: "none",
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all .2s",
                            lineHeight: 1.4,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent)";
                            e.currentTarget.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {response && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.75,
                      color: "var(--text-primary)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {response}
                    {streaming && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                        style={{ color: "var(--accent)" }}
                      >
                        ▊
                      </motion.span>
                    )}
                  </motion.div>
                )}

                {error && (
                  <p style={{ fontSize: "0.82rem", color: "#f87171", margin: "12px 0 0" }}>{error}</p>
                )}
              </div>

              {/* Input */}
              <div style={{
                padding: "12px 16px 16px",
                borderTop: "1px solid var(--border)",
              }}>
                <div style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={streaming ? "Thinking…" : "Ask the portfolio…"}
                    disabled={streaming}
                    maxLength={500}
                    style={{
                      flex: 1,
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "0.84rem",
                      outline: "none",
                      transition: "border-color .2s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                  <button
                    onClick={() => send()}
                    disabled={streaming || !query.trim()}
                    style={{
                      padding: "11px 16px",
                      borderRadius: 10,
                      background: query.trim() && !streaming ? "var(--accent)" : "var(--bg-card)",
                      color: query.trim() && !streaming ? "var(--btn-face)" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      cursor: query.trim() && !streaming ? "pointer" : "default",
                      transition: "all .2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ↵
                  </button>
                </div>
                <p style={{
                  fontSize: "0.62rem",
                  color: "var(--text-muted)",
                  margin: "8px 0 0",
                  textAlign: "center",
                  opacity: 0.6,
                }}>
                  Powered by GPT-4.1-mini · Built by Tinashe
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
