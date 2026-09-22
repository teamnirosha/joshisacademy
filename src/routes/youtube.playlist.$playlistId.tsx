import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ListVideo,
  Play,
  ArrowLeft,
  ExternalLink,
  Clock,
  Calendar,
  CheckCircle2,
  Youtube,
  BookOpen,
} from "lucide-react";
import type { YouTubeVideoItem } from "@/services/cms.server";
import type { YouTubePlaylistItem, YouTubeChannelConfig } from "@/services/youtube.server";
import { VideoModal } from "@/components/youtube/VideoModal";

export const Route = createFileRoute("/youtube/playlist/$playlistId")({
  head: ({ params }) => ({
    meta: [
      { title: `Curated YouTube Playlist | Joshi's Academy` },
      {
        name: "description",
        content: `Complete structured video lectures and chapter playlists from Varsha Tutorials for Class 9 & 10 CBSE & ICSE Science.`,
      },
    ],
  }),
  component: PlaylistDetailPage,
});

function PlaylistDetailPage() {
  const { playlistId } = Route.useParams();
  const [playlist, setPlaylist] = useState<YouTubePlaylistItem | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [channel, setChannel] = useState<YouTubeChannelConfig | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaylistData() {
      try {
        const res = await fetch(
          `/api/public/youtube?playlist_id=${encodeURIComponent(playlistId)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.playlist) setPlaylist(data.playlist);
          if (data.videos) setVideos(data.videos);
          if (data.channel) setChannel(data.channel);
        }
      } catch (err) {
        console.warn("Failed to load playlist details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPlaylistData();
  }, [playlistId]);

  const channelUrl = channel?.channel_url || "https://www.youtube.com/@varshastutorials";
  const playlistUrl = playlist?.playlist_id
    ? `https://www.youtube.com/playlist?list=${playlist.playlist_id}`
    : `${channelUrl}/playlists`;

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/youtube"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#35208f] hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Playlists &amp; Videos</span>
          </Link>

          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-xs hover:bg-red-700 transition-colors"
          >
            <Youtube className="size-4 fill-white" />
            <span>Open in YouTube</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Playlist Hero Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden bg-black shrink-0 border border-border/80 shadow-md">
            <img
              src={
                playlist?.thumbnail_url ||
                "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop"
              }
              alt={playlist?.title || "Playlist"}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/85 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
              <ListVideo className="size-3.5 text-amber-400" />
              <span>{videos.length} Lectures</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="size-3.5" />
              <span>Complete Course Learning Journey</span>
            </span>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
              {playlist?.title || "Class 10 Science Series"}
            </h1>

            {playlist?.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {playlist.description}
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold text-ink">Varsha Tutorials • Joshi's Academy</span>
              <span>•</span>
              <span>Class 9 &amp; 10 Secondary Science</span>
              <span>•</span>
              <span>Board Exam Focused</span>
            </div>
          </div>
        </div>

        {/* Ordered Lessons List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink mb-6 flex items-center justify-between">
            <span>Course Lessons &amp; Lectures</span>
            <span className="text-xs font-sans text-muted-foreground font-normal">
              {videos.length} Lessons in Sequential Order
            </span>
          </h2>

          <div className="divide-y divide-border/60">
            {videos.map((vid, idx) => {
              const formattedIdx = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="py-4 px-2 sm:px-4 flex items-center gap-4 hover:bg-ivory rounded-2xl transition-all cursor-pointer group"
                >
                  <span className="font-mono font-bold text-sm sm:text-base text-muted-foreground group-hover:text-[#35208f] w-8 text-center shrink-0">
                    {formattedIdx}
                  </span>

                  <div className="relative w-24 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-border/80">
                    <img
                      src={
                        vid.thumbnail_url ||
                        `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`
                      }
                      alt={vid.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 flex items-center justify-center">
                      <div className="size-8 rounded-full bg-[#35208f] text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Play className="size-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    {vid.duration && (
                      <span className="absolute bottom-1 right-1 bg-black/85 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        {vid.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-ink group-hover:text-[#35208f] transition-colors line-clamp-2">
                      {vid.title}
                    </h3>
                    {vid.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {vid.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35208f]/10 text-[#35208f] font-bold text-xs group-hover:bg-[#35208f] group-hover:text-white transition-colors shrink-0"
                  >
                    <span>Play</span>
                    <Play className="size-3 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          channelUrl={channelUrl}
        />
      )}
    </div>
  );
}
