// ============================================================================
// Joshi's Academy CMS — Site Settings Service
// Manages editable website branding, announcements, contact details,
// and content module visibility with MySQL persistence and memory fallback.
// ============================================================================

import { supabaseServer } from "@/lib/supabase.server";
import { site, announcement } from "@/content/site";

export interface SiteSettingsData {
  // Website & Branding
  site_name: string;
  tagline: string;
  address_display: string;
  // Contact & Admissions
  phone: string;
  whatsapp: string;
  email: string;
  // Announcement Banner
  announcement_enabled: boolean;
  announcement_badge: string;
  announcement_text: string;
  announcement_expiry: string;
  // Content Modules Visibility
  gallery_module_enabled: boolean;
  youtube_module_enabled: boolean;
  reviews_module_enabled: boolean;
  // Admissions & CRM Preferences
  default_enquiry_status: string;
  admission_counselling_note: string;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  site_name: site.name || "Joshi’s Academy",
  tagline: site.tagline || "Gyan Ki Varsha",
  address_display: site.addressDisplay || "Kharadi, Pune, Maharashtra, India",
  phone: site.phone || "07030554317",
  whatsapp: site.whatsapp || "07030554317",
  email: "admin@joshisacademy.com",
  announcement_enabled: announcement.enabled ?? true,
  announcement_badge: announcement.badge || "2025-26 AY",
  announcement_text: announcement.text || "Science available at just ₹1500/- for 2025-26 AY!",
  announcement_expiry: announcement.expiry || "2026-12-31",
  gallery_module_enabled: true,
  youtube_module_enabled: true,
  reviews_module_enabled: true,
  default_enquiry_status: "NEW",
  admission_counselling_note: "Direct teacher counselling call within 24 hours.",
};

// In-memory runtime cache/fallback
let memorySettings: SiteSettingsData = { ...DEFAULT_SETTINGS };

