"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Section whisper prompts ── */
const SECTION_PROMPTS: Record<string, string> = {
  hero: "The visitor just landed on the portfolio. Give a confident, intriguing one-liner (under 12 words) as if the site is greeting them. No punctuation flourishes. Be cool, not corporate.",
  projects: "The visitor is now looking at the projects section. Make a sharp, brief observation (under 15 words) about the calibre or range of work shown. Sound impressed but understated.",
  about: "The visitor scrolled to the About section. Say something knowing and brief (under 15 words) about Tinashe's background — the finance-to-engineering arc, the end-to-end shipping mentality. Don't be generic.",
  contact: "The visitor reached the contact section. One compelling, short line (under 12 words) encouraging them to reach out. No cheese. Be direct.",
};

/* ── Component ── */
export default function AiOrb() {
  const [whisper, setWhisper] = useState("");
  const [visible, setVisible] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const spokenRef = useRef<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  /* Detect touch device */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ── Stream a whisper from the API ── */
  const speak = useCallback(async (section: string) => {
    if (spokenRef.current.has(section)) return;
    spokenRef.current.add(section);

    // Cancel any in-flight whisper
    abortRef.current?.abort();

    // Clear previous fade timer
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setWhisper("");
    setVisible(true);
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: SECTION_PROMPTS[section],
          mode: "whisper",
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        setVisible(false);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setVisible(false); setStreaming(false); return; }

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
              setWhisper(full);
            }
          } catch { continue; }
        }
      }

      setStreaming(false);

      // Auto-fade after 8 seconds
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, 8000);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setVisible(false);
      setStreaming(false);
    }
  }, []);

  /* ── Observe sections entering viewport ── */
  useEffect(() => {
    // Wait for preloader to finish
    const timer = setTimeout(() => {
      const sections = ["hero", "projects", "about", "contact"];
      const observers: IntersectionObserver[] = [];

      for (const id of sections) {
        let el: Element | null = document.getElementById(id);

        if (!el) continue;

        const sectionId = id; // capture for closure
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting && !spokenRef.current.has(sectionId)) {
                speak(sectionId);
              }
            }
          },
          { threshold: 0.3 }
        );

        observer.observe(el);
        observers.push(observer);
      }

      return () => {
        observers.forEach((o) => o.disconnect());
      };
    }, 2800);

    return () => clearTimeout(timer);
  }, [speak]);

  if (isTouch) return null;

  return (
    <>
      {/* ── The Orb ── */}
      <div
        className={`ai-orb${streaming ? " thinking" : ""}`}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: "50%",
          zIndex: 9990,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span className="ai-orb-glow" />
        <span className="ai-orb-core" />
      </div>

      {/* ── Whisper text ── */}
      <AnimatePresence>
        {visible && whisper && (
          <motion.div
            initial={{ opacity: 0, x: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 8, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 36,
              right: 90,
              maxWidth: 260,
              padding: "10px 16px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              zIndex: 9990,
              pointerEvents: "none",
            }}
          >
            <p style={{
              fontSize: "0.76rem",
              lineHeight: 1.55,
              color: "var(--text-secondary)",
              margin: 0,
              fontStyle: "italic",
              letterSpacing: "0.01em",
            }}>
              {whisper}
              {streaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  style={{ color: "var(--accent)", marginLeft: 1 }}
                >
                  ▊
                </motion.span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
