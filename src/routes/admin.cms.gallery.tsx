import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sparkles,
  CheckCircle,
  X,
  Upload,
  Link as LinkIcon,
  FileUp,
  Check,
} from "lucide-react";
import { GalleryService, type GalleryItem } from "@/services/cms.server";

export const Route = createFileRoute("/admin/cms/gallery")({
  component: CMSGalleryPage,
});

const CATEGORIES = [
  "All",
  "Campus & Infrastructure",
  "Classrooms",
  "Science Labs",
  "Cultural Events",
  "Sports & Activities",
  "Wall of Fame",
];

function CMSGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Upload & Form state
  const [uploadSource, setUploadSource] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formCategory, setFormCategory] = useState("Campus & Infrastructure");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/gallery");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setItems(data.items);
          try {
            localStorage.setItem("joshis_cms_gallery_cache_v2", JSON.stringify(data.items));
          } catch (e) {}
          return;
        }
      }
      // Fallback to cached items
      const cached = localStorage.getItem("joshis_cms_gallery_cache_v2");
      if (cached) {
        setItems(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Notice loading gallery items:", e);
      try {
        const cached = localStorage.getItem("joshis_cms_gallery_cache_v2");
        if (cached) setItems(JSON.parse(cached));
      } catch (err) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load from cache immediately for instant UI
    try {
      const cached = localStorage.getItem("joshis_cms_gallery_cache_v2");
      if (cached) {
        setItems(JSON.parse(cached));
      }
    } catch (e) {}
    loadGallery();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormDescription("");
    setFormImageUrl("");
    setSelectedFile(null);
    setUploadSource("file");
    setFormCategory("Campus & Infrastructure");
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description || "");
    setFormImageUrl(item.image_url);
    setSelectedFile(null);
    setUploadSource(item.image_url.startsWith("data:") ? "file" : "url");
    setFormCategory(item.category || "Campus & Infrastructure");
    setFormIsPublished(item.is_published);
    setIsModalOpen(true);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setSelectedFile(file);
    setUploadingFile(true);
    try {
      // Compress / read file
      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const maxDim = 1600;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.85));
            } else {
              resolve(e.target?.result as string);
            }
          };
          img.onerror = () => resolve(e.target?.result as string);
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed reading image"));
        reader.readAsDataURL(file);
      });

      setFormImageUrl(uploadedUrl);
    } catch (err: any) {
      alert("Failed to process image file: " + err?.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert("Please enter a title for the image.");
      return;
    }

    if (!formImageUrl.trim()) {
      alert("Please upload a local image file or enter an image URL.");
      return;
    }

    setSaving(true);
    try {
      const payload = editingItem
        ? {
            action: "update",
            id: editingItem.id,
            title: formTitle,
            description: formDescription,
            imageUrl: formImageUrl,
            thumbnailUrl: formImageUrl,
            category: formCategory,
            isPublished: formIsPublished,
          }
        : {
            action: "create",
            title: formTitle,
            description: formDescription,
            imageUrl: formImageUrl,
            thumbnailUrl: formImageUrl,
            category: formCategory,
            isPublished: formIsPublished,
            displayOrder: items.length + 1,
          };

      const res = await fetch("/api/cms/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save operation failed");

      setStatusMessage(
        editingItem ? "Gallery item updated successfully!" : "New gallery item added to website!",
      );
      setIsModalOpen(false);
      await loadGallery();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert("Error saving item: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    const updatedStatus = !item.is_published;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_published: updatedStatus } : i)),
    );
    try {
      await fetch("/api/cms/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_publish",
          id: item.id,
          isPublished: updatedStatus,
        }),
      });
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch("/api/cms/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }
      setStatusMessage("Item deleted.");
      await loadGallery();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert("Error deleting item: " + err?.message);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index]!;
    newItems[index] = newItems[targetIdx]!;
    newItems[targetIdx] = temp;

    const updatedPayload = newItems.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setItems(updatedPayload);

    try {
      await fetch("/api/cms/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          items: updatedPayload.map((item) => ({ id: item.id, displayOrder: item.display_order })),
        }),
      });
    } catch (e) {}
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-4 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="size-4" />
          {statusMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet border border-violet/20">
              <ImageIcon className="size-3" /> Content Module
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">Gallery Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload images directly from your computer, manage categories, reorder, or toggle live
            website visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGallery}
            className="p-2.5 rounded-xl border border-border bg-ivory text-muted-foreground hover:text-ink hover:bg-lavender/50 transition-colors"
            title="Refresh gallery"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-violet text-ivory px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-violet-dark shadow-xs transition-all cursor-pointer"
          >
            <Plus className="size-4" /> Add Gallery Image
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center rounded-2xl border border-border/80 bg-white p-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search gallery by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-ivory pl-10 pr-4 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-violet text-ivory shadow-2xs"
                  : "bg-ivory text-muted-foreground hover:bg-lavender/50 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 rounded-full border-2 border-violet border-t-transparent animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white space-y-3">
          <ImageIcon className="size-10 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-ink text-sm">No gallery items found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or category filter."
              : "Click 'Add Gallery Image' to upload your first campus photo."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet text-ivory px-3.5 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="size-4" /> Add Image Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group rounded-2xl border bg-white overflow-hidden shadow-2xs transition-all duration-300 hover:shadow-md flex flex-col ${
                item.is_published ? "border-border/80" : "border-amber-300 bg-amber-50/20"
              }`}
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="rounded-full bg-ink/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ivory">
                    {item.category || "General"}
                  </span>
                  {!item.is_published && (
                    <span className="rounded-full bg-amber-500 text-ink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                      Draft / Hidden
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-xl bg-ink/80 backdrop-blur-md p-1">
                  <button
                    onClick={() => handleMoveOrder(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-ivory hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-ivory px-1">
                    #{item.display_order}
                  </span>
                  <button
                    onClick={() => handleMoveOrder(index, "down")}
                    disabled={index === items.length - 1}
                    className="p-1 text-ivory hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-ink text-sm leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      item.is_published
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {item.is_published ? (
                      <>
                        <Eye className="size-3.5" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-3.5" /> Unpublished
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-violet hover:bg-lavender/50 cursor-pointer transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal with Local File Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-border overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                  <ImageIcon className="size-4" />
                </div>
                <h2 className="font-bold text-ink text-base">
                  {editingItem ? "Edit Gallery Image" : "Add Gallery Image"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2.5 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
                />
              </div>

              {/* Upload Source Selector (File Upload vs External URL) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Photo Source *
                  </label>
                  <div className="flex items-center gap-1 rounded-xl bg-ivory p-1 border border-border/80">
                    <button
                      type="button"
                      onClick={() => setUploadSource("file")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                        uploadSource === "file"
                          ? "bg-violet text-ivory shadow-2xs font-bold"
                          : "text-muted-foreground hover:text-ink"
                      }`}
                    >
                      <Upload className="size-3" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadSource("url")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                        uploadSource === "url"
                          ? "bg-violet text-ivory shadow-2xs font-bold"
                          : "text-muted-foreground hover:text-ink"
                      }`}
                    >
                      <LinkIcon className="size-3" /> Image URL
                    </button>
                  </div>
                </div>

                {uploadSource === "file" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragOver
                          ? "border-violet bg-violet/10"
                          : formImageUrl
                            ? "border-emerald-400 bg-emerald-50/40"
                            : "border-border/80 bg-ivory hover:bg-lavender/30 hover:border-violet/40"
                      }`}
                    >
                      {uploadingFile ? (
                        <div className="py-4 flex flex-col items-center gap-2">
                          <div className="size-6 rounded-full border-2 border-violet border-t-transparent animate-spin" />
                          <span className="text-xs font-semibold text-violet">
                            Processing image file...
                          </span>
                        </div>
                      ) : formImageUrl ? (
                        <div className="w-full space-y-2">
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black max-h-48 mx-auto">
                            <img
                              src={formImageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                              <Check className="size-3.5" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 px-1">
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="size-3.5 text-emerald-600" />
                              {selectedFile ? selectedFile.name : "Image Uploaded Successfully"}
                            </span>
                            <span className="text-violet font-bold underline hover:text-violet-dark">
                              Change Photo
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 flex flex-col items-center gap-1.5">
                          <div className="size-10 rounded-2xl bg-violet/10 text-violet flex items-center justify-center">
                            <FileUp className="size-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-ink block">
                              Click to choose photo or drag & drop here
                            </span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              Supports PNG, JPG, WEBP (Max 10MB)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2.5 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Provide a direct HTTPS URL for the high-res photo.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2.5 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief caption for this photo..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-ivory px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="size-4 rounded accent-violet"
                  />
                  <span>Publish immediately to website gallery</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingFile || !formImageUrl}
                  className="flex items-center gap-1.5 rounded-xl bg-violet text-ivory px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-violet-dark disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {saving ? "Saving..." : editingItem ? "Update Image" : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