export const SettingsService = {
  async getAllSettings(): Promise<SiteSettingsData> {
    try {
      const { data, error } = await supabaseServer
        .from("cms_site_settings")
        .select("key, value");

      if (!error && Array.isArray(data) && data.length > 0) {
        const map: Record<string, string> = {};
        for (const row of (data as { key: string; value: string }[])) {
          map[row.key] = row.value;
        }

        const parsed: SiteSettingsData = {
          site_name: map["site_name"] || DEFAULT_SETTINGS.site_name,
          tagline: map["tagline"] || DEFAULT_SETTINGS.tagline,
          address_display: map["address_display"] || DEFAULT_SETTINGS.address_display,
          phone: map["phone"] || DEFAULT_SETTINGS.phone,
          whatsapp: map["whatsapp"] || DEFAULT_SETTINGS.whatsapp,
          email: map["email"] || DEFAULT_SETTINGS.email,
          announcement_enabled: map["announcement_enabled"] !== "false",
          announcement_badge: map["announcement_badge"] || DEFAULT_SETTINGS.announcement_badge,
          announcement_text: map["announcement_text"] || DEFAULT_SETTINGS.announcement_text,
          announcement_expiry: map["announcement_expiry"] || DEFAULT_SETTINGS.announcement_expiry,
          gallery_module_enabled: map["gallery_module_enabled"] !== "false",
          youtube_module_enabled: map["youtube_module_enabled"] !== "false",
          reviews_module_enabled: map["reviews_module_enabled"] !== "false",
          default_enquiry_status: map["default_enquiry_status"] || DEFAULT_SETTINGS.default_enquiry_status,
          admission_counselling_note:
            map["admission_counselling_note"] || DEFAULT_SETTINGS.admission_counselling_note,
        };
        memorySettings = { ...parsed };
        return parsed;
      }
    } catch (err) {
      console.warn("Supabase settings fetch notice, using fallback:", err);
    }

    return { ...memorySettings };
  },

  async getPublicSettings(): Promise<{
    site_name: string;
    tagline: string;
    address_display: string;
    phone: string;
    whatsapp: string;
    email: string;
    announcement: {
      enabled: boolean;
      badge: string;
      text: string;
      expiry: string;
    };
    modules: {
      gallery: boolean;
      youtube: boolean;
      reviews: boolean;
    };
  }> {
    const all = await this.getAllSettings();
    return {
      site_name: all.site_name,
      tagline: all.tagline,
      address_display: all.address_display,
      phone: all.phone,
      whatsapp: all.whatsapp,
      email: all.email,
      announcement: {
        enabled: all.announcement_enabled,
        badge: all.announcement_badge,
        text: all.announcement_text,
        expiry: all.announcement_expiry,
      },
      modules: {
        gallery: all.gallery_module_enabled,
        youtube: all.youtube_module_enabled,
        reviews: all.reviews_module_enabled,
      },
    };
  },

  async updateSettings(updates: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
    await ensureSettingsTable();

    // Validation
    const cleanUpdates: Record<string, string> = {};

    if (updates.site_name !== undefined) {
      const val = updates.site_name.trim();
      if (!val) throw new Error("Academy site name cannot be empty.");
      cleanUpdates["site_name"] = val.slice(0, 150);
    }

    if (updates.tagline !== undefined) {
      cleanUpdates["tagline"] = updates.tagline.trim().slice(0, 150);
    }

    if (updates.address_display !== undefined) {
      cleanUpdates["address_display"] = updates.address_display.trim().slice(0, 300);
    }

    if (updates.phone !== undefined) {
      const val = updates.phone.trim();
      if (!val) throw new Error("Contact phone number cannot be empty.");
      cleanUpdates["phone"] = val.slice(0, 20);
    }

    if (updates.whatsapp !== undefined) {
      cleanUpdates["whatsapp"] = updates.whatsapp.trim().slice(0, 20);
    }

    if (updates.email !== undefined) {
      const val = updates.email.trim();
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        throw new Error("Invalid email format.");
      }
      cleanUpdates["email"] = val.slice(0, 100);
    }

    if (updates.announcement_enabled !== undefined) {
      cleanUpdates["announcement_enabled"] = updates.announcement_enabled ? "true" : "false";
    }

    if (updates.announcement_badge !== undefined) {
      cleanUpdates["announcement_badge"] = updates.announcement_badge.trim().slice(0, 50);
    }

    if (updates.announcement_text !== undefined) {
      cleanUpdates["announcement_text"] = updates.announcement_text.trim().slice(0, 300);
    }

    if (updates.announcement_expiry !== undefined) {
      cleanUpdates["announcement_expiry"] = updates.announcement_expiry.trim().slice(0, 30);
    }

    if (updates.gallery_module_enabled !== undefined) {
      cleanUpdates["gallery_module_enabled"] = updates.gallery_module_enabled ? "true" : "false";
    }

    if (updates.youtube_module_enabled !== undefined) {
      cleanUpdates["youtube_module_enabled"] = updates.youtube_module_enabled ? "true" : "false";
    }

    if (updates.reviews_module_enabled !== undefined) {
      cleanUpdates["reviews_module_enabled"] = updates.reviews_module_enabled ? "true" : "false";
    }

    if (updates.default_enquiry_status !== undefined) {
      cleanUpdates["default_enquiry_status"] = updates.default_enquiry_status.trim().slice(0, 30);
    }

    if (updates.admission_counselling_note !== undefined) {
      cleanUpdates["admission_counselling_note"] = updates.admission_counselling_note.trim().slice(0, 300);
    }

    // Persist to Supabase
    try {
      const rows = Object.entries(cleanUpdates).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      await supabaseServer.from("cms_site_settings").upsert(rows);
    } catch (err) {
      console.warn("Supabase settings update notice:", err);
    }

    // Update memory
    for (const [key, val] of Object.entries(cleanUpdates)) {
      if (
        key === "announcement_enabled" ||
        key === "gallery_module_enabled" ||
        key === "youtube_module_enabled" ||
        key === "reviews_module_enabled"
      ) {
        (memorySettings as any)[key] = val === "true";
      } else {
        (memorySettings as any)[key] = val;
      }
    }

    return this.getAllSettings();
  },
};
