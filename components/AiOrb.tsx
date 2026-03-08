"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Configuration ── */
const CHAR_INTERVAL_MS = 35;
const HOLD_DURATION_MS = 5000;
const FIRST_DWELL_MS = 2000;
const LONG_DWELL_MS = 25000;
const MAX_WHISPERS_PER_SECTION = 2;
const MAX_TOTAL_WHISPERS = 8;

/* ── Time-of-day context ── */
function getTimeContext(): string {
  const h = new Date().getHours();
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  if (h < 6) return `It's deep night on a ${day}`;
  if (h < 9) return `It's early ${day} morning`;
  if (h < 12) return `It's ${day} mid-morning`;
  if (h < 14) return `It's ${day} around midday`;
  if (h < 17) return `It's ${day} afternoon`;
  if (h < 21) return `It's ${day} evening`;
  if (h < 23) return `It's late ${day} night`;
  return `It's near midnight on a ${day}`;
}

/* ── Behaviorally-aware prompt builder ── */
function buildPrompt(
  section: string,
  trigger: "enter" | "dwell" | "revisit" | "fast-scroll",
  scrollSpeed: "fast" | "slow" | "idle",
  dwellSeconds: number | null,
  priorWhispers: string[],
): string {
  const time = getTimeContext();
  const prior = priorWhispers.length
    ? `\nYou already said: ${priorWhispers.slice(-3).map((w) => `"${w}"`).join(", ")}. Don't repeat themes — evolve the narrative.`
    : "\nThis is your first observation this session.";

  const speed =
    scrollSpeed === "fast"
      ? " They've been scrolling quickly — hunting for something."
      : scrollSpeed === "slow"
        ? " They've been scrolling slowly, reading everything."
        : "";

  const triggers: Record<string, string> = {
    enter: `Visitor just arrived at the ${section} section.${speed}`,
    dwell: `Visitor has been studying the ${section} section for ${dwellSeconds ?? "a while"} seconds — they're clearly engaged.`,
    revisit: `Visitor scrolled BACK to the ${section} section. Something drew them back.`,
    "fast-scroll": `Visitor is racing through the site at high speed, barely pausing. Currently passing ${section}.`,
  };

  const sectionHints: Record<string, Record<string, string>> = {
    hero: {
      enter: "Confident, intriguing greeting. Be cool, not corporate.",
      dwell: "They're lingering on the landing — impressed or studying the design.",
      revisit: "They came back to the top. Say something about that.",
    },
    projects: {
      enter: "Sharp observation about the calibre or range of work shown.",
      dwell: "They're examining projects closely. Reference the depth.",
      revisit: "They returned to projects. Something specific caught their eye.",
    },
    about: {
      enter: "Something knowing about the finance-to-engineering arc.",
      dwell: "They're deep in the About section. Say something about the person behind the work.",
      revisit: "They came back to learn more. That's telling.",
    },
    contact: {
      enter: "One compelling line to make them reach out. Be direct.",
      dwell: "They're sitting on Contact but haven't acted. Gentle nudge.",
      revisit: "They returned to Contact. They're serious.",
    },
  };

  const hint =
    sectionHints[section]?.[trigger] || sectionHints[section]?.enter || "";

  return `${time}. ${triggers[trigger] || triggers.enter} ${hint}${prior}`.trim();
}

/* ══════════════════════════════════════════════════════════════════ */

