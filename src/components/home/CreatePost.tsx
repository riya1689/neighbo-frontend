"use client";

import React, { useState, useEffect } from 'react';
import { 
  ImageIcon, 
  Smile, 
  MapPin, 
  Layers, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  Lock, 
  Globe,
  Upload
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

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen]);

  const fetchMetadata = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
    if (!isLoggedIn) {
      toast.error("Please login to create a post");
      return;
    }

    if (!title || !content || !selectedCategory || !selectedNeighborhood) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          categoryId: selectedCategory,
          neighborhoodId: selectedNeighborhood,
          isPremium,
          images: imageUrl ? [imageUrl] : []
        })
      });

      if (res.ok) {
        toast.success("Post created successfully!");
        setIsOpen(false);
        // Reset form
        setTitle("");
        setContent("");
        setImageUrl("");
        setIsPremium(false);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create post");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="text-primary" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Login to Join the Conversation</h3>
          <p className="text-sm text-slate-500">Only verified neighbors can share posts in the community.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-primary text-white px-8 py-2 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Simple Input Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4 transition-all hover:border-primary/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
             <CheckCircle2 className="text-primary/40" size={20} />
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="flex-1 bg-slate-50 text-slate-500 text-left rounded-full px-6 py-3 border border-slate-100 hover:bg-slate-100 transition focus:outline-none"
          >
            What's happening in your neighborhood?
          </button>
        </div>
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-6">
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition">
              <ImageIcon size={20} className="text-emerald-500" /> Photo
            </button>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition">
              <Layers size={20} className="text-primary" /> Category
            </button>
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition shadow-md shadow-primary/10"
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 font-poppins">Create New Post</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Post Title</label>
                <input 
                  type="text" 
                  placeholder="Give your post a catchy title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Description</label>
                <textarea 
                  placeholder="Share details with your neighbors..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
                />
              </div>

              {/* Category & Neighborhood */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium pr-10"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Neighborhood</label>
                  <div className="relative">
                    <select 
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full appearance-none px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium pr-10"
                    >
                      <option value="">Select Area</option>
                      {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Image URL (Optional)</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Paste image link here..." 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Paid/Free Toggle */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPremium ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    {isPremium ? <Lock size={18} className="text-amber-600" /> : <Globe size={18} className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{isPremium ? 'Premium Content' : 'Public Post'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{isPremium ? 'Only paid users can view' : 'Everyone can see this'}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsPremium(!isPremium)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPremium ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPremium ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Post <CheckCircle2 size={18} /></>
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