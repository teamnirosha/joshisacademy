import { useEffect, useState } from "react";

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
        <div className="relative mb-6 size-24 animate-in fade-in zoom-in-95 duration-500">
          <img
            src="/brand/logo.png"
            alt="Joshi's Academy Seal"
            width={96}
            height={96}
            className="size-full object-contain"
            fetchPriority="high"
          />
        </div>
        <p className="font-sans text-xs font-extrabold uppercase tracking-[0.24em] text-ink">
          JOSHI’S ACADEMY
        </p>
        <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-violet">
          GYAN KI VARSHA
        </p>
        <div className="mt-6 h-0.5 w-12 overflow-hidden bg-border">
          <div className="h-full w-full origin-left animate-[loading-bar_0.7s_ease-out_forwards] bg-violet" />
        </div>
      </div>
    </div>
  );
}
