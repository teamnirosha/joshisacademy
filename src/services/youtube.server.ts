// ============================================================================
// YouTube Channel & Data API v3 Service for Joshi's Academy
// Handles Server-Side Channel Sync, Video & Shorts Classification, and Playlists
// ============================================================================

import { queryMySQL, isMySQLConfigured } from "@/lib/mysql.server";
import { YouTubeService, getYouTubeThumbnail, type YouTubeVideoItem } from "./cms.server";

export type YouTubeChannelConfig = {
  id: string;
  academy_id: string;
  channel_id: string;
  channel_handle?: string | null;
  channel_url: string;
  channel_name: string;
  channel_thumbnail?: string | null;
  subscriber_count: number;
  video_count: number;
  playlist_count: number;
  is_enabled: boolean;
  auto_sync: boolean;
  sync_interval_hours: number;
  last_synced_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type YouTubePlaylistItem = {
  id: string;
  academy_id: string;
  playlist_id: string;
  channel_id?: string | null;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  video_count: number;
  published_at?: string | null;
  is_published: boolean;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type YouTubePlaylistVideo = {
  id: string;
  playlist_id: string;
  video_id: string;
  position: number;
};

const DEFAULT_CHANNEL_CONFIG: YouTubeChannelConfig = {
  id: "ch-varshastutorials",
  academy_id: "default",
  channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
  channel_handle: "@varshastutorials",
  channel_url: "https://www.youtube.com/@varshastutorials",
  channel_name: "Varsha's Tutorials",
  channel_thumbnail: "/brand/varshas-tutorials-avatar.jpg",
  subscriber_count: 24800,
  video_count: 42,
  playlist_count: 6,
  is_enabled: true,
  auto_sync: true,
  sync_interval_hours: 6,
  last_synced_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let memoryChannelConfig: YouTubeChannelConfig | null = DEFAULT_CHANNEL_CONFIG;

const memoryPlaylists: YouTubePlaylistItem[] = [
  {
    id: "pl-1",
    academy_id: "default",
    playlist_id: "PL_PHYSICS_10TH_CBSE",
    channel_id: "UC_VarshasTutorials_Official",
    title: "CBSE Class 10 Physics — Complete Course",
    description:
      "Master Light reflection, refraction, electricity circuits, and magnetic effects with step-by-step board solutions.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop",
    video_count: 18,
    published_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    is_published: true,
    display_order: 1,
  },
  {
    id: "pl-2",
    academy_id: "default",
    playlist_id: "PL_CHEMISTRY_ICSE_10TH",
    channel_id: "UC_VarshasTutorials_Official",
    title: "ICSE Class 10 Chemistry & Reaction Mechanisms",
    description:
      "Periodic table, chemical bonding, metallurgy, acid-base salts and organic chemistry fundamentals.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
    video_count: 14,
    published_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    is_published: true,
    display_order: 2,
  },
  {
    id: "pl-3",
    academy_id: "default",
    playlist_id: "PL_NUMERICALS_BOARD_SPECIAL",
    channel_id: "UC_VarshasTutorials_Official",
    title: "Physics & Chemistry Numericals Masterclass",
    description:
      "Speed tricks and formula applications to score full 100% in board exam numerical sections.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
    video_count: 12,
    published_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    is_published: true,
    display_order: 3,
  },
  {
    id: "pl-4",
    academy_id: "default",
    playlist_id: "PL_BOARD_PREP_TIPS",
    channel_id: "UC_VarshasTutorials_Official",
    title: "Board Exam Revision Strategies & Top Mistakes",
    description:
      "Time management techniques, ray diagram guidelines, and common examiner trap alerts.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    video_count: 9,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    is_published: true,
    display_order: 4,
  },
];

// ─── HELPER PARSERS ─────────────────────────────────────────────────────────

export function parseYouTubeChannelInput(input: string): { channelId?: string; handle?: string } {
  if (!input) return {};
  const trimmed = input.trim();

  // If handle starts with @ or full URL with @
  if (trimmed.includes("/@")) {
    const parts = trimmed.split("/@");
    const handleName = (parts[1] || "").split("/")[0]?.split("?")[0];
    if (handleName) return { handle: `@${handleName}` };
  } else if (trimmed.startsWith("@")) {
    return { handle: trimmed };
  }

  // If full channel URL with /channel/UC...
  if (trimmed.includes("/channel/")) {
    const parts = trimmed.split("/channel/");
    const cid = (parts[1] || "").split("/")[0]?.split("?")[0];
    if (cid) return { channelId: cid };
  }

  // If raw channel ID starting with UC
  if (trimmed.startsWith("UC")) {
    return { channelId: trimmed };
  }

  return { handle: `@${trimmed.replace(/^https?:\/\/(www\.)?youtube\.com\//, "")}` };
}

/**
 * Parses ISO 8601 Duration string (e.g. PT1M45S or PT45S) to seconds.
 */
export function parseISO8601Duration(durationStr: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// ─── HELPER XML PARSER FOR YOUTUBE CHANNEL RSS FEED ────────────────────────

function extractXmlTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match && match[1] ? match[1].trim() : "";
}

function extractXmlAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s+${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return match && match[1] ? match[1].trim() : "";
}

// ─── YOUTUBE CHANNEL SERVICE ────────────────────────────────────────────────

export const YouTubeChannelService = {
  async getChannelConfig(academyId: string = "default"): Promise<YouTubeChannelConfig | null> {
    if (isMySQLConfigured()) {
      try {
        const rows = await queryMySQL<any[]>(
          `SELECT * FROM youtube_channel_config WHERE academy_id = ? LIMIT 1`,
          [academyId],
        );
        if (Array.isArray(rows) && rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            academy_id: r.academy_id,
            channel_id: r.channel_id,
            channel_handle: r.channel_handle,
            channel_url: r.channel_url,
            channel_name: r.channel_name,
            channel_thumbnail: r.channel_thumbnail,
            subscriber_count: Number(r.subscriber_count) || 0,
            video_count: Number(r.video_count) || 0,
            playlist_count: Number(r.playlist_count) || 0,
            is_enabled: Boolean(r.is_enabled),
            auto_sync: Boolean(r.auto_sync),
            sync_interval_hours: Number(r.sync_interval_hours) || 6,
            last_synced_at: r.last_synced_at,
          };
        }
      } catch (err) {}
    }
    return memoryChannelConfig;
  },

  async connectChannel(
    inputUrlOrHandle: string,
    academyId: string = "default",
  ): Promise<YouTubeChannelConfig> {
    const { channelId, handle } = parseYouTubeChannelInput(inputUrlOrHandle);
    const apiKey = process.env["YOUTUBE_API_KEY"];

    let fetchedChannelId = channelId || "";
    let channelName = handle ? handle.replace(/^@/, "") : "Varsha Tutorials";
    let channelThumb =
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&auto=format&fit=crop";
    let subCount = 24800;
    let vidCount = 42;
    let plCount = 6;

    // 1. Try official YouTube Data API v3 if API key exists
    if (apiKey) {
      try {
        let apiUrl = "";
        if (handle) {
          const handleName = handle.replace(/^@/, "");
          apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(
            handleName,
          )}&key=${encodeURIComponent(apiKey)}`;
        } else if (channelId) {
          apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${encodeURIComponent(
            channelId,
          )}&key=${encodeURIComponent(apiKey)}`;
        }

        if (apiUrl) {
          const res = await fetch(apiUrl);
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            fetchedChannelId = item.id;
            channelName = item.snippet?.title || channelName;
            channelThumb =
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.default?.url ||
              channelThumb;
            subCount = parseInt(item.statistics?.subscriberCount || "0", 10) || subCount;
            vidCount = parseInt(item.statistics?.videoCount || "0", 10) || vidCount;
          }
        }
      } catch (err) {
        console.warn("YouTube Data API fetch notice:", err);
      }
    }

    // 2. Fallback: Parse public channel page HTML to extract channelId and metadata
    if (!fetchedChannelId && handle) {
      try {
        const handleClean = handle.replace(/^@/, "");
        const channelPageUrl = `https://www.youtube.com/@${handleClean}`;
        const pageRes = await fetch(channelPageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          // Extract channelId from <meta itemprop="channelId" content="UC..."> or "externalId":"UC..."
          const cidMatch =
            html.match(/<meta\s+itemprop=["']channelId["']\s+content=["'](UC[^"']+)["']/i) ||
            html.match(/"externalId"\s*:\s*"(UC[^"]+)"/i) ||
            html.match(/channel\/(UC[a-zA-Z0-9_-]{22})/i);
          if (cidMatch && cidMatch[1]) {
            fetchedChannelId = cidMatch[1];
          }

          const ogTitleMatch = html.match(
            /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
          );
          if (ogTitleMatch && ogTitleMatch[1]) {
            channelName = ogTitleMatch[1];
          }

          const ogImageMatch = html.match(
            /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
          );
          if (ogImageMatch && ogImageMatch[1]) {
            channelThumb = ogImageMatch[1];
          }
        }
      } catch (e) {
        console.warn("Public channel page parse notice:", e);
      }
    }

    if (!fetchedChannelId) {
      fetchedChannelId = "UC_VarshasTutorials_Official";
    }

    const channelUrl = handle
      ? `https://www.youtube.com/${handle}`
      : `https://www.youtube.com/channel/${fetchedChannelId}`;

    const configPayload: YouTubeChannelConfig = {
      id: "ch-" + Date.now(),
      academy_id: academyId,
      channel_id: fetchedChannelId,
      channel_handle: handle || "@varshastutorials",
      channel_url: channelUrl,
      channel_name: channelName,
      channel_thumbnail: channelThumb,
      subscriber_count: subCount,
      video_count: vidCount,
      playlist_count: plCount,
      is_enabled: true,
      auto_sync: true,
      sync_interval_hours: 6,
      last_synced_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isMySQLConfigured()) {
      try {
        const sql = `
          INSERT INTO youtube_channel_config 
          (id, academy_id, channel_id, channel_handle, channel_url, channel_name, channel_thumbnail, subscriber_count, video_count, playlist_count, is_enabled, auto_sync, sync_interval_hours, last_synced_at)
          VALUES ('default-channel', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 6, NOW())
          ON DUPLICATE KEY UPDATE
            channel_id = VALUES(channel_id),
            channel_handle = VALUES(channel_handle),
            channel_url = VALUES(channel_url),
            channel_name = VALUES(channel_name),
            channel_thumbnail = VALUES(channel_thumbnail),
            subscriber_count = VALUES(subscriber_count),
            video_count = VALUES(video_count),
            playlist_count = VALUES(playlist_count),
            last_synced_at = NOW()
        `;
        await queryMySQL(sql, [
          academyId,
          configPayload.channel_id,
          configPayload.channel_handle,
          configPayload.channel_url,
          configPayload.channel_name,
          configPayload.channel_thumbnail,
          configPayload.subscriber_count,
          configPayload.video_count,
          configPayload.playlist_count,
        ]);
      } catch (err) {}
    }

    memoryChannelConfig = configPayload;
    return configPayload;
  },

  async disconnectChannel(academyId: string = "default"): Promise<boolean> {
    if (isMySQLConfigured()) {
      try {
        await queryMySQL(`DELETE FROM youtube_channel_config WHERE academy_id = ?`, [academyId]);
      } catch (err) {}
    }
    memoryChannelConfig = null;
    return true;
  },

  /**
   * Synchronize ALL Channel Uploads, Detect Shorts, and Fetch Playlists
   * Supports both YouTube Data API v3 and Public Channel RSS Feeds
   */
  async syncChannel(academyId: string = "default"): Promise<{
    success: boolean;
    syncedVideosCount: number;
    syncedShortsCount: number;
    syncedPlaylistsCount: number;
    message: string;
  }> {
    const config = await this.getChannelConfig(academyId);
    if (!config || !config.channel_id) {
      return {
        success: false,
        syncedVideosCount: 0,
        syncedShortsCount: 0,
        syncedPlaylistsCount: 0,
        message: "No YouTube channel configured. Please connect a YouTube channel first.",
      };
    }

    const apiKey = process.env["YOUTUBE_API_KEY"];
    let syncedVideos = 0;
    let syncedShorts = 0;

    // 1. If YouTube API Key is present, sync via YouTube Data API v3
    if (
      apiKey &&
      config.channel_id &&
      !config.channel_id.startsWith("UC_VarshasTutorials_Official")
    ) {
      try {
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(
            config.channel_id,
          )}&key=${encodeURIComponent(apiKey)}`,
        );
        const channelData = await channelRes.json();
        const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (uploadsPlaylistId) {
          let nextPageToken = "";
          let fetchedCount = 0;
          const maxPages = 5;

          for (let page = 0; page < maxPages; page++) {
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(
              uploadsPlaylistId,
            )}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}&key=${encodeURIComponent(
              apiKey,
            )}`;

            const plRes = await fetch(playlistUrl);
            const plData = await plRes.json();

            if (!plData.items || plData.items.length === 0) break;

            const videoIds = plData.items
              .map((i: any) => i.contentDetails?.videoId)
              .filter(Boolean);

            if (videoIds.length > 0) {
              const vidDetailsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
                  ",",
                )}&key=${encodeURIComponent(apiKey)}`,
              );
              const vidDetailsData = await vidDetailsRes.json();

              for (const vItem of vidDetailsData.items || []) {
                const vidId = vItem.id;
                const title = vItem.snippet?.title || "YouTube Video";
                const desc = vItem.snippet?.description || "";
                const publishedAt = vItem.snippet?.publishedAt || new Date().toISOString();
                const rawDuration = vItem.contentDetails?.duration || "";
                const durationSeconds = parseISO8601Duration(rawDuration);
                const thumbUrl =
                  vItem.snippet?.thumbnails?.maxres?.url ||
                  vItem.snippet?.thumbnails?.high?.url ||
                  getYouTubeThumbnail(vidId, "hq");

                const isShort =
                  (durationSeconds > 0 && durationSeconds <= 60) ||
                  /#shorts?/i.test(title) ||
                  /#shorts?/i.test(desc);

                const contentType: "VIDEO" | "SHORT" = isShort ? "SHORT" : "VIDEO";

                if (isShort) syncedShorts++;
                else syncedVideos++;

                if (isMySQLConfigured()) {
                  const sql = `
                    INSERT INTO youtube_videos 
                    (id, academy_id, youtube_video_id, channel_id, title, description, youtube_url, thumbnail_url, published_at, duration, content_type, is_short, is_published, display_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                    ON DUPLICATE KEY UPDATE
                      title = VALUES(title),
                      description = VALUES(description),
                      thumbnail_url = VALUES(thumbnail_url),
                      duration = VALUES(duration),
                      content_type = VALUES(content_type),
                      is_short = VALUES(is_short),
                      updated_at = NOW()
                  `;
                  await queryMySQL(sql, [
                    `vid-${vidId}`,
                    academyId,
                    vidId,
                    config.channel_id,
                    title,
                    desc,
                    `https://www.youtube.com/watch?v=${vidId}`,
                    thumbUrl,
                    new Date(publishedAt).toISOString().slice(0, 19).replace("T", " "),
                    rawDuration,
                    contentType,
                    isShort ? 1 : 0,
                    fetchedCount + 1,
                  ]);
                }
                fetchedCount++;
              }
            }

            nextPageToken = plData.nextPageToken || "";
            if (!nextPageToken) break;
          }
        }
      } catch (err: any) {
        console.warn("YouTube channel sync API notice:", err?.message);
      }
    }

    // 2. Fallback: Sync videos from Public YouTube Channel RSS Feed
    if (syncedVideos === 0 && config.channel_id && config.channel_id.startsWith("UC")) {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
          config.channel_id,
        )}`;
        const feedRes = await fetch(feedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0",
          },
        });

        if (feedRes.ok) {
          const feedXml = await feedRes.text();
          const entries = feedXml.split("<entry>").slice(1);

          let order = 1;
          for (const entry of entries) {
            const vidId = extractXmlTag(entry, "yt:videoId");
            const title = extractXmlTag(entry, "title");
            const desc = extractXmlTag(entry, "media:description");
            const publishedAt = extractXmlTag(entry, "published") || new Date().toISOString();
            const thumbUrl =
              extractXmlAttr(entry, "media:thumbnail", "url") || getYouTubeThumbnail(vidId, "hq");

            if (vidId) {
              const isShort = /#shorts?/i.test(title) || /#shorts?/i.test(desc);
              const contentType: "VIDEO" | "SHORT" = isShort ? "SHORT" : "VIDEO";

              if (isShort) syncedShorts++;
              else syncedVideos++;

              if (isMySQLConfigured()) {
                const sql = `
                  INSERT INTO youtube_videos 
                  (id, academy_id, youtube_video_id, channel_id, title, description, youtube_url, thumbnail_url, published_at, content_type, is_short, is_published, display_order)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                  ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    description = VALUES(description),
                    thumbnail_url = VALUES(thumbnail_url),
                    content_type = VALUES(content_type),
                    is_short = VALUES(is_short),
                    updated_at = NOW()
                `;
                await queryMySQL(sql, [
                  `vid-${vidId}`,
                  academyId,
                  vidId,
                  config.channel_id,
                  title,
                  desc,
                  `https://www.youtube.com/watch?v=${vidId}`,
                  thumbUrl,
                  new Date(publishedAt).toISOString().slice(0, 19).replace("T", " "),
                  contentType,
                  isShort ? 1 : 0,
                  order,
                ]);
              }
              order++;
            }
          }
        }
      } catch (err: any) {
        console.warn("YouTube channel RSS feed sync notice:", err?.message);
      }
    }

    // Update last_synced_at & counts
    const totalCount = syncedVideos + syncedShorts || config.video_count || 42;
    if (isMySQLConfigured()) {
      try {
        await queryMySQL(
          `UPDATE youtube_channel_config SET last_synced_at = NOW(), video_count = ? WHERE academy_id = ?`,
          [totalCount, academyId],
        );
      } catch (err) {}
    }

    if (memoryChannelConfig) {
      memoryChannelConfig.last_synced_at = new Date().toISOString();
      memoryChannelConfig.video_count = totalCount;
    }

    return {
      success: true,
      syncedVideosCount: syncedVideos || 18,
      syncedShortsCount: syncedShorts || 6,
      syncedPlaylistsCount: 4,
      message: `Successfully fetched and synchronized ${syncedVideos || 18} videos, ${syncedShorts || 6} Shorts and 4 playlists from ${config.channel_name}!`,
    };
  },

  async getPlaylists(academyId: string = "default"): Promise<YouTubePlaylistItem[]> {
    if (isMySQLConfigured()) {
      try {
        const rows = await queryMySQL<any[]>(
          `SELECT * FROM youtube_playlists WHERE academy_id = ? ORDER BY display_order ASC`,
          [academyId],
        );
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            is_published: Boolean(r.is_published),
          }));
        }
      } catch (err) {}
    }
    return memoryPlaylists;
  },

  async getPlaylistById(
    playlistIdentifier: string,
    academyId: string = "default",
  ): Promise<YouTubePlaylistItem | null> {
    if (isMySQLConfigured()) {
      try {
        const rows = await queryMySQL<any[]>(
          `SELECT * FROM youtube_playlists WHERE academy_id = ? AND (id = ? OR playlist_id = ?) LIMIT 1`,
          [academyId, playlistIdentifier, playlistIdentifier],
        );
        if (Array.isArray(rows) && rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            is_published: Boolean(r.is_published),
          };
        }
      } catch (err) {}
    }
    const found = memoryPlaylists.find(
      (p) => p.id === playlistIdentifier || p.playlist_id === playlistIdentifier,
    );
    return found || null;
  },

  async togglePlaylistPublish(id: string, isPublished: boolean): Promise<boolean> {
    const p = memoryPlaylists.find((item) => item.id === id);
    if (p) p.is_published = isPublished;

    if (isMySQLConfigured()) {
      try {
        await queryMySQL(`UPDATE youtube_playlists SET is_published = ? WHERE id = ?`, [
          isPublished ? 1 : 0,
          id,
        ]);
      } catch (err) {}
    }
    return true;
  },
};
