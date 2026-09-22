import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Video,
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  X,
  Play,
  Tv,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Check,
  Zap,
  Youtube,
} from "lucide-react";
import {
  YouTubeService,
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  type YouTubeVideoItem,
} from "@/services/cms.server";
import {
  YouTubeChannelService,
  type YouTubeChannelConfig,
  type YouTubePlaylistItem,
} from "@/services/youtube.server";

export const Route = createFileRoute("/admin/cms/youtube")({
  component: CMSYouTubeDashboardPage,
});

type TabType = "ALL" | "VIDEOS" | "SHORTS" | "PLAYLISTS";

function CMSYouTubeDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [channelConfig, setChannelConfig] = useState<YouTubeChannelConfig | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Connect Channel input
  const [inputChannelUrl, setInputChannelUrl] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Video Player Modal
  const [activePlayerVideoId, setActivePlayerVideoId] = useState<string | null>(null);

  // Playlist Items Modal
  const [viewingPlaylist, setViewingPlaylist] = useState<YouTubePlaylistItem | null>(null);

  // Manual Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formYoutubeUrl, setFormYoutubeUrl] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadAllYouTubeData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/youtube");
      if (res.ok) {
        const data = await res.json();
        setChannelConfig(data.config || null);
        setVideos(data.videos || []);
        setPlaylists(data.playlists || []);

        try {
          localStorage.setItem("joshis_cms_yt_cache_v2", JSON.stringify(data));
        } catch (e) {}
        return;
      }
    } catch (e) {
      console.warn("Notice loading YouTube data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem("joshis_cms_yt_cache_v2");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.config) setChannelConfig(data.config);
        if (Array.isArray(data.videos) && data.videos.length > 0) setVideos(data.videos);
        if (Array.isArray(data.playlists) && data.playlists.length > 0) setPlaylists(data.playlists);
      }
    } catch (e) {}

    loadAllYouTubeData();
  }, []);

  useEffect(() => {
    if (formYoutubeUrl) {
      const id = extractYouTubeVideoId(formYoutubeUrl);
      setExtractedId(id);
    } else {
      setExtractedId(null);
    }
  }, [formYoutubeUrl]);

  const handleConnectChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChannelUrl.trim()) return;

    setConnecting(true);
    try {
      const res = await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect",
          channelUrl: inputChannelUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to connect channel");

      setChannelConfig(data.config);
      setStatusMessage("YouTube channel connected successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
      await handleSyncChannel();
    } catch (err: any) {
      alert("Failed to connect channel: " + err?.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSyncChannel = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");

      setStatusMessage(data.message || "YouTube channel synchronized successfully!");
      await loadAllYouTubeData();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert("Sync notice: " + err?.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnectChannel = async () => {
    if (
      !confirm("Disconnect YouTube Channel configuration? Existing synced data will be preserved.")
    )
      return;

    try {
      const res = await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      if (res.ok) {
        setChannelConfig(null);
        setStatusMessage("Channel disconnected.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      alert("Error: " + err?.message);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractYouTubeVideoId(formYoutubeUrl);
    if (!vidId) {
      alert("Invalid YouTube URL.");
      return;
    }

    setSaving(true);
    try {
      if (editingVideo) {
        const res = await fetch("/api/cms/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_video",
            id: editingVideo.id,
            title: formTitle,
            description: formDescription,
            youtubeUrl: formYoutubeUrl,
            isPublished: formIsPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");
        setStatusMessage("Video updated!");
      } else {
        const res = await fetch("/api/cms/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_video",
            title: formTitle,
            description: formDescription,
            youtubeUrl: formYoutubeUrl,
            isPublished: formIsPublished,
            displayOrder: videos.length + 1,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Creation failed");
        setStatusMessage("Video added!");
      }
      setIsModalOpen(false);
      await loadAllYouTubeData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert("Error: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublishVideo = async (vid: YouTubeVideoItem) => {
    const updatedStatus = !vid.is_published;
    setVideos((prev) =>
      prev.map((v) => (v.id === vid.id ? { ...v, is_published: updatedStatus } : v)),
    );
    try {
      await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_publish",
          id: vid.id,
          isPublished: updatedStatus,
        }),
      });
    } catch (e) {}
  };

  const handleTogglePublishPlaylist = async (pl: YouTubePlaylistItem) => {
    const updatedStatus = !pl.is_published;
    setPlaylists((prev) =>
      prev.map((p) => (p.id === pl.id ? { ...p, is_published: updatedStatus } : p)),
    );
    try {
      await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_playlist_publish",
          id: pl.id,
          isPublished: updatedStatus,
        }),
      });
    } catch (e) {}
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video link?")) return;
    setVideos((prev) => prev.filter((v) => v.id !== id));
    try {
      await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_video",
          id,
        }),
      });
      await loadAllYouTubeData();
      setStatusMessage("Video deleted.");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {}
  };

  const handleMoveVideoOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const newVids = [...videos];
    const temp = newVids[index]!;
    newVids[index] = newVids[targetIdx]!;
    newVids[targetIdx] = temp;

    const updatedPayload = newVids.map((v, idx) => ({ ...v, display_order: idx + 1 }));
    setVideos(updatedPayload);
    try {
      await fetch("/api/cms/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder_videos",
          items: updatedPayload.map((v) => ({ id: v.id, displayOrder: v.display_order })),
        }),
      });
    } catch (e) {}
  };

  // Filter items based on activeTab and searchQuery
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.youtube_video_id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "VIDEOS") return !v.is_short && v.content_type !== "SHORT";
    if (activeTab === "SHORTS") return v.is_short || v.content_type === "SHORT";
    return true;
  });

  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-4 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="size-4" />
          {statusMessage}
        </div>
      )}

      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-200">
              <Tv className="size-3" /> YouTube Channel CMS
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">
            YouTube Channel, Videos & Shorts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage YouTube videos, Shorts, playlists, and thumbnails for Joshi's Academy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllYouTubeData}
            className="p-2.5 rounded-xl border border-border bg-ivory text-muted-foreground hover:text-ink hover:bg-lavender/50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingVideo(null);
              setFormTitle("");
              setFormDescription("");
              setFormYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
              setFormIsPublished(true);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-red-700 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="size-4" /> Add Video Link
          </button>
        </div>
      </div>

      {/* ── 2. CHANNEL CONNECTION & SYNC CARD ──────────────────────────── */}
      <div className="rounded-3xl border border-border/80 bg-ink text-ivory p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={channelConfig?.channel_thumbnail || "/brand/varshas-tutorials-avatar.jpg"}
                alt={channelConfig?.channel_name || "Varsha Tutorials"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith("/brand/varshas-tutorials-avatar.jpg")) {
                    target.src = "/brand/varshas-tutorials-avatar.jpg";
                  }
                }}
                className="size-16 rounded-full object-cover border-2 border-red-500 shadow-md shrink-0 bg-neutral-900"
              />
              <span className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border border-black shadow-xs flex items-center justify-center">
                <Youtube className="size-3 text-white fill-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white">
                  {channelConfig?.channel_name || "Varsha's Tutorials"}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <CheckCircle className="size-3" /> CONNECTED
                </span>
              </div>
              <p className="text-xs text-ivory/60 font-mono mt-0.5">
                {channelConfig?.channel_handle || "@varshastutorials"} • Channel ID:{" "}
                {channelConfig?.channel_id || "UCDSt5dxDiWkZ7p9mhoSECJQ"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-ivory/80">
                <span className="font-semibold text-amber-400">
                  {channelConfig?.subscriber_count
                    ? `${channelConfig.subscriber_count.toLocaleString()}+ Subscribers`
                    : "24,800+ Subscribers"}
                </span>
                <span>•</span>
                <span>{videos.length} Videos</span>
                <span>•</span>
                <span>{playlists.length} Playlists</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncChannel}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Synchronizing..." : "Sync Live Channel"}</span>
            </button>

            <a
              href={channelConfig?.channel_url || "https://www.youtube.com/@varshastutorials"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Visit Channel</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── 3. TABS BAR & SEARCH ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(["ALL", "VIDEOS", "SHORTS", "PLAYLISTS"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow-2xs"
                  : "bg-ivory text-muted-foreground hover:bg-lavender/50 hover:text-ink"
              }`}
            >
              {tab === "ALL" && `ALL (${videos.length})`}
              {tab === "VIDEOS" && `VIDEOS (${videos.filter((v) => !v.is_short).length})`}
              {tab === "SHORTS" && `SHORTS (${videos.filter((v) => v.is_short).length})`}
              {tab === "PLAYLISTS" && `PLAYLISTS (${playlists.length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search YouTube items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-ivory pl-10 pr-4 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </div>

      {/* ── 4. TAB CONTENTS ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="size-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        </div>
      ) : activeTab === "PLAYLISTS" ? (
        /* ── PLAYLISTS TAB ───────────────────────────────────────────────── */
        filteredPlaylists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white">
            No playlists found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((pl) => (
              <div
                key={pl.id}
                className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-black overflow-hidden group">
                  <img
                    src={
                      pl.thumbnail_url ||
                      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-ink/80 backdrop-blur-xs flex flex-col items-center justify-center text-ivory p-2 text-center">
                    <Layers className="size-5 mb-1" />
                    <span className="font-bold text-xs">{pl.video_count}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold">
                      VIDEOS
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-ink text-sm leading-snug line-clamp-2">
                      {pl.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pl.description || "Official Joshi's Academy Playlist"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePublishPlaylist(pl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        pl.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {pl.is_published ? "Published" : "Hidden"}
                    </button>

                    <button
                      onClick={() => setViewingPlaylist(pl)}
                      className="text-xs font-bold text-violet hover:underline flex items-center gap-1"
                    >
                      View Videos →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "SHORTS" ? (
        /* ── SHORTS TAB (Vertical 9:16 Cards) ────────────────────────────── */
        filteredVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white">
            No YouTube Shorts found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredVideos.map((short) => {
              const thumbUrl = getYouTubeThumbnail(short.youtube_video_id, "hq");
              return (
                <div
                  key={short.id}
                  className="group rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs flex flex-col hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[9/16] bg-black overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-[9px] font-bold uppercase">
                        SHORT
                      </span>
                    </div>

                    <button
                      onClick={() => setActivePlayerVideoId(short.youtube_video_id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 cursor-pointer"
                    >
                      <div className="size-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="size-4 fill-white ml-0.5" />
                      </div>
                    </button>
                  </div>

                  <div className="p-3 space-y-2">
                    <h3 className="font-bold text-ink text-xs line-clamp-2 leading-snug">
                      {short.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => handleTogglePublishVideo(short)}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          short.is_published
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-amber-800 bg-amber-100"
                        }`}
                      >
                        {short.is_published ? "Live" : "Hidden"}
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(short.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : /* ── ALL / VIDEOS TAB ────────────────────────────────────────────── */
      filteredVideos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white space-y-3">
          <Video className="size-10 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-ink text-sm">No videos found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid, index) => {
            const thumbUrl = getYouTubeThumbnail(vid.youtube_video_id, "hq");
            return (
              <div
                key={vid.id}
                className={`group rounded-2xl border bg-white overflow-hidden shadow-2xs transition-all duration-300 hover:shadow-md flex flex-col ${
                  vid.is_published ? "border-border/80" : "border-amber-300 bg-amber-50/20"
                }`}
              >
                <div className="relative aspect-video bg-black overflow-hidden group">
                  <img
                    src={thumbUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setActivePlayerVideoId(vid.youtube_video_id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 cursor-pointer"
                  >
                    <div className="size-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="size-5 fill-white ml-0.5" />
                    </div>
                  </button>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        vid.is_short ? "bg-amber-500 text-ink" : "bg-red-600 text-white"
                      }`}
                    >
                      {vid.is_short ? "SHORT" : "VIDEO"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-xl bg-ink/80 backdrop-blur-md p-1">
                    <button
                      onClick={() => handleMoveVideoOrder(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-ivory hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-ivory px-1">
                      #{vid.display_order}
                    </span>
                    <button
                      onClick={() => handleMoveVideoOrder(index, "down")}
                      disabled={index === videos.length - 1}
                      className="p-1 text-ivory hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-ink text-sm leading-snug line-clamp-2">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {vid.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTogglePublishVideo(vid)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        vid.is_published
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {vid.is_published ? (
                        <>
                          <Eye className="size-3.5" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3.5" /> Unpublished
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={vid.youtube_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Watch on YouTube"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. YOUTUBE EMBED PLAYER MODAL ────────────────────────────────────── */}
      {activePlayerVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setActivePlayerVideoId(null)}
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-ink/80 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activePlayerVideoId}?autoplay=1`}
              title="YouTube Player"
              className="size-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── 6. PLAYLIST DETAILS MODAL ───────────────────────────────────────── */}
      {viewingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-border">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                  <Layers className="size-4" />
                </div>
                <h2 className="font-bold text-ink text-base">{viewingPlaylist.title}</h2>
              </div>
              <button
                onClick={() => setViewingPlaylist(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {viewingPlaylist.description ||
                "Official Joshi's Academy Playlist containing curated video lectures."}
            </p>

            <div className="p-3 bg-ivory rounded-2xl border border-border/80 flex items-center justify-between text-xs font-bold text-ink">
              <span>Total Videos: {viewingPlaylist.video_count}</span>
              <a
                href={`https://www.youtube.com/playlist?list=${viewingPlaylist.playlist_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-violet hover:underline flex items-center gap-1"
              >
                Open Playlist on YouTube <ExternalLink className="size-3" />
              </a>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingPlaylist(null)}
                className="px-4 py-2 bg-violet text-ivory font-bold text-xs rounded-xl uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. MANUAL ADD VIDEO MODAL ─────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-6 border border-border">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Video className="size-4" />
                </div>
                <h2 className="font-bold text-ink text-base">
                  {editingVideo ? "Edit YouTube Video" : "Add Custom Video Link"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  YouTube Video Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formYoutubeUrl}
                  onChange={(e) => setFormYoutubeUrl(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE 10th Science Masterclass"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="size-4 rounded accent-red-600"
                  />
                  <span>Publish immediately to website homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !extractedId}
                  className="flex items-center gap-1.5 rounded-xl bg-red-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-red-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {saving ? "Saving..." : editingVideo ? "Update Video" : "Save Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
