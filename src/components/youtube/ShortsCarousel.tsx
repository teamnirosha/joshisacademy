import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Smartphone, Eye } from "lucide-react";
import type { YouTubeVideoItem } from "@/services/cms.server";

interface ShortsCarouselProps {
  shorts: YouTubeVideoItem[];
  onSelectShort: (short: YouTubeVideoItem) => void;
}

export function ShortsCarousel({ shorts, onSelectShort }: ShortsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      checkScrollButtons();
      el.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        el.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [shorts]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setDragMoved(true);
    }
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrows */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-1">
            <Smartphone className="size-3.5" />
            <span>Varsha Tutorials Shorts</span>
          </span>
          <h3 className="text-xl sm:text-2xl text-ink font-semibold">Latest Shorts</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Quick lessons, tips and key board revision moments from Varsha Tutorials.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll shorts left"
            className={`size-10 rounded-full border border-border/80 flex items-center justify-center transition-all ${
              canScrollLeft
                ? "bg-white text-ink hover:bg-ivory shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-muted/40 text-muted-foreground/40 border-border/30 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll shorts right"
            className={`size-10 rounded-full border border-border/80 flex items-center justify-center transition-all ${
              canScrollRight
                ? "bg-white text-ink hover:bg-ivory shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-muted/40 text-muted-foreground/40 border-border/30 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {shorts.map((short) => (
          <div
            key={short.id}
            onClick={() => {
              if (!dragMoved) {
                onSelectShort(short);
              }
            }}
            className="flex-shrink-0 w-[190px] sm:w-[230px] snap-start group/card relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-border/70 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer select-none"
          >
            {/* Background Thumbnail Image */}
            <img
              src={
                short.thumbnail_url ||
                `https://img.youtube.com/vi/${short.youtube_video_id}/maxresdefault.jpg`
              }
              alt={short.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
            />

            {/* Subtle Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity group-hover/card:opacity-95" />

            {/* Top Badge: Short */}
            <div className="relative p-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-medium uppercase tracking-wider shadow-xs backdrop-blur-xs">
                <Smartphone className="size-3" />
                <span>Short</span>
              </span>

              {short.view_count && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-normal backdrop-blur-xs">
                  <Eye className="size-2.5" />
                  {short.view_count}
                </span>
              )}
            </div>

            {/* Hover Center Play Button Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-80 opacity-0 group-hover/card:scale-100 group-hover/card:opacity-100 transition-all duration-300">
                <Play className="size-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom Content / Title */}
            <div className="absolute bottom-0 inset-x-0 p-3.5 text-white">
              <h4 className="font-medium text-xs sm:text-sm leading-snug line-clamp-2 text-white/95 group-hover/card:text-white transition-colors">
                {short.title}
              </h4>
              <div className="mt-2 flex items-center justify-between text-[11px] text-red-400 font-medium">
                <span className="group-hover/card:underline inline-flex items-center gap-1">
                  ▶ Watch Short
                </span>
                {short.duration && (
                  <span className="text-white/60 font-mono text-[10px]">{short.duration}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
