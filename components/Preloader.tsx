"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent scroll during preloader
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
    }, 2000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-primary)" }}>
              TO<span style={{ color: "var(--accent)" }}>.</span>
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            style={{ width: 48, height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden", position: "relative" }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0, background: "var(--accent)", borderRadius: 1 }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}
          >
            Engineering
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
