import { createFileRoute } from "@tanstack/react-router";
import { GalleryService } from "@/services/cms.server";

export const Route = createFileRoute("/api/cms/gallery")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const items = await GalleryService.getItems("default", true);
          return new Response(JSON.stringify({ items }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const action = body.action || "create";

          if (action === "create") {
            const newItem = await GalleryService.createItem({
              title: body.title,
              description: body.description,
              imageUrl: body.imageUrl,
              thumbnailUrl: body.thumbnailUrl,
              category: body.category,
              isPublished: body.isPublished ?? true,
              displayOrder: body.displayOrder,
            });
            return new Response(JSON.stringify({ success: true, item: newItem }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "update") {
            const updated = await GalleryService.updateItem(body.id, {
              title: body.title,
              description: body.description,
              imageUrl: body.imageUrl,
              thumbnailUrl: body.thumbnailUrl,
              category: body.category,
              isPublished: body.isPublished,
              displayOrder: body.displayOrder,
            });
            return new Response(JSON.stringify({ success: true, item: updated }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "delete") {
            await GalleryService.deleteItem(body.id);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "toggle_publish") {
            const updated = await GalleryService.updateItem(body.id, {
              isPublished: body.isPublished,
            });
            return new Response(JSON.stringify({ success: true, item: updated }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "reorder") {
            await GalleryService.reorderItems(body.items || [], "default");
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
      },
    },
  },
});
