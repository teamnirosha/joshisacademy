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
  Inbox,
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
        <div className="flex size-full items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3 lg:w-60 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-ink hover:bg-lavender/40 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5 text-violet" /> : <Menu className="size-5" />}
            </button>

            <Link to="/admin/cms" className="flex items-center gap-2.5 group min-w-0">
              <div className="size-9 rounded-xl bg-violet text-ivory flex items-center justify-center font-bold text-sm shadow-xs border border-violet/20 shrink-0">
                <ShieldCheck className="size-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink leading-none truncate">
                  {site.name} CMS
                </span>
                <span className="block text-[9px] font-bold text-violet uppercase tracking-widest mt-0.5 truncate">
                  Standalone Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-ivory px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-ink hover:bg-lavender/50 transition-colors"
              title="Open public website in new tab"
            >
              <ExternalLink className="size-3.5 text-violet shrink-0" />
              <span className="hidden sm:inline">View Website</span>
            </a>

            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border/60">
              <span
                className="hidden md:inline-flex items-center text-xs font-bold text-violet bg-violet/10 px-2.5 py-1 rounded-full border border-violet/20 max-w-[200px] truncate"
                title={adminUser.email}
              >
                {adminUser.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50/70 hover:bg-red-100 border border-red-200/70 transition-colors cursor-pointer"
                title="Logout from CMS"
              >
                <LogOut className="size-3.5 shrink-0" />
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

        {/* Sidebar Navigation */}
        <aside
          className={`fixed top-16 left-0 bottom-0 z-30 w-64 border-r border-border/80 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">
                DASHBOARD
              </span>
              <div className="mt-2 space-y-1">
                <Link
                  to="/admin/cms"
                  onClick={() => setMobileMenuOpen(false)}
                  activeOptions={{ exact: true }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <LayoutDashboard className="size-4 shrink-0" /> Dashboard
                </Link>
                <Link
                  to="/admin/cms/enquiries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <span className="flex items-center gap-2.5">
                    <Inbox className="size-4 shrink-0" /> Enquiries & Leads
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
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
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <ImageIcon className="size-4 shrink-0" /> Gallery
                </Link>
                <Link
                  to="/admin/cms/youtube"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Video className="size-4 shrink-0" /> YouTube Videos
                </Link>
                <Link
                  to="/admin/cms/google-reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Star className="size-4 shrink-0" /> Google Reviews
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
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all text-muted-foreground hover:bg-lavender/50 hover:text-ink"
                  activeProps={{ className: "!bg-violet !text-ivory shadow-xs" }}
                >
                  <Settings className="size-4 shrink-0" /> CMS Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border/60 bg-white shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" /> Logout Session
            </button>
          </div>
        </aside>

        {/* Content Outlet with Fixed Sidebar Left Margin & Responsive Padding */}
        <main className="flex-1 min-w-0 lg:ml-64 w-full bg-ivory">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
