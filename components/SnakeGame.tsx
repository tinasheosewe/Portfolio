"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Types ── */
type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const CELL = 20; // px per cell
const COLS = 20;
const ROWS = 20;
const TICK_MS = 110; // game speed

const opposite: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* ── Game state (refs for the game loop, state for re-renders) ── */
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>(randomFood(snakeRef.current));
  const loopRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<"idle" | "playing" | "over">("idle");

  /* ── Scaling ── */
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (!wrapRef.current) return;
    const maxW = wrapRef.current.clientWidth;
    const gameW = COLS * CELL;
    setScale(Math.min(1, maxW / gameW));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  /* ── Drawing ── */
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const w = COLS * CELL;
    const h = ROWS * CELL;

    // Read CSS variables from the document
    const style = getComputedStyle(document.documentElement);
    const bgColor = style.getPropertyValue("--bg-card").trim() || "#111";
    const gridColor = style.getPropertyValue("--border").trim() || "#1c1c1c";
    const snakeColor = style.getPropertyValue("--accent").trim() || "#e8960c";
    const headColor = style.getPropertyValue("--text-primary").trim() || "#f2ede8";
    const foodColor = snakeColor;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = gridColor;
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath();
        ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Food – pulsing glow
    const food = foodRef.current;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
    ctx.shadowColor = foodColor;
    ctx.shadowBlur = 8 + pulse * 6;
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.roundRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? headColor : snakeColor;
      ctx.globalAlpha = isHead ? 1 : 0.9 - (i / snake.length) * 0.4;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, isHead ? 5 : 3);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }, []);

  /* ── Game loop ── */
  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    const head = { ...snake[0] };
    if (dir === "UP") head.y -= 1;
    if (dir === "DOWN") head.y += 1;
    if (dir === "LEFT") head.x -= 1;
    if (dir === "RIGHT") head.x += 1;

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      setStatus("over");
      return;
    }
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      setStatus("over");
      return;
    }

    const newSnake = [head, ...snake];
    const food = foodRef.current;

    if (head.x === food.x && head.y === food.y) {
      foodRef.current = randomFood(newSnake);
      setScore(prev => {
        const next = prev + 1;
        setBest(b => Math.max(b, next));
        return next;
      });
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  /* ── Start / restart ── */
  const start = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setStatus("playing");
    draw();
  }, [draw]);

  /* ── Run the interval when playing ── */
  useEffect(() => {
    if (status === "playing") {
      loopRef.current = window.setInterval(tick, TICK_MS);
    }
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [status, tick]);

  /* ── Keyboard controls ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();

      if (status === "idle" || status === "over") {
        start();
        nextDirRef.current = dir;
        return;
      }
      if (dir !== opposite[dirRef.current]) {
        nextDirRef.current = dir;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, start]);

  /* ── Touch / swipe controls ── */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let startX = 0, startY = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap → start if idle/over
        if (status === "idle" || status === "over") start();
        return;
      }
      let dir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        dir = dy > 0 ? "DOWN" : "UP";
      }
      if (status === "idle" || status === "over") {
        start();
        nextDirRef.current = dir;
      } else if (dir !== opposite[dirRef.current]) {
        nextDirRef.current = dir;
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [status, start]);

  /* ── Initial draw ── */
  useEffect(() => { draw(); }, [draw]);

  /* ── Animated food glow when playing ── */
  useEffect(() => {
    if (status !== "playing") return;
    let raf: number;
    const animate = () => { draw(); raf = requestAnimationFrame(animate); };
    // We already have the interval for tick, but we want smooth food glow
    // Actually the tick already calls draw — let's only add the raf for the glow
    // The tick interval handles game logic + draw; the raf only re-draws for glow
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [status, draw]);

  const gameW = COLS * CELL;
  const gameH = ROWS * CELL;

  return (
    <div ref={wrapRef} style={{ width: "100%", maxWidth: gameW, margin: "0 auto" }}>
      {/* Score bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12, fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.8rem", color: "var(--text-muted)",
        transform: `scale(${scale})`, transformOrigin: "top left",
        width: gameW,
      }}>
        <span>Score: <strong style={{ color: "var(--accent)" }}>{score}</strong></span>
        <span>Best: <strong style={{ color: "var(--text-primary)" }}>{best}</strong></span>
      </div>

      {/* Canvas wrapper with border */}
      <div style={{
        position: "relative",
        width: gameW * scale,
        height: gameH * scale,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        <canvas
          ref={canvasRef}
          width={gameW}
          height={gameH}
          style={{
            display: "block",
            width: gameW * scale,
            height: gameH * scale,
            borderRadius: 8,
          }}
        />

        {/* Overlay for idle / game over */}
        {status !== "playing" && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", borderRadius: 8,
          }}>
            {status === "over" && (
              <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.3rem", margin: "0 0 4px" }}>
                Game Over
              </p>
            )}
            <p style={{ color: "var(--text-primary)", fontSize: "0.9rem", margin: 0, opacity: 0.8 }}>
              {status === "idle" ? "Arrow keys or swipe to start" : `Score: ${score}`}
            </p>
            {status === "over" && (
              <button
                onClick={start}
                style={{
                  marginTop: 16, padding: "8px 20px", borderRadius: 6,
                  border: "1px solid var(--accent)", background: "transparent",
                  color: "var(--accent)", fontWeight: 600, fontSize: "0.85rem",
                  transition: "background .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-dim)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Play again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile d-pad hint */}
      <p style={{
        textAlign: "center", marginTop: 16,
        fontSize: "0.75rem", color: "var(--text-muted)",
        fontFamily: "var(--font-mono, monospace)",
      }}>
        WASD / Arrow keys · Swipe on mobile
      </p>
    </div>
  );
}
