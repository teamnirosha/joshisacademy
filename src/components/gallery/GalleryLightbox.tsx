import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/services/cms.server";

export interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when lightbox is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex]!;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-ink/95 backdrop-blur-md p-4 sm:p-8 text-ivory animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded photograph lightbox"
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between z-10 max-w-7xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-lavender border border-white/15">
            {currentItem.category || "Classrooms"}
          </span>
          <span className="text-xs font-mono text-ivory/60">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="size-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-ivory hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Image Display with Controls */}
      <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-4">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 size-12 rounded-full border border-white/20 bg-black/40 text-ivory flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer z-20 shadow-lg hover:scale-105"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* High Resolution Image */}
        <div className="relative max-h-[72vh] max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/60 flex items-center justify-center">
          <img
            src={currentItem.image_url}
            alt={currentItem.title}
            className="max-h-[72vh] w-auto max-w-full object-contain select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % items.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 size-12 rounded-full border border-white/20 bg-black/40 text-ivory flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer z-20 shadow-lg hover:scale-105"
            aria-label="Next photograph"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Caption & Metadata Footer */}
      <div className="w-full max-w-3xl text-center space-y-1 pb-2 z-10">
        <h3 className="font-display text-xl sm:text-2xl text-ivory font-semibold">
          {currentItem.title}
        </h3>
        {currentItem.description && (
          <p className="text-xs sm:text-sm text-ivory/80 max-w-xl mx-auto leading-relaxed">
            {currentItem.description}
          </p>
        )}
        <p className="text-[10px] text-ivory/40 font-mono pt-1">
          Kharadi Campus, Pune • Press ESC to exit
        </p>
      </div>
    </div>
  );
}
