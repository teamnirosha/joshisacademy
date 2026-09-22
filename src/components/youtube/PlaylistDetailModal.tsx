import React, { useEffect, useRef } from "react";
import { X, ListVideo, Play, ExternalLink, Clock, Sparkles } from "lucide-react";
import type { YouTubePlaylistItem } from "@/services/youtube.server";
import type { YouTubeVideoItem } from "@/services/cms.server";

interface PlaylistDetailModalProps {
  playlist: YouTubePlaylistItem | null;
  videos: YouTubeVideoItem[];
  onClose: () => void;
  onSelectVideo: (video: YouTubeVideoItem) => void;
}

export function PlaylistDetailModal({
  playlist,
  videos,
  onClose,
  onSelectVideo,
}: PlaylistDetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!playlist) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playlist, onClose]);

  if (!playlist) return null;

  const playlistUrl = playlist.playlist_id
    ? `https://www.youtube.com/playlist?list=${playlist.playlist_id}`
    : "https://www.youtube.com/@varshastutorials/playlists";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="playlist-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-border/80 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-ink text-ivory border-b border-ivory/15 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ListVideo className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Curated Learning Playlist
              </span>
              <h3
                id="playlist-modal-title"
                className="font-bold text-base sm:text-lg text-ivory truncate"
              >
                {playlist.title}
              </h3>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-ivory flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Close playlist view"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Playlist Banner / Info */}
        <div className="p-6 bg-ivory/40 border-b border-border/60 flex flex-col sm:flex-row gap-5 items-start shrink-0">
          <div className="relative w-full sm:w-52 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-border/80 shadow-xs">
            <img
              src={
                playlist.thumbnail_url ||
                "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop"
              }
              alt={playlist.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-bold">
              {playlist.video_count || videos.length} Lessons
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-display text-lg sm:text-xl font-bold text-ink">{playlist.title}</h4>
            {playlist.description && (
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {playlist.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-xs"
              >
                <span>View on YouTube</span>
                <ExternalLink className="size-3.5" />
              </a>
              <span className="text-xs text-muted-foreground">
                Total {videos.length} videos available in course
              </span>
            </div>
          </div>
        </div>

        {/* Playlist Videos List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-border/60">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">
            Playlist Lessons ({videos.length})
          </h5>

          {videos.map((vid, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            return (
              <div
                key={vid.id}
                onClick={() => {
                  onSelectVideo(vid);
                }}
                className="py-3 px-2 sm:px-3 flex items-center gap-3 sm:gap-4 hover:bg-ivory rounded-xl transition-all cursor-pointer group"
              >
                {/* Lesson Sequence Number */}
                <span className="font-mono font-bold text-xs sm:text-sm text-muted-foreground group-hover:text-[#35208f] w-6 text-center shrink-0">
                  {formattedIndex}
                </span>

                {/* Video Thumbnail */}
                <div className="relative w-20 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-border/80">
                  <img
                    src={
                      vid.thumbnail_url ||
                      `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`
                    }
                    alt={vid.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                    <div className="size-7 rounded-full bg-[#35208f] text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Play className="size-3.5 fill-white ml-0.5" />
                    </div>
                  </div>
                  {vid.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                      {vid.duration}
                    </span>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-xs sm:text-sm text-ink group-hover:text-[#35208f] transition-colors line-clamp-2">
                    {vid.title}
                  </h6>
                  {vid.description && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                      {vid.description}
                    </p>
                  )}
                </div>

                {/* Play CTA Button */}
                <button
                  type="button"
                  className="hidden xs:inline-flex items-center gap-1 text-xs font-bold text-[#35208f] group-hover:underline shrink-0 px-2.5 py-1 rounded bg-[#35208f]/5 group-hover:bg-[#35208f]/10 transition-colors"
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
  );
}
