import { createFileRoute } from "@tanstack/react-router";
import { CMSAuthService } from "@/services/cms-auth.server";

export const Route = createFileRoute("/api/cms/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { email, password } = body || {};

          if (!email || !password) {
            return new Response(
              JSON.stringify({ success: false, message: "Email and password are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const isValid = CMSAuthService.verifyCredentials(email, password);

          if (!isValid) {
            return new Response(
              JSON.stringify({ success: false, message: "Invalid email or password." }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const adminUser = {
            id: "cms-admin-01",
            email: email.trim().toLowerCase(),
            name: "CMS Administrator",
            role: "CMS_ADMIN" as const,
          };

          return new Response(
            JSON.stringify({
              success: true,
              admin: adminUser,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: "Authentication failed." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
