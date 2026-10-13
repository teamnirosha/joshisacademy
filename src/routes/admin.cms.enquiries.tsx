import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiriesService, type EnquiryRecord } from "@/services/enquiries.service";

export const Route = createFileRoute("/admin/cms/enquiries")({
  component: CMSEnquiriesPage,
});

const SQL_SCRIPT = `-- Supabase SQL: Create enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_class text NOT NULL,
  board text NOT NULL,
  parent_name text NOT NULL,
  mobile_number text NOT NULL,
  email text,
  preferred_contact text NOT NULL DEFAULT 'Call',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'NEW',
  source text NOT NULL DEFAULT 'Website Enquiry Popup',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert enquiry" ON public.enquiries;
CREATE POLICY "Allow public insert enquiry" ON public.enquiries
  FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read enquiries" ON public.enquiries;
CREATE POLICY "Allow read enquiries" ON public.enquiries
  FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow update enquiries" ON public.enquiries;
CREATE POLICY "Allow update enquiries" ON public.enquiries
  FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete enquiries" ON public.enquiries;
CREATE POLICY "Allow delete enquiries" ON public.enquiries
  FOR DELETE TO anon, authenticated, service_role USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO anon, authenticated, service_role;`;

function CMSEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // New offline lead form state
  const [newLead, setNewLead] = useState({
    parent_name: "",
    mobile_number: "",
    email: "",
    student_class: "X",
    board: "CBSE",
    preferred_contact: "Call" as const,
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const isReady = await EnquiriesService.isSupabaseTableReady();
      setIsSupabaseReady(isReady);
      const res = await EnquiriesService.getAll();
      setEnquiries(res.data);
    } catch (err) {
      console.warn("Load enquiries notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: EnquiryRecord["status"]) => {
    await EnquiriesService.updateStatus(id, newStatus);
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the enquiry for "${name}"?`)) {
      await EnquiriesService.delete(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.parent_name || !newLead.mobile_number) return;

    await EnquiriesService.create({
      ...newLead,
      source: "Manual Admin Entry",
    });

    setShowAddModal(false);
    setNewLead({
      parent_name: "",
      mobile_number: "",
      email: "",
      student_class: "X",
      board: "CBSE",
      preferred_contact: "Call",
      notes: "",
    });
    loadData();
  };

  const handleExportCsv = () => {
    if (enquiries.length === 0) return;
    const headers = [
      "ID",
      "Date",
      "Parent Name",
      "Mobile Number",
      "Email",
      "Class",
      "Board",
      "Preferred Contact",
      "Status",
      "Source",
      "Notes",
    ];

    const rows = enquiries.map((e) => [
      e.id,
      new Date(e.created_at).toLocaleString("en-IN"),
      `"${e.parent_name.replace(/"/g, '""')}"`,
      `"${e.mobile_number}"`,
      `"${e.email || ""}"`,
      e.student_class,
      e.board,
      e.preferred_contact,
      e.status,
      `"${e.source || ""}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Joshis_Academy_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered enquiries
  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.parent_name.toLowerCase().includes(search.toLowerCase()) ||
        item.mobile_number.includes(search) ||
        (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesClass = classFilter === "ALL" || item.student_class === classFilter;

      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [enquiries, search, statusFilter, classFilter]);

  // Stat counts
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === "NEW").length;
    const contactedCount = enquiries.filter((e) => e.status === "CONTACTED" || e.status === "IN_PROGRESS").length;
    const enrolledCount = enquiries.filter((e) => e.status === "ENROLLED").length;
    return { total, newCount, contactedCount, enrolledCount };
  }, [enquiries]);

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet border border-violet/20">
              <Inbox className="size-3 text-violet" /> Admissions CRM
            </span>
            {isSupabaseReady === false && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                Local Fallback Active
              </span>
            )}
            {isSupabaseReady === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                Supabase Connected
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Admission Enquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage prospective Class 9 & 10 parents, counselling calls, and admission pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl border-border/80 text-xs font-bold uppercase tracking-wider h-9"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={enquiries.length === 0}
            className="rounded-xl border-border/80 text-xs font-bold uppercase tracking-wider h-9"
          >
            <Download className="size-3.5 mr-1.5 text-violet" /> Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-violet hover:bg-royal text-ivory text-xs font-bold uppercase tracking-wider h-9 shadow-xs"
          >
            <Plus className="size-3.5 mr-1" /> Add Offline Lead
          </Button>
        </div>
      </div>

      {/* ── Supabase Notice Banner if Table Not Yet Created in Supabase ──────── */}
      {isSupabaseReady === false && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-amber-950">
                Supabase `enquiries` table needs to be created
              </h2>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                All incoming website leads are currently saved safely in local storage and the n8n automation webhook.
                Ask Sir to run the 1-minute SQL script in the Supabase SQL Editor to enable shared database storage.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowSqlModal(true)}
            className="shrink-0 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl h-8.5"
          >
            <Copy className="size-3.5 mr-1.5" /> View & Copy SQL Script
          </Button>
        </div>
      )}

      {/* ── 4 Summary Stat Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Inquiries
            </span>
            <Inbox className="size-4 text-violet" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-ink font-display">
            {stats.total}
          </div>
          <p className="text-[10px] text-muted-foreground">All leads captured</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              New / Pending
            </span>
            <Clock className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-display">
            {stats.newCount}
          </div>
          <p className="text-[10px] text-amber-700 font-medium">Require counselling call</p>
        </div>

        <div className="rounded-2xl border border-violet/20 bg-violet/5 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet">
              Contacted
            </span>
            <UserCheck className="size-4 text-violet" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-violet font-display">
            {stats.contactedCount}
          </div>
          <p className="text-[10px] text-muted-foreground">In active discussion</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Enrolled
            </span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-display">
            {stats.enrolledCount}
          </div>
          <p className="text-[10px] text-emerald-700 font-medium">Confirmed admissions</p>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by parent name, mobile number, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/90 bg-ivory/50 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-ink outline-none focus:border-violet focus:bg-white transition-all placeholder:text-muted-foreground/60"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl border border-border/80 p-0.5 bg-ivory/60 text-xs">
              {(["ALL", "NEW", "CONTACTED", "ENROLLED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-violet text-ivory shadow-2xs"
                      : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {st === "ALL" ? "All" : st === "NEW" ? "New" : st === "CONTACTED" ? "In Discussion" : "Enrolled"}
                </button>
              ))}
            </div>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-xl border border-border/80 bg-white px-3 py-1.5 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="ALL">All Classes</option>
              <option value="IX">Class 9 (IX)</option>
              <option value="X">Class 10 (X)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Enquiries Table ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-border/70 text-muted-foreground text-[10px] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Parent & Student</th>
                <th className="py-3.5 px-4">Class & Board</th>
                <th className="py-3.5 px-4">Contact Detail</th>
                <th className="py-3.5 px-4">Preferred</th>
                <th className="py-3.5 px-4">Date Received</th>
                <th className="py-3.5 px-4">Lead Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Inbox className="size-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-sm text-ink">No enquiries found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {search ? "Try adjusting your search criteria" : "New leads will appear here automatically"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const whatsappMessage = encodeURIComponent(
                    `Hello ${item.parent_name}, greetings from Joshi's Academy, Kharadi! We received your enquiry for Class ${item.student_class} (${item.board}). When would be a convenient time to discuss your child's batch schedule and academic counselling?`
                  );
                  const cleanPhone = item.mobile_number.replace(/\D/g, "");

                  return (
                    <tr key={item.id} className="hover:bg-lavender/20 transition-colors">
                      {/* Parent & Student */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-ink text-sm">{item.parent_name}</div>
                        {item.notes && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 max-w-xs" title={item.notes}>
                            {item.notes}
                          </p>
                        )}
                        {item.source && (
                          <span className="inline-block text-[9px] text-muted-foreground/70 uppercase tracking-widest mt-0.5">
                            via {item.source}
                          </span>
                        )}
                      </td>

                      {/* Class & Board */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-violet/10 px-2 py-0.5 text-[11px] font-bold text-violet border border-violet/20">
                            <GraduationCap className="size-3" /> Class {item.student_class}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                            {item.board}
                          </span>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink font-mono text-xs tracking-wider">
                          +91 {item.mobile_number}
                        </div>
                        {item.email && (
                          <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                            {item.email}
                          </div>
                        )}
                      </td>

                      {/* Preferred Contact Mode */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.preferred_contact === "WhatsApp"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {item.preferred_contact === "WhatsApp" ? (
                            <MessageSquare className="size-2.5" />
                          ) : (
                            <Phone className="size-2.5" />
                          )}
                          {item.preferred_contact || "Call"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                        <div>{new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                        <div className="text-[10px] text-muted-foreground/70">
                          {new Date(item.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as EnquiryRecord["status"])
                          }
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border cursor-pointer outline-none ${
                            item.status === "NEW"
                              ? "bg-amber-50 border-amber-300 text-amber-900"
                              : item.status === "CONTACTED"
                              ? "bg-blue-50 border-blue-300 text-blue-900"
                              : item.status === "IN_PROGRESS"
                              ? "bg-violet/10 border-violet/30 text-violet"
                              : item.status === "ENROLLED"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-gray-100 border-gray-300 text-gray-700"
                          }`}
                        >
                          <option value="NEW">New Lead</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="ENROLLED">Enrolled 🎉</option>
                          <option value="CLOSED">Closed / Archive</option>
                        </select>
                      </td>

                      {/* Quick Actions (Call, WhatsApp, Delete) */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click WhatsApp Button */}
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="size-3.5" />
                          </a>

                          {/* 1-Click Phone Call */}
                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
                            title="Call Mobile"
                          >
                            <Phone className="size-3.5" />
                          </a>

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.parent_name)}
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Remove lead"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SQL Modal (Instructions for Sir) ─────────────────────────────────── */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center font-bold">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ink">Supabase SQL Table Script</h2>
                  <p className="text-xs text-muted-foreground">
                    1-Click creation of `enquiries` table in Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 text-muted-foreground hover:text-ink rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong className="text-ink">Step 1:</strong> Open your Supabase Dashboard:{" "}
                <a
                  href="https://supabase.com/dashboard/project/gxpnboomkqwtmjlgygce/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Supabase SQL Editor <ExternalLink className="size-3" />
                </a>
              </p>
              <p>
                <strong className="text-ink">Step 2:</strong> Paste the script below into the query editor and click <strong className="text-emerald-700">Run</strong>.
              </p>
            </div>

            <div className="relative flex-1 min-h-[220px] bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] overflow-auto">
              <pre className="whitespace-pre">{SQL_SCRIPT}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSqlModal(false)}
                className="rounded-xl"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleCopySql}
                className="rounded-xl bg-violet hover:bg-royal text-ivory font-bold uppercase tracking-wider text-xs"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="size-3.5 mr-1 text-emerald-300" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 mr-1" /> Copy SQL Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Offline Lead Modal ───────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <h2 className="text-base font-bold text-ink">Add Offline Walk-In Lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-muted-foreground hover:text-ink rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newLead.parent_name}
                  onChange={(e) => setNewLead({ ...newLead, parent_name: e.target.value })}
                  className="w-full rounded-xl border border-border/80 px-3.5 py-2.5 font-medium text-sm text-ink outline-none focus:border-violet"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                  10-Digit Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9823012345"
                  value={newLead.mobile_number}
                  onChange={(e) => setNewLead({ ...newLead, mobile_number: e.target.value })}
                  className="w-full rounded-xl border border-border/80 px-3.5 py-2.5 font-medium text-sm text-ink outline-none focus:border-violet"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                    Student Class
                  </label>
                  <select
                    value={newLead.student_class}
                    onChange={(e) => setNewLead({ ...newLead, student_class: e.target.value })}
                    className="w-full rounded-xl border border-border/80 px-3 py-2 font-medium text-xs text-ink outline-none focus:border-violet"
                  >
                    <option value="IX">Class 9 (IX)</option>
                    <option value="X">Class 10 (X)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                    Board
                  </label>
                  <select
                    value={newLead.board}
                    onChange={(e) => setNewLead({ ...newLead, board: e.target.value })}
                    className="w-full rounded-xl border border-border/80 px-3 py-2 font-medium text-xs text-ink outline-none focus:border-violet"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full rounded-xl border border-border/80 px-3.5 py-2 font-medium text-xs text-ink outline-none focus:border-violet"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1 uppercase tracking-wider text-[10px]">
                  Notes / Discussion Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquired about evening batch for Science & Maths..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full rounded-xl border border-border/80 px-3.5 py-2 font-medium text-xs text-ink outline-none focus:border-violet resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-violet hover:bg-royal text-ivory font-bold uppercase tracking-wider text-xs"
                >
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
