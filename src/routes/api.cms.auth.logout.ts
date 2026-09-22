import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cms/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(
          JSON.stringify({ success: true, message: "Logged out successfully." }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
