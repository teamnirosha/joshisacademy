import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seoMeta } from "@/components/page-hero";
import { GalleryService, type GalleryItem } from "@/services/cms.server";
import { EditorialGallery } from "@/components/gallery/EditorialGallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      ...seoMeta(
        "Classroom & Science Lab Gallery | Joshi’s Academy Kharadi, Pune",
        "View authentic photographs of small-batch Science classrooms, doubt-solving sessions, and state-of-the-art facilities at Joshi’s Academy in Kharadi, Pune.",
      ),
      {
        name: "keywords",
        content:
          "coaching classroom photos Kharadi, science tuition environment Kharadi, Joshi's Academy classroom pictures, coaching infrastructure Kharadi",
      },
    ],
    links: [{ rel: "canonical", href: "https://joshisacademy.com/gallery" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://joshisacademy.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Gallery",
              item: "https://joshisacademy.com/gallery",
            },
          ],
        }),
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial cache load for zero layout shift
    try {
      const cached = localStorage.getItem("joshis_public_gallery_cache_v2");
      if (cached) {
        setItems(JSON.parse(cached));
        setLoading(false);
      }
    } catch (e) {}

    async function loadGallery() {
      try {
        const res = await fetch("/api/public/gallery");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
            try {
              localStorage.setItem("joshis_public_gallery_cache_v2", JSON.stringify(data.items));
            } catch (e) {}
            return;
          }
        }
      } catch (err) {
        console.warn("Notice loading gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Visual Journal"
        title="Learning, observed closely."
        intro="Authentic moments from our classrooms in Kharadi, Pune. We prioritize real academic focus, interactive discussions, and concept clarity."
      />

      <section className="section-shell py-16 md:py-24">
        {loading ? <GallerySkeleton /> : <EditorialGallery items={items} />}
      </section>
    </>
  );
}
