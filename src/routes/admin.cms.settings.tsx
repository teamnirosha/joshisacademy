import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  ShieldCheck,
  User,
  Globe,
  Database,
  LogOut,
  CheckCircle2,
  Lock,
  Save,
  RotateCcw,
  Bell,
  Phone,
  Building,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CMSAuthService, type CMSAdminUser } from "@/services/cms-auth.server";
import type { SiteSettingsData } from "@/services/settings.server";

export const Route = createFileRoute("/admin/cms/settings")({
  component: CMSPageSettings,
});

interface DiagnosticsData {
  authenticatedUser: {
    name: string;
    email: string;
    role: string;
    sessionStatus: string;
  };
  authMechanism: string;
  passwordProtection: string;
  sessionStorage: string;
  lmsIsolation: string;
  database: {
    type: string;
    database: string;
    status: string;
  };
  publicApis: { path: string; label: string; status: string }[];
}

function CMSPageSettings() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<CMSAdminUser | null>(null);

  // Original settings from server
  const [initialSettings, setInitialSettings] = useState<SiteSettingsData | null>(null);
  // Working draft in form
  const [formData, setFormData] = useState<SiteSettingsData | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const session = CMSAuthService.getSession();
    setAdminUser(session);
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/cms/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setInitialSettings(data.settings);
        setFormData(data.settings);
        if (data.diagnostics) {
          setDiagnostics(data.diagnostics);
        }
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to load settings" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Network connection error loading settings." });
    } finally {
      setLoading(false);
    }
  };

  // Determine if user has unsaved modifications
  const isDirty = useMemo(() => {
    if (!initialSettings || !formData) return false;
    return JSON.stringify(initialSettings) !== JSON.stringify(formData);
  }, [initialSettings, formData]);

  const handleFieldChange = <K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [key]: value,
    });
    if (feedback) setFeedback(null);
  };

  const handleReset = () => {
    if (initialSettings) {
      setFormData({ ...initialSettings });
      setFeedback(null);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData || saving) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/cms/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: formData }),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setInitialSettings(data.settings);
        setFormData(data.settings);
        setFeedback({
          type: "success",
          message: "All settings saved and persisted to database successfully!",
        });
        // Auto clear success notice after 5 seconds
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Failed to save settings. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Network error occurred while saving settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/cms/auth/logout", { method: "POST" });
    } catch (e) {}
    CMSAuthService.clearSession();
    navigate({ to: "/admin/cms/login", search: { redirect: "/admin/cms" } });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Page Header Banner ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet border border-violet/20">
              <Settings className="size-3" /> System Configuration
            </span>
            {isDirty && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                Unsaved Changes
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">CMS Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure live website branding, contact numbers, announcement banner, and content module visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty || saving || loading}
            className="rounded-xl border-border/80 text-xs font-bold uppercase tracking-wider h-9"
          >
            <RotateCcw className="size-3.5 mr-1.5" /> Reset
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSave()}
            disabled={!isDirty || saving || loading}
            className="rounded-xl bg-violet hover:bg-royal text-ivory text-xs font-bold uppercase tracking-wider h-9 shadow-xs"
          >
            <Save className={`size-3.5 mr-1.5 ${saving ? "animate-spin" : ""}`} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* ── Feedback Banner ───────────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="size-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline font-bold cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading && !formData ? (
        <div className="p-12 text-center rounded-3xl border border-border/80 bg-white">
          <div className="size-8 rounded-full border-2 border-violet border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-muted-foreground">Loading CMS configuration...</p>
        </div>
      ) : formData ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* ── Section 1: Website Branding & General Info ────────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="size-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0">
                <Building className="size-4" />
              </div>
              <div>
                <h2 className="font-bold text-ink text-sm sm:text-base">Branding & Academy Identity</h2>
                <p className="text-[11px] text-muted-foreground">
                  Controls the primary titles and physical campus address shown on the public site.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Academy Display Name
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => handleFieldChange("site_name", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="Joshi’s Academy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Academy Tagline / Motto
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleFieldChange("tagline", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="Gyan Ki Varsha"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Campus Address Display
                </label>
                <input
                  type="text"
                  value={formData.address_display}
                  onChange={(e) => handleFieldChange("address_display", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="Kharadi, Pune, Maharashtra, India"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Contact & Admissions Details ───────────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="size-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="size-4" />
              </div>
              <div>
                <h2 className="font-bold text-ink text-sm sm:text-base">Contact & Admissions Channels</h2>
                <p className="text-[11px] text-muted-foreground">
                  Clickable phone and WhatsApp links connected to parent enquiries and counselling dialogs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="07030554317"
                  required
                />
                <span className="block text-[10px] text-muted-foreground mt-1">
                  Used for 1-click call buttons
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  WhatsApp Admission Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="07030554317"
                />
                <span className="block text-[10px] text-muted-foreground mt-1">
                  Used for 1-click WhatsApp chat
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="contact@joshisacademy.com"
                />
                <span className="block text-[10px] text-muted-foreground mt-1">
                  Displayed in footer and contact page
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Admission Counselling Note
                </label>
                <input
                  type="text"
                  value={formData.admission_counselling_note}
                  onChange={(e) => handleFieldChange("admission_counselling_note", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                  placeholder="Direct teacher counselling call within 24 hours."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Default Enquiry Status
                </label>
                <select
                  value={formData.default_enquiry_status}
                  onChange={(e) => handleFieldChange("default_enquiry_status", e.target.value)}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all"
                >
                  <option value="NEW">NEW (Pending Callback)</option>
                  <option value="CONTACTED">CONTACTED (Discussion Started)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Counselled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 3: Public Website Announcement Bar ────────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h2 className="font-bold text-ink text-sm sm:text-base">Website Announcement Bar</h2>
                  <p className="text-[11px] text-muted-foreground">
                    Promotional banner rendered at the top of every public page.
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formData.announcement_enabled}
                  onChange={(e) => handleFieldChange("announcement_enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet relative" />
                <span className="text-xs font-bold text-ink">
                  {formData.announcement_enabled ? "Banner Enabled" : "Banner Disabled"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={formData.announcement_badge}
                  onChange={(e) => handleFieldChange("announcement_badge", e.target.value)}
                  disabled={!formData.announcement_enabled}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all disabled:opacity-50"
                  placeholder="2025-26 AY"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={formData.announcement_text}
                  onChange={(e) => handleFieldChange("announcement_text", e.target.value)}
                  disabled={!formData.announcement_enabled}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all disabled:opacity-50"
                  placeholder="Science available at just ₹1500/- for 2025-26 AY!"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Expiration Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={formData.announcement_expiry}
                  onChange={(e) => handleFieldChange("announcement_expiry", e.target.value)}
                  disabled={!formData.announcement_enabled}
                  className="w-full rounded-xl border border-border bg-ivory/40 px-3.5 py-2 text-xs text-ink focus:border-violet focus:bg-white focus:outline-hidden transition-all disabled:opacity-50"
                />
              </div>

              <div className="md:col-span-2 flex items-center pt-5 text-xs text-muted-foreground">
                <span className="p-3 bg-ivory rounded-xl border border-border/80 w-full">
                  <strong>Preview:</strong>{" "}
                  <span className="inline-block bg-violet text-ivory text-[10px] font-bold px-2 py-0.5 rounded-md mr-1.5">
                    {formData.announcement_badge || "NOTICE"}
                  </span>
                  {formData.announcement_text || "No announcement text configured"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Section 4: Public Content Modules Visibility ─────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="size-8 rounded-lg bg-royal/10 text-royal flex items-center justify-center shrink-0">
                <Layers className="size-4" />
              </div>
              <div>
                <h2 className="font-bold text-ink text-sm sm:text-base">Content Modules Visibility</h2>
                <p className="text-[11px] text-muted-foreground">
                  Enable or disable specific sections from appearing on the public website.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Gallery Module */}
              <div className="p-4 rounded-2xl border border-border/80 bg-ivory/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-xs">Public Gallery Feed</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gallery_module_enabled}
                      onChange={(e) => handleFieldChange("gallery_module_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 relative" />
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Controls campus photographs feed on the website and gallery page.
                </p>
              </div>

              {/* YouTube Module */}
              <div className="p-4 rounded-2xl border border-border/80 bg-ivory/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-xs">YouTube Video Feed</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.youtube_module_enabled}
                      onChange={(e) => handleFieldChange("youtube_module_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 relative" />
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Controls synced YouTube video carousels and shorts playlists.
                </p>
              </div>

              {/* Google Reviews Module */}
              <div className="p-4 rounded-2xl border border-border/80 bg-ivory/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-xs">Google Reviews Feed</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reviews_module_enabled}
                      onChange={(e) => handleFieldChange("reviews_module_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 relative" />
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Controls verified Google rating score badge and parent testimonial cards.
                </p>
              </div>
            </div>
          </div>

          {/* ── Section 5: Read-Only Diagnostics & Security Status ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Account Diagnostic */}
            <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <User className="size-4 text-violet" />
                <h2 className="font-bold text-ink text-sm sm:text-base">System Diagnostics & Security</h2>
              </div>

              <div className="p-4 rounded-2xl border border-violet/20 bg-violet/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet">
                    Active CMS Administrator
                  </span>
                  <h3 className="font-bold text-ink text-sm mt-0.5">
                    {diagnostics?.authenticatedUser.name || adminUser?.name || "CMS Administrator"}
                  </h3>
                  <p className="text-xs font-mono font-medium text-muted-foreground">
                    {diagnostics?.authenticatedUser.email || adminUser?.email || "admin@joshisacademy.com"}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  {diagnostics?.authenticatedUser.sessionStatus || "ACTIVE SESSION"}
                </span>
              </div>

              <div className="space-y-2.5 text-xs pt-1">
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Authentication Mechanism</span>
                  <span className="font-semibold text-ink">{diagnostics?.authMechanism || "Isolated CMS Auth Service"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Password Protection</span>
                  <span className="font-semibold text-ink flex items-center gap-1">
                    <Lock className="size-3 text-violet" /> {diagnostics?.passwordProtection || "Bcrypt Hash Verified"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Database Persistence</span>
                  <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                    <Database className="size-3 text-emerald-600" />{" "}
                    {diagnostics?.database.status === "CONNECTED"
                      ? "MySQL Database (Active)"
                      : "Local Storage Fallback"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground font-medium">LMS Isolation</span>
                  <span className="font-extrabold text-emerald-700">100% Standalone</span>
                </div>
              </div>
            </div>

            {/* Public APIs Status */}
            <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <Globe className="size-4 text-violet" />
                <h2 className="font-bold text-ink text-sm sm:text-base">Public Website API Endpoints</h2>
              </div>

              <div className="space-y-2.5">
                {(diagnostics?.publicApis || [
                  { path: "/api/public/gallery", label: "Public Gallery Feed", status: "ONLINE" },
                  { path: "/api/public/youtube", label: "Public YouTube Videos Feed", status: "ONLINE" },
                  { path: "/api/public/google-reviews", label: "Public Google Reviews Cache", status: "ONLINE" },
                  { path: "/api/public/settings", label: "Public Settings & Announcements", status: "ONLINE" },
                ]).map((api, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-border/70 bg-ivory/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="block font-bold text-ink text-xs">{api.label}</span>
                      <span className="block font-mono text-[10px] text-violet mt-0.5">{api.path}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> {api.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl border border-border/80 bg-ivory text-[11px] text-muted-foreground space-y-1">
                <span className="font-bold text-ink block">Security Guarantee:</span>
                <p>
                  Public APIs expose no administrative credentials or sensitive database tokens.
                  Write operations strictly require authenticated administrator authorization.
                </p>
              </div>
            </div>
          </div>

          {/* ── Sticky Bottom Action Bar when Changes are Made ───────────────────── */}
          {isDirty && (
            <div className="sticky bottom-4 z-20 rounded-2xl border border-violet/30 bg-white/95 backdrop-blur-md p-4 shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-ink">
                  You have unsaved configuration changes.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={saving}
                  className="rounded-xl border-border/80 text-xs font-bold uppercase tracking-wider h-9"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving}
                  className="rounded-xl bg-violet hover:bg-royal text-ivory text-xs font-bold uppercase tracking-wider h-9 shadow-xs"
                >
                  <Save className={`size-3.5 mr-1.5 ${saving ? "animate-spin" : ""}`} />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </form>
      ) : null}
    </div>
  );
}
