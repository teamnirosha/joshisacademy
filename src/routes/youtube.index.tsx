import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Youtube,
  Play,
  Smartphone,
  ListVideo,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import type { YouTubeVideoItem } from "@/services/cms.server";
import type { YouTubeChannelConfig, YouTubePlaylistItem } from "@/services/youtube.server";
import { VideoModal } from "@/components/youtube/VideoModal";
import { ShortsCarousel } from "@/components/youtube/ShortsCarousel";
import { PlaylistDetailModal } from "@/components/youtube/PlaylistDetailModal";

export const Route = createFileRoute("/youtube/")({
  head: () => ({
    meta: [
      { title: "Varsha Tutorials Video Lectures & Shorts | Joshi's Academy" },
      {
        name: "description",
        content:
          "Watch authentic Class 9 & 10 CBSE & ICSE Physics & Chemistry video lectures, practical experiments, Shorts and complete playlists from Varsha Tutorials.",
      },
    ],
  }),
  component: YouTubeIndexPage,
});

function YouTubeIndexPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "VIDEOS" | "SHORTS" | "PLAYLISTS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [channel, setChannel] = useState<YouTubeChannelConfig | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [shorts, setShorts] = useState<YouTubeVideoItem[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylistItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylistItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/public/youtube?type=all");
        if (res.ok) {
          const data = await res.json();
          if (data.channel) setChannel(data.channel);
          if (data.allVideos) setVideos(data.allVideos);
          else if (data.videos) setVideos(data.videos);
          if (data.shorts) setShorts(data.shorts);
          if (data.playlists) setPlaylists(data.playlists);
        }
      } catch (e) {
        console.warn("Failed to load YouTube videos:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const nonShortVideos = useMemo(
    () => videos.filter((v) => !v.is_short && v.content_type !== "SHORT"),
    [videos],
  );

  // Filter videos based on activeTab and searchQuery
  const filteredVideos = useMemo(() => {
    let list: YouTubeVideoItem[] = [];
    if (activeTab === "ALL" || activeTab === "VIDEOS") {
      list = nonShortVideos;
    } else if (activeTab === "SHORTS") {
      list = shorts;
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)),
    );
  }, [activeTab, nonShortVideos, shorts, searchQuery]);

  // Paginated videos
  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredVideos.slice(0, start + itemsPerPage);
  }, [filteredVideos, page, itemsPerPage]);

  const hasMore = paginatedVideos.length < filteredVideos.length;

  const channelUrl = channel?.channel_url || "https://www.youtube.com/@varshastutorials";
  const channelName = channel?.channel_name || "Varsha Tutorials";
  const channelAvatar =
    channel?.channel_thumbnail || "/brand/varshas-tutorials-avatar.jpg";

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#35208f] hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-xs hover:bg-red-700 transition-colors"
          >
            <Youtube className="size-4 fill-white" />
            <span>Visit YouTube Channel</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Channel Hero Header */}
        <div className="bg-ink text-ivory rounded-3xl p-6 sm:p-10 mb-10 shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
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
                  className="size-16 sm:size-20 rounded-full object-cover border-2 border-red-500 shadow-md shrink-0 bg-neutral-900"
                />
                <span className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1.5 border-2 border-black shadow-xs flex items-center justify-center">
                  <Youtube className="size-3 text-white fill-white" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    {channelName}
                  </h1>
                  <CheckCircle2 className="size-5 text-red-500 fill-red-500/20" />
                </div>
                <p className="text-sm text-ivory/70 font-mono">@varshastutorials</p>
                <p className="mt-1 text-xs text-amber-400 font-medium">
                  Official Secondary Science Coaching Channel • Joshi's Academy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-ivory/80 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="text-center">
                <span className="block text-xl font-semibold text-white">
                  {nonShortVideos.length}
                </span>
                <span className="text-[11px] text-ivory/60 uppercase">Lessons</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-semibold text-white">
                  {shorts.length}
                </span>
                <span className="text-[11px] text-ivory/60 uppercase">Shorts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-semibold text-white">
                  {playlists.length}
                </span>
                <span className="text-[11px] text-ivory/60 uppercase">Playlists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white p-4 rounded-2xl border border-border/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setActiveTab("ALL");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "ALL"
                  ? "bg-[#35208f] text-white shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-ink"
              }`}
            >
              All Lessons ({nonShortVideos.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("SHORTS");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "SHORTS"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-ink"
              }`}
            >
              Shorts ({shorts.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("PLAYLISTS");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "PLAYLISTS"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-ink"
              }`}
            >
              Playlists ({playlists.length})
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== "PLAYLISTS" && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lessons & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-[#faf8f5] text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#35208f]/20 focus:border-[#35208f]"
              />
            </div>
          )}
        </div>

        {/* ─── TAB: PLAYLISTS VIEW ─────────────────────────────────────────── */}
        {activeTab === "PLAYLISTS" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className="group bg-white rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={
                        pl.thumbnail_url ||
                        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={pl.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors" />
                    <div className="absolute bottom-2.5 right-2.5 bg-ink/90 text-white font-bold text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-xs">
                      <ListVideo className="size-3.5 text-amber-400" />
                      <span>▶ {pl.video_count || 12} Videos</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-semibold text-base text-ink leading-snug group-hover:text-[#35208f] transition-colors">
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 group-hover:text-[#35208f] transition-colors">
                    <span>Explore Course Playlist →</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "SHORTS" ? (
          /* ─── TAB: SHORTS VERTICAL CARDS ────────────────────────────────── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {paginatedVideos.map((short) => (
              <div
                key={short.id}
                onClick={() => setSelectedVideo(short)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-border/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <img
                  src={
                    short.thumbnail_url ||
                    `https://img.youtube.com/vi/${short.youtube_video_id}/maxresdefault.jpg`
                  }
                  alt={short.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="relative p-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-medium uppercase">
                    <Smartphone className="size-3" />
                    <span>Short</span>
                  </span>
                  {short.view_count && (
                    <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
                      {short.view_count}
                    </span>
                  )}
                </div>

                <div className="relative p-3.5 text-white">
                  <div className="size-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-red-600 transition-all">
                    <Play className="size-4 fill-white ml-0.5" />
                  </div>
                  <h4 className="font-medium text-xs sm:text-sm leading-snug line-clamp-2 text-white">
                    {short.title}
                  </h4>
                  <span className="mt-1.5 inline-block text-[11px] font-medium text-red-400 group-hover:underline">
                    ▶ Watch Short
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ─── TAB: 4-COLUMN VIDEOS GRID ─────────────────────────────────── */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="group bg-white border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
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
                      <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/15 transition-colors flex items-center justify-center">
                        <div className="size-12 rounded-full bg-[#35208f] text-white flex items-center justify-center shadow-lg transform scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                          <Play className="size-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      {vid.duration && (
                        <span className="absolute bottom-2 right-2 bg-ink/90 text-white font-mono text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                          {vid.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-sm sm:text-base text-ink leading-snug group-hover:text-[#35208f] transition-colors line-clamp-2">
                        {vid.title}
                      </h4>
                      {vid.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-0 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                    <span className="font-medium text-[#35208f] group-hover:underline">
                      Watch Lecture →
                    </span>
                    {vid.published_at && (
                      <span>{new Date(vid.published_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="pt-10 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 rounded-xl bg-white hover:bg-ivory text-ink font-semibold text-xs uppercase tracking-wider border border-border shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Load More Videos ({filteredVideos.length - paginatedVideos.length} Remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          channelUrl={channelUrl}
        />
      )}

      {/* Playlist Detail Modal */}
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
    </div>
  );
}
