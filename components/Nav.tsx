"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Linkedin, Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS: [string, string][] = [["/#projects","Work"],["/#about","About"],["/#contact","Contact"]];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const hour = new Date().getHours();
      const timeDefault = hour >= 6 && hour < 18 ? "light" : "dark";
      setTheme(timeDefault);
      document.documentElement.setAttribute("data-theme", timeDefault);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu on hash change
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
        transition: "background .4s ease, border-color .4s ease",
        background: scrolled || menuOpen ? (theme === "dark" ? "rgba(8,8,8,0.88)" : "rgba(245,242,238,0.88)") : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
      }}>
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.05em", textDecoration: "none", color: "var(--text-primary)", zIndex: 810 }}>
            TO<span style={{ color: "var(--accent)" }}>.</span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="nav-desktop" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {NAV_LINKS.map(([href, label]) => (
              <Link key={href} href={href} style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                {label}
              </Link>
            ))}
            <a href="https://www.linkedin.com/in/tinasheosewe/" target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color .2s", display: "flex", alignItems: "center" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Linkedin size={16} />
            </a>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ background: "none", border: "none", padding: 4, color: "var(--text-muted)", display: "flex", alignItems: "center", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => (window as unknown as { __openCommandPalette?: () => void }).__openCommandPalette?.()}
              aria-label="Open command palette"
              className="cmd-k-hint"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", color: "var(--text-muted)", fontSize: "0.72rem", transition: "all .2s", letterSpacing: "0.03em" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <kbd style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.68rem", pointerEvents: "none" }}>⌘K</kbd>
            </button>
          </div>

          {/* ── Hamburger button (mobile only) ── */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ display: "none", background: "none", border: "none", color: "var(--text-primary)", padding: 6, zIndex: 810 }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay menu ── */}
      <div
        className="nav-mobile-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 799,
          background: theme === "dark" ? "rgba(8,8,8,0.96)" : "rgba(245,242,238,0.96)",
          backdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
          transition: "opacity .3s ease, visibility .3s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map(([href, label]) => (
          <Link key={href} href={href} onClick={() => setMenuOpen(false)}
            style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)", textDecoration: "none" }}>
            {label}
          </Link>
        ))}
        <div style={{ display: "flex", gap: 24, marginTop: 16, alignItems: "center" }}>
          <a href="https://www.linkedin.com/in/tinasheosewe/" target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            onClick={() => setMenuOpen(false)}
            style={{ color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
            <Linkedin size={16} /> LinkedIn
          </a>
          <button
            onClick={() => { toggleTheme(); setMenuOpen(false); }}
            style={{ background: "none", border: "none", padding: 4, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* ── Responsive toggle styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
