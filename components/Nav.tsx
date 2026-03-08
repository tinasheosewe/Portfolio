"use client";
import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";

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
        <a href="#" style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.05em", textDecoration: "none", color: "var(--text-primary)" }}>
          TO<span style={{ color: "var(--accent)" }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {[["#projects","Work"],["#about","About"],["#contact","Contact"]].map(([href, label]) => (
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
          <a href="#contact"
            style={{ padding: "7px 18px", borderRadius: 100, border: "1px solid var(--border-mid)", fontSize: "0.78rem", letterSpacing: "0.05em", color: "var(--text-secondary)", textDecoration: "none", transition: "border-color .2s, color .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
