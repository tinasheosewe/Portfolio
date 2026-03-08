"use client";
import { useState, useEffect } from "react";
import { Linkedin, Menu, X } from "lucide-react";

const NAV_LINKS: [string, string][] = [["#projects","Work"],["#about","About"],["#contact","Contact"]];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        background: scrolled || menuOpen ? "rgba(8,8,8,0.88)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
      }}>
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.05em", textDecoration: "none", color: "var(--text-primary)", zIndex: 810 }}>
            TO<span style={{ color: "var(--accent)" }}>.</span>
          </a>

          {/* ── Desktop nav ── */}
          <div className="nav-desktop" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                {label}
              </a>
            ))}
            <a href="https://www.linkedin.com/in/tinasheosewe/" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color .2s", display: "flex", alignItems: "center" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Linkedin size={16} />
            </a>
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
          background: "rgba(8,8,8,0.96)",
          backdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
          transition: "opacity .3s ease, visibility .3s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}
            style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)", textDecoration: "none" }}>
            {label}
          </a>
        ))}
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          <a href="https://www.linkedin.com/in/tinasheosewe/" target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{ color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
            <Linkedin size={16} /> LinkedIn
          </a>
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
