"use client";
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
