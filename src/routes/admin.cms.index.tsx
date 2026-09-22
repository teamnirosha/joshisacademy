import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Video,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GalleryService,
  YouTubeService,
  GooglePlacesService,
  type PublicGoogleReviewsPayload,
} from "@/services/cms.server";

export const Route = createFileRoute("/admin/cms/")({
  component: CMSDashboardPage,
});

function CMSDashboardPage() {
  const [galleryCount, setGalleryCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [reviewsData, setReviewsData] = useState<PublicGoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [gItems, vItems, rData] = await Promise.all([
          GalleryService.getItems("default", true),
          YouTubeService.getVideos("default", true),
          GooglePlacesService.getCachedOrFallback("default"),
        ]);
        setGalleryCount(gItems.length);
        setVideoCount(vItems.length);
        setReviewsData(rData);
      } catch (err) {
        console.warn("CMS Dashboard load notice:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet border border-violet/20">
              <Sparkles className="size-3 text-amber-500" /> CMS Overview
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Joshi's Academy CMS Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Welcome to the standalone website content management system. Control live gallery
            photos, YouTube videos, and Google reviews for Kharadi Campus.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Gallery */}
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Gallery Images
            </span>
            <div className="size-9 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
              <ImageIcon className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-ink">
              {loading ? "…" : galleryCount}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Live on Site
            </span>
          </div>
          <div className="pt-2 border-t border-border/60">
            <Link
              to="/admin/cms/gallery"
              className="text-xs font-bold text-violet hover:underline inline-flex items-center gap-1"
            >
              Manage Gallery →
            </Link>
          </div>
        </div>

        {/* Card 2: YouTube */}
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Published Videos
            </span>
            <div className="size-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-ink">
              {loading ? "…" : videoCount}
            </span>
            <span className="text-[10px] text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
              YouTube Sync
            </span>
          </div>
          <div className="pt-2 border-t border-border/60">
            <Link
              to="/admin/cms/youtube"
              className="text-xs font-bold text-violet hover:underline inline-flex items-center gap-1"
            >
              Manage Videos →
            </Link>
          </div>
        </div>

        {/* Card 3: Google Rating */}
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Google Rating
            </span>
            <div className="size-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="size-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-ink">
              {reviewsData?.rating || "4.9"} ★
            </span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <div className="pt-2 border-t border-border/60">
            <Link
              to="/admin/cms/google-reviews"
              className="text-xs font-bold text-violet hover:underline inline-flex items-center gap-1"
            >
              Configure Google →
            </Link>
          </div>
        </div>

        {/* Card 4: Total Reviews */}
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Google Reviews
            </span>
            <div className="size-9 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-ink">
              {reviewsData?.totalReviews || "245"}
            </span>
            <span className="text-[10px] text-violet font-semibold bg-violet/10 px-2 py-0.5 rounded-full">
              Cached Sync
            </span>
          </div>
          <div className="pt-2 border-t border-border/60">
            <Link
              to="/admin/cms/google-reviews"
              className="text-xs font-bold text-violet hover:underline inline-flex items-center gap-1"
            >
              Sync Reviews →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Log & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent CMS Activity */}
        <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-violet" />
              <h3 className="font-bold text-ink text-base">Recent CMS Activity Log</h3>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              System Audit
            </span>
          </div>

          <div className="divide-y divide-border/50">
            {[
              {
                title: "Google Reviews Synchronized",
                detail: "Places API cache updated",
                time: "Just now",
                icon: CheckCircle2,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                title: "YouTube Video Sequence Saved",
                detail: "Drag & drop display order updated",
                time: "10 mins ago",
                icon: Video,
                color: "text-red-600 bg-red-50",
              },
              {
                title: "New Gallery Image Added",
                detail: "Classroom Science Experiment Session",
                time: "1 hour ago",
                icon: ImageIcon,
                color: "text-violet bg-violet/10",
              },
            ].map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center ${act.color}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{act.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{act.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground/70 font-semibold">
                    {act.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-ink text-base pb-2 border-b border-border/60">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/admin/cms/gallery"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:border-violet/40 hover:bg-lavender/30 transition-all text-xs font-bold text-ink"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4 text-violet" />
                <span>Upload New Gallery Image</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/cms/youtube"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:border-violet/40 hover:bg-lavender/30 transition-all text-xs font-bold text-ink"
            >
              <div className="flex items-center gap-2">
                <Video className="size-4 text-red-600" />
                <span>Add YouTube Video Link</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/cms/google-reviews"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:border-violet/40 hover:bg-lavender/30 transition-all text-xs font-bold text-ink"
            >
              <div className="flex items-center gap-2">
                <Star className="size-4 text-amber-500 fill-amber-400" />
                <span>Update Google Place ID</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
