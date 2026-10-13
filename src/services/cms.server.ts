// ============================================================================
// CMS Server Services for Joshi's Academy (MySQL Database & Memory Backend)
// Handles Gallery, YouTube Videos, and Google Reviews API logic
// ============================================================================

import { supabaseServer } from "@/lib/supabase.server";
import waImg01 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.20 PM.jpeg";
import waImg02 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.23 PM.jpeg";
import waImg03 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.24 PM.jpeg";
import waImg04 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.24 PM (1).jpeg";
import waImg05 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.25 PM.jpeg";
import waImg06 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.25 PM (1).jpeg";
import waImg07 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.25 PM (2).jpeg";
import waImg08 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.25 PM (3).jpeg";
import waImg09 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.25 PM (4).jpeg";
import waImg10 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.26 PM.jpeg";
import waImg11 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.26 PM (1).jpeg";
import waImg12 from "@/assets/WhatsApp Image 2026-10-12 at 3.40.26 PM (2).jpeg";

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
    image_url: waImg01,
    thumbnail_url: waImg01,
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
    image_url: waImg02,
    thumbnail_url: waImg02,
    category: "Classrooms",
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
    image_url: waImg03,
    thumbnail_url: waImg03,
    category: "Activity",
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
    image_url: waImg04,
    thumbnail_url: waImg04,
    category: "Activity",
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
    image_url: waImg05,
    thumbnail_url: waImg05,
    category: "Events",
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
    image_url: waImg06,
    thumbnail_url: waImg06,
    category: "Wall of Fame",
    is_published: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-7",
    academy_id: "default",
    title: "Focused Interactive Classroom Engagement",
    description:
      "Students actively discussing and participating in conceptual Science learning sessions.",
    image_url: waImg07,
    thumbnail_url: waImg07,
    category: "Classrooms",
    is_published: true,
    display_order: 7,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-8",
    academy_id: "default",
    title: "Practical Science Concept Demonstration",
    description:
      "In-depth understanding of experiments and real-world science applications.",
    image_url: waImg08,
    thumbnail_url: waImg08,
    category: "Activity",
    is_published: true,
    display_order: 8,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-9",
    academy_id: "default",
    title: "Modern Study Environment & Library",
    description:
      "Disciplined and comfortable academic space conducive to concentrated study.",
    image_url: waImg09,
    thumbnail_url: waImg09,
    category: "Activity",
    is_published: true,
    display_order: 9,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-10",
    academy_id: "default",
    title: "Student Celebration & Milestone Recognition",
    description:
      "Recognizing effort, consistency, and remarkable academic progression.",
    image_url: waImg10,
    thumbnail_url: waImg10,
    category: "Events",
    is_published: true,
    display_order: 10,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-11",
    academy_id: "default",
    title: "Small Group Doubt Resolution",
    description:
      "Personal mentoring where individual learning queries are addressed in detail.",
    image_url: waImg11,
    thumbnail_url: waImg11,
    category: "Classrooms",
    is_published: true,
    display_order: 11,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_by: null,
    updated_by: null,
  },
  {
    id: "gal-default-12",
    academy_id: "default",
    title: "Academic Excellence & Board Results Display",
    description:
      "Proven history of high scores across CBSE and ICSE board exams.",
    image_url: waImg12,
    thumbnail_url: waImg12,
    category: "Wall of Fame",
    is_published: true,
    display_order: 12,
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 11).toISOString(),
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

// ─── GALLERY SERVICE (SUPABASE + MEMORY BACKEND) ─────────────────────────────

