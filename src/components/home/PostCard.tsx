"use client";

import React from 'react';
import { 
  MoreHorizontal, 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Tag, 
  Lock, 
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostProps {
  post: {
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
  };
}

export default function PostCard({ post }: PostProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {post.user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-800 text-sm">{post.user.name}</h4>
              <ShieldCheck size={14} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} className="text-slate-300" />
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{post.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Categories & Area Pills */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
            <Tag size={12} />
            {post.category.name}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100">
            <MapPin size={12} className="text-slate-400" />
            {post.neighborhood.name}
          </div>
          {post.isPremium && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">
              <Lock size={12} />
              Premium
            </div>
          )}
        </div>

        {/* Post Image */}
        {post.images && post.images.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 mt-2">
            <img 
              src={post.images[0]} 
              alt={post.title} 
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found")}
            />
          </div>
        )}
      </div>

      {/* Post Footer - Engagement */}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-xl px-1">
            <button className="p-2 text-slate-400 hover:text-primary transition"><ArrowBigUp size={22} /></button>
            <span className="text-sm font-bold text-slate-700 min-w-[20px] text-center">0</span>
            <button className="p-2 text-slate-400 hover:text-red-500 transition"><ArrowBigDown size={22} /></button>
          </div>
          
          <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition group">
            <div className="p-2 bg-transparent group-hover:bg-primary/5 rounded-xl transition">
              <MessageSquare size={20} />
            </div>
            <span className="text-sm font-bold">Comments</span>
          </button>
        </div>

        <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition group">
          <div className="p-2 bg-transparent group-hover:bg-primary/5 rounded-xl transition">
            <Share2 size={20} />
          </div>
          <span className="text-sm font-bold hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}
