import { Maximize2 } from "lucide-react";
import type { GalleryItem } from "@/services/cms.server";

export interface GalleryCardProps {
  item: GalleryItem;
  variant: "featured" | "stacked" | "medium" | "wide" | "standard";
  onClick: () => void;
  priority?: boolean;
}

export function GalleryCard({ item, variant, onClick, priority = false }: GalleryCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-white shadow-2xs cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
        isFeatured ? "h-full min-h-[480px] lg:min-h-[580px]" : "h-full min-h-[260px]"
      }`}
    >
      <div className="relative size-full overflow-hidden bg-black/5 flex-1">
        <img
          src={item.image_url}
          alt={item.title}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop";
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="rounded-full bg-ink/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory border border-white/20">
            {item.category || "Classrooms"}
          </span>
        </div>

        {/* Expand Icon */}
        <div className="absolute top-4 right-4 z-10 size-9 rounded-full bg-ink/70 backdrop-blur-md text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
          <Maximize2 className="size-4" />
        </div>

        {/* Featured Image Text Overlay (As shown in reference screenshot) */}
        {isFeatured ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-ivory">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-lavender drop-shadow-xs">
              {item.category ? item.category.toUpperCase() : "PEDAGOGY"} • KHARADI CAMPUS • CLASS X
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-ivory font-semibold mt-1.5 leading-tight">
              {item.title}
            </h2>
            {item.description && (
              <p className="mt-2 text-xs sm:text-sm text-ivory/85 leading-relaxed max-w-xl">
                {item.description}
              </p>
            )}

            {/* Violet Underline Accent */}
            <div className="mt-4 h-0.5 w-12 bg-violet transition-all duration-300 group-hover:w-24" />
          </div>
        ) : (
          /* Standard Hover Overlay */
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-ivory">
            <span className="text-[10px] font-bold uppercase tracking-wider text-lavender">
              Kharadi Campus
            </span>
            <h3 className="font-display text-lg text-ivory font-semibold line-clamp-1 mt-0.5">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1 text-xs text-ivory/80 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
            <div className="mt-2.5 h-0.5 w-8 bg-violet transition-all duration-300 group-hover:w-16" />
          </div>
        )}
      </div>

      {/* Non-featured bottom bar */}
      {!isFeatured && (
        <div className="p-3.5 bg-white border-t border-border/60">
          <h3 className="font-bold text-ink text-xs line-clamp-1">{item.title}</h3>
          <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
            {item.category || "Classrooms"}
          </span>
        </div>
      )}
    </div>
  );
}
