// ============================================================================
// CMS Server Services for Joshi's Academy (MySQL Database & Memory Backend)
// Handles Gallery, YouTube Videos, and Google Reviews API logic
// ============================================================================

import { queryMySQL, isMySQLConfigured } from "@/lib/mysql.server";

export type GalleryItem = {
  id: string;
  academy_id: string;
  title: string;
  description?: string | null;
  image_url: string;
  thumbnail_url?: string | null;
  category?: string | null;
  is_published: boolean;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
};

export type YouTubeVideoItem = {
  id: string;
  academy_id: string;
  channel_id?: string | null;
  title: string;
  description?: string | null;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url?: string | null;
  published_at?: string | null;
  duration?: string | null;
  content_type?: "VIDEO" | "SHORT" | string;
  is_short?: boolean;
  is_featured?: boolean;
  view_count?: number | string | null;
  is_published: boolean;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
};

export type GoogleReviewConfig = {
  id: string;
  academy_id: string;
  google_place_id?: string | null;
  is_enabled: boolean;
  auto_refresh: boolean;
  max_reviews: number;
  min_rating: number;
  last_fetched_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GoogleReviewCache = {
  id: string;
  academy_id: string;
  place_id?: string | null;
  place_name?: string | null;
  overall_rating?: number | null;
  total_reviews?: number | null;
  review_data?: any;
  last_fetched_at: string;
};

export type NormalizedReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  authorPhotoUrl?: string | null;
  googleMapsUri?: string | null;
};

export type PublicGoogleReviewsPayload = {
  enabled: boolean;
  placeName: string;
  rating: number;
  totalReviews: number;
  googleMapsUri: string;
  reviews: NormalizedReview[];
  lastFetchedAt: string;
};

// ─── LOCAL IN-MEMORY FALLBACK STORAGE ───────────────────────────────────────


