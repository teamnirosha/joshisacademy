import { supabase } from "@/integrations/supabase/client";

export interface EnquiryRecord {
  id: string;
  student_class: string; // 'IX' | 'X' | string
  board: string; // 'CBSE' | 'ICSE' | string
  parent_name: string;
  mobile_number: string;
  email?: string | null;
  preferred_contact: "Call" | "WhatsApp" | string;
  notes?: string | null;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "ENROLLED" | "CLOSED";
  source?: string;
  created_at: string;
  updated_at?: string;
}

const STORAGE_KEY = "joshis_academy_enquiries_v1";

const DEFAULT_SEEDS: EnquiryRecord[] = [
  {
    id: "lead-seed-01",
    student_class: "X",
    board: "CBSE",
    parent_name: "Sanjay Kulkarni",
    mobile_number: "9822014589",
    email: "sanjay.kulkarni@gmail.com",
    preferred_contact: "WhatsApp",
    notes: "Inquired about Class 10 Science batch timings for Kharadi campus.",
    status: "NEW",
    source: "Website Enquiry Popup",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
  },
  {
    id: "lead-seed-02",
    student_class: "IX",
    board: "ICSE",
    parent_name: "Anita Deshmukh",
    mobile_number: "9422589632",
    email: "anita.deshmukh@yahoo.com",
    preferred_contact: "Call",
    notes: "Wants counselling for ICSE Physics & Chemistry foundation.",
    status: "CONTACTED",
    source: "Website Enquiry Popup",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    id: "lead-seed-03",
    student_class: "X",
    board: "ICSE",
    parent_name: "Vikram Joshi",
    mobile_number: "9764512340",
    email: "vikram.j@outlook.com",
    preferred_contact: "WhatsApp",
    notes: "Interested in upcoming board crash course & test series.",
    status: "ENROLLED",
    source: "Website Enquiry Popup",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // yesterday
  },
];

export const EnquiriesService = {
  getLocalEnquiries(): EnquiryRecord[] {
    if (typeof window === "undefined") return DEFAULT_SEEDS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEEDS));
        return DEFAULT_SEEDS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SEEDS;
    }
  },

  saveLocalEnquiries(enquiries: EnquiryRecord[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  },

  async isSupabaseTableReady(): Promise<boolean> {
    try {
      const { error } = await supabase.from("enquiries").select("id").limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  async getAll(): Promise<{ data: EnquiryRecord[]; fromSupabase: boolean }> {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        // Sync to local cache as well
        if (data.length > 0) {
          this.saveLocalEnquiries(data as EnquiryRecord[]);
        }
        return { data: data as EnquiryRecord[], fromSupabase: true };
      }
    } catch (err) {
      console.warn("Supabase fetch notice:", err);
    }

    // Fallback to local storage
    return { data: this.getLocalEnquiries(), fromSupabase: false };
  },

  async create(payload: Omit<EnquiryRecord, "id" | "created_at" | "status"> & { notes?: string }): Promise<EnquiryRecord> {
    const newEnquiry: EnquiryRecord = {
      id: "lead-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
      student_class: payload.student_class,
      board: payload.board,
      parent_name: payload.parent_name,
      mobile_number: payload.mobile_number,
      email: payload.email || null,
      preferred_contact: payload.preferred_contact,
      notes: payload.notes || "",
      status: "NEW",
      source: payload.source || "Website Enquiry Popup",
      created_at: new Date().toISOString(),
    };

    // 1. Save to local storage first so lead is 100% saved immediately
    const current = this.getLocalEnquiries();
    this.saveLocalEnquiries([newEnquiry, ...current]);

    // 2. Try persisting to Supabase
    try {
      const { error } = await supabase.from("enquiries").insert({
        student_class: newEnquiry.student_class,
        board: newEnquiry.board,
        parent_name: newEnquiry.parent_name,
        mobile_number: newEnquiry.mobile_number,
        email: newEnquiry.email,
        preferred_contact: newEnquiry.preferred_contact,
        notes: newEnquiry.notes,
        status: newEnquiry.status,
        source: newEnquiry.source,
      });

      if (error) {
        console.warn("Supabase insert notice (stored in local backup):", error.message);
      }
    } catch (err) {
      console.warn("Supabase insert notice:", err);
    }

    return newEnquiry;
  },

  async updateStatus(id: string, status: EnquiryRecord["status"]): Promise<void> {
    // 1. Update local
    const current = this.getLocalEnquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item));
    this.saveLocalEnquiries(updated);

    // 2. Try Supabase update
    try {
      await supabase.from("enquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (e) {
      console.warn("Supabase update notice:", e);
    }
  },

  async delete(id: string): Promise<void> {
    // 1. Delete local
    const current = this.getLocalEnquiries();
    const filtered = current.filter((item) => item.id !== id);
    this.saveLocalEnquiries(filtered);

    // 2. Try Supabase delete
    try {
      await supabase.from("enquiries").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete notice:", e);
    }
  },
};
