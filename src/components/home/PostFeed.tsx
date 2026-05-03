"use client";

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  isPremium: boolean;
  price: number;
  createdAt: string;
  user: { name: string };
  category: { name: string };
  neighborhood: { name: string };
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    try {
      const res = await fetch(`${apiUrl}/posts`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-2 bg-slate-100 rounded w-1/6" />
              </div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-40 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <img src="https://cdn-icons-png.flaticon.com/512/5058/5058432.png" className="w-8 h-8 grayscale opacity-30" alt="empty" />
        </div>
        <h3 className="font-bold text-slate-800">No posts yet</h3>
        <p className="text-sm text-slate-500">Be the first one to share something with your neighbors!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
