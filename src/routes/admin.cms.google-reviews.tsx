import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Star,
  RefreshCw,
  Sliders,
  CheckCircle,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  GooglePlacesService,
  type GoogleReviewConfig,
  type PublicGoogleReviewsPayload,
} from "@/services/cms.server";

export const Route = createFileRoute("/admin/cms/google-reviews")({
  component: CMSGoogleReviewsPage,
});

function CMSGoogleReviewsPage() {
  const [config, setConfig] = useState<GoogleReviewConfig | null>(null);
  const [reviewsData, setReviewsData] = useState<PublicGoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Form states
  const [placeId, setPlaceId] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [maxReviews, setMaxReviews] = useState(10);
  const [minRating, setMinRating] = useState(4);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadConfigAndReviews = async () => {
    setLoading(true);
    try {
      const cfg = await GooglePlacesService.getConfig("default");
      setConfig(cfg);
      setPlaceId(cfg.google_place_id || "");
      setIsEnabled(cfg.is_enabled);
      setAutoRefresh(cfg.auto_refresh);
      setMaxReviews(cfg.max_reviews);
      setMinRating(cfg.min_rating);

      const payload = await GooglePlacesService.getCachedOrFallback("default");
      setReviewsData(payload);
    } catch (e) {
      console.warn("Failed loading Google Reviews config:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigAndReviews();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await GooglePlacesService.saveConfig("default", {
        google_place_id: placeId.trim(),
        is_enabled: isEnabled,
        auto_refresh: autoRefresh,
        max_reviews: Number(maxReviews),
        min_rating: Number(minRating),
      });
      setStatusMessage("Google Reviews configuration saved successfully!");
      await loadConfigAndReviews();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert("Failed to save config: " + err?.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const freshData = await GooglePlacesService.syncReviews("default");
      setReviewsData(freshData);
      setStatusMessage("Google Reviews synchronized & cached!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert("Error syncing reviews: " + err?.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-4 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="size-4" />
          {statusMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
              <Star className="size-3 fill-amber-400 text-amber-400" /> Google Places Integration
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">
            Google Reviews & Place ID
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure server-side Google Place ID syncing, rating filters, and review limits.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 text-ink font-bold px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-amber-400 shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Google API..." : "Sync Reviews Now"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Overall Google Rating
            </span>
            <span className="font-display text-3xl font-bold text-ink mt-1 block">
              {reviewsData?.rating || 4.9} ★
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="size-5 fill-amber-400 text-amber-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Total Student Reviews
            </span>
            <span className="font-display text-3xl font-bold text-ink mt-1 block">
              {reviewsData?.totalReviews || 245}
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-violet/10 text-violet flex items-center justify-center">
            <Building2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Last Sync Timestamp
            </span>
            <span className="font-mono text-xs font-bold text-ink mt-2 block">
              {reviewsData?.lastFetchedAt
                ? new Date(reviewsData.lastFetchedAt).toLocaleString()
                : "Cached Fallback"}
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Column */}
        <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border/60">
            <Sliders className="size-4 text-violet" />
            <h2 className="font-bold text-ink text-base">Google Review Parameters</h2>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Google Place ID
              </label>
              <input
                type="text"
                placeholder="e.g. ChIJ... (Google Maps Place ID for Kharadi Campus)"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2.5 text-xs font-mono font-medium text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="size-3 text-amber-500" />
                Find Place ID using{" "}
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet underline"
                >
                  Google Place ID Finder
                </a>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Max Reviews to Display
                </label>
                <select
                  value={maxReviews}
                  onChange={(e) => setMaxReviews(Number(e.target.value))}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value={3}>3 Reviews</option>
                  <option value={5}>5 Reviews</option>
                  <option value={10}>10 Reviews</option>
                  <option value={15}>15 Reviews</option>
                  <option value={20}>20 Reviews</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Minimum Star Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value={4}>4 Stars & Above</option>
                  <option value={5}>5 Stars Only</option>
                  <option value={3}>3 Stars & Above</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-ivory cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-ink">
                    Enable Google Reviews Section
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    Show or hide Google reviews on the public homepage.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="size-4 rounded accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-ivory cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-ink">Auto-Sync Reviews Daily</span>
                  <span className="block text-[10px] text-muted-foreground">
                    Automatically fetch new Google Places reviews server-side.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="size-4 rounded accent-amber-500"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="size-3" /> Server Key Protected
              </span>

              <button
                type="submit"
                disabled={savingConfig}
                className="flex items-center gap-1.5 rounded-xl bg-violet text-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-violet-dark disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {savingConfig ? "Saving..." : "Save Config"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <h2 className="font-bold text-ink text-base">Live Synced Reviews Preview</h2>
              </div>
              {reviewsData?.googleMapsUri && (
                <a
                  href={reviewsData.googleMapsUri}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-violet hover:underline flex items-center gap-1"
                >
                  Open Maps <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="size-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              </div>
            ) : reviewsData?.reviews?.length ? (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {reviewsData.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl border border-border/70 bg-ivory/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{r.authorName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, s) => (
                          <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                      "{r.text}"
                    </p>
                    <div className="text-[9px] text-muted-foreground/70 font-semibold text-right">
                      {r.relativeTime}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No reviews synced yet. Click "Sync Reviews Now".
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex items-center justify-between">
            <span>Verified Google Places Data</span>
            <span className="font-semibold text-ink">Kharadi Campus, Pune</span>
          </div>
        </div>
      </div>
    </div>
  );
}
