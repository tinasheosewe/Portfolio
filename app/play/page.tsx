"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const SnakeGame = dynamic(() => import("@/components/SnakeGame"), { ssr: false });

export default function PlayPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 48px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            marginBottom: 24,
            transition: "color .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft size={14} />
          Back to portfolio
        </Link>

        <h1 style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
        }}>
          Snake
        </h1>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          margin: "0 0 32px",
          fontFamily: "var(--font-mono, monospace)",
        }}>
          Take a break.
        </p>

        <SnakeGame />
      </div>
    </motion.main>
  );
}
