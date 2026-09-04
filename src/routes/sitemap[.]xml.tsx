import { createFileRoute } from "@tanstack/react-router";
import { articles, courses } from "@/content/site";
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const base = "https://id-preview--9abde1ff-c22b-4669-b239-b7a3fe6f1344.lovable.app";
        const paths = [
          "",
          "courses",
          "results",
          "faculty",
          "about",
          "journal",
          "contact",
          "faq",
          "privacy",
          "terms",
          ...courses.map((c) => `courses/${c.slug}`),
          ...articles.map((a) => `journal/${a.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${base}/${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
