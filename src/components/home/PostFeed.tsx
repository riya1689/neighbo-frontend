"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostCard from './PostCard';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  isPremium: boolean;
  price: number;
  createdAt: string;
  user: { displayName: string; name?: string; username?: string };
  category: { name: string };
  neighborhood: { name: string };
  shareCount?: number;
  sharedBy?: string | null;
  feedId?: string;
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Impression Tracking State
  const viewedPostsRef = useRef<Set<string>>(new Set());
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncImpressions = useCallback(async () => {
    if (viewedPostsRef.current.size === 0) return;

    const postIds = Array.from(viewedPostsRef.current);
    viewedPostsRef.current.clear();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${apiUrl}/posts/impressions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ postIds })
      });
      console.log(`Synced ${postIds.length} impressions`);
    } catch (e) {
      console.error("Failed to sync impressions", e);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    
    // Cleanup timeout on unmount
    return () => {
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
      syncImpressions(); // Final sync on unmount
    };
  }, [syncImpressions]);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    try {
      // Use /feed for personalized feed if token exists, otherwise fallback to /posts
      const endpoint = token ? `${apiUrl}/posts/feed` : `${apiUrl}/posts`;
      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
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

  // Intersection Observer Callback
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const postId = entry.target.getAttribute('data-post-id');
          if (postId) {
            viewedPostsRef.current.add(postId);
            
            // Debounced sync
            if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
            batchTimeoutRef.current = setTimeout(syncImpressions, 5000);
          }
        }
      });
    }, { threshold: 0.5 }); // 50% visibility

    if (node) {
      // Observe all children with data-post-id
      const postElements = document.querySelectorAll('[data-post-id]');
      postElements.forEach(el => observer.current?.observe(el));
    }
  }, [loading, syncImpressions]);

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
    <div className="space-y-6" ref={lastPostElementRef}>
      {posts.map(post => (
        <div key={post.feedId || post.id} data-post-id={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}