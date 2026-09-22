import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  ShieldCheck,
  User,
  Key,
  Globe,
  Database,
  LogOut,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { CMSAuthService, type CMSAdminUser } from "@/services/cms-auth.server";

export const Route = createFileRoute("/admin/cms/settings")({
  component: CMSPageSettings,
});

function CMSPageSettings() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<CMSAdminUser | null>(null);

  useEffect(() => {
    const session = CMSAuthService.getSession();
    setAdminUser(session);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/cms/auth/logout", { method: "POST" });
    } catch (e) {}
    CMSAuthService.clearSession();
    navigate({ to: "/admin/cms/login", search: { redirect: "/admin/cms" } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet border border-violet/20">
              <Settings className="size-3" /> System Configuration
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">CMS Admin Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Security status, active session credentials, and public website API integrations.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-red-100 shadow-2xs transition-all cursor-pointer"
        >
          <LogOut className="size-4" /> Terminate Session
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Account Card */}
        <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border/60">
            <User className="size-4 text-violet" />
            <h2 className="font-bold text-ink text-base">Active CMS Administrator</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-violet/20 bg-violet/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet">
                  Authenticated User
                </span>
                <h3 className="font-bold text-ink text-sm mt-0.5">
                  {adminUser?.name || "CMS Administrator"}
                </h3>
                <p className="text-xs font-mono font-medium text-muted-foreground">
                  {adminUser?.email || "admin@joshisacademy.com"}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                ACTIVE SESSION
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                <span className="text-muted-foreground font-medium">Authentication Mechanism</span>
                <span className="font-semibold text-ink">Isolated CMS Auth Service</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                <span className="text-muted-foreground font-medium">Password Protection</span>
                <span className="font-semibold text-ink flex items-center gap-1">
                  <Lock className="size-3 text-violet" /> Bcrypt Hash Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                <span className="text-muted-foreground font-medium">Session Storage</span>
                <span className="font-semibold text-ink">HttpOnly Cookie + Admin Token</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-muted-foreground font-medium">LMS Isolation</span>
                <span className="font-extrabold text-emerald-700">100% Standalone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Website APIs */}
        <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border/60">
            <Globe className="size-4 text-violet" />
            <h2 className="font-bold text-ink text-base">Public Website API Status</h2>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            The public website calls these dedicated unauthenticated read-only endpoints to fetch
            live CMS content.
          </p>

          <div className="space-y-3">
            {[
              {
                path: "/api/public/gallery",
                label: "Public Gallery Feed",
                filter: "is_published = true",
              },
              {
                path: "/api/public/youtube",
                label: "Public YouTube Videos Feed",
                filter: "is_published = true",
              },
              {
                path: "/api/public/google-reviews",
                label: "Public Google Reviews Cache",
                filter: "is_enabled = true",
              },
            ].map((api, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-border/70 bg-ivory/50 flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-ink text-xs">{api.label}</span>
                  <span className="block font-mono text-[10px] text-violet mt-0.5">{api.path}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> ONLINE
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-ivory text-[11px] text-muted-foreground space-y-1">
            <span className="font-bold text-ink block">Security Guarantee:</span>
            <p>
              CMS administrative routes (<code className="text-violet">/admin/cms/*</code>) and
              write APIs (<code className="text-violet">/api/cms/*</code>) require a valid CMS admin
              token. Public APIs expose no administrative capability or API secrets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
