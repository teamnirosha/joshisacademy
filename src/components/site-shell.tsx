import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import Lenis from "lenis";
import {
  ArrowRight,
  Compass,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "./enquiry-dialog";
import { BrandLoader } from "./brand-loader";
import { site, announcement } from "@/content/site";

const navItems = [
  { label: "Courses", to: "/courses" },
  { label: "Results", to: "/results" },
  { label: "Faculty", to: "/faculty" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const location = useLocation();

  // Initialize buttery smooth Lenis momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", (e: { scroll: number }) => {
      setScrolled(e.scroll > 10);
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const [liveSettings, setLiveSettings] = useState<{
    site_name?: string;
    tagline?: string;
    address_display?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    announcement?: {
      enabled: boolean;
      badge: string;
      text: string;
      expiry: string;
    };
  } | null>(null);

  // Fetch live published settings with fallback
  useEffect(() => {
    fetch("/api/public/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setLiveSettings(data.settings);
          if (data.settings.announcement?.enabled) {
            const isExpired =
              data.settings.announcement.expiry &&
              new Date(data.settings.announcement.expiry) < new Date();
            if (!isExpired) {
              setShowAnnouncement(true);
            } else {
              setShowAnnouncement(false);
            }
          } else {
            setShowAnnouncement(false);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentSiteName = liveSettings?.site_name || site.name;
  const currentTagline = liveSettings?.tagline || site.tagline;
  const currentPhone = liveSettings?.phone || site.phone;
  const currentWhatsapp = liveSettings?.whatsapp || site.whatsapp;
  const currentAnnouncementBadge = liveSettings?.announcement?.badge || announcement.badge;
  const currentAnnouncementText = liveSettings?.announcement?.text || announcement.text;

  useEffect(() => {
    if (announcement.enabled && !liveSettings) {
      const isExpired = announcement.expiry && new Date(announcement.expiry) < new Date();
      if (!isExpired) {
        setShowAnnouncement(true);
      }
    }
  }, [liveSettings]);

  // Measure the announcement bar height so we can offset the fixed header correctly
  useEffect(() => {
    if (!showAnnouncement) {
      setAnnouncementHeight(0);
      return;
    }
    const el = announcementRef.current;
    if (!el) return;
    const updateHeight = () => {
      setAnnouncementHeight(el.offsetHeight);
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [showAnnouncement]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenEnquiry = () => setEnquireOpen(true);
    window.addEventListener("open-enquiry", handleOpenEnquiry);
    return () => window.removeEventListener("open-enquiry", handleOpenEnquiry);
  }, []);

  const isHome = location.pathname === "/";
  const isCmsRoute = location.pathname.startsWith("/admin");

  // Automatically trigger attractive enquiry popup ONLY ONCE for first-time new visitors
  useEffect(() => {
    if (isCmsRoute) return;

    try {
      const alreadyShown = localStorage.getItem("joshis_enquiry_popup_shown_v1");
      if (alreadyShown) {
        return;
      }

      // First time new visitor: show once after 5 seconds, then mark as shown
      const timer = setTimeout(() => {
        setEnquireOpen(true);
        try {
          localStorage.setItem("joshis_enquiry_popup_shown_v1", "true");
        } catch (e) {}
      }, 5000);

      return () => clearTimeout(timer);
    } catch (e) {}
  }, [isCmsRoute]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // If on CMS Admin routes, render children without public header/footer/popups
  if (isCmsRoute) {
    return <>{children}</>;
  }

  // Total offset for page content = announcement bar + header
  const HEADER_HEIGHT = 64; // px - compact target height
  const contentOffset = announcementHeight + HEADER_HEIGHT;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground flex flex-col antialiased">
      <BrandLoader />

      {/* Fixed Institutional Header + Announcement Bar */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-[rgba(250,249,245,0.98)] backdrop-blur-md shadow-xs"
            : isHome
              ? "bg-transparent"
              : "border-b border-border/40 bg-ivory"
        }`}
      >
        {/* Top Announcement Bar */}
        {showAnnouncement && (
          <div
            ref={announcementRef}
            className={`w-full transition-all duration-300 overflow-hidden ${
              scrolled
                ? "max-h-0 opacity-0 py-0 border-none"
                : "max-h-24 sm:max-h-12 opacity-100 py-1.5 sm:py-2 border-b border-violet/15 bg-white text-ink shadow-2xs"
            }`}
            role="region"
            aria-label="Academic Announcement"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 sm:gap-3 flex-wrap px-3 text-center">
              <span className="inline-flex items-center gap-1 rounded bg-violet text-ivory px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shadow-2xs shrink-0">
                <Sparkles className="size-2.5 sm:size-3 text-amber-300" />
                {currentAnnouncementBadge}
              </span>
              <span className="text-[11px] sm:text-xs font-medium tracking-tight text-ink">
                {currentAnnouncementText}
              </span>
              <button
                onClick={() => setEnquireOpen(true)}
                className="text-[11px] sm:text-xs font-medium text-violet underline underline-offset-4 hover:text-royal transition-colors cursor-pointer shrink-0"
              >
                Enquire Now →
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto flex h-[58px] sm:h-[64px] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          {/* Logo + Institutional Title - compact, crisp, clean branding */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none shrink-0 min-w-0"
            aria-label={`${currentSiteName} Home`}
          >
            <div className="relative size-[34px] sm:size-[42px] shrink-0 rounded-full bg-white shadow-xs flex items-center justify-center p-0.5 border border-border/70 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/brand/logo.png"
                alt={`${currentSiteName} Academic Seal`}
                width={42}
                height={42}
                className="size-full object-contain rounded-full"
              />
            </div>
            <div className="leading-tight min-w-0">
              <span
                className={`block text-[11px] sm:text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors truncate ${
                  scrolled || !isHome ? "text-ink" : "text-ivory drop-shadow-xs"
                }`}
              >
                {currentSiteName}
              </span>
              <span
                className={`block text-[7px] sm:text-[8px] font-medium tracking-[0.18em] uppercase transition-colors mt-0.5 truncate ${
                  scrolled || !isHome ? "text-violet" : "text-lavender"
                }`}
              >
                {currentTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden items-center gap-3 xl:gap-6 lg:flex shrink-0"
            aria-label="Primary Navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[11px] xl:text-[12px] font-medium tracking-[0.08em] uppercase transition-colors ${
                  scrolled || !isHome
                    ? "text-ink/70 hover:text-violet"
                    : "text-ivory/80 hover:text-white"
                }`}
                activeProps={{
                  className:
                    scrolled || !isHome
                      ? "!text-violet !font-semibold"
                      : "!text-white !font-semibold underline underline-offset-6",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setEnquireOpen(true)}
              className={`inline-flex items-center justify-center gap-1.5 h-[36px] sm:h-[42px] px-2.5 sm:px-6 text-[10px] sm:text-[12px] font-semibold tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all rounded-md cursor-pointer shadow-sm ${
                scrolled || !isHome
                  ? "bg-violet text-ivory hover:bg-violet/90 hover:shadow-md"
                  : "bg-amber-400 text-ink hover:bg-amber-300 hover:shadow-amber-400/20"
              }`}
            >
              <span className="hidden xs:inline">I'M </span>INTERESTED →
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className={`lg:hidden flex items-center justify-center size-9 transition-colors cursor-pointer rounded-lg hover:bg-white/10 ${
                scrolled || !isHome ? "text-ink hover:text-violet" : "text-ivory hover:text-white"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-canvas Editorial Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink p-6 text-ivory animate-in fade-in duration-200 lg:hidden overflow-y-auto w-full max-w-full">
          <div className="flex items-center justify-between border-b border-ivory/15 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="relative size-12 shrink-0 rounded-full bg-white p-0.5 shadow-sm">
                <img
                  src="/brand/logo.png"
                  alt={`${site.name} Seal`}
                  width={48}
                  height={48}
                  className="size-full object-contain rounded-full"
                />
              </div>
              <div>
                <strong className="block text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase">
                  {site.name}
                </strong>
                <span className="block text-[8px] sm:text-[8.5px] font-medium tracking-[0.22em] text-lavender uppercase mt-0.5">
                  {site.tagline}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center size-9 text-ivory/70 hover:text-ivory"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            className="my-auto flex flex-col divide-y divide-ivory/10 py-4"
            aria-label="Mobile Navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-display text-2xl transition-colors hover:text-lavender"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="space-y-3 pt-5 border-t border-ivory/15">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setEnquireOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-ink h-12 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-amber-300 transition-colors shadow-md rounded-md cursor-pointer"
            >
              I'M INTERESTED <ArrowRight className="size-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-ivory/60 pt-2">
              <span>📍 Kharadi, Pune</span>
              <span>CBSE • ICSE Classes IX &amp; X</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - offset by header + announcement height */}
      <main
        className="flex-1 w-full max-w-full overflow-x-hidden pb-16 lg:pb-0"
        style={{ paddingTop: isHome ? 0 : `${contentOffset}px` }}
      >
        {children}
      </main>

      {/* Footer Component */}
      <Footer
        onEnquire={() => setEnquireOpen(true)}
        siteName={currentSiteName}
        tagline={currentTagline}
        phone={currentPhone}
        whatsapp={currentWhatsapp}
        addressDisplay={liveSettings?.address_display || site.addressDisplay}
      />

      {/* Persistent Mobile Bottom Action Bar (3 Actions: Call, WhatsApp, I'm Interested) */}
      <div className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-3 h-14 border-t border-ivory/20 shadow-2xl lg:hidden text-center bg-ink">
        <a
          href={currentPhone ? `tel:${currentPhone.replace(/\s+/g, "")}` : "#"}
          onClick={(e) => {
            if (!currentPhone) {
              e.preventDefault();
              setEnquireOpen(true);
            }
          }}
          className="flex items-center justify-center gap-1.5 border-r border-ivory/15 bg-ink text-ivory hover:bg-white/10 transition-colors px-1"
        >
          <Phone className="size-3.5 text-lavender shrink-0" />
          <span className="text-[10px] font-medium uppercase tracking-wider truncate">CALL NOW</span>
        </a>

        <a
          href={currentWhatsapp ? `https://wa.me/${currentWhatsapp.replace(/\D/g, "")}` : "#"}
          onClick={(e) => {
            if (!currentWhatsapp) {
              e.preventDefault();
              setEnquireOpen(true);
            }
          }}
          className="flex items-center justify-center gap-1.5 border-r border-ivory/15 bg-emerald-700 text-white hover:bg-emerald-800 transition-colors px-1"
        >
          <MessageSquare className="size-3.5 text-white shrink-0" />
          <span className="text-[10px] font-medium uppercase tracking-wider truncate">WHATSAPP</span>
        </a>

        <button
          type="button"
          onClick={() => setEnquireOpen(true)}
          className="flex items-center justify-center gap-1 bg-violet text-ivory hover:bg-violet/90 transition-colors cursor-pointer px-1"
        >
          <span className="text-[9.5px] font-medium uppercase tracking-wider truncate">
            I'M INTERESTED
          </span>
          <ArrowRight className="size-3 shrink-0" />
        </button>
      </div>

      {/* Global Enquiry Dialog */}
      <EnquiryDialog open={enquireOpen} onOpenChange={setEnquireOpen} />
    </div>
  );
}

function Footer({
  onEnquire,
  siteName,
  tagline,
  phone,
  whatsapp,
  addressDisplay,
}: {
  onEnquire: () => void;
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  addressDisplay: string;
}) {
  return (
    <footer className="bg-ink pb-28 pt-16 text-ivory lg:pb-12 border-t border-border/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-ivory/15 pb-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          {/* ── Column 1: Identity + Contact ──────────────────────── */}
          <div>
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 rounded-full bg-white p-0.5 shadow-xs">
                <img
                  src="/brand/logo.png"
                  alt={`${siteName} Seal`}
                  width={48}
                  height={48}
                  className="size-full object-contain rounded-full"
                />
              </div>
              <div>
                <strong className="block text-[13px] font-semibold tracking-[0.08em] uppercase text-ivory">
                  {siteName}
                </strong>
                <span className="block text-[8.5px] font-medium tracking-[0.22em] text-lavender uppercase mt-0.5">
                  {tagline}
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ivory/65">
              {site.description}
            </p>

            {/* Contact Details */}
            <div className="mt-6 space-y-3 border-t border-ivory/10 pt-5 text-xs">
              <a
                href={phone ? `tel:${phone.replace(/\s+/g, "")}` : "#"}
                className="flex items-center gap-2.5 text-ivory/75 hover:text-lavender transition-colors"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ivory/10">
                  <Phone className="size-3.5 text-lavender" />
                </span>
                <span>{phone}</span>
              </a>
              <a
                href={whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-ivory/75 hover:text-emerald-400 transition-colors"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <MessageSquare className="size-3.5 text-emerald-400" />
                </span>
                <span>WhatsApp Varsha Ma'am</span>
              </a>
              <div className="flex items-start gap-2.5 text-ivory/55">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ivory/10 mt-0.5">
                  <MapPin className="size-3.5 text-lavender" />
                </span>
                <span className="text-[12px] leading-relaxed">
                  {addressDisplay || "Kharadi, Pune, Maharashtra, India"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onEnquire}
                className="inline-flex items-center gap-2 border border-ivory/30 px-5 h-10 text-[12px] font-medium tracking-[0.11em] uppercase text-ivory hover:bg-ivory/10 transition-colors"
              >
                Book a Free Counselling Session →
              </button>
            </div>
          </div>

          {/* ── Column 2: Navigation Links ─────────────────────────── */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ivory/45 mb-3">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-medium uppercase tracking-wider">
              {[
                ...navItems,
                { label: "FAQ", to: "/faq" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="border-b border-ivory/10 py-2.5 text-ivory/65 transition-colors hover:text-lavender hover:border-lavender/40 block truncate"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Column 3: Map Embed ────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ivory/45">
              Find Us
            </p>
            <div className="overflow-hidden border border-ivory/15 rounded-sm">
              <iframe
                title="Joshi's Academy location map"
                src={site.mapsEmbed}
                width="100%"
                height="200"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-lavender hover:text-ivory transition-colors"
            >
              <Compass className="size-3.5" />
              Get Directions
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between flex-wrap border-t border-ivory/10">
          <p>© {new Date().getFullYear()} Joshi's Academy. Kharadi, Pune, Maharashtra, India.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-ivory/70">
              Designed &amp; Developed by{" "}
              <a
                href="https://nirosha.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2 decoration-purple-400/50"
              >
                Team Nirosha
              </a>
            </span>
            <button onClick={onEnquire} className="text-lavender hover:underline cursor-pointer">
              Direct Admissions Desk →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
