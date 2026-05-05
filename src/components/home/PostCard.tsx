"use client";

import React, { useState, useEffect } from 'react';
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
  Clock,
  Send,
  Reply
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

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
    netVotes?: number;
    commentCount?: number;
    userVote?: string | null;
    shareCount?: number;
    sharedBy?: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string };
  replies?: Comment[];
}

export default function PostCard({ post }: PostProps) {
  const [netVotes, setNetVotes] = useState(post.netVotes || 0);
  const [userVote, setUserVote] = useState<string | null>(post.userVote || null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);

  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to vote");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/votes/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      if (res.ok) {
        const data = await res.json();
        setNetVotes(data.netVotes);
        setUserVote(data.userVote);
      }
    } catch (e) {
      toast.error("Failed to vote");
    }
  };

  const fetchComments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/comments/${post.id}`);
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (parentId: string | null = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to comment");
        return;
      }

      if (!newComment.trim()) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/comments/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment, parentId })
      });

      if (res.ok) {
        setNewComment("");
        setReplyTo(null);
        fetchComments();
        toast.success(parentId ? "Reply added!" : "Comment added!");
      }
    } catch (e) {
      toast.error("Failed to post comment");
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to share");
        return;
      }

      if (!window.confirm("Are you sure you want to share this post?")) {
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/posts/${post.id}/share`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setShareCount(data.shareCount);
        toast.success("Post shared successfully!");
      } else {
        toast.error("Failed to share post");
      }
    } catch (e) {
      toast.error("Failed to share post");
    }
  };


  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      {post.sharedBy && (
        <div className="bg-slate-50 px-5 py-2 flex items-center gap-2 border-b border-slate-100 text-xs text-slate-500 font-medium">
          <Share2 size={14} className="text-primary" />
          <span className="font-bold text-slate-700">{post.sharedBy}</span> shared this post
        </div>
      )}
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
      <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-slate-100 rounded-xl px-1 shadow-sm">
            <button 
              onClick={() => handleVote("UPVOTE")}
              className={`p-2 transition-colors ${userVote === "UPVOTE" ? "text-primary scale-110" : "text-slate-400 hover:text-primary"}`}
            >
              <ArrowBigUp size={24} fill={userVote === "UPVOTE" ? "currentColor" : "none"} />
            </button>
            <span className={`text-sm font-bold min-w-[20px] text-center ${userVote === "UPVOTE" ? "text-primary" : userVote === "DOWNVOTE" ? "text-red-500" : "text-slate-700"}`}>
              {netVotes}
            </span>
            <button 
              onClick={() => handleVote("DOWNVOTE")}
              className={`p-2 transition-colors ${userVote === "DOWNVOTE" ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500"}`}
            >
              <ArrowBigDown size={24} fill={userVote === "DOWNVOTE" ? "currentColor" : "none"} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition group ${showComments ? "text-primary" : "text-slate-400 hover:text-primary"}`}
          >
            <div className={`p-2 rounded-xl transition ${showComments ? "bg-primary/10" : "bg-white border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10"}`}>
              <MessageSquare size={20} />
            </div>
            <span className="text-sm font-bold">{post.commentCount || 0} Comments</span>
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition group"
        >
          <div className="p-2 bg-white border border-slate-100 group-hover:bg-primary/5 rounded-xl transition group-hover:border-primary/10">
            <Share2 size={20} />
          </div>
          <span className="text-sm font-bold">{shareCount > 0 ? shareCount : "Share"}</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="px-5 py-5 bg-slate-50/50 border-t border-slate-100">
          {/* Add Comment Input */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary text-xs uppercase">
              {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).name.charAt(0) : "?"}
            </div>
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment(replyTo)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/20 transition-all pr-12"
              />
              <button 
                onClick={() => handleAddComment(replyTo)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block min-w-[150px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{comment.user.name}</span>
                        <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 px-1">
                       <button 
                        onClick={() => { setReplyTo(comment.id); setNewComment(""); }}
                        className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1 uppercase tracking-wider"
                       >
                         <Reply size={12} /> Reply
                       </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-4 border-l-2 border-slate-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-400 text-[8px]">
                          {reply.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block">
                            <div className="flex items-center justify-between mb-1 gap-4">
                              <span className="text-[11px] font-bold text-slate-800">{reply.user.name}</span>
                              <span className="text-[9px] text-slate-400">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
                            </div>
                            <p className="text-xs text-slate-600">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