const memoryGallery: GalleryItem[] = [
  {
    id: "gal-default-1",
    academy_id: "default",
    title: "Small-Batch Science Lecture in Session",
    description:
      "A teacher breaking down Newton's laws of motion with real-time student participation.",
    image_url:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    category: "Classrooms",
    is_published: true,
    display_order: 1,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-2",
    academy_id: "default",
    title: "Step-Wise Numerical Problem Solving Workshop",
    description:
      "Deconstructing Physics numericals and Chemistry valency problems on the board with student participation.",
    image_url:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop",
    category: "Campus & Infrastructure",
    is_published: true,
    display_order: 2,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-3",
    academy_id: "default",
    title: "State-of-the-Art Science Laboratory",
    description:
      "Hands-on Physics and Chemistry practical experiment demonstrations for ICSE & CBSE Class 10.",
    image_url:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
    category: "Science Labs",
    is_published: true,
    display_order: 3,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-4",
    academy_id: "default",
    title: "Weekly Test Series & Board Examination Practice Session",
    description:
      "Students completing timed test series reflecting exact CBSE & ICSE marking parameters.",
    image_url:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
    category: "Campus & Infrastructure",
    is_published: true,
    display_order: 4,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-5",
    academy_id: "default",
    title: "Annual Academic Felicitation & Merit Awards",
    description:
      "Celebrating top scorers from ICSE & CBSE Class 10 board examinations at Joshi's Academy Kharadi.",
    image_url:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
    category: "Cultural Events",
    is_published: true,
    display_order: 5,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-6",
    academy_id: "default",
    title: "Wall of Fame • 95%+ Board Champions",
    description:
      "Honoring past batch toppers across Physics, Chemistry, Biology, and Mathematics with distinction.",
    image_url:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop",
    thumbnail_url:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
    category: "Wall of Fame",
    is_published: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
  },
];
const memoryVideos: YouTubeVideoItem[] = [
  // ─── REAL FEATURED VIDEO FROM VARSHA'S TUTORIALS ───────────────────────────
  {
    id: "vid-yt-1",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Redox Reactions Class 10 CBSE | Oxidation & Reduction Made SUPER EASY ⚡",
    description:
      "Varsha Ma'am breaks down Redox Reactions, Oxidation, Reduction, Oxidising Agents & Reducing Agents for Class 10 CBSE 2026 board exam students with crystal clear examples.",
    youtube_url: "https://www.youtube.com/watch?v=Y10NWZ-XFPA",
    youtube_video_id: "Y10NWZ-XFPA",
    thumbnail_url: "https://img.youtube.com/vi/Y10NWZ-XFPA/maxresdefault.jpg",
    published_at: "2026-04-19T04:43:28.000Z",
    duration: "18:42",
    content_type: "VIDEO",
    is_short: false,
    is_featured: true,
    view_count: "4.8K",
    is_published: true,
    display_order: 1,
    created_at: "2026-04-19T04:43:28.000Z",
    updated_at: "2026-04-19T04:43:28.000Z",
  },
  // ─── REAL FULL LESSON VIDEOS FROM VARSHA'S TUTORIALS ───────────────────────
  {
    id: "vid-yt-2",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Chemical Reactions & Equations 🔥 | Part 2 | Class 10 CBSE 2026 | Must Watch Chapter",
    description:
      "Balancing chemical equations, combination, decomposition, displacement, and double displacement reactions explained in detail by Varsha Joshi.",
    youtube_url: "https://www.youtube.com/watch?v=Sbpy-bXyRRE",
    youtube_video_id: "Sbpy-bXyRRE",
    thumbnail_url: "https://img.youtube.com/vi/Sbpy-bXyRRE/hqdefault.jpg",
    published_at: "2026-04-12T09:40:08.000Z",
    duration: "24:15",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "5.2K",
    is_published: true,
    display_order: 2,
    created_at: "2026-04-12T09:40:08.000Z",
    updated_at: "2026-04-12T09:40:08.000Z",
  },
  {
    id: "vid-yt-3",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Chemical Reactions & Equations 🔥 | Part 1 | Class 10 CBSE 2026 | Must Watch Chapter",
    description:
      "Introduction to chemical equations, physical states representation, exothermic vs endothermic reactions with laboratory demonstration insights.",
    youtube_url: "https://www.youtube.com/watch?v=3YA2SFNXXtE",
    youtube_video_id: "3YA2SFNXXtE",
    thumbnail_url: "https://img.youtube.com/vi/3YA2SFNXXtE/hqdefault.jpg",
    published_at: "2026-04-01T14:30:01.000Z",
    duration: "21:30",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "6.1K",
    is_published: true,
    display_order: 3,
    created_at: "2026-04-01T14:30:01.000Z",
    updated_at: "2026-04-01T14:30:01.000Z",
  },
  {
    id: "vid-yt-4",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Class 10 Science | Respiration Full Chapter in One Shot 🔥 | CBSE Board Exam",
    description:
      "Aerobic vs Anaerobic respiration, ATP formation, human respiratory system and gas exchange step-by-step for Class 10 Board preparation.",
    youtube_url: "https://www.youtube.com/watch?v=WEh2T-g_3Bo",
    youtube_video_id: "WEh2T-g_3Bo",
    thumbnail_url: "https://img.youtube.com/vi/WEh2T-g_3Bo/hqdefault.jpg",
    published_at: "2026-03-27T14:30:28.000Z",
    duration: "32:10",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "7.9K",
    is_published: true,
    display_order: 4,
    created_at: "2026-03-27T14:30:28.000Z",
    updated_at: "2026-03-27T14:30:28.000Z",
  },
  {
    id: "vid-yt-5",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Everything about Cell | Class 10th Science Study | Learn the Easy Way",
    description:
      "Cell structures, organelles, plant vs animal cell comparison, and cell division fundamentals for secondary students.",
    youtube_url: "https://www.youtube.com/watch?v=bPlNnZdM8ms",
    youtube_video_id: "bPlNnZdM8ms",
    thumbnail_url: "https://img.youtube.com/vi/bPlNnZdM8ms/hqdefault.jpg",
    published_at: "2026-01-12T12:30:56.000Z",
    duration: "19:40",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "3.4K",
    is_published: true,
    display_order: 5,
    created_at: "2026-01-12T12:30:56.000Z",
    updated_at: "2026-01-12T12:30:56.000Z",
  },
  {
    id: "vid-yt-6",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Microorganisms Complete Chapter | Class 8th & 9th Science | Learn the Easy Way",
    description:
      "Bacteria, fungi, viruses, friendly microbes, pathogens, and food preservation methods explained simply.",
    youtube_url: "https://www.youtube.com/watch?v=kOhnb4OqRfE",
    youtube_video_id: "kOhnb4OqRfE",
    thumbnail_url: "https://img.youtube.com/vi/kOhnb4OqRfE/hqdefault.jpg",
    published_at: "2025-06-02T10:30:22.000Z",
    duration: "22:50",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "4.1K",
    is_published: true,
    display_order: 6,
    created_at: "2025-06-02T10:30:22.000Z",
    updated_at: "2025-06-02T10:30:22.000Z",
  },
  {
    id: "vid-yt-7",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "HOT Questions Series | Question 5 | Class 10th Science Study | Learn the Easy Way",
    description:
      "Higher Order Thinking Skills (HOTS) questions solving session for Class 10 Science board examinations.",
    youtube_url: "https://www.youtube.com/watch?v=rKjM8Ew-8IE",
    youtube_video_id: "rKjM8Ew-8IE",
    thumbnail_url: "https://img.youtube.com/vi/rKjM8Ew-8IE/hqdefault.jpg",
    published_at: "2025-05-28T10:30:40.000Z",
    duration: "14:20",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "2.8K",
    is_published: true,
    display_order: 7,
    created_at: "2025-05-28T10:30:40.000Z",
    updated_at: "2025-05-28T10:30:40.000Z",
  },
  {
    id: "vid-yt-8",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "HOT Questions Series | Question 4 | Class 10th Science Study | Learn the Easy Way",
    description:
      "Critical numerical and reasoning questions from physics & chemistry solved step-by-step.",
    youtube_url: "https://www.youtube.com/watch?v=P6cokBtxSxc",
    youtube_video_id: "P6cokBtxSxc",
    thumbnail_url: "https://img.youtube.com/vi/P6cokBtxSxc/hqdefault.jpg",
    published_at: "2025-05-27T14:00:47.000Z",
    duration: "15:05",
    content_type: "VIDEO",
    is_short: false,
    is_featured: false,
    view_count: "3.1K",
    is_published: true,
    display_order: 8,
    created_at: "2025-05-27T14:00:47.000Z",
    updated_at: "2025-05-27T14:00:47.000Z",
  },

  // ─── REAL SHORTS FROM VARSHA'S TUTORIALS (9:16) ───────────────────────────
  {
    id: "short-yt-1",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Chemical Reactions & Equations Coming Soon 🔥 | Class 10 CBSE #shorts",
    description: "Quick revision teaser for Class 10 CBSE Science students.",
    youtube_url: "https://www.youtube.com/watch?v=ieefoJi6EJs",
    youtube_video_id: "ieefoJi6EJs",
    thumbnail_url: "https://img.youtube.com/vi/ieefoJi6EJs/hqdefault.jpg",
    published_at: "2026-03-31T05:16:27.000Z",
    duration: "0:45",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "14.2K",
    is_published: true,
    display_order: 101,
    created_at: "2026-03-31T05:16:27.000Z",
    updated_at: "2026-03-31T05:16:27.000Z",
  },
  {
    id: "short-yt-2",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Class 10th Science Study Tips | Learn the Easy Way #shorts",
    description: "Quick mnemonic tips for remembering chemistry periodic trends.",
    youtube_url: "https://www.youtube.com/watch?v=7HVogrFkxkw",
    youtube_video_id: "7HVogrFkxkw",
    thumbnail_url: "https://img.youtube.com/vi/7HVogrFkxkw/hqdefault.jpg",
    published_at: "2025-05-26T07:52:46.000Z",
    duration: "0:52",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "18.6K",
    is_published: true,
    display_order: 102,
    created_at: "2025-05-26T07:52:46.000Z",
    updated_at: "2025-05-26T07:52:46.000Z",
  },
  {
    id: "short-yt-3",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Class 10th Science Study Conceptual Breakdown #shorts",
    description: "Quick explanation of reflection and refraction optical rules.",
    youtube_url: "https://www.youtube.com/watch?v=DM4ySD9lVAA",
    youtube_video_id: "DM4ySD9lVAA",
    thumbnail_url: "https://img.youtube.com/vi/DM4ySD9lVAA/hqdefault.jpg",
    published_at: "2025-06-11T13:26:24.000Z",
    duration: "0:48",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "21.3K",
    is_published: true,
    display_order: 103,
    created_at: "2025-06-11T13:26:24.000Z",
    updated_at: "2025-06-11T13:26:24.000Z",
  },
  {
    id: "short-yt-4",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "Why is Cigarette Smoking Injurious to Health? Class 10 Biology #shorts",
    description: "Tar, nicotine, alveoli surface damage and respiratory biology.",
    youtube_url: "https://www.youtube.com/watch?v=Qdn0hSOce_o",
    youtube_video_id: "Qdn0hSOce_o",
    thumbnail_url: "https://img.youtube.com/vi/Qdn0hSOce_o/hqdefault.jpg",
    published_at: "2025-05-09T13:46:54.000Z",
    duration: "0:58",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "29.4K",
    is_published: true,
    display_order: 104,
    created_at: "2025-05-09T13:46:54.000Z",
    updated_at: "2025-05-09T13:46:54.000Z",
  },
  {
    id: "short-yt-5",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "HOT Question Series | Question 3 | Class 10th Science Study #shorts",
    description: "Tricky board exam reasoning problem solved in 45 seconds.",
    youtube_url: "https://www.youtube.com/watch?v=4gVXecxyVCQ",
    youtube_video_id: "4gVXecxyVCQ",
    thumbnail_url: "https://img.youtube.com/vi/4gVXecxyVCQ/hqdefault.jpg",
    published_at: "2025-05-25T13:40:16.000Z",
    duration: "0:42",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "16.1K",
    is_published: true,
    display_order: 105,
    created_at: "2025-05-25T13:40:16.000Z",
    updated_at: "2025-05-25T13:40:16.000Z",
  },
  {
    id: "short-yt-6",
    academy_id: "default",
    channel_id: "UCDSt5dxDiWkZ7p9mhoSECJQ",
    title: "HOT Series Question 2 | Class 10th Science Study #shorts",
    description: "Circuit analysis shortcuts and Ohm's law formula tips.",
    youtube_url: "https://www.youtube.com/watch?v=FX8qwGlr51Y",
    youtube_video_id: "FX8qwGlr51Y",
    thumbnail_url: "https://img.youtube.com/vi/FX8qwGlr51Y/hqdefault.jpg",
    published_at: "2025-05-12T10:45:53.000Z",
    duration: "0:50",
    content_type: "SHORT",
    is_short: true,
    is_featured: false,
    view_count: "11.7K",
    is_published: true,
    display_order: 106,
    created_at: "2025-05-12T10:45:53.000Z",
    updated_at: "2025-05-12T10:45:53.000Z",
  },
];

