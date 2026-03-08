"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node: HTMLElement) => {
        return !!node.closest?.("[data-lenis-prevent]");
      },
    });

    // Expose velocity as CSS custom property for scroll-linked effects
    lenis.on("scroll", (e: { velocity: number }) => {
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        String(Math.min(Math.abs(e.velocity), 8))
      );
      document.documentElement.style.setProperty(
        "--scroll-direction",
        String(e.velocity > 0 ? 1 : -1)
      );
    });

    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return null;
}
