import { createFileRoute } from "@tanstack/react-router";
import { YouTubeService } from "@/services/cms.server";
import { YouTubeChannelService } from "@/services/youtube.server";

export const Route = createFileRoute("/api/public/youtube")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const url = new URL(request.url);
          const playlistId = url.searchParams.get("playlist_id");
          const type = url.searchParams.get("type"); // "videos" | "shorts" | "playlists"
          const page = parseInt(url.searchParams.get("page") || "1", 10);
          const limit = parseInt(url.searchParams.get("limit") || "24", 10);

          const config = await YouTubeChannelService.getChannelConfig("default");
          const allVideos = await YouTubeService.getVideos("default", false);
          const playlists = await YouTubeChannelService.getPlaylists("default");
          const publishedPlaylists = playlists.filter((p: any) => p.is_published);

          if (playlistId) {
            const selectedPl = await YouTubeChannelService.getPlaylistById(playlistId, "default");
            // Find videos matching or return all lesson videos in order
            const playlistVideos = allVideos
              .filter((v: any) => !v.is_short && v.content_type !== "SHORT")
              .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

            return new Response(
              JSON.stringify({
                channel: config,
                playlist: selectedPl,
                videos: playlistVideos,
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "public, max-age=60, s-maxage=300",
                },
              },
            );
          }

          const rawVideos = allVideos.filter((v: any) => !v.is_short && v.content_type !== "SHORT");
          const shorts = allVideos.filter((v: any) => v.is_short || v.content_type === "SHORT");

          // Sort videos: featured first, then published_at DESC or display_order ASC
          const sortedVideos = [...rawVideos].sort((a: any, b: any) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            if (a.display_order !== undefined && b.display_order !== undefined) {
              return a.display_order - b.display_order;
            }
            return (
              new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
            );
          });

          const featuredVideo =
            sortedVideos.find((v: any) => v.is_featured) || sortedVideos[0] || null;

          const startIndex = (page - 1) * limit;
          const paginatedVideos = sortedVideos.slice(startIndex, startIndex + limit);

          return new Response(
            JSON.stringify({
              channel: config,
              featuredVideo,
              videos: type === "all" ? sortedVideos : paginatedVideos,
              allVideos: sortedVideos,
              totalVideos: sortedVideos.length,
              page,
              limit,
              hasMore: startIndex + limit < sortedVideos.length,
              shorts,
              playlists: publishedPlaylists,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=60, s-maxage=300",
              },
            },
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to fetch YouTube content" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
