import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, Compass, MapPin, Menu, MessageSquare, Phone, Sparkles, X } from "lucide-react";
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

  useEffect(() => {
    if (announcement.enabled) {
      const isExpired = announcement.expiry && new Date(announcement.expiry) < new Date();
      if (!isExpired) {
        setShowAnnouncement(true);
      }
    }
  }, []);

  // Measure the announcement bar height so we can offset the fixed header correctly
  useEffect(() => {
    if (!showAnnouncement) {
      setAnnouncementHeight(0);
      return;
    }
    const el = announcementRef.current;
    if (!el) return;
    setAnnouncementHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => setAnnouncementHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
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

  // Automatically trigger attractive enquiry popup 3 seconds after website visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnquireOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  // Total offset for page content = announcement bar + header
  const HEADER_HEIGHT = 72; // px — compact target height
  const contentOffset = announcementHeight + HEADER_HEIGHT;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground flex flex-col antialiased">
      <BrandLoader />

      {/* Top Configurable Announcement Bar — fixed at very top */}
      {showAnnouncement && (
        <div
          ref={announcementRef}
          className="fixed inset-x-0 top-0 z-50 bg-violet text-ivory px-4 py-2 text-center"
          role="region"
          aria-label="Academic Announcement"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ivory">
              <Sparkles className="size-3" />
              {announcement.badge}
            </span>
            <span className="text-xs tracking-tight">{announcement.text}</span>
            <button
              onClick={() => setEnquireOpen(true)}
              className="ml-1 text-xs font-bold underline underline-offset-4 hover:text-lavender transition-colors cursor-pointer"
            >
              Enquire Now →
            </button>
          </div>
        </div>
      )}

      {/* Fixed Institutional Navbar — compact width with large, clean logo */}
      <header
        style={{ top: `${announcementHeight}px` }}
        className={`fixed inset-x-0 z-40 transition-all duration-200 ${scrolled
          ? "border-b border-border bg-[rgba(250,249,245,0.97)] backdrop-blur-md shadow-xs"
          : isHome
            ? "bg-transparent"
            : "border-b border-border/40 bg-ivory"
          }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + Institutional Title — large, crisp, clean branding */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group cursor-pointer focus:outline-none"
            aria-label={`${site.name} Home`}
          >
            <div className="relative size-[54px] sm:size-[58px] shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center p-0.5 border border-border/70 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/brand/logo.png"
                alt={`${site.name} Academic Seal`}
                width={58}
                height={58}
                className="size-full object-contain rounded-full"
              />
            </div>
            <div className="leading-tight">
              <span
                className={`block text-[13px] sm:text-[14.5px] font-extrabold tracking-[0.08em] uppercase transition-colors ${scrolled || !isHome ? "text-ink" : "text-ivory drop-shadow-xs"
                  }`}
              >
                {site.name}
              </span>
              <span
                className={`block text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.20em] uppercase transition-colors mt-0.5 ${scrolled || !isHome ? "text-violet" : "text-lavender"
                  }`}
              >
                {site.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden items-center gap-[22px] xl:gap-[28px] lg:flex"
            aria-label="Primary Navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors ${scrolled || !isHome
                  ? "text-ink/70 hover:text-violet"
                  : "text-ivory/80 hover:text-white"
                  }`}
                activeProps={{
                  className:
                    scrolled || !isHome
                      ? "!text-violet !font-bold"
                      : "!text-white !font-bold underline underline-offset-8",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnquireOpen(true)}
              className={`hidden sm:inline-flex items-center gap-1.5 h-[40px] px-5 text-[11px] font-extrabold tracking-[0.11em] uppercase transition-colors rounded-sm cursor-pointer ${scrolled || !isHome
                ? "bg-violet text-ivory hover:bg-violet/90"
                : "bg-ivory text-ink hover:bg-white shadow-md"
                }`}
            >
              SPEAK TO VARSHA MA'AM →
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className={`lg:hidden flex items-center justify-center size-9 transition-colors ${scrolled || !isHome ? "text-ink hover:text-violet" : "text-ivory hover:text-white"
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
                <strong className="block text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase">
                  {site.name}
                </strong>
                <span className="block text-[8px] sm:text-[8.5px] font-bold tracking-[0.22em] text-lavender uppercase mt-0.5">
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
              className="w-full flex items-center justify-center gap-2 bg-violet text-ivory h-12 text-xs font-bold tracking-[0.12em] uppercase hover:bg-violet/90 transition-colors shadow-sm"
            >
              SPEAK TO VARSHA MA'AM <ArrowRight className="size-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-ivory/50 pt-1">
              <span>Kharadi, Pune</span>
              <span>CBSE • ICSE Science</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area — offset by header + announcement height */}
      <main
        className="flex-1 w-full max-w-full overflow-x-hidden pb-16 lg:pb-0"
        style={{ paddingTop: isHome ? 0 : `${contentOffset}px` }}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer onEnquire={() => setEnquireOpen(true)} />

      {/* Mobile Fixed Bottom Action Bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-3 border-t border-border/20 bg-ink text-ivory shadow-[0_-4px_16px_rgba(0,0,0,0.25)] lg:hidden"
        role="navigation"
        aria-label="Mobile Action Bar"
      >
        <a
          href={site.phone ? `tel:${site.phone}` : "#"}
          onClick={(e) => {
            if (!site.phone) {
              e.preventDefault();
              setEnquireOpen(true);
            }
          }}
          className="flex items-center justify-center gap-1.5 border-r border-ivory/15 bg-ink text-ivory hover:bg-white/10 transition-colors px-1"
        >
          <Phone className="size-3.5 text-lavender shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider truncate">CALL NOW</span>
        </a>

        <a
          href={site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : "#"}
          onClick={(e) => {
            if (!site.whatsapp) {
              e.preventDefault();
              setEnquireOpen(true);
            }
          }}
          className="flex items-center justify-center gap-1.5 border-r border-ivory/15 bg-emerald-700 text-white hover:bg-emerald-800 transition-colors px-1"
        >
          <MessageSquare className="size-3.5 text-white shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider truncate">WHATSAPP</span>
        </a>

        <button
          type="button"
          onClick={() => setEnquireOpen(true)}
          className="flex items-center justify-center gap-1 bg-violet text-ivory hover:bg-violet/90 transition-colors cursor-pointer px-1"
        >
          <span className="text-[9.5px] font-bold uppercase tracking-wider truncate">SPEAK TO VARSHA</span>
          <ArrowRight className="size-3 shrink-0" />
        </button>
      </div>

      {/* Global Enquiry Dialog */}
      <EnquiryDialog open={enquireOpen} onOpenChange={setEnquireOpen} />
    </div>
  );
}

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return (
    <footer className="bg-ink pb-28 pt-16 text-ivory lg:pb-12 border-t border-border/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-ivory/15 pb-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          {/* ── Column 1: Identity + Contact ──────────────────────── */}
          <div>
            {/* Logo & Brand */}
            <div className="flex items-center gap-3.5">
              <div className="relative size-14 shrink-0 rounded-full bg-white p-0.5 shadow-sm">
                <img
                  src="/brand/logo.png"
                  alt={`${site.name} Academic Seal`}
                  width={56}
                  height={56}
                  className="size-full object-contain rounded-full"
                />
              </div>
              <div>
                <p className="text-[13px] sm:text-[13.5px] font-extrabold tracking-[0.10em] uppercase text-ivory">
                  {site.name}
                </p>
                <p className="mt-[2px] text-[8px] sm:text-[8.5px] font-bold tracking-[0.24em] uppercase text-lavender">
                  {site.tagline}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm font-display text-xl text-ivory/95 leading-snug">
              Specialist Science Coaching for CBSE &amp; ICSE Classes IX &amp; X.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/55">
              Personalised attention, concept-first teaching, and rigorous testing in Kharadi, Pune,
              Maharashtra.
            </p>

            {/* Contact Details */}
            <div className="mt-7 space-y-2.5 text-sm">
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-2.5 text-ivory/75 hover:text-ivory transition-colors group"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ivory/10 group-hover:bg-violet/40 transition-colors">
                  <Phone className="size-3.5 text-lavender" />
                </span>
                <span className="text-[13px] font-semibold tracking-wide">{site.phone}</span>
              </a>
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-ivory/75 hover:text-ivory transition-colors group"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ivory/10 group-hover:bg-green-600/40 transition-colors">
                  <MessageSquare className="size-3.5 text-green-400" />
                </span>
                <span className="text-[13px] font-semibold tracking-wide">WhatsApp Us</span>
              </a>
              <div className="flex items-start gap-2.5 text-ivory/55">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ivory/10 mt-0.5">
                  <MapPin className="size-3.5 text-lavender" />
                </span>
                <span className="text-[12px] leading-relaxed">
                  Kharadi, Pune,
                  <br />
                  Maharashtra, India
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onEnquire}
                className="inline-flex items-center gap-2 border border-ivory/30 px-5 h-10 text-[12px] font-bold tracking-[0.11em] uppercase text-ivory hover:bg-ivory/10 transition-colors"
              >
                Book a Free Counselling Session →
              </button>
            </div>
          </div>

          {/* ── Column 2: Navigation Links ─────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory/45 mb-3">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-semibold uppercase tracking-wider">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory/45">
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
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-lavender hover:text-ivory transition-colors"
            >
              <Compass className="size-3.5" />
              Get Directions
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <p>© {new Date().getFullYear()} Joshi's Academy. Kharadi, Pune, Maharashtra, India.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-ivory/35">CBSE • ICSE • Science • IX–X</span>
            <button onClick={onEnquire} className="text-lavender hover:underline cursor-pointer">
              Direct Admissions Desk →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
