import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Youtube,
  Video,
  Smartphone,
  ListVideo,
  ExternalLink,
  Clock,
  Calendar,
  Eye,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Tv,
} from "lucide-react";
import { gsap } from "gsap";
import type { YouTubeVideoItem } from "@/services/cms.server";
import type { YouTubeChannelConfig, YouTubePlaylistItem } from "@/services/youtube.server";
import { VideoModal } from "@/components/youtube/VideoModal";
import { ShortsCarousel } from "@/components/youtube/ShortsCarousel";
import { PlaylistDetailModal } from "@/components/youtube/PlaylistDetailModal";

const INITIAL_VISIBLE_VIDEOS = 8;
const LOAD_MORE_STEP = 4;

export function LatestVideos() {
  const [activeTab, setActiveTab] = useState<"VIDEOS" | "SHORTS" | "PLAYLISTS">("VIDEOS");
  const [channel, setChannel] = useState<YouTubeChannelConfig | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [shorts, setShorts] = useState<YouTubeVideoItem[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylistItem[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideoItem | null>(null);

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylistItem | null>(null);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const newCardsRef = useRef<HTMLDivElement>(null);

  // Fetch public YouTube data from backend API
  useEffect(() => {
    let isMounted = true;

    async function fetchYouTubeData() {
      try {
        const res = await fetch("/api/public/youtube");
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;

          if (data.channel) setChannel(data.channel);
          if (data.allVideos && data.allVideos.length > 0) {
            setVideos(data.allVideos);
          } else if (data.videos && data.videos.length > 0) {
            setVideos(data.videos);
          }

          if (data.featuredVideo) {
            setFeaturedVideo(data.featuredVideo);
          }

          if (data.shorts) setShorts(data.shorts);
          if (data.playlists) setPlaylists(data.playlists);
        }
      } catch (err) {
        console.warn("YouTube public API fetch notice:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchYouTubeData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Set default featured video if not explicitly set
  const nonShortVideos = videos.filter((v) => !v.is_short && v.content_type !== "SHORT");
  const activeFeatured =
    featuredVideo || nonShortVideos.find((v) => v.is_featured) || nonShortVideos[0] || null;
  const gridVideos = activeFeatured
    ? nonShortVideos.filter((v) => v.id !== activeFeatured.id)
    : nonShortVideos;
  const displayedGridVideos = gridVideos.slice(0, visibleCount);
  const hasMoreVideos = visibleCount < gridVideos.length;

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Section Entrance GSAP Animation
  useEffect(() => {
    if (loading || prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Intro entrance
      gsap.fromTo(
        ".yt-hero-tagline",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
      gsap.fromTo(
        ".yt-hero-heading",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: "power2.out" },
      );
      gsap.fromTo(
        ".yt-hero-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power2.out" },
      );
      gsap.fromTo(
        ".yt-hero-cta",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, stagger: 0.1, ease: "power2.out" },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, prefersReducedMotion]);

  // Tab change animation
  const handleTabChange = (tab: "VIDEOS" | "SHORTS" | "PLAYLISTS") => {
    if (activeTab === tab) return;

    if (!prefersReducedMotion && tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }
    setActiveTab(tab);
  };

  // Load More Handler with GSAP Stagger
  const handleLoadMore = () => {
    const prevCount = visibleCount;
    const nextCount = prevCount + LOAD_MORE_STEP;
    setVisibleCount(nextCount);

    if (!prefersReducedMotion) {
      setTimeout(() => {
        const newElements = document.querySelectorAll(".yt-video-card-new");
        if (newElements.length > 0) {
          gsap.fromTo(
            newElements,
            { opacity: 0, y: 25, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
              onComplete: () => {
                newElements.forEach((el) => el.classList.remove("yt-video-card-new"));
              },
            },
          );
        }
      }, 30);
    }
  };

  const channelUrl = channel?.channel_url || "https://www.youtube.com/@varshastutorials";
  const channelHandle = channel?.channel_handle || "@varshastutorials";
  const channelName = channel?.channel_name || "Varsha Tutorials";
  const channelAvatar =
    channel?.channel_thumbnail || "/brand/varshas-tutorials-avatar.jpg";

  const formatRelativeDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="youtube-experience"
      className="bg-[#faf8f5] py-16 sm:py-24 border-b border-border/70 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── SECTION 1: HERO / INTRO BANNER ──────────────────────────────── */}
        <div
          ref={heroRef}
          className="relative bg-ink text-ivory rounded-3xl p-6 sm:p-10 lg:p-12 mb-12 shadow-xl border border-white/10 overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              {/* Tagline */}
              <div className="yt-hero-tagline inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-medium uppercase tracking-wider mb-4 backdrop-blur-xs">
                <Sparkles className="size-3.5" />
                <span>LEARN • EXPLORE • GROW</span>
              </div>

              {/* Main Heading */}
              <h2 className="yt-hero-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug">
                Latest from Varsha Tutorials
              </h2>

              {/* Subtitle Description */}
              <p className="yt-hero-desc mt-3 text-sm sm:text-base text-ivory/80 leading-relaxed max-w-xl">
                Discover authentic secondary science lectures, bite-sized revision Shorts, and
                complete CBSE &amp; ICSE learning playlists from our official YouTube channel.
              </p>

              {/* Action Buttons */}
              <div className="yt-hero-cta mt-6 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => {
                    const grid = document.getElementById("youtube-content-tabs");
                    grid?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ivory text-ink hover:bg-white font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="size-3.5 fill-current" />
                  <span>Explore Videos</span>
                </button>

                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Youtube className="size-4 fill-white" />
                  <span>Visit YouTube Channel ↗</span>
                </a>
              </div>
            </div>

            {/* Channel Profile Card */}
            <div className="yt-hero-cta bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl backdrop-blur-md lg:w-80 shrink-0 flex flex-col justify-between">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative shrink-0">
                  <img
                    src={channelAvatar}
                    alt={channelName}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith("/brand/varshas-tutorials-avatar.jpg")) {
                        target.src = "/brand/varshas-tutorials-avatar.jpg";
                      }
                    }}
                    className="size-14 rounded-full object-cover border-2 border-red-500 shadow-md shrink-0 bg-neutral-900"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border border-black shadow-xs flex items-center justify-center">
                    <Youtube className="size-2.5 text-white fill-white" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-sm text-white truncate">{channelName}</h4>
                    <CheckCircle2 className="size-4 text-red-500 fill-red-500/20 shrink-0" />
                  </div>
                  <p className="text-xs text-ivory/60 font-mono">{channelHandle}</p>
                  <span className="inline-block mt-1 text-[11px] font-medium text-amber-400">
                    {channel?.subscriber_count
                      ? `${channel.subscriber_count.toLocaleString()}+ Learners`
                      : "24,800+ Learners"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-ivory/70">
                <span>{videos.length || 42} Full Lessons</span>
                <span>•</span>
                <span>{shorts.length || 12} Shorts</span>
                <span>•</span>
                <span>{playlists.length || 4} Playlists</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: TOP NAVIGATION TABS ──────────────────────────────── */}
        <div id="youtube-content-tabs" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-3">
            {/* Tabs List */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
              role="tablist"
            >
              <button
                role="tab"
                aria-selected={activeTab === "VIDEOS"}
                onClick={() => handleTabChange("VIDEOS")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "VIDEOS"
                    ? "bg-[#35208f] text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-ink border border-border/70"
                }`}
              >
                <Video className="size-4" />
                <span>Videos ({nonShortVideos.length})</span>
                {activeTab === "VIDEOS" && (
                  <span className="absolute bottom-0 inset-x-4 h-0.5 bg-amber-400 rounded-full animate-in fade-in" />
                )}
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "SHORTS"}
                onClick={() => handleTabChange("SHORTS")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "SHORTS"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-ink border border-border/70"
                }`}
              >
                <Smartphone className="size-4" />
                <span>Shorts ({shorts.length})</span>
                {activeTab === "SHORTS" && (
                  <span className="absolute bottom-0 inset-x-4 h-0.5 bg-white rounded-full animate-in fade-in" />
                )}
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "PLAYLISTS"}
                onClick={() => handleTabChange("PLAYLISTS")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "PLAYLISTS"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-ink border border-border/70"
                }`}
              >
                <ListVideo className="size-4" />
                <span>Playlists ({playlists.length})</span>
                {activeTab === "PLAYLISTS" && (
                  <span className="absolute bottom-0 inset-x-4 h-0.5 bg-white rounded-full animate-in fade-in" />
                )}
              </button>
            </div>

            {/* Direct Channel External Link */}
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#35208f] hover:underline self-end sm:self-auto shrink-0"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        {/* ─── SECTION 3: TAB CONTENT CONTAINER ────────────────────────────── */}
        <div ref={tabContentRef}>
          {/* ─────────────────────────────────────────────────────────────────
              TAB 1: VIDEOS (FEATURED EDITORIAL HERO + 4-COLUMN GRID)
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === "VIDEOS" && (
            <div className="space-y-8">
              {/* Featured Video Editorial Card */}
              {activeFeatured && (
                <div
                  onClick={() => setSelectedVideo(activeFeatured)}
                  className="group bg-white rounded-2xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer grid lg:grid-cols-12 gap-0"
                >
                  {/* Left: Large Thumbnail */}
                  <div className="relative lg:col-span-7 aspect-video bg-black overflow-hidden">
                    <img
                      src={
                        activeFeatured.thumbnail_url ||
                        `https://img.youtube.com/vi/${activeFeatured.youtube_video_id}/maxresdefault.jpg`
                      }
                      alt={activeFeatured.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="size-16 sm:size-20 rounded-full bg-[#35208f]/90 text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-105 transition-all duration-300">
                        <Play className="size-8 fill-white ml-1" />
                      </div>
                    </div>

                    {activeFeatured.duration && (
                      <span className="absolute bottom-3 right-3 bg-black/85 text-white font-mono text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
                        {activeFeatured.duration}
                      </span>
                    )}
                  </div>

                  {/* Right: Editorial Information */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 font-semibold text-[11px] uppercase tracking-wider">
                          FEATURED LESSON
                        </span>
                        {activeFeatured.view_count && (
                          <span className="text-xs text-muted-foreground font-normal">
                            • {activeFeatured.view_count} views
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold text-ink group-hover:text-[#35208f] transition-colors leading-snug">
                        {activeFeatured.title}
                      </h3>

                      {activeFeatured.description && (
                        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {activeFeatured.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-border/60 flex items-center justify-between mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35208f] text-white text-xs font-semibold uppercase tracking-wider group-hover:bg-[#2b177d] transition-colors shadow-xs"
                      >
                        <Play className="size-3.5 fill-white" />
                        <span>Watch Video</span>
                      </button>

                      {activeFeatured.published_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeDate(activeFeatured.published_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4-Column Grid of Lessons */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-ink">
                    More Lectures &amp; Lessons
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Showing {displayedGridVideos.length} of {gridVideos.length} videos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                  {displayedGridVideos.map((vid, idx) => {
                    const isNewlyAppended = idx >= visibleCount - LOAD_MORE_STEP;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => setSelectedVideo(vid)}
                        className={`group bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                          isNewlyAppended ? "yt-video-card-new" : ""
                        }`}
                      >
                        <div>
                          {/* 16:9 Thumbnail Frame */}
                          <div className="relative aspect-video bg-black overflow-hidden">
                            <img
                              src={
                                vid.thumbnail_url ||
                                `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`
                              }
                              alt={vid.title}
                              loading="lazy"
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />

                            {/* Dark Translucent Hover Overlay + Play Button ○ ▶ */}
                            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                              <div className="size-12 rounded-full bg-[#35208f] text-white flex items-center justify-center shadow-lg transform scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                <Play className="size-5 fill-white ml-0.5" />
                              </div>
                            </div>

                            {/* Duration Badge Bottom-Right */}
                            {vid.duration && (
                              <span className="absolute bottom-2 right-2 bg-ink/90 text-white font-mono text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                                {vid.duration}
                              </span>
                            )}
                          </div>

                          {/* Card Information */}
                          <div className="p-4">
                            <h5 className="font-semibold text-sm sm:text-base text-ink leading-snug group-hover:text-[#35208f] transition-colors line-clamp-2">
                              {vid.title}
                            </h5>

                            {vid.description && (
                              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {vid.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Metadata Footer */}
                        <div className="px-4 pb-4 pt-0 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                          <span className="font-medium text-[#35208f] group-hover:underline">
                            Watch Video →
                          </span>
                          <span>
                            {vid.published_at ? formatRelativeDate(vid.published_at) : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Load More & View All CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                {hasMoreVideos && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full sm:w-auto min-w-[200px] px-8 py-3 rounded-xl bg-white hover:bg-ivory text-ink font-semibold text-xs uppercase tracking-wider border border-border shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    Load More Lessons
                  </button>
                )}

                <Link
                  to="/youtube"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#35208f]/10 hover:bg-[#35208f] text-[#35208f] hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  <span>View All Videos</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 2: SHORTS (HORIZONTAL 9:16 SCROLL CAROUSEL)
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === "SHORTS" && (
            <div className="space-y-6">
              <ShortsCarousel shorts={shorts} onSelectShort={(s) => setSelectedVideo(s)} />

              <div className="pt-4 text-center">
                <a
                  href={`${channelUrl}/shorts`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  <Smartphone className="size-4" />
                  <span>Browse All Shorts on YouTube ↗</span>
                </a>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 3: PLAYLISTS (CURATED COURSE PATHS)
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === "PLAYLISTS" && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl text-ink font-semibold">
                  Explore Our Playlists
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                  Follow complete learning journeys with our curated YouTube playlists for CBSE
                  &amp; ICSE board exams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlaylist(pl)}
                    className="group bg-white rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Playlist Thumbnail Frame */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={
                            pl.thumbnail_url ||
                            "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop"
                          }
                          alt={pl.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-ink/35 group-hover:bg-ink/20 transition-colors" />

                        {/* Video Count Overlay Badge */}
                        <div className="absolute bottom-2.5 right-2.5 bg-ink/90 text-white font-medium text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-xs shadow-xs">
                          <ListVideo className="size-3.5 text-amber-400" />
                          <span>▶ {pl.video_count || 12} Videos</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h4 className="font-semibold text-base text-ink leading-snug group-hover:text-[#35208f] transition-colors line-clamp-2">
                          {pl.title}
                        </h4>
                        {pl.description && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {pl.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:text-[#35208f] transition-colors">
                        <span>View Playlist</span>
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── VIDEO PLAYER MODAL (16:9 VIDEO & 9:16 SHORTS) ──────────────────── */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          channelUrl={channelUrl}
        />
      )}

      {/* ─── PLAYLIST DETAIL MODAL ──────────────────────────────────────────── */}
      {selectedPlaylist && (
        <PlaylistDetailModal
          playlist={selectedPlaylist}
          videos={nonShortVideos}
          onClose={() => setSelectedPlaylist(null)}
          onSelectVideo={(v) => {
            setSelectedPlaylist(null);
            setSelectedVideo(v);
          }}
        />
      )}
    </section>
  );
}
