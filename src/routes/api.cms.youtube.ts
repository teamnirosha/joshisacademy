import { createFileRoute } from "@tanstack/react-router";
import { YouTubeChannelService } from "@/services/youtube.server";
import { YouTubeService } from "@/services/cms.server";

export const Route = createFileRoute("/api/cms/youtube")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const config = await YouTubeChannelService.getChannelConfig("default");
          const videos = await YouTubeService.getVideos("default", true);
          const playlists = await YouTubeChannelService.getPlaylists("default");

          const shorts = videos.filter((v: any) => v.is_short || v.content_type === "SHORT");

          return new Response(
            JSON.stringify({
              config,
              videos,
              shorts,
              playlists,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const action = body.action || "sync";

          if (action === "connect") {
            const channelUrl = body.channelUrl;
            if (!channelUrl) {
              return new Response(JSON.stringify({ error: "Channel URL is required" }), {
                status: 400,
              });
            }
            const config = await YouTubeChannelService.connectChannel(channelUrl, "default");
            return new Response(JSON.stringify({ success: true, config }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "disconnect") {
            await YouTubeChannelService.disconnectChannel("default");
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "sync") {
            const syncResult = await YouTubeChannelService.syncChannel("default");
            return new Response(JSON.stringify(syncResult), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "create_video") {
            const newVid = await YouTubeService.createVideo({
              title: body.title,
              description: body.description,
              youtubeUrl: body.youtubeUrl,
              isPublished: body.isPublished ?? true,
              displayOrder: body.displayOrder,
            });
            return new Response(JSON.stringify({ success: true, video: newVid }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "update_video") {
            const updated = await YouTubeService.updateVideo(body.id, {
              title: body.title,
              description: body.description,
              youtubeUrl: body.youtubeUrl,
              isPublished: body.isPublished,
              displayOrder: body.displayOrder,
            });
            return new Response(JSON.stringify({ success: true, video: updated }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "delete_video") {
            await YouTubeService.deleteVideo(body.id);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "toggle_publish") {
            const updated = await YouTubeService.updateVideo(body.id, {
              isPublished: body.isPublished,
            });
            return new Response(JSON.stringify({ success: true, video: updated }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "reorder_videos") {
            await YouTubeService.reorderVideos(body.items || [], "default");
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "toggle_playlist_publish") {
            await YouTubeChannelService.togglePlaylistPublish(body.id, body.isPublished);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
      },
    },
  },
});