// ─── YOUTUBE HELPERS ─────────────────────────────────────────────────────────

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|shorts\/|v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  return null;
}

export function getYouTubeThumbnail(videoId: string, quality: "maxres" | "hq" = "maxres"): string {
  if (quality === "hq") {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

async function ensureGalleryTable() {
  if (!isMySQLConfigured()) return;
  try {
    await queryMySQL(`
      CREATE TABLE IF NOT EXISTS \`gallery\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`academy_id\` VARCHAR(64) NOT NULL DEFAULT 'default',
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`image_url\` LONGTEXT NOT NULL,
        \`thumbnail_url\` LONGTEXT DEFAULT NULL,
        \`category\` VARCHAR(100) NOT NULL DEFAULT 'General',
        \`is_published\` TINYINT(1) NOT NULL DEFAULT 1,
        \`display_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_gallery_academy\` (\`academy_id\`),
        KEY \`idx_gallery_published\` (\`is_published\`),
        KEY \`idx_gallery_order\` (\`display_order\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (e) {}
}

// ─── GALLERY SERVICE (MYSQL + MEMORY BACKEND) ───────────────────────────────

export const GalleryService = {
  async getItems(
    academyId: string = "default",
    includeUnpublished: boolean = false,
  ): Promise<GalleryItem[]> {
    if (isMySQLConfigured()) {
      try {
        await ensureGalleryTable();
        const sql = includeUnpublished
          ? `SELECT * FROM gallery WHERE academy_id = ? ORDER BY display_order ASC, created_at DESC`
          : `SELECT * FROM gallery WHERE academy_id = ? AND is_published = 1 ORDER BY display_order ASC, created_at DESC`;
        const rows = await queryMySQL<any[]>(sql, [academyId]);
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            is_published: Boolean(r.is_published),
          }));
        }
      } catch (err) {
        console.warn("MySQL gallery query error, using local fallback:", err);
      }
    }

    return includeUnpublished
      ? [...memoryGallery]
      : memoryGallery.filter((item) => item.is_published);
  },

  async createItem(payload: {
    academyId?: string;
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    category?: string;
    isPublished?: boolean;
    displayOrder?: number;
  }): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      id: "gal-" + Date.now(),
      academy_id: payload.academyId || "default",
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      image_url: payload.imageUrl.trim(),
      thumbnail_url: payload.thumbnailUrl?.trim() || payload.imageUrl.trim(),
      category: payload.category?.trim() || "Campus & Infrastructure",
      is_published: payload.isPublished ?? true,
      display_order: payload.displayOrder ?? memoryGallery.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
    };

    if (isMySQLConfigured()) {
      try {
        await ensureGalleryTable();
        const sql = `
          INSERT INTO gallery (id, academy_id, title, description, image_url, thumbnail_url, category, is_published, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await queryMySQL(sql, [
          newItem.id,
          newItem.academy_id,
          newItem.title,
          newItem.description,
          newItem.image_url,
          newItem.thumbnail_url,
          newItem.category,
          newItem.is_published ? 1 : 0,
          newItem.display_order,
        ]);
      } catch (err) {
        console.warn("MySQL insert error:", err);
      }
    }

    memoryGallery.push(newItem);
    return newItem;
  },

  async updateItem(
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      imageUrl: string;
      thumbnailUrl: string;
      category: string;
      isPublished: boolean;
      displayOrder: number;
    }>,
  ) {
    const idx = memoryGallery.findIndex((i) => i.id === id);
    if (idx !== -1) {
      if (payload.title !== undefined) memoryGallery[idx]!.title = payload.title.trim();
      if (payload.description !== undefined)
        memoryGallery[idx]!.description = payload.description.trim();
      if (payload.imageUrl !== undefined) memoryGallery[idx]!.image_url = payload.imageUrl.trim();
      if (payload.category !== undefined) memoryGallery[idx]!.category = payload.category.trim();
      if (payload.isPublished !== undefined) memoryGallery[idx]!.is_published = payload.isPublished;
      if (payload.displayOrder !== undefined)
        memoryGallery[idx]!.display_order = payload.displayOrder;
      memoryGallery[idx]!.updated_at = new Date().toISOString();
    }

    if (isMySQLConfigured()) {
      try {
        await ensureGalleryTable();
        const fields: string[] = [];
        const params: any[] = [];
        if (payload.title !== undefined) {
          fields.push("title = ?");
          params.push(payload.title.trim());
        }
        if (payload.description !== undefined) {
          fields.push("description = ?");
          params.push(payload.description.trim());
        }
        if (payload.imageUrl !== undefined) {
          fields.push("image_url = ?");
          params.push(payload.imageUrl.trim());
        }
        if (payload.category !== undefined) {
          fields.push("category = ?");
          params.push(payload.category.trim());
        }
        if (payload.isPublished !== undefined) {
          fields.push("is_published = ?");
          params.push(payload.isPublished ? 1 : 0);
        }
        if (payload.displayOrder !== undefined) {
          fields.push("display_order = ?");
          params.push(payload.displayOrder);
        }

        if (fields.length > 0) {
          fields.push("updated_at = NOW()");
          params.push(id);
          const sql = `UPDATE gallery SET ${fields.join(", ")} WHERE id = ?`;
          await queryMySQL(sql, params);
        }
      } catch (err) {}
    }

    return memoryGallery.find((i) => i.id === id) || null;
  },

  async deleteItem(id: string) {
    const idx = memoryGallery.findIndex((i) => i.id === id);
    if (idx !== -1) memoryGallery.splice(idx, 1);

    if (isMySQLConfigured()) {
      try {
        await ensureGalleryTable();
        await queryMySQL(`DELETE FROM gallery WHERE id = ?`, [id]);
      } catch (err) {}
    }
    return true;
  },

  async reorderItems(items: { id: string; displayOrder: number }[], academyId: string = "default") {
    items.forEach((item) => {
      const found = memoryGallery.find((g) => g.id === item.id);
      if (found) found.display_order = item.displayOrder;
    });

    if (isMySQLConfigured()) {
      try {
        await ensureGalleryTable();
        for (const item of items) {
          await queryMySQL(`UPDATE gallery SET display_order = ? WHERE id = ? AND academy_id = ?`, [
            item.displayOrder,
            item.id,
            academyId,
          ]);
        }
      } catch (err) {}
    }
    return true;
  },

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to read image file."));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  },
};

// ─── YOUTUBE SERVICE (MYSQL + MEMORY BACKEND) ───────────────────────────────

export const YouTubeService = {
  async getVideos(
    academyId: string = "default",
    includeUnpublished: boolean = false,
  ): Promise<YouTubeVideoItem[]> {
    if (isMySQLConfigured()) {
      try {
        const sql = includeUnpublished
          ? `SELECT * FROM youtube_videos WHERE academy_id = ? ORDER BY display_order ASC, created_at DESC`
          : `SELECT * FROM youtube_videos WHERE academy_id = ? AND is_published = 1 ORDER BY display_order ASC, created_at DESC`;
        const rows = await queryMySQL<any[]>(sql, [academyId]);
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            is_published: Boolean(r.is_published),
            is_featured: Boolean(r.is_featured),
            is_short: Boolean(r.is_short),
          }));
        }
      } catch (err) {}
    }

    return includeUnpublished
      ? [...memoryVideos]
      : memoryVideos.filter((item) => item.is_published);
  },

  async createVideo(payload: {
    academyId?: string;
    title: string;
    description?: string;
    youtubeUrl: string;
    isPublished?: boolean;
    displayOrder?: number;
  }): Promise<YouTubeVideoItem> {
    const videoId = extractYouTubeVideoId(payload.youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL.");
    }
    const thumbnailUrl = getYouTubeThumbnail(videoId, "maxres");

    const newVid: YouTubeVideoItem = {
      id: "vid-" + Date.now(),
      academy_id: payload.academyId || "default",
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      youtube_url: payload.youtubeUrl.trim(),
      youtube_video_id: videoId,
      thumbnail_url: thumbnailUrl,
      is_published: payload.isPublished ?? true,
      display_order: payload.displayOrder ?? memoryVideos.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
    };

    if (isMySQLConfigured()) {
      try {
        const sql = `
          INSERT INTO youtube_videos (id, academy_id, title, description, youtube_url, youtube_video_id, thumbnail_url, is_published, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await queryMySQL(sql, [
          newVid.id,
          newVid.academy_id,
          newVid.title,
          newVid.description,
          newVid.youtube_url,
          newVid.youtube_video_id,
          newVid.thumbnail_url,
          newVid.is_published ? 1 : 0,
          newVid.display_order,
        ]);
      } catch (err) {}
    }

    memoryVideos.push(newVid);
    return newVid;
  },

  async updateVideo(
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      youtubeUrl: string;
      isPublished: boolean;
      displayOrder: number;
    }>,
  ) {
    const idx = memoryVideos.findIndex((v) => v.id === id);
    if (idx !== -1) {
      if (payload.title !== undefined) memoryVideos[idx]!.title = payload.title.trim();
      if (payload.description !== undefined)
        memoryVideos[idx]!.description = payload.description.trim();
      if (payload.isPublished !== undefined) memoryVideos[idx]!.is_published = payload.isPublished;
      if (payload.displayOrder !== undefined)
        memoryVideos[idx]!.display_order = payload.displayOrder;
      if (payload.youtubeUrl !== undefined) {
        const videoId = extractYouTubeVideoId(payload.youtubeUrl);
        if (videoId) {
          memoryVideos[idx]!.youtube_url = payload.youtubeUrl.trim();
          memoryVideos[idx]!.youtube_video_id = videoId;
          memoryVideos[idx]!.thumbnail_url = getYouTubeThumbnail(videoId, "maxres");
        }
      }
    }

    if (isMySQLConfigured()) {
      try {
        const fields: string[] = [];
        const params: any[] = [];
        if (payload.title !== undefined) {
          fields.push("title = ?");
          params.push(payload.title.trim());
        }
        if (payload.description !== undefined) {
          fields.push("description = ?");
          params.push(payload.description.trim());
        }
        if (payload.isPublished !== undefined) {
          fields.push("is_published = ?");
          params.push(payload.isPublished ? 1 : 0);
        }
        if (payload.displayOrder !== undefined) {
          fields.push("display_order = ?");
          params.push(payload.displayOrder);
        }
        if (payload.youtubeUrl !== undefined) {
          const videoId = extractYouTubeVideoId(payload.youtubeUrl);
          if (videoId) {
            fields.push("youtube_url = ?", "youtube_video_id = ?", "thumbnail_url = ?");
            params.push(payload.youtubeUrl.trim(), videoId, getYouTubeThumbnail(videoId, "maxres"));
          }
        }
        if (fields.length > 0) {
          params.push(id);
          await queryMySQL(`UPDATE youtube_videos SET ${fields.join(", ")} WHERE id = ?`, params);
        }
      } catch (err) {}
    }

    return memoryVideos.find((v) => v.id === id) || null;
  },

  async deleteVideo(id: string) {
    const idx = memoryVideos.findIndex((v) => v.id === id);
    if (idx !== -1) memoryVideos.splice(idx, 1);

    if (isMySQLConfigured()) {
      try {
        await queryMySQL(`DELETE FROM youtube_videos WHERE id = ?`, [id]);
      } catch (err) {}
    }
    return true;
  },

  async reorderVideos(
    items: { id: string; displayOrder: number }[],
    academyId: string = "default",
  ) {
    items.forEach((item) => {
      const found = memoryVideos.find((v) => v.id === item.id);
      if (found) found.display_order = item.displayOrder;
    });

    if (isMySQLConfigured()) {
      try {
        for (const item of items) {
          await queryMySQL(
            `UPDATE youtube_videos SET display_order = ? WHERE id = ? AND academy_id = ?`,
            [item.displayOrder, item.id, academyId],
          );
        }
      } catch (err) {}
    }
    return true;
  },
};

// ─── GOOGLE PLACES & REVIEWS SERVICE ─────────────────────────────────────────

const FALLBACK_REVIEWS: PublicGoogleReviewsPayload = {
  enabled: true,
  placeName: "Joshi's Academy",
  rating: 4.9,
  totalReviews: 245,
  googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
  lastFetchedAt: new Date().toISOString(),
  reviews: [
    {
      authorName: "Rohan Deshmukh",
      rating: 5,
      text: "Varsha Ma'am teaches Science with extraordinary clarity. Concepts in Physics numericals and Chemistry equations became crystal clear. Secured 96% in 10th CBSE!",
      relativeTime: "2 weeks ago",
      authorPhotoUrl: null,
      googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
    },
    {
      authorName: "Ananya Kulkarni",
      rating: 5,
      text: "Small batch size gives individual focus. Doubts are solved in every single lecture. Highly recommended for ICSE & CBSE students in Kharadi.",
      relativeTime: "1 month ago",
      authorPhotoUrl: null,
      googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
    },
    {
      authorName: "Prakash Sharma (Parent)",
      rating: 5,
      text: "Best decision for my daughter's Class 10 board prep. Regular test series and individual feedback built immense exam confidence.",
      relativeTime: "2 months ago",
      authorPhotoUrl: null,
      googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
    },
  ],
};

export const GooglePlacesService = {
  async getConfig(academyId: string = "default"): Promise<GoogleReviewConfig> {
    if (isMySQLConfigured()) {
      try {
        const rows = await queryMySQL<any[]>(
          `SELECT * FROM google_review_config WHERE academy_id = ? LIMIT 1`,
          [academyId],
        );
        if (Array.isArray(rows) && rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            academy_id: r.academy_id,
            google_place_id: r.google_place_id || process.env["GOOGLE_PLACE_ID"] || "",
            is_enabled: Boolean(r.is_enabled),
            auto_refresh: Boolean(r.auto_refresh),
            max_reviews: r.max_reviews || 10,
            min_rating: r.min_rating || 4,
            last_fetched_at: r.last_fetched_at,
          };
        }
      } catch (err) {}
    }

    return {
      id: "default",
      academy_id: academyId,
      google_place_id: process.env["GOOGLE_PLACE_ID"] || "",
      is_enabled: true,
      auto_refresh: true,
      max_reviews: 10,
      min_rating: 4,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async saveConfig(
    academyId: string = "default",
    payload: Partial<{
      google_place_id: string;
      is_enabled: boolean;
      auto_refresh: boolean;
      max_reviews: number;
      min_rating: number;
    }>,
  ) {
    if (isMySQLConfigured()) {
      try {
        const sql = `
          INSERT INTO google_review_config (id, academy_id, google_place_id, is_enabled, auto_refresh, max_reviews, min_rating)
          VALUES ('default-config', ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            google_place_id = VALUES(google_place_id),
            is_enabled = VALUES(is_enabled),
            auto_refresh = VALUES(auto_refresh),
            max_reviews = VALUES(max_reviews),
            min_rating = VALUES(min_rating)
        `;
        await queryMySQL(sql, [
          academyId,
          payload.google_place_id || "",
          payload.is_enabled ? 1 : 0,
          payload.auto_refresh ? 1 : 0,
          payload.max_reviews ?? 10,
          payload.min_rating ?? 4,
        ]);
      } catch (err) {}
    }

    return this.getConfig(academyId);
  },

  async syncReviews(academyId: string = "default"): Promise<PublicGoogleReviewsPayload> {
    const config = await this.getConfig(academyId);
    const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
    const placeId = config.google_place_id || process.env["GOOGLE_PLACE_ID"];

    if (!apiKey || !placeId) {
      return this.getCachedOrFallback(academyId);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId,
      )}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "OK" || !data.result) {
        return this.getCachedOrFallback(academyId);
      }

      const place = data.result;
      const rawReviews: any[] = place.reviews || [];

      const normalizedReviews: NormalizedReview[] = rawReviews
        .filter((r) => r.rating >= config.min_rating)
        .slice(0, config.max_reviews)
        .map((r) => ({
          authorName: r.author_name || "Google Reviewer",
          rating: r.rating || 5,
          text: r.text || "",
          relativeTime: r.relative_time_description || "Recently",
          authorPhotoUrl: r.profile_photo_url || null,
          googleMapsUri: place.url || `https://maps.google.com/?q=place_id:${placeId}`,
        }));

      const payload: PublicGoogleReviewsPayload = {
        enabled: config.is_enabled,
        placeName: place.name || "Joshi's Academy",
        rating: place.rating || 4.9,
        totalReviews: place.user_ratings_total || normalizedReviews.length,
        googleMapsUri: place.url || `https://maps.google.com/?q=place_id:${placeId}`,
        reviews: normalizedReviews,
        lastFetchedAt: new Date().toISOString(),
      };

      if (isMySQLConfigured()) {
        try {
          const sql = `
            INSERT INTO google_review_cache (id, academy_id, place_id, place_name, overall_rating, total_reviews, review_data, last_fetched_at)
            VALUES ('default-cache', ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              place_id = VALUES(place_id),
              place_name = VALUES(place_name),
              overall_rating = VALUES(overall_rating),
              total_reviews = VALUES(total_reviews),
              review_data = VALUES(review_data),
              last_fetched_at = VALUES(last_fetched_at)
          `;
          await queryMySQL(sql, [
            academyId,
            placeId,
            payload.placeName,
            payload.rating,
            payload.totalReviews,
            JSON.stringify(payload.reviews),
            payload.lastFetchedAt,
          ]);
        } catch (err) {}
      }

      return payload;
    } catch (err) {
      return this.getCachedOrFallback(academyId);
    }
  },

  async getCachedOrFallback(academyId: string = "default"): Promise<PublicGoogleReviewsPayload> {
    if (isMySQLConfigured()) {
      try {
        const rows = await queryMySQL<any[]>(
          `SELECT * FROM google_review_cache WHERE academy_id = ? LIMIT 1`,
          [academyId],
        );
        if (Array.isArray(rows) && rows.length > 0) {
          const cache = rows[0];
          let parsedReviews: NormalizedReview[] = [];
          if (typeof cache.review_data === "string") {
            parsedReviews = JSON.parse(cache.review_data);
          } else if (Array.isArray(cache.review_data)) {
            parsedReviews = cache.review_data;
          }

          if (parsedReviews.length > 0) {
            return {
              enabled: true,
              placeName: cache.place_name || "Joshi's Academy",
              rating: Number(cache.overall_rating) || 4.9,
              totalReviews: cache.total_reviews || parsedReviews.length,
              googleMapsUri: `https://maps.google.com/?q=${encodeURIComponent(cache.place_name || "Joshi's Academy Kharadi")}`,
              reviews: parsedReviews,
              lastFetchedAt: cache.last_fetched_at,
            };
          }
        }
      } catch (err) {}
    }

    return FALLBACK_REVIEWS;
  },

  async getPublicReviews(academyId: string = "default"): Promise<PublicGoogleReviewsPayload> {
    const config = await this.getConfig(academyId);
    if (!config.is_enabled) {
      return {
        enabled: false,
        placeName: "Joshi's Academy",
        rating: 4.9,
        totalReviews: 0,
        googleMapsUri: "",
        reviews: [],
        lastFetchedAt: new Date().toISOString(),
      };
    }

    return this.getCachedOrFallback(academyId);
  },
};
