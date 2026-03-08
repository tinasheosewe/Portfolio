"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  strength?: number;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
  className?: string;
}

export default function MagneticButton({ children, style, strength = 0.35, href, onClick, type, disabled, target, rel, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const inner = (
    <motion.span
      animate={{ x: pos.x * 0.6, y: pos.y * 0.6 }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.4 }}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, pointerEvents: "none" }}
    >
      {children}
    </motion.span>
  );

  const wrapperStyle: React.CSSProperties = { display: "inline-block", ...style };

  if (href) {
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.5 }}
        style={{ display: "inline-block", width: "fit-content" }}
        className={className}
      >
        <a href={href} target={target} rel={rel} onClick={onClick} style={wrapperStyle}>
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.5 }}
      style={{ display: "inline-block", width: "fit-content" }}
      className={className}
    >
      <button type={type || "button"} onClick={onClick} disabled={disabled} style={wrapperStyle}>
        {inner}
      </button>
    </motion.div>
  );
}
