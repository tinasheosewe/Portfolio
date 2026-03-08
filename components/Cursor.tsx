"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const rp = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
  const hov = useRef(false);
  const textHov = useRef(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handleChange);

    if (mq.matches) return () => mq.removeEventListener("change", handleChange);

    const move = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("mousemove", move);
    const on = () => { hov.current = true; };
    const off = () => { hov.current = false; };
    const textOn = () => { textHov.current = true; };
    const textOff = () => { textHov.current = false; };
    const attach = () => {
      document.querySelectorAll("a,button,[data-cursor],[role='button']").forEach((el) => {
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
      });
      document.querySelectorAll("input,textarea,select").forEach((el) => {
        el.addEventListener("mouseenter", textOn);
        el.addEventListener("mouseleave", textOff);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const { x, y } = mouse.current;
      const isText = textHov.current;
      const isBtn = hov.current;
      if (dot.current) {
        if (isText) {
          // Morph dot into a thin caret line
          dot.current.style.width = "2px";
          dot.current.style.height = "24px";
          dot.current.style.borderRadius = "1px";
          dot.current.style.background = "var(--accent)";
          dot.current.style.opacity = "1";
          dot.current.style.transform = `translate(${x - 1}px,${y - 12}px) scale(1)`;
          dot.current.style.mixBlendMode = "normal";
        } else {
          dot.current.style.width = "8px";
          dot.current.style.height = "8px";
          dot.current.style.borderRadius = "50%";
          dot.current.style.background = "var(--accent)";
          dot.current.style.mixBlendMode = "normal";
          const dotSize = isBtn ? 6 : 8;
          dot.current.style.transform = `translate(${x - dotSize / 2}px,${y - dotSize / 2}px) scale(${isBtn ? 0.5 : 1})`;
          dot.current.style.opacity = isBtn ? "0" : "1";
        }
      }
      if (ring.current) {
        rp.current.x = lerp(rp.current.x, x, 0.08);
        rp.current.y = lerp(rp.current.y, y, 0.08);
        if (isText) {
          // Collapse ring to nothing for text fields
          ring.current.style.width = "0px";
          ring.current.style.height = "0px";
          ring.current.style.opacity = "0";
          ring.current.style.transform = `translate(${rp.current.x}px,${rp.current.y}px)`;
          ring.current.style.borderColor = "transparent";
          ring.current.style.background = "transparent";
          ring.current.style.backdropFilter = "none";
        } else {
          ring.current.style.opacity = "1";
          const s = isBtn ? 64 : 32;
          ring.current.style.transform = `translate(${rp.current.x - s / 2}px,${rp.current.y - s / 2}px)`;
          ring.current.style.width = s + "px";
          ring.current.style.height = s + "px";
          ring.current.style.borderColor = isBtn ? "var(--accent)" : "var(--cursor-ring)";
          ring.current.style.background = isBtn ? "var(--cursor-hover-bg)" : "transparent";
          ring.current.style.backdropFilter = isBtn ? "blur(2px)" : "none";
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { document.removeEventListener("mousemove", move); mo.disconnect(); cancelAnimationFrame(raf.current); mq.removeEventListener("change", handleChange); };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:"var(--accent)",pointerEvents:"none",zIndex:9999,transition:"opacity .25s ease, transform .15s ease, width .3s cubic-bezier(.23,1,.32,1), height .3s cubic-bezier(.23,1,.32,1), border-radius .3s ease" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:32,height:32,borderRadius:"50%",border:"1.5px solid var(--cursor-ring)",pointerEvents:"none",zIndex:9998,transition:"width .4s cubic-bezier(.23,1,.32,1),height .4s cubic-bezier(.23,1,.32,1),border-color .3s ease,background .3s ease,backdrop-filter .3s ease,opacity .3s ease" }} />
    </>
  );
}
