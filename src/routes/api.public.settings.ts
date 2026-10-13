import { createFileRoute } from "@tanstack/react-router";
import { SettingsService } from "@/services/settings.server";

export const Route = createFileRoute("/api/public/settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const settings = await SettingsService.getPublicSettings();
          return new Response(JSON.stringify({ success: true, settings }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=300",
            },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Failed to load public settings" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