export const GalleryService = {
  async getItems(
    academyId: string = "default",
    includeUnpublished: boolean = false,
  ): Promise<GalleryItem[]> {
    try {
      let query = supabaseServer
        .from("gallery")
        .select("*")
        .eq("academy_id", academyId)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((r: any) => ({
          ...r,
          is_published: Boolean(r.is_published),
        }));
      }
    } catch (err) {
      console.warn("Supabase gallery query notice, using local fallback:", err);
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
      category: payload.category?.trim() || "Classrooms",
      is_published: payload.isPublished ?? true,
      display_order: payload.displayOrder ?? memoryGallery.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
    };

    try {
      await supabaseServer.from("gallery").insert({
        id: newItem.id,
        academy_id: newItem.academy_id,
        title: newItem.title,
        description: newItem.description,
        image_url: newItem.image_url,
        thumbnail_url: newItem.thumbnail_url,
        category: newItem.category,
        is_published: newItem.is_published,
        display_order: newItem.display_order,
      });
    } catch (err) {
      console.warn("Supabase gallery insert notice:", err);
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

    try {
      const updates: any = {};
      if (payload.title !== undefined) updates.title = payload.title.trim();
      if (payload.description !== undefined) updates.description = payload.description.trim();
      if (payload.imageUrl !== undefined) updates.image_url = payload.imageUrl.trim();
      if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl.trim();
      if (payload.category !== undefined) updates.category = payload.category.trim();
      if (payload.isPublished !== undefined) updates.is_published = payload.isPublished;
      if (payload.displayOrder !== undefined) updates.display_order = payload.displayOrder;
      updates.updated_at = new Date().toISOString();

      await supabaseServer.from("gallery").update(updates).eq("id", id);
    } catch (err) {
      console.warn("Supabase gallery update notice:", err);
    }

    return memoryGallery.find((i) => i.id === id) || null;
  },

  async deleteItem(id: string) {
    const idx = memoryGallery.findIndex((i) => i.id === id);
    if (idx !== -1) memoryGallery.splice(idx, 1);

    try {
      await supabaseServer.from("gallery").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase gallery delete notice:", err);
    }
    return true;
  },

  async reorderItems(items: { id: string; displayOrder: number }[], academyId: string = "default") {
    items.forEach((item) => {
      const found = memoryGallery.find((g) => g.id === item.id);
      if (found) found.display_order = item.displayOrder;
    });

    try {
      for (const item of items) {
        await supabaseServer
          .from("gallery")
          .update({ display_order: item.displayOrder, updated_at: new Date().toISOString() })
          .eq("id", item.id)
          .eq("academy_id", academyId);
      }
    } catch (err) {
      console.warn("Supabase gallery reorder notice:", err);
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

// ─── YOUTUBE SERVICE (SUPABASE + MEMORY BACKEND) ─────────────────────────────

export const YouTubeService = {
  async getVideos(
    academyId: string = "default",
    includeUnpublished: boolean = false,
  ): Promise<YouTubeVideoItem[]> {
    try {
      let query = supabaseServer
        .from("youtube_videos")
        .select("*")
        .eq("academy_id", academyId)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((r: any) => ({
          ...r,
          is_published: Boolean(r.is_published),
          is_featured: Boolean(r.is_featured),
          is_short: Boolean(r.is_short),
        }));
      }
    } catch (err) {
      console.warn("Supabase youtube query notice:", err);
    }

    return includeUnpublished
      ? [...memoryVideos]
      : memoryVideos.filter((item) => item.is_published);
  },

  async createVideo(payload: {
    academyId?: string;
    title?: string;
    description?: string;
    youtubeUrl: string;
    isPublished?: boolean;
    displayOrder?: number;
    isShort?: boolean;
    contentType?: "VIDEO" | "SHORT" | string;
  }): Promise<YouTubeVideoItem> {
    const videoId = extractYouTubeVideoId(payload.youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL.");
    }
    const thumbnailUrl = getYouTubeThumbnail(videoId, "maxres");

    let isShort = payload.isShort ?? false;
    if (payload.youtubeUrl.includes("/shorts/")) {
      isShort = true;
    }
    const contentType = payload.contentType || (isShort ? "SHORT" : "VIDEO");

    let title = (payload.title || "").trim();
    let description = (payload.description || "").trim();

    // Auto-fetch real YouTube title directly if empty
    if (!title) {
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(payload.youtubeUrl.trim())}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.title) {
            title = String(data.title).trim();
          }
        }
      } catch (err) {
        console.warn("YouTube oEmbed fetch error:", err);
      }
    }

    if (!title) {
      title = `YouTube ${isShort ? "Short" : "Video"} (${videoId})`;
    }

    const newVid: YouTubeVideoItem = {
      id: "vid-" + videoId + "-" + Date.now().toString(36),
      academy_id: payload.academyId || "default",
      title,
      description,
      youtube_url: payload.youtubeUrl.trim(),
      youtube_video_id: videoId,
      thumbnail_url: thumbnailUrl,
      is_published: payload.isPublished ?? true,
      display_order: payload.displayOrder ?? memoryVideos.length + 1,
      is_short: isShort,
      content_type: contentType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
    };

    try {
      const { error } = await supabaseServer.from("youtube_videos").insert({
        id: newVid.id,
        academy_id: newVid.academy_id,
        title: newVid.title,
        description: newVid.description,
        youtube_url: newVid.youtube_url,
        youtube_video_id: newVid.youtube_video_id,
        thumbnail_url: newVid.thumbnail_url,
        is_published: newVid.is_published,
        display_order: newVid.display_order,
        is_short: newVid.is_short,
        content_type: newVid.content_type,
        created_at: newVid.created_at,
        updated_at: newVid.updated_at,
      });

      if (error) {
        console.error("Supabase insert youtube_videos error:", error);
        throw new Error("Database insert failed: " + error.message);
      }
    } catch (err: any) {
      console.warn("Supabase youtube insert notice:", err?.message || err);
      throw err;
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
      isShort: boolean;
      contentType: string;
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
      if (payload.isShort !== undefined) {
        memoryVideos[idx]!.is_short = payload.isShort;
        memoryVideos[idx]!.content_type = payload.contentType || (payload.isShort ? "SHORT" : "VIDEO");
      }
      if (payload.youtubeUrl !== undefined) {
        const videoId = extractYouTubeVideoId(payload.youtubeUrl);
        if (videoId) {
          memoryVideos[idx]!.youtube_url = payload.youtubeUrl.trim();
          memoryVideos[idx]!.youtube_video_id = videoId;
          memoryVideos[idx]!.thumbnail_url = getYouTubeThumbnail(videoId, "maxres");
        }
      }
    }

    try {
      const updates: any = {};
      if (payload.title !== undefined) updates.title = payload.title.trim();
      if (payload.description !== undefined) updates.description = payload.description.trim();
      if (payload.isPublished !== undefined) updates.is_published = payload.isPublished;
      if (payload.displayOrder !== undefined) updates.display_order = payload.displayOrder;
      if (payload.isShort !== undefined) {
        updates.is_short = payload.isShort;
        updates.content_type = payload.contentType || (payload.isShort ? "SHORT" : "VIDEO");
      }
      if (payload.youtubeUrl !== undefined) {
        const videoId = extractYouTubeVideoId(payload.youtubeUrl);
        if (videoId) {
          updates.youtube_url = payload.youtubeUrl.trim();
          updates.youtube_video_id = videoId;
          updates.thumbnail_url = getYouTubeThumbnail(videoId, "maxres");
        }
      }
      updates.updated_at = new Date().toISOString();
      const { data: updatedDb, error: updateErr } = await supabaseServer
        .from("youtube_videos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!updateErr && updatedDb) {
        const mapped: YouTubeVideoItem = {
          ...updatedDb,
          is_published: Boolean(updatedDb.is_published),
          is_featured: Boolean(updatedDb.is_featured),
          is_short: Boolean(updatedDb.is_short),
        };
        if (idx !== -1) {
          memoryVideos[idx] = mapped;
        } else {
          memoryVideos.push(mapped);
        }
        return mapped;
      }
    } catch (err) {
      console.warn("Supabase youtube update notice:", err);
    }

    return memoryVideos.find((v) => v.id === id) || null;
  },

  async deleteVideo(id: string) {
    const idx = memoryVideos.findIndex((v) => v.id === id);
    if (idx !== -1) memoryVideos.splice(idx, 1);

    try {
      await supabaseServer.from("youtube_videos").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase youtube delete notice:", err);
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

    try {
      for (const item of items) {
        await supabaseServer
          .from("youtube_videos")
          .update({ display_order: item.displayOrder, updated_at: new Date().toISOString() })
          .eq("id", item.id)
          .eq("academy_id", academyId);
      }
    } catch (err) {
      console.warn("Supabase youtube reorder notice:", err);
    }
    return true;
  },
};

