import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CMSAuthService } from "@/services/cms-auth.server";
import { site } from "@/content/site";

export const Route = createFileRoute("/admin/cms/login")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search["redirect"];
    return {
      redirect: typeof raw === "string" ? raw : "/admin/cms",
    };
  },
  component: CMSLoginPage,
});

function CMSLoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin/cms/login" });
  const [email, setEmail] = useState("admin@joshisacademy.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectUrl = search["redirect"] || "/admin/cms";

  useEffect(() => {
    // If already logged in, redirect to target CMS page immediately
    const session = CMSAuthService.getSession();
    if (session) {
      navigate({ to: redirectUrl as any });
    }
  }, [navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Persist session
      CMSAuthService.setSession(data.admin);

      // Navigate to destination
      const targetUrl = redirectUrl.startsWith("/admin/cms") ? redirectUrl : "/admin/cms";
      navigate({ to: targetUrl as any });
    } catch (err: any) {
      // Fallback local check if fetch fails
      if (CMSAuthService.verifyCredentials(email, password)) {
        CMSAuthService.setSession({
          id: "cms-admin-01",
          email: email.trim().toLowerCase(),
          name: "CMS Administrator",
          role: "CMS_ADMIN",
        });
        navigate({ to: redirectUrl as any });
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a10] text-ivory flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Glow gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-violet/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-violet to-royal p-0.5 shadow-2xl flex items-center justify-center border border-white/20">
            <div className="size-full bg-ink rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="size-8 text-amber-400" />
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lavender border border-violet/30">
              <Sparkles className="size-3 text-amber-300" />
              Standalone CMS Portal
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white font-medium tracking-tight">
            {site.name}
          </h1>
          <p className="text-xs text-ivory/60 font-normal">
            Website Content Management Administrator Login
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-200">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 size-4 text-ivory/40 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@joshisacademy.com"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-white outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition-all placeholder:text-ivory/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80">
                Admin Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-ivory/40 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-white outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition-all placeholder:text-ivory/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-12 rounded-2xl bg-violet hover:bg-royal text-ivory text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-violet/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  LOGIN TO CMS <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-[10px] text-ivory/40 font-mono">
              Default Admin: admin@joshisacademy.com / Admin@123
            </span>
          </div>
        </div>

        {/* Public site link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-ivory/50 hover:text-white transition-colors underline underline-offset-4"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
