"use client";

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SidebarLeft from '@/components/layout/SidebarLeft';
import SidebarRight from '@/components/layout/SidebarRight';
import PostCard from '@/components/home/PostCard';

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async (categoryId?: string) => {
    setPostsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const url = categoryId 
        ? `${apiUrl}/posts?categoryId=${categoryId}` 
        : `${apiUrl}/posts`;
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setPostsLoading(false);
      setLoading(false);
    }
  };

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoryId(id);
    fetchPosts(id || undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* --- LEFT SIDEBAR (3 cols) --- */}
          <aside className="hidden md:block md:col-span-3">
            <SidebarLeft />
          </aside>
 
          {/* --- MIDDLE MAIN SECTION (9 cols) --- */}
          <div className="col-span-1 md:col-span-9 space-y-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Explore Categories</h1>
                  <p className="text-sm text-slate-500 font-medium">Find exactly what you're looking for.</p>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button 
                  onClick={() => handleCategorySelect(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    selectedCategoryId === null 
                      ? "bg-primary text-white border-primary shadow-md" 
                      : "bg-white text-slate-500 border-slate-100 hover:border-primary/30"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${
                      selectedCategoryId === category.id 
                        ? "bg-primary text-white border-primary shadow-md" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-primary/30"
                    }`}
                  >
                    {category.name}
                    {selectedCategoryId === category.id && <CheckCircle2 size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {postsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                  <Sparkles size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="font-bold text-slate-800">No posts in this category</h3>
                  <p className="text-sm text-slate-500">Be the first one to post in this category!</p>
                </div>
              ) : (
                posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <SidebarRight />
          </div>
        </div>
      </main>
    </div>
  );
}
