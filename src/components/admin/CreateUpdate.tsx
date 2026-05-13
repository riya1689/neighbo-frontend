"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface Neighborhood {
  id: string;
  name: string;
}

export default function CreateUpdate({ 
  onSuccess 
}: { 
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [updateType, setUpdateType] = useState("IDEA"); // Default
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const updateTypes = [
    { label: "Premium Plan", value: "PREMIUM_PLAN" },
    { label: "Feature", value: "FEATURE" },
    { label: "Bug Fix", value: "BUG_FIX" },
    { label: "Idea", value: "IDEA" },
    { label: "Announcement", value: "ANNOUNCEMENT" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen]);

  const fetchMetadata = async () => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
    try {
      const [catRes, neighRes] = await Promise.all([
        fetch(`${apiUrl}/categories`),
        fetch(`${apiUrl}/neighborhoods`)
      ]);
      const cats = await catRes.json();
      const neighs = await neighRes.json();
      setCategories(cats);
      setNeighborhoods(neighs);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!title || !content || !updateType || !selectedNeighborhood) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    // We need a categoryId for the Post model. 
    // We'll try to find an 'Official' or 'General' category or just use the first one available.
    const defaultCategoryId = categories.find(c => c.name.toLowerCase().includes('official'))?.id || categories[0]?.id;

    if (!defaultCategoryId) {
        toast.error("No valid category found for updates.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${apiUrl}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          updateType,
          neighborhoodId: selectedNeighborhood,
          categoryId: defaultCategoryId,
          images: imageUrl ? [imageUrl] : []
        })
      });

      if (res.ok) {
        toast.success("Official Update published!");
        setIsOpen(false);
        // Reset form
        setTitle("");
        setContent("");
        setImageUrl("");
        if (onSuccess) onSuccess();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
      >
        <PlusCircle size={20} />
        <span>Admin's Create Post</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-slate-800 font-poppins">Publish Official Update</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase px-1">Update Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. New Gulshan Premium Plan Launched!" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase px-1">Detailed Description</label>
                <textarea 
                  placeholder="Explain the update in detail..." 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  rows={4} 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none resize-none focus:ring-2 ring-primary/20" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">Update Category</label>
                  <select 
                    value={updateType} 
                    onChange={(e) => setUpdateType(e.target.value)} 
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                  >
                    {updateTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase px-1">Target Area</label>
                  <select 
                    value={selectedNeighborhood} 
                    onChange={(e) => setSelectedNeighborhood(e.target.value)} 
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                  >
                    <option value="">Select Neighborhood</option>
                    {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase px-1">Featured Image URL (Optional)</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition">Discard</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Publish Update <PlusCircle size={18} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
