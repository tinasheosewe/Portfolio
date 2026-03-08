"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Time-of-day context for prompt ── */
function getTimeContext(): string {
  const h = new Date().getHours();
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  if (h >= 0 && h < 6) return `It's ${day}, ${h === 0 ? 12 : h}AM. Deep-night browsing.`;
  if (h < 9) return `It's ${day} early morning.`;
  if (h < 12) return `It's ${day} mid-morning.`;
  if (h < 14) return `It's ${day} around lunch.`;
  if (h < 17) return `It's ${day} afternoon.`;
  if (h < 21) return `It's ${day} evening.`;
  return `It's ${day}, ${h > 12 ? h - 12 : h}PM. Late night.`;
}

/* ── Build behaviorally-aware prompt ── */
function buildPrompt(
  section: string,
  scrollSpeed: "fast" | "slow" | "normal",
  isDwell: boolean,
  dwellSeconds: number | null,
  priorWhispers: string[],
): string {
  const time = getTimeContext();
  const prior = priorWhispers.length
    ? `\nYou already said: ${priorWhispers.map((w) => `"${w}"`).join(", ")}. Don't repeat themes or structure.`
    : "";
  const speed =
    scrollSpeed === "fast"
      ? " They scrolled here fast — they're hunting."
      : scrollSpeed === "slow"
        ? " They scrolled slowly, reading carefully."
        : "";
  const dwell =
    isDwell && dwellSeconds
      ? ` They've been on this section for ${Math.round(dwellSeconds)} seconds.`
      : "";

  const base: Record<string, string> = {
    hero: "Visitor just landed. Confident, intriguing greeting. Be cool, not corporate.",
    projects: "Visitor is viewing projects. Sharp observation about the work's calibre or range.",
    about: "Visitor reading About. Something knowing about the finance-to-engineering arc.",
    contact: "Visitor reached Contact. One compelling line to make them reach out.",
  };
  const dwellBase: Record<string, string> = {
    hero: "They're still on the landing — impressed or studying the design.",
    projects: "They're examining projects closely. Reference something specific about the depth.",
    about: "They're lingering on About. Say something deeper about the person behind the work.",
    contact: "They're sitting on Contact but haven't acted. Gentle nudge.",
  };

  const prompt = isDwell ? dwellBase[section] || base[section] : base[section];
  return `${time}${speed}${dwell} ${prompt}${prior}`.trim();
}

/* ══════════════════════════════════════════════════════════════════ */

