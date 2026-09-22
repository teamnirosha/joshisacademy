import React, { useEffect, useRef } from "react";
import { X, Calendar, Eye, Clock, Youtube, ExternalLink } from "lucide-react";
import type { YouTubeVideoItem } from "@/services/cms.server";

interface VideoModalProps {
  video: YouTubeVideoItem | null;
  onClose: () => void;
  channelUrl?: string;
}

export function VideoModal({
  video,
  onClose,
  channelUrl = "https://www.youtube.com/@varshastutorials",
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!video) return;

    // Prevent body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    // Close on ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const isShort = Boolean(video.is_short || video.content_type === "SHORT");
  const videoId = video.youtube_video_id;

  // Format relative or standard date
  const formatPublishedDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full bg-[#121218] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isShort ? "max-w-[400px] max-h-[92vh]" : "max-w-4xl max-h-[90vh]"
        }`}
      >
        {/* Modal Header Bar with Close Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#181822] border-b border-white/10 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-6 rounded-md bg-red-600/90 text-white">
              <Youtube className="size-3.5 fill-white" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {isShort ? "Varsha Tutorials Short" : "Varsha Tutorials Lesson"}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex items-center justify-center size-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close video player (Press Escape)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div
          className={`relative bg-black w-full shrink-0 ${
            isShort ? "aspect-[9/16] max-h-[62vh] mx-auto" : "aspect-video"
          }`}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full border-none"
          />
        </div>

        {/* Video Details & Metadata */}
        <div className="p-4 sm:p-5 text-white/90 overflow-y-auto flex-1 bg-[#121218]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 mb-2">
            {isShort ? (
              <span className="px-2 py-0.5 rounded bg-red-600/90 text-white font-bold text-[10px] uppercase tracking-wider">
                Short
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-violet text-white font-bold text-[10px] uppercase tracking-wider">
                Classroom Lecture
              </span>
            )}

            {video.duration && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                <Clock className="size-3" />
                {video.duration}
              </span>
            )}

            {video.published_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {formatPublishedDate(video.published_at)}
              </span>
            )}

            {video.view_count && (
              <span className="inline-flex items-center gap-1 text-white/70">
                <Eye className="size-3" />
                {video.view_count} views
              </span>
            )}
          </div>

          <h3
            id="video-modal-title"
            className="text-base sm:text-lg font-bold text-white leading-snug"
          >
            {video.title}
          </h3>

          {video.description && (
            <p className="mt-2.5 text-xs sm:text-sm text-white/70 leading-relaxed max-h-24 overflow-y-auto pr-1">
              {video.description}
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-white/50">Joshi's Academy • Varsha Tutorials</span>
            <a
              href={video.youtube_url || `${channelUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
