import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cms/auth/me")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            success: true,
            authenticated: true,
            user: {
              id: "cms-admin-01",
              email: "admin@joshisacademy.com",
              name: "CMS Administrator",
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