export default function AiOrb() {
  const [displayText, setDisplayText] = useState("");
  const [isRisen, setIsRisen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const spokenRef = useRef<Set<string>>(new Set());
  const priorWhispersRef = useRef<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charQueueRef = useRef<string[]>([]);
  const charTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullTextRef = useRef("");
  const scrollEventsRef = useRef<number[]>([]);
  const sectionEntryRef = useRef<Record<string, number>>({});

  /* ── Touch detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ── Scroll-velocity tracker ── */
  useEffect(() => {
    const onScroll = () => {
      scrollEventsRef.current.push(Date.now());
      const cutoff = Date.now() - 2000;
      scrollEventsRef.current = scrollEventsRef.current.filter((t) => t > cutoff);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function getScrollSpeed(): "fast" | "slow" | "normal" {
    const n = scrollEventsRef.current.length;
    if (n > 30) return "fast";
    if (n < 8) return "slow";
    return "normal";
  }

  /* ── Character drip: buffer SSE chunks → emit char-by-char ── */
  const startCharDrip = useCallback(() => {
    if (charTimerRef.current) clearInterval(charTimerRef.current);
    charTimerRef.current = setInterval(() => {
      if (charQueueRef.current.length > 0) {
        const ch = charQueueRef.current.shift()!;
        fullTextRef.current += ch;
        setDisplayText(fullTextRef.current);
      }
    }, 38); // 38ms per char — deliberate, visible pace
  }, []);

  const stopCharDrip = useCallback(() => {
    if (charTimerRef.current) {
      clearInterval(charTimerRef.current);
      charTimerRef.current = null;
    }
    if (charQueueRef.current.length > 0) {
      fullTextRef.current += charQueueRef.current.join("");
      charQueueRef.current = [];
      setDisplayText(fullTextRef.current);
    }
  }, []);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (charTimerRef.current) clearInterval(charTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  /* ── Stream a whisper from the API ── */
  const speak = useCallback(
    async (section: string, isDwell = false) => {
      const key = isDwell ? `${section}:dwell` : section;
      if (spokenRef.current.has(key)) return;
      spokenRef.current.add(key);

      // Cancel in-flight
      abortRef.current?.abort();
      stopCharDrip();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

      // Reset state
      fullTextRef.current = "";
      charQueueRef.current = [];
      setDisplayText("");
      setStreaming(true);
      setIsRisen(true);
      startCharDrip();

      abortRef.current = new AbortController();

      const dwellSec = sectionEntryRef.current[section]
        ? (Date.now() - sectionEntryRef.current[section]) / 1000
        : null;
      const prompt = buildPrompt(
        section,
        getScrollSpeed(),
        isDwell,
        dwellSec,
        priorWhispersRef.current,
      );

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, mode: "whisper" }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          setIsRisen(false);
          setStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setIsRisen(false);
          setStreaming(false);
          return;
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              if (parsed.content) {
                for (const ch of parsed.content) charQueueRef.current.push(ch);
              }
            } catch {
              continue;
            }
          }
        }

        // Wait for the character queue to fully drain
        await new Promise<void>((resolve) => {
          const check = setInterval(() => {
            if (charQueueRef.current.length === 0) {
              clearInterval(check);
              resolve();
            }
          }, 50);
        });

        stopCharDrip();
        setStreaming(false);
        priorWhispersRef.current.push(fullTextRef.current);

        // Hold for reading, then descend
        hideTimerRef.current = setTimeout(() => {
          setIsRisen(false);
          // Clear text after slide-down animation
          setTimeout(() => {
            setDisplayText("");
            fullTextRef.current = "";
          }, 700);
        }, 5000);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setIsRisen(false);
        setStreaming(false);
      }
    },
    [startCharDrip, stopCharDrip],
  );

  /* ── Observe sections entering viewport ── */
  useEffect(() => {
    let observers: IntersectionObserver[] = [];
    const dwellTimers: Record<string, ReturnType<typeof setTimeout>> = {};

    const timer = setTimeout(() => {
      const sections = ["hero", "projects", "about", "contact"];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                if (!sectionEntryRef.current[id])
                  sectionEntryRef.current[id] = Date.now();
                if (!spokenRef.current.has(id)) speak(id);
                // Dwell whisper after 25 seconds
                if (!spokenRef.current.has(`${id}:dwell`)) {
                  dwellTimers[id] = setTimeout(() => speak(id, true), 25000);
                }
              } else {
                delete sectionEntryRef.current[id];
                if (dwellTimers[id]) {
                  clearTimeout(dwellTimers[id]);
                  delete dwellTimers[id];
                }
              }
            }
          },
          { threshold: 0.3 },
        );

        observer.observe(el);
        observers.push(observer);
      }
    }, 2800);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
      observers = [];
      Object.values(dwellTimers).forEach((t) => clearTimeout(t));
    };
  }, [speak]);

  if (isTouch) return null;

  return (
    <>
      {/* ── The Orb — always visible ── */}
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

      {/* ── Whisper text — rises from below, chars flow left from orb ── */}
      <motion.div
        animate={{ y: isRisen ? 0 : 50, opacity: isRisen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        style={{
          position: "fixed",
          bottom: 40,
          right: 82,
          zIndex: 9990,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            margin: 0,
            fontStyle: "italic",
            letterSpacing: "0.01em",
            textAlign: "right",
            whiteSpace: "nowrap",
            textShadow:
              "0 1px 12px var(--bg), 0 0 30px var(--bg), 0 0 60px var(--bg)",
          }}
        >
          {displayText}
          {streaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                color: "var(--accent)",
                marginLeft: 2,
                fontStyle: "normal",
              }}
            >
              ▎
            </motion.span>
          )}
        </p>
      </motion.div>
    </>
  );
}
