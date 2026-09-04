import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function BrandLoader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if user already saw the loader in this session or prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenLoader = sessionStorage.getItem("ja_seen_loader");

    if (hasSeenLoader || prefersReducedMotion) {
      return;
    }

    setVisible(true);
    sessionStorage.setItem("ja_seen_loader", "true");

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 650);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 size-28 rounded-full bg-white p-1.5 shadow-md border border-border/60 animate-in fade-in zoom-in-95 duration-500">
          <img
            src="/brand/logo.png"
            alt={`${site.name} Academic Seal`}
            width={112}
            height={112}
            className="size-full object-contain rounded-full"
            fetchPriority="high"
          />
        </div>
        <p className="font-sans text-sm font-extrabold uppercase tracking-[0.20em] text-ink">
          {site.name}
        </p>
        <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.30em] text-violet">
          {site.tagline}
        </p>
        <div className="mt-6 h-0.5 w-16 overflow-hidden bg-border rounded-full">
          <div className="h-full w-full origin-left animate-[loading-bar_0.7s_ease-out_forwards] bg-violet" />
        </div>
      </div>
    </div>
  );
}
