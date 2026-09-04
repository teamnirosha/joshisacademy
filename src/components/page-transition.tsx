import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { DualRingSpinner } from "./dual-ring-spinner";

/**
 * PageTransition
 *
 * Three-phase route transition:
 *
 *  1. "loading"  — Full-screen ivory overlay fades IN (160ms), spinner appears.
 *                  Gives the browser a frame to render the spinner before
 *                  swapping page content.
 *  2. "entering" — Content is swapped invisibly behind the overlay, then the
 *                  overlay fades OUT (260ms) while the new page starts fading up.
 *  3. "idle"     — Overlay removed from DOM. Page is fully visible.
 *
 * Total perceived transition: ~420ms — snappy but clearly animated.
 *
 * Respects prefers-reduced-motion: styles.css collapses all animation-duration
 * to 0.01ms for users who prefer reduced motion.
 */

type Phase = "idle" | "loading" | "exiting" | "entering";

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const prevPath = useRef(pathname);
  const t1 = useRef<ReturnType<typeof setTimeout>>();
  const t2 = useRef<ReturnType<typeof setTimeout>>();
  const raf = useRef<number>();

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Cancel any in-flight timers from a rapid navigation
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    if (raf.current) cancelAnimationFrame(raf.current);

    // Scroll to top immediately
    window.scrollTo({ top: 0 });

    // Phase 1 — show spinner overlay
    setPhase("loading");

    // Phase 2 — after spinner has faded in, swap content + start exit animation
    t1.current = setTimeout(() => {
      setDisplayPath(pathname);
      setPhase("exiting");

      // Phase 3 — after overlay exit animation (260ms), begin page enter
      t2.current = setTimeout(() => {
        setPhase("entering");

        // Phase 4 — two RAFs: first renders at opacity-0, second triggers transition
        raf.current = requestAnimationFrame(() => {
          raf.current = requestAnimationFrame(() => {
            setPhase("idle");
          });
        });
      }, 260);
    }, 180);

    return () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [pathname]);

  const showOverlay = phase === "loading" || phase === "exiting";

  return (
    <>
      {/* ── Full-screen spinner overlay ─────────────────────────────────── */}
      {showOverlay && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-ivory/96 backdrop-blur-sm ${
            phase === "loading" ? "spinner-overlay-enter" : "spinner-overlay-exit"
          }`}
          aria-live="polite"
          aria-busy="true"
        >
          <DualRingSpinner label={true} dark={false} />
        </div>
      )}

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div
        key={displayPath}
        style={{
          opacity: phase === "entering" ? 0 : 1,
          transform: phase === "entering" ? "translateY(10px)" : "translateY(0)",
          transition:
            phase === "idle"
              ? "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)"
              : "none",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </>
  );
}
