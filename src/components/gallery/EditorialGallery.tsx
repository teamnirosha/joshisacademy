import { useState } from "react";
import { Filter, Sparkles } from "lucide-react";
import type { GalleryItem } from "@/services/cms.server";
import { GalleryCard } from "./GalleryCard";
import { GalleryLightbox } from "./GalleryLightbox";

export interface EditorialGalleryProps {
  items: GalleryItem[];
}

export function EditorialGallery({ items }: EditorialGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories dynamically from CMS items
  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))).filter((c): c is string => Boolean(c)),
  ];

  // Filter items by category
  const filteredItems = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  // Layout assignment helper for editorial grid rhythm matching reference
  const getItemLayoutConfig = (index: number, total: number) => {
    // Single item
    if (total === 1) {
      return { colSpan: "md:col-span-12", variant: "featured" as const };
    }
    // 2 items
    if (total === 2) {
      return { colSpan: "md:col-span-6", variant: "featured" as const };
    }

    // Editorial pattern cycle (every 10 items)
    const positionInCycle = index % 10;

    switch (positionInCycle) {
      case 0: // Ref Item #1: Featured Large Left
        return { colSpan: "md:col-span-8 lg:col-span-8", variant: "featured" as const };
      case 1: // Ref Item #2: Stacked Right Top
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "stacked" as const };
      case 2: // Ref Item #3: Stacked Right Bottom
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "stacked" as const };
      case 3: // Row 2 Item #4
        return { colSpan: "md:col-span-5 lg:col-span-4", variant: "medium" as const };
      case 4: // Row 2 Item #5
        return { colSpan: "md:col-span-7 lg:col-span-8", variant: "wide" as const };
      case 5:
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "standard" as const };
      case 6:
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "standard" as const };
      case 7:
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "standard" as const };
      case 8:
        return { colSpan: "md:col-span-7 lg:col-span-7", variant: "wide" as const };
      case 9:
        return { colSpan: "md:col-span-5 lg:col-span-5", variant: "medium" as const };
      default:
        return { colSpan: "md:col-span-4 lg:col-span-4", variant: "standard" as const };
    }
  };

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-violet" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Filter Categories:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-violet text-ivory shadow-2xs font-bold"
                    : "bg-ivory text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-border bg-white p-8 space-y-3">
          <Sparkles className="size-8 text-violet mx-auto" />
          <h3 className="font-bold text-ink text-base">No photographs available</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {selectedCategory === "All"
              ? "There are currently no published photographs in the gallery."
              : `There are currently no published photographs in "${selectedCategory}".`}
          </p>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet text-ivory text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>View All Categories</span>
            </button>
          )}
        </div>
      ) : (
        /* Reference Editorial Masonry Grid Composition */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {filteredItems.map((item, index) => {
            const config = getItemLayoutConfig(index, filteredItems.length);
            return (
              <div key={item.id} className={`${config.colSpan}`}>
                <GalleryCard
                  item={item}
                  variant={config.variant}
                  onClick={() => setLightboxIndex(index)}
                  priority={index === 0}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}
