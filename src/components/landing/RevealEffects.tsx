"use client";

import { useEffect } from "react";

export function RevealEffects() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const siblings = el.parentElement
              ? Array.from(el.parentElement.querySelectorAll<HTMLElement>(":scope > [data-reveal]"))
              : [];
            const idx = Math.max(0, siblings.indexOf(el));
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, idx * 110);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      const bar = document.getElementById("trn-progress");
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = (e: MouseEvent) => {
      const glow = document.getElementById("trn-glow");
      const hero = document.getElementById("top");
      if (!glow || !hero) return;
      const r = hero.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      glow.style.left = e.clientX - r.left + "px";
      glow.style.top = e.clientY - r.top + "px";
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return null;
}
