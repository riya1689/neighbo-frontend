"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SidebarLeft from '@/components/layout/SidebarLeft';
import SidebarRight from '@/components/layout/SidebarRight';
import PostCard from '@/components/home/PostCard';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/posts/trending`);
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Trending Now</h1>
                  <p className="text-sm text-slate-500 font-medium">Most active posts in your community.</p>
                </div>
              </div>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition shadow-sm hover:shadow-md">
                <Filter size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                  <Sparkles size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="font-bold text-slate-800">No trends yet</h3>
                  <p className="text-sm text-slate-500">Check back later for trending activity.</p>
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
