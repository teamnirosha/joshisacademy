import { createFileRoute } from "@tanstack/react-router";
import { articles, courses } from "@/content/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const base = "https://joshisacademy.com";
        const today = new Date().toISOString().split("T")[0];

        const mainRoutes = [
          { path: "", priority: "1.0", changefreq: "daily" },
          { path: "courses", priority: "0.9", changefreq: "weekly" },
          { path: "results", priority: "0.8", changefreq: "monthly" },
          { path: "faculty", priority: "0.8", changefreq: "monthly" },
          { path: "about", priority: "0.8", changefreq: "monthly" },
          { path: "journal", priority: "0.9", changefreq: "weekly" },
          { path: "contact", priority: "0.9", changefreq: "monthly" },
          { path: "faq", priority: "0.8", changefreq: "monthly" },
          { path: "privacy", priority: "0.3", changefreq: "yearly" },
          { path: "terms", priority: "0.3", changefreq: "yearly" },
        ];

        const courseRoutes = courses.map((c) => ({
          path: `courses/${c.slug}`,
          priority: "0.9",
          changefreq: "weekly",
        }));

        const journalRoutes = articles.map((a) => ({
          path: `journal/${a.slug}`,
          priority: "0.8",
          changefreq: "monthly",
        }));

        const allRoutes = [...mainRoutes, ...courseRoutes, ...journalRoutes];

        const urlTags = allRoutes
          .map(
            (r) =>
              `<url><loc>${base}/${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
          )
          .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlTags}</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