export default function AiOrb() {
  const [displayedChars, setDisplayedChars] = useState<string[]>([]);
  const [orbState, setOrbState] = useState<"rest" | "thinking" | "speaking">(
    "rest",
  );
  const [whisperVisible, setWhisperVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  /* ── Behavioral tracking ── */
  const currentSectionRef = useRef<string | null>(null);
  const sectionEntryTimeRef = useRef<Record<string, number>>({});
  const sectionWhisperCountRef = useRef<Map<string, number>>(new Map());
  const totalWhispersRef = useRef(0);
  const priorWhispersRef = useRef<string[]>([]);
  const visitedSectionsRef = useRef<Set<string>>(new Set());
  const hasSpokenFastScrollRef = useRef(false);

  /* ── Scroll speed ── */
  const scrollSpeedRef = useRef<"fast" | "slow" | "idle">("idle");
  const lastScrollYRef = useRef(0);
  const scrollDeltasRef = useRef<number[]>([]);

  /* ── Streaming ── */
  const charBufferRef = useRef<string[]>([]);
  const charIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const speakingRef = useRef(false);

  /* ── Touch detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ── Scroll speed measurement ── */
  useEffect(() => {
    if (isTouch) return;
    let rafId: number;
    const measure = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollYRef.current);
      lastScrollYRef.current = y;
      scrollDeltasRef.current.push(delta);
      if (scrollDeltasRef.current.length > 10) scrollDeltasRef.current.shift();
      const avg =
        scrollDeltasRef.current.reduce((a, b) => a + b, 0) /
        scrollDeltasRef.current.length;
      scrollSpeedRef.current = avg > 40 ? "fast" : avg > 5 ? "slow" : "idle";
      rafId = requestAnimationFrame(measure);
    };
    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [isTouch]);

  /* ── Character reveal interval ── */
  const startCharReveal = useCallback(() => {
    if (charIntervalRef.current) return;
    charIntervalRef.current = setInterval(() => {
      if (charBufferRef.current.length > 0) {
        const char = charBufferRef.current.shift()!;
        setDisplayedChars((prev) => [...prev, char]);
      }
    }, CHAR_INTERVAL_MS);
  }, []);

  const stopCharReveal = useCallback(() => {
    if (charIntervalRef.current) {
      clearInterval(charIntervalRef.current);
      charIntervalRef.current = null;
    }
    if (charBufferRef.current.length > 0) {
      setDisplayedChars((prev) => [...prev, ...charBufferRef.current]);
      charBufferRef.current = [];
    }
  }, []);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (charIntervalRef.current) clearInterval(charIntervalRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      Object.values(dwellTimersRef.current).forEach(clearTimeout);
      abortRef.current?.abort();
    };
  }, []);

  /* ── Stream a whisper from the API ── */
  const speak = useCallback(
    async (
      section: string,
      trigger: "enter" | "dwell" | "revisit" | "fast-scroll",
    ) => {
      if (speakingRef.current || totalWhispersRef.current >= MAX_TOTAL_WHISPERS)
        return;
      const count = sectionWhisperCountRef.current.get(section) ?? 0;
      if (count >= MAX_WHISPERS_PER_SECTION) return;

      speakingRef.current = true;
      totalWhispersRef.current++;
      sectionWhisperCountRef.current.set(section, count + 1);

      abortRef.current?.abort();
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

      charBufferRef.current = [];
      setDisplayedChars([]);
      setOrbState("thinking");
      setWhisperVisible(true);

      abortRef.current = new AbortController();

      const dwellSec = sectionEntryTimeRef.current[section]
        ? Math.round(
            (Date.now() - sectionEntryTimeRef.current[section]) / 1000,
          )
        : null;

      const prompt = buildPrompt(
        section,
        trigger,
        scrollSpeedRef.current,
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
          setOrbState("rest");
          setWhisperVisible(false);
          speakingRef.current = false;
          return;
        }

        setOrbState("speaking");
        startCharReveal();

        const reader = res.body?.getReader();
        if (!reader) {
          setOrbState("rest");
          setWhisperVisible(false);
          speakingRef.current = false;
          return;
        }

        const decoder = new TextDecoder();
        let full = "";

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
                full += parsed.content;
                for (const c of parsed.content) charBufferRef.current.push(c);
              }
            } catch {
              continue;
            }
          }
        }

        // Wait for character buffer to drain
        await new Promise<void>((resolve) => {
          const check = setInterval(() => {
            if (charBufferRef.current.length === 0) {
              clearInterval(check);
              resolve();
            }
          }, 50);
        });

        stopCharReveal();
        priorWhispersRef.current.push(full.trim());

        // Hold the text, then dismiss
        holdTimerRef.current = setTimeout(() => {
          setWhisperVisible(false);
          setTimeout(() => {
            setDisplayedChars([]);
            setOrbState("rest");
            speakingRef.current = false;
          }, 800);
        }, HOLD_DURATION_MS);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setOrbState("rest");
        setWhisperVisible(false);
        speakingRef.current = false;
      }
    },
    [startCharReveal, stopCharReveal],
  );

  /* ── Section change handler ── */
  const onSectionChange = useCallback(
    (section: string, entering: boolean) => {
      if (entering) {
        const wasVisited = visitedSectionsRef.current.has(section);
        const prevSection = currentSectionRef.current;
        currentSectionRef.current = section;
        sectionEntryTimeRef.current[section] = Date.now();
        visitedSectionsRef.current.add(section);

        const count = sectionWhisperCountRef.current.get(section) ?? 0;
        if (count >= MAX_WHISPERS_PER_SECTION) return;

        if (wasVisited && prevSection !== section) {
          // Revisit
          dwellTimersRef.current[`${section}:revisit`] = setTimeout(() => {
            if (currentSectionRef.current === section) {
              speak(section, "revisit");
            }
          }, 1500);
        } else if (!wasVisited) {
          // First visit — after dwell
          dwellTimersRef.current[section] = setTimeout(() => {
            if (currentSectionRef.current === section) {
              speak(section, "enter");
            }
          }, FIRST_DWELL_MS);

          // Long dwell — second whisper
          dwellTimersRef.current[`${section}:dwell`] = setTimeout(() => {
            if (currentSectionRef.current === section) {
              speak(section, "dwell");
            }
          }, LONG_DWELL_MS);
        }
      } else {
        // Leaving section — clear its timers
        if (currentSectionRef.current === section) {
          currentSectionRef.current = null;
        }
        clearTimeout(dwellTimersRef.current[section]);
        clearTimeout(dwellTimersRef.current[`${section}:dwell`]);
        clearTimeout(dwellTimersRef.current[`${section}:revisit`]);
      }
    },
    [speak],
  );

  /* ── IntersectionObserver ── */
  useEffect(() => {
    if (isTouch) return;
    const observers: IntersectionObserver[] = [];
    const timer = setTimeout(() => {
      for (const id of ["hero", "projects", "about", "contact"]) {
        const el = document.getElementById(id);
        if (!el) continue;
        const sid = id;
        const observer = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              onSectionChange(sid, e.isIntersecting);
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
    };
  }, [isTouch, onSectionChange]);

  /* ── Fast-scroll whisper ── */
  useEffect(() => {
    if (isTouch) return;
    const check = setInterval(() => {
      if (
        scrollSpeedRef.current === "fast" &&
        !hasSpokenFastScrollRef.current &&
        !speakingRef.current &&
        currentSectionRef.current &&
        totalWhispersRef.current < MAX_TOTAL_WHISPERS
      ) {
        hasSpokenFastScrollRef.current = true;
        speak(currentSectionRef.current, "fast-scroll");
      }
    }, 3000);
    return () => clearInterval(check);
  }, [isTouch, speak]);

  if (isTouch) return null;

  return (
    <>
      {/* ── Orb — stays in place, color changes by state ── */}
      <div
        className={`ai-orb ${orbState}`}
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

      {/* ── Characters emerging from orb — grow leftward ── */}
      <AnimatePresence>
        {whisperVisible && displayedChars.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            style={{
              position: "fixed",
              bottom: 40,
              right: 76,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              maxWidth: "min(60vw, 620px)",
              pointerEvents: "none",
              zIndex: 9989,
            }}
          >
            {displayedChars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                  textShadow:
                    "0 0 20px var(--bg), 0 0 40px var(--bg), 0 0 60px var(--bg)",
                  whiteSpace: "pre",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
