import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/classroom-hero.jpg";
import approachImg from "@/assets/academy-approach.jpg";
import wideImg from "@/assets/classroom-wide.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: seoMeta(
      "Classroom & Academy Gallery | Joshi’s Academy Kharadi",
      "Authentic photographs of small-batch Science classrooms, conceptual learning sessions, and student focus at Joshi’s Academy in Kharadi, Pune.",
    ),
    links: [{ rel: "canonical", href: "https://joshisacademy.com/gallery" }],
  }),
  component: GalleryPage,
});

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  src: string;
  spanClass: string;
  aspectClass: string;
  caption: string;
  metadata: string;
};

const items: GalleryItem[] = [
  {
    id: 0,
    title: "Small-Batch Lecture in Session",
    category: "Pedagogy",
    src: heroImg,
    spanClass: "md:col-span-8 md:row-span-2",
    aspectClass: "aspect-[16/10]",
    caption:
      "A teacher breaking down Newton's laws of motion with real-time student participation.",
    metadata: "Kharadi Campus • Class X Session",
  },
  {
    id: 1,
    title: "Personalised Doubt Exploration",
    category: "Mentorship",
    src: approachImg,
    spanClass: "md:col-span-4 md:row-span-1",
    aspectClass: "aspect-[4/5]",
    caption:
      "Direct engagement ensuring conceptual queries are answered before advancing to the next topic.",
    metadata: "1-on-1 Guidance Desk",
  },
  {
    id: 2,
    title: "Focused Classroom Environment",
    category: "Classroom",
    src: wideImg,
    spanClass: "md:col-span-4 md:row-span-1",
    aspectClass: "aspect-[4/3]",
    caption: "Quiet, disciplined learning environment designed to promote deep study habits.",
    metadata: "Batch Hall A",
  },
  {
    id: 3,
    title: "Step-Wise Problem Solving",
    category: "Practice",
    src: approachImg,
    spanClass: "md:col-span-4 md:row-span-1",
    aspectClass: "aspect-[1/1]",
    caption: "Deconstructing Physics numericals and Chemistry valency problems on the board.",
    metadata: "Numerical Workshop",
  },
  {
    id: 4,
    title: "Board Examination Practice Session",
    category: "Assessment",
    src: wideImg,
    spanClass: "md:col-span-8 md:row-span-1",
    aspectClass: "aspect-[16/9]",
    caption:
      "Students completing timed test series reflecting exact CBSE & ICSE marking parameters.",
    metadata: "Weekly Test Series",
  },
  {
    id: 5,
    title: "Interactive Scientific Discussion",
    category: "Understanding",
    src: heroImg,
    spanClass: "md:col-span-12 md:row-span-1",
    aspectClass: "aspect-[21/9]",
    caption:
      "Fostering authentic curiosity and scientific inquiry rather than passive memorisation.",
    metadata: "Secondary Science Wing",
  },
];

function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for accessible lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + items.length) % items.length : null,
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <>
      <PageHero
        eyebrow="Visual Journal"
        title="Learning, observed closely."
        intro="Authentic moments from our classrooms in Kharadi, Pune. We prioritize real academic focus and thoughtful discussions over staging."
      />

      <section className="section-shell py-24 md:py-36">
        {/* Editorial Masonry Grid with Intentional Asymmetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(240px,auto)]">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden border border-border bg-white cursor-pointer ${item.spanClass}`}
              onClick={() => setLightboxIndex(item.id)}
            >
              <div className={`relative overflow-hidden w-full h-full ${item.aspectClass}`}>
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Editorial Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 sm:p-8 text-ivory">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-lavender">
                    {item.category} • {item.metadata}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-1">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-ivory/80 leading-relaxed max-w-lg">
                    {item.caption}
                  </p>

                  {/* Violet Underline Accent */}
                  <div className="mt-4 h-0.5 w-12 bg-violet transition-all duration-300 group-hover:w-20" />
                </div>

                <div className="absolute top-4 right-4 size-8 rounded-full bg-ink/60 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="size-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessible Fullscreen Lightbox Modal */}
      {lightboxIndex !== null &&
        items[lightboxIndex] &&
        (() => {
          const currentItem = items[lightboxIndex];
          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md p-4 sm:p-8 text-ivory animate-in fade-in duration-200"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded photograph"
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 size-11 rounded-full border border-ivory/30 flex items-center justify-center text-ivory hover:bg-ivory/15 transition-colors cursor-pointer z-10"
                aria-label="Close lightbox"
              >
                <X className="size-5" />
              </button>

              {/* Previous control */}
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev - 1 + items.length) % items.length : null,
                  )
                }
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 size-12 rounded-full border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/15 transition-colors cursor-pointer z-10"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="size-6" />
              </button>

              {/* Next control */}
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null))
                }
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 size-12 rounded-full border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/15 transition-colors cursor-pointer z-10"
                aria-label="Next photograph"
              >
                <ChevronRight className="size-6" />
              </button>

              {/* Image & Caption Container */}
              <div className="flex flex-col items-center max-w-5xl w-full">
                <img
                  src={currentItem.src}
                  alt={currentItem.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm border border-ivory/10 shadow-2xl"
                />
                <div className="mt-6 text-center max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-lavender">
                    {currentItem.category} • {currentItem.metadata}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-1">
                    {currentItem.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ivory/70 leading-relaxed">
                    {currentItem.caption}
                  </p>
                  <p className="mt-3 text-[11px] text-ivory/40">
                    Image {lightboxIndex + 1} of {items.length} • Use Arrow Keys or Escape
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
