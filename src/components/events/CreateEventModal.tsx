"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar,
  AlertCircle,
  PlusCircle,
  Image as ImageIcon,
  MapPin,
  Tag
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

export default function CreateEventModal({ 
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
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

    if (!title || !description || !date || !selectedNeighborhood || !selectedCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();

    try {
      const res = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          date,
          neighborhoodId: selectedNeighborhood,
          categoryId: selectedCategory,
          imageUrl: imageUrl || null
        })
      });

      if (res.ok) {
        toast.success("Event created! Waiting for admin approval.");
        setIsOpen(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDate("");
        setImageUrl("");
        setSelectedNeighborhood("");
        setSelectedCategory("");
        if (onSuccess) onSuccess();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create event");
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
        <span>Create Event</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 font-poppins tracking-tight">Propose New Event</h2>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">Subject to community guidelines</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Event Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Weekend Charity Drive" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20 font-medium transition-all" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Event Date</label>
                  <div className="relative">
                    <input 
                      type="datetime-local" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20 font-medium transition-all" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Event Description</label>
                <textarea 
                  placeholder="Tell us more about the event..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4} 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none resize-none focus:ring-2 ring-primary/20 font-medium transition-all" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Tag size={12} /> Category
                  </label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20 font-medium appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <MapPin size={12} /> Target Area
                  </label>
                  <select 
                    value={selectedNeighborhood} 
                    onChange={(e) => setSelectedNeighborhood(e.target.value)} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20 font-medium appearance-none"
                    required
                  >
                    <option value="">Select Neighborhood</option>
                    {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <ImageIcon size={12} /> Cover Image URL (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-primary/20 font-medium transition-all" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Proposal <Calendar size={18} /></>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100">
                <AlertCircle className="text-slate-400 shrink-0" size={16} />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Your event will be reviewed by administrators. Once approved, it will be listed in the "Upcoming Events" section of the community hub.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