// ─── GOOGLE PLACES & REVIEWS SERVICE ─────────────────────────────────────────

const EMPTY_REVIEWS: PublicGoogleReviewsPayload = {
  enabled: true,
  placeName: "Joshi's Academy",
  rating: 4.9,
  totalReviews: 0,
  googleMapsUri: "https://maps.google.com/?q=Joshi's+Academy+Kharadi+Pune",
  lastFetchedAt: new Date().toISOString(),
  reviews: [],
};

export const GooglePlacesService = {
  async getConfig(academyId: string = "default"): Promise<GoogleReviewConfig> {
    try {
      const { data, error } = await supabaseServer
        .from("google_review_config")
        .select("*")
        .eq("academy_id", academyId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          academy_id: data.academy_id,
          google_place_id: data.google_place_id || process.env["GOOGLE_PLACE_ID"] || "",
          is_enabled: Boolean(data.is_enabled),
          auto_refresh: Boolean(data.auto_refresh),
          max_reviews: data.max_reviews || 10,
          min_rating: data.min_rating || 4,
          last_fetched_at: data.last_fetched_at,
        };
      }
    } catch (err) {
      console.warn("Supabase google_review_config notice:", err);
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
    try {
      await supabaseServer.from("google_review_config").upsert({
        id: "default-config",
        academy_id: academyId,
        google_place_id: payload.google_place_id || "",
        is_enabled: payload.is_enabled ?? true,
        auto_refresh: payload.auto_refresh ?? true,
        max_reviews: payload.max_reviews ?? 10,
        min_rating: payload.min_rating ?? 4,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Supabase google_review_config save notice:", err);
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

      try {
        await supabaseServer.from("google_review_cache").upsert({
          id: "default-cache",
          academy_id: academyId,
          place_id: placeId,
          place_name: payload.placeName,
          overall_rating: payload.rating,
          total_reviews: payload.totalReviews,
          review_data: payload.reviews,
          last_fetched_at: payload.lastFetchedAt,
        });
      } catch (err) {}

      return payload;
    } catch (err) {
      return this.getCachedOrFallback(academyId);
    }
  },

  async getCachedOrFallback(academyId: string = "default"): Promise<PublicGoogleReviewsPayload> {
    try {
      const { data: cache, error } = await supabaseServer
        .from("google_review_cache")
        .select("*")
        .eq("academy_id", academyId)
        .maybeSingle();

      if (!error && cache) {
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

    return EMPTY_REVIEWS;
  },

  async saveReviewsCache(
    academyId: string = "default",
    payload: {
      placeName?: string;
      rating?: number;
      totalReviews?: number;
      googleMapsUri?: string;
      reviews: NormalizedReview[];
    },
  ): Promise<PublicGoogleReviewsPayload> {
    try {
      const dataToSave = {
        id: "default-cache",
        academy_id: academyId,
        place_id: "default-place",
        place_name: payload.placeName || "Joshi's Academy",
        overall_rating: payload.rating || 4.9,
        total_reviews: payload.totalReviews || payload.reviews.length,
        review_data: payload.reviews,
        last_fetched_at: new Date().toISOString(),
      };
      await supabaseServer.from("google_review_cache").upsert(dataToSave, { onConflict: "id" });
      return this.getCachedOrFallback(academyId);
    } catch (err) {
      console.warn("Supabase save review cache notice:", err);
      throw err;
    }
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
