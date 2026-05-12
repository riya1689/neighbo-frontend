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
  Upload,
  PlusCircle // Added this import
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

export default function CreatePost({ 
  asButton = false, 
  buttonText = "Create Post" 
}: { 
  asButton?: boolean; 
  buttonText?: string 
}) {
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
  const [unlockPrice, setUnlockPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

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
    if (!isLoggedIn) {
      toast.error("Please login to create a post");
      return;
    }

    if (!title || !content || !selectedCategory || !selectedNeighborhood) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isPremium && (!unlockPrice || Number(unlockPrice) <= 0)) {
      toast.error("Please set a valid unlock price (BDT) for premium content.");
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
          unlockPrice: isPremium ? Number(unlockPrice) : undefined,
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
        setUnlockPrice("");
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

  // Move Modal inside the main return flow or keep as a helper 
  // but ensure it's called correctly.
  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Create New Post</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase px-1">Post Title</label>
              <input type="text" placeholder="Catchy title..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase px-1">Description</label>
              <textarea placeholder="Share details..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={selectedNeighborhood} onChange={(e) => setSelectedNeighborhood(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <option value="">Select Area</option>
                {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase px-1">Image URL</label>
              <input type="text" placeholder="Paste image link..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{isPremium ? 'Premium Content' : 'Public Post'}</p>
                <p className="text-[10px] text-slate-500">Only paid users can view</p>
              </div>
              <button type="button" onClick={() => setIsPremium(!isPremium)} className={`relative h-6 w-11 rounded-full ${isPremium ? 'bg-primary' : 'bg-slate-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isPremium ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {isPremium && (
              <input type="number" placeholder="Price (BDT)" value={unlockPrice} onChange={(e) => setUnlockPrice(e.target.value)} className="w-full px-5 py-3 rounded-xl border border-amber-200" />
            )}

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition">Discard</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition disabled:opacity-50">
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
        <Lock className="text-primary" size={24} />
        <h3 className="font-bold text-slate-800">Login to Join</h3>
        <button onClick={() => window.location.href = '/login'} className="bg-primary text-white px-8 py-2 rounded-xl font-bold">Login Now</button>
      </div>
    );
  }

  return (
    <>
      {asButton ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition"
        >
          <PlusCircle size={18} />
          <span>{buttonText}</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
               <CheckCircle2 className="text-primary/40" size={20} />
            </div>
            <button onClick={() => setIsOpen(true)} className="flex-1 bg-slate-50 text-slate-500 text-left rounded-full px-6 py-3 border border-slate-100">
              What's happening in your neighborhood?
            </button>
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-6">
              <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-xs font-bold text-slate-500"><ImageIcon size={20} /> Photo</button>
              <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-xs font-bold text-slate-500"><Layers size={20} /> Category</button>
            </div>
            <button onClick={() => setIsOpen(true)} className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold">Create Post</button>
          </div>
        </div>
      )}
      {isOpen && renderModal()}
    </>
  );
}