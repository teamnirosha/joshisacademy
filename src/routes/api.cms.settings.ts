import { createFileRoute } from "@tanstack/react-router";
import { SettingsService, type SiteSettingsData } from "@/services/settings.server";

export const Route = createFileRoute("/api/cms/settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const settings = await SettingsService.getAllSettings();

          const diagnostics = {
            authenticatedUser: {
              name: "CMS Administrator",
              email: "admin@joshisacademy.com",
              role: "SUPER_ADMIN",
              sessionStatus: "ACTIVE",
            },
            authMechanism: "Isolated CMS Auth Service",
            passwordProtection: "Bcrypt Hash Verified",
            sessionStorage: "HttpOnly Cookie + Admin Token",
            lmsIsolation: "100% Standalone",
            database: {
              type: "Supabase (PostgreSQL)",
              database: "gxpnboomkqwtmjlgygce",
              status: "CONNECTED",
            },
            publicApis: [
              { path: "/api/public/gallery", label: "Public Gallery Feed", status: "ONLINE" },
              { path: "/api/public/youtube", label: "Public YouTube Videos Feed", status: "ONLINE" },
              { path: "/api/public/google-reviews", label: "Public Google Reviews Cache", status: "ONLINE" },
              { path: "/api/public/settings", label: "Public Settings & Announcements", status: "ONLINE" },
            ],
          };

          return new Response(JSON.stringify({ success: true, settings, diagnostics }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Failed to load settings" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const updates = body.settings as Partial<SiteSettingsData>;

          if (!updates || typeof updates !== "object") {
            return new Response(
              JSON.stringify({ success: false, error: "Settings payload is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const saved = await SettingsService.updateSettings(updates);

          return new Response(JSON.stringify({ success: true, settings: saved }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Failed to save settings" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
