import { useState, useEffect } from "react";
import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Star,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CMSAuthService, type CMSAdminUser } from "@/services/cms-auth.server";
import { site } from "@/content/site";

export const Route = createFileRoute("/admin/cms")({
  component: CMSLayout,
});

function CMSLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<CMSAdminUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check auth session
  useEffect(() => {
    const session = CMSAuthService.getSession();
    if (!session && !location.pathname.startsWith("/admin/cms/login")) {
      navigate({
        to: "/admin/cms/login",
        search: { redirect: location.pathname },
      });
    } else {
      setAdminUser(session);
    }
    setAuthChecked(true);
  }, [location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("/api/cms/auth/logout", { method: "POST" });
    } catch (e) {}
    CMSAuthService.clearSession();
    navigate({ to: "/admin/cms/login", search: { redirect: "/admin/cms" } });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0a10] text-ivory flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-violet border-t-transparent animate-spin" />
      </div>
    );
  }

  // If on login route, render children without CMS shell
  if (location.pathname === "/admin/cms/login") {
    return <Outlet />;
  }

  if (!adminUser) {
    return null;
  }

  const navLinks = [
    { label: "Dashboard", to: "/admin/cms", icon: LayoutDashboard, exact: true },
    { label: "Gallery", to: "/admin/cms/gallery", icon: ImageIcon },
    { label: "YouTube Videos", to: "/admin/cms/youtube", icon: Video },
    { label: "Google Reviews", to: "/admin/cms/google-reviews", icon: Star },
    { label: "CMS Settings", to: "/admin/cms/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col font-sans">
      {/* ── Top Standalone CMS Header ────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto flex size-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-ink rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link to="/admin/cms" className="flex items-center gap-2.5 group">
              <div className="size-9 rounded-xl bg-violet text-ivory flex items-center justify-center font-bold text-sm shadow-xs border border-violet/20">
                <ShieldCheck className="size-5 text-amber-300" />
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink leading-none">
                  {site.name} CMS
                </span>
                <span className="block text-[9px] font-bold text-violet uppercase tracking-widest mt-0.5">
                  Standalone Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-ivory px-3 py-1.5 text-xs font-semibold text-ink hover:bg-lavender/50 transition-colors"
            >
              <ExternalLink className="size-3.5 text-violet" /> View Website
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-border/60">
              <span className="hidden sm:inline text-xs font-bold text-violet bg-violet/10 px-2.5 py-1 rounded-full border border-violet/20">
                {adminUser.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                title="Logout from CMS"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 pt-16 flex min-h-screen">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-ink/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation (Fixed on viewport) */}
        <aside
          className={`fixed top-16 left-0 bottom-0 z-30 w-64 border-r border-border/80 bg-white p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">
                DASHBOARD
              </span>
              <div className="mt-2 space-y-1">
                <Link
                  to="/admin/cms"
                  onClick={() => setMobileMenuOpen(false)}
                  activeOptions={{ exact: true }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">
                CONTENT MODULES
              </span>
              <div className="mt-2 space-y-1">
                <Link
                  to="/admin/cms/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <ImageIcon className="size-4" /> Gallery
                </Link>
                <Link
                  to="/admin/cms/youtube"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Video className="size-4" /> YouTube Videos
                </Link>
                <Link
                  to="/admin/cms/google-reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Star className="size-4" /> Google Reviews
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">
                SYSTEM
              </span>
              <div className="mt-2 space-y-1">
                <Link
                  to="/admin/cms/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Settings className="size-4" /> CMS Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" /> Logout Session
            </button>
          </div>
        </aside>

        {/* Content Outlet with Fixed Sidebar Left Padding */}
        <main className="flex-1 min-w-0 lg:pl-64 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
