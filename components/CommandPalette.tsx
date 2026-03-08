"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlockRenderer from "./blocks/BlockRenderer";
import type { Block } from "@/lib/block-types";

/* ── Suggested prompts ── */
const SUGGESTIONS = [

  "Compare AptHunt and Persona’s architectures",
  "Why should I hire Tinashe?",
  "Show me the tech stack",
];

/* ── Types ── */
interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [prose, setProse] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard shortcut: ⌘K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Focus input when palette opens ── */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Pause Lenis scroll when palette is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── Auto-scroll results ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [prose, blocks, status]);

  /* ── Submit query ── */
  const submit = useCallback(
    async (text?: string) => {
      const q = (text || query).trim();
      if (!q || loading) return;

      setLoading(true);
      setStatus("Connecting…");
      setProse("");
      setBlocks([]);
      setError("");
      setHasResult(false);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, history }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Error ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const payload = trimmed.slice(6);

            if (payload === "[DONE]") continue;

            try {
              const evt = JSON.parse(payload);
              switch (evt.type) {
                case "status":
                  setStatus(evt.message);
                  break;
                case "prose":
                  setProse(evt.content);
                  setStatus("");
                  setHasResult(true);
                  break;
                case "blocks":
                  setBlocks(evt.blocks || []);
                  break;
                case "error":
                  setError(evt.message);
                  setStatus("");
                  break;
              }
            } catch {
              /* skip unparseable lines */
            }
          }
        }

        // Update history
        setHistory((prev) => [
          ...prev.slice(-4),
          { role: "user", content: q },
          { role: "assistant", content: prose || "(responded with blocks)" },
        ]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("");
      } finally {
        setLoading(false);
        setQuery("");
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [query, loading, history, prose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <>
      {/* ── Trigger — expose global open function ── */}
      <CmdKGlobal onOpen={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <motion.div
            className="cmd-overlay"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="cmd-palette"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Input area ── */}
              <div className={`cmd-input-wrap${loading ? " cmd-input-wrap--locked" : ""}`}>
                <span className="cmd-input-icon">
                  {loading ? (
                    <svg className="cmd-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  )}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="cmd-input"
                  placeholder={loading ? "Generating response…" : "Ask this portfolio anything…"}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={loading}
                />
                <kbd className="cmd-kbd">esc</kbd>
              </div>

              {/* ── Results area ── */}
              <div className="cmd-results" ref={scrollRef}>
                {/* Suggested prompts — only when no result */}
                {!hasResult && !loading && !error && (
                  <motion.div
                    className="cmd-suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <p className="cmd-suggestions-label">Try asking</p>
                    <div className="cmd-suggestions-grid">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          className="cmd-suggestion-chip"
                          onClick={() => {
                            setQuery(s);
                            submit(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Status / thinking indicator */}
                {loading && status && (
                  <motion.div
                    className="cmd-status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={status}
                  >
                    <div className="cmd-status-dot" />
                    <span>{status}</span>
                  </motion.div>
                )}

                {/* Prose response */}
                {prose && (
                  <motion.div
                    className="cmd-prose"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{prose}</ReactMarkdown>
                  </motion.div>
                )}

                {/* Blocks */}
                {blocks.length > 0 && (
                  <div className="cmd-blocks">
                    {blocks.map((block, i) => (
                      <BlockRenderer key={`${block.type}-${i}`} block={block} index={i} />
                    ))}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    className="cmd-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="cmd-footer">
                <span>
                  Powered by AI · Responses may vary
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Expose open function globally for Nav/Hero hints ── */
function CmdKGlobal({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    (window as unknown as { __openCommandPalette: () => void }).__openCommandPalette = onOpen;
  }, [onOpen]);
  return null;
}
