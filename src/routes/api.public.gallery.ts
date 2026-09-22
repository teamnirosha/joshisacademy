import { createFileRoute } from "@tanstack/react-router";
import { GalleryService } from "@/services/cms.server";

export const Route = createFileRoute("/api/public/gallery")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const items = await GalleryService.getItems("default", false);
          return new Response(JSON.stringify({ items }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=300",
            },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message || "Failed to fetch gallery" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
