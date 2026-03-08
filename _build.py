#!/usr/bin/env python3
"""Writes all portfolio source files for the awwwards-style redesign."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def w(path: str, content: str) -> None:
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(content)
    print(f"✓  {path}")

# ─────────────────────────────────────────────────────────────────────────────
# globals.css  (grain + full design system)
# ─────────────────────────────────────────────────────────────────────────────
w("app/globals.css", """@import "tailwindcss";

:root {
  --bg: #080808;
  --bg-card: #111111;
  --bg-card-hover: #161616;
  --border: #1c1c1c;
  --border-mid: #292929;
  --text-primary: #f2ede8;
  --text-secondary: #7a7570;
  --text-muted: #3e3b38;
  --accent: #e8960c;
  --accent-dim: rgba(232,150,12,0.12);
  --accent-glow: rgba(232,150,12,0.25);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; cursor: none; }
body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
a, button { cursor: none; }

/* Film grain */
.grain::after {
  content: "";
  position: fixed;
  inset: -200%;
  width: 400%;
  height: 400%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.038;
  pointer-events: none;
  z-index: 9000;
  animation: grain 0.5s steps(1) infinite;
}
@keyframes grain {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-2%,-3%)}
  20%{transform:translate(3%,2%)}
  30%{transform:translate(-1%,4%)}
  40%{transform:translate(2%,-1%)}
  50%{transform:translate(-3%,3%)}
  60%{transform:translate(1%,-2%)}
  70%{transform:translate(-2%,1%)}
  80%{transform:translate(3%,-3%)}
  90%{transform:translate(-1%,2%)}
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-mid); border-radius: 3px; }

/* Selection */
::selection { background: var(--accent-glow); color: var(--text-primary); }

/* Horizontal marquee */
.marquee-track {
  display: flex;
  gap: 0;
  animation: marquee 22s linear infinite;
  white-space: nowrap;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
""")

# ─────────────────────────────────────────────────────────────────────────────
# layout.tsx
# ─────────────────────────────────────────────────────────────────────────────
w("app/layout.tsx", """import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tinashe Osewe — Full-Stack Engineer",
  description: "Full-stack engineer building AI-powered products end to end.",
  openGraph: {
    title: "Tinashe Osewe — Full-Stack Engineer",
    description: "Full-stack engineer. AI products. Shipped.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} grain`}>
        <Cursor />
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
""")

# ─────────────────────────────────────────────────────────────────────────────
# Cursor.tsx
# ─────────────────────────────────────────────────────────────────────────────
w("components/Cursor.tsx", """"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const rp = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
  const hov = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("mousemove", move);
    const on = () => { hov.current = true; };
    const off = () => { hov.current = false; };
    const attach = () => {
      document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const { x, y } = mouse.current;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px,${y - 4}px)`;
      if (ring.current) {
        rp.current.x = lerp(rp.current.x, x, 0.1);
        rp.current.y = lerp(rp.current.y, y, 0.1);
        const s = hov.current ? 52 : 32;
        ring.current.style.transform = `translate(${rp.current.x - s / 2}px,${rp.current.y - s / 2}px)`;
        ring.current.style.width = s + "px";
        ring.current.style.height = s + "px";
        ring.current.style.borderColor = hov.current ? "var(--accent)" : "rgba(242,237,232,0.28)";
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { document.removeEventListener("mousemove", move); mo.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:"var(--accent)",pointerEvents:"none",zIndex:9999 }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:32,height:32,borderRadius:"50%",border:"1.5px solid rgba(242,237,232,0.28)",pointerEvents:"none",zIndex:9998,transition:"width .3s cubic-bezier(.23,1,.32,1),height .3s cubic-bezier(.23,1,.32,1),border-color .25s ease" }} />
    </>
  );
}
""")

# ─────────────────────────────────────────────────────────────────────────────
# SmoothScroll.tsx
# ─────────────────────────────────────────────────────────────────────────────
w("components/SmoothScroll.tsx", """"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return null;
}
""")

# ─────────────────────────────────────────────────────────────────────────────
# Nav.tsx
# ─────────────────────────────────────────────────────────────────────────────
w("components/Nav.tsx", """"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
      transition: "background .4s ease, border-color .4s ease",
      background: scrolled ? "rgba(8,8,8,0.88)" : "transparent",
      borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      backdropFilter: scrolled ? "blur(20px)" : "none",
    }}>
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.05em", textDecoration: "none", color: "var(--text-primary)" }}>
          TO<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {[["/#projects","Work"],["/#about","About"],["/#contact","Contact"]].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              {label}
            </Link>
          ))}
          <a href="mailto:tinashe.osewe@gmail.com"
            style={{ padding: "7px 18px", borderRadius: 100, border: "1px solid var(--border-mid)", fontSize: "0.78rem", letterSpacing: "0.05em", color: "var(--text-secondary)", textDecoration: "none", transition: "border-color .2s, color .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            Hire me
          </a>
        </div>
      </nav>
    </header>
  );
}
""")

print("\\n✓ All files written.")
