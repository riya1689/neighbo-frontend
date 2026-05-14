"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    unlockPrice?: number | null;
    isUnlocked?: boolean;
    createdAt: string;
    user: { displayName: string; username?: string; profileImage?: string };
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
  user: { displayName: string; profileImage?: string };
  replies?: Comment[];
}

export default function PostCard({ post: initialPost }: PostProps) {
  const [post, setPost] = useState(initialPost);
  const [netVotes, setNetVotes] = useState(post.netVotes || 0);
  const [userVote, setUserVote] = useState<string | null>(post.userVote || null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [unlocking, setUnlocking] = useState(false);

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const isOwner = currentUser?.id === (post as any).userId;
  const isLocked = post.isPremium && post.unlockPrice && !post.isUnlocked && !isOwner;
  const isDeleted = (post as any).isDeleted === true;

  const handleUnlock = async () => {
    if (isDeleted) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to unlock this post.');
      return;
    }
    setUnlocking(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'UNLOCK', postId: post.id }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to initiate payment.');
      }
    } catch (e) {
      toast.error('Something went wrong.');
    } finally {
      setUnlocking(false);
    }
  };

  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    if (isDeleted) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login to vote"); return; }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/votes/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        setNetVotes(data.netVotes);
        setUserVote(data.userVote);
      }
    } catch (e) { toast.error("Failed to vote"); }
  };

  const fetchComments = async () => {
    if (isDeleted) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/comments/${post.id}`);
      const data = await res.json();
      setComments(data);
    } catch (e) { console.error(e); }
  };

  const handleAddComment = async (parentId: string | null = null) => {
    if (isDeleted) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login to comment"); return; }
      if (!newComment.trim()) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/comments/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment, parentId })
      });
      if (res.ok) {
        setNewComment(""); setReplyTo(null); fetchComments();
        toast.success(parentId ? "Reply added!" : "Comment added!");
      }
    } catch (e) { toast.error("Failed to post comment"); }
  };

  const handleShare = async () => {
    if (isDeleted) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login to share"); return; }
      if (!window.confirm("Are you sure you want to share this post?")) return;
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/posts/${post.id}/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShareCount(data.shareCount);
        toast.success("Post shared successfully!");
      } else { toast.error("Failed to share post"); }
    } catch (e) { toast.error("Failed to share post"); }
  };

  useEffect(() => {
    if (showComments && !isDeleted) fetchComments();
  }, [showComments, isDeleted]);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${isDeleted ? 'opacity-80' : ''}`}>
      {post.sharedBy && (
        <div className="bg-slate-50 px-5 py-2 flex items-center gap-2 border-b border-slate-100 text-xs text-slate-500 font-medium">
          <Share2 size={14} className="text-primary" />
          <span className="font-bold text-slate-700">{post.sharedBy}</span> shared this post
        </div>
      )}

      {/* Post Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            href={`/profile/${post.user.username || 'me'}`}
            className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary hover:bg-primary/20 transition-colors overflow-hidden border border-slate-100 uppercase"
          >
            {post.user.profileImage ? (
              <img src={post.user.profileImage} alt={post.user.displayName} className="w-full h-full object-cover" />
            ) : (
              (post.user.displayName || post.user.username || "?").charAt(0)
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${post.user.username || 'me'}`} className="flex items-center gap-1.5 group/name overflow-hidden">
              <h4 className="font-bold text-slate-800 text-sm group-hover/name:text-primary transition-colors truncate">{post.user.displayName}</h4>
              <ShieldCheck size={14} className="text-primary flex-shrink-0" />
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} className="text-slate-300" />
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition" disabled={isDeleted}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-4 space-y-4">
        <div>
          {/* CHANGED: Title is always rendered outside and above the lock area */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{post.title}</h3>

          {isDeleted ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
              <p className="text-sm text-slate-400 font-bold italic italic-mono">
                "This post is now unavailable"
              </p>
            </div>
          ) : isLocked ? (
            /*
             * CHANGED: Entire lock UI is now a self-contained relative container.
             * - Title is rendered ABOVE this block (see h3 above), so lock box starts after title. ✅ Fix #1
             * - `overflow-hidden` on this wrapper ensures nothing escapes the description box bounds. ✅ Fix #3
             * - Explicit min-height keeps the box tall enough for the lock card to sit inside. ✅ Fix #2
             */
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ minHeight: '140px' }}
            >
              {/*
               * CHANGED: Blurred preview text — removed top/left/right padding and reduced opacity.
               * Only bottom gets a fade; top, left, right sides have no extra blur offset. ✅ Fix #4
               */}
              <div className="p-3">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap blur-[4px] select-none opacity-30">
                  {post.content.slice(0, 180)}
                  {post.content.length > 180 ? "..." : ""}
                </p>
              </div>

              {/*
               * CHANGED: Overlay is inset-0 so it never grows beyond the parent wrapper.
               * No negative insets — stays fully inside description box. ✅ Fix #2 & #3
               */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl" />

              {/* CHANGED: Lock card centered inside the description box only */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                  className="
                    bg-white/90
                    backdrop-blur-xl
                    border border-white/60
                    rounded-2xl
                    w-full
                    max-w-[240px]
                    p-4
                    text-center
                    shadow-xl
                    shadow-slate-200/40
                    transition-transform
                    hover:scale-[1.02]
                  "
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-amber-100">
                    <Lock size={18} className="text-amber-600" />
                  </div>

                  <p className="text-sm font-black text-slate-800 mb-3 leading-snug">
                    Premium Content
                  </p>

                  <button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="
                      w-full
                      py-2.5
                      bg-primary
                      text-white
                      rounded-xl
                      font-bold
                      hover:bg-primary/90
                      transition
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-sm
                      disabled:opacity-50
                      shadow-lg
                      shadow-primary/20
                    "
                  >
                    {unlocking ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>৳{post.unlockPrice} BDT — Unlock</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </div>

        {!isDeleted && (
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
                {post.unlockPrice ? `৳${post.unlockPrice} BDT` : 'Premium'}
              </div>
            )}
          </div>
        )}

        {!isDeleted && !isLocked && post.images && post.images.length > 0 && (
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
      <div className={`px-5 py-3 border-t border-slate-50 flex items-center justify-between ${isDeleted ? 'bg-slate-100/30 grayscale pointer-events-none' : 'bg-slate-50/30'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-slate-100 rounded-xl px-1 shadow-sm">
            <button
              onClick={() => handleVote("UPVOTE")}
              className={`p-2 transition-colors ${userVote === "UPVOTE" ? "text-primary scale-110" : "text-slate-400 hover:text-primary"}`}
              disabled={isDeleted}
            >
              <ArrowBigUp size={24} fill={userVote === "UPVOTE" ? "currentColor" : "none"} />
            </button>
            <span className={`text-sm font-bold min-w-[20px] text-center ${userVote === "UPVOTE" ? "text-primary" : userVote === "DOWNVOTE" ? "text-red-500" : "text-slate-700"}`}>
              {netVotes}
            </span>
            <button
              onClick={() => handleVote("DOWNVOTE")}
              className={`p-2 transition-colors ${userVote === "DOWNVOTE" ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500"}`}
              disabled={isDeleted}
            >
              <ArrowBigDown size={24} fill={userVote === "DOWNVOTE" ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition group ${showComments ? "text-primary" : "text-slate-400 hover:text-primary"}`}
            disabled={isDeleted}
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
          disabled={isDeleted}
        >
          <div className="p-2 bg-white border border-slate-100 group-hover:bg-primary/5 rounded-xl transition group-hover:border-primary/10">
            <Share2 size={20} />
          </div>
          <span className="text-sm font-bold">{shareCount > 0 ? shareCount : "Share"}</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && !isDeleted && (
        <div className="px-5 py-5 bg-slate-50/50 border-t border-slate-100">
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary text-xs uppercase overflow-hidden border border-slate-100">
              {localStorage.getItem("user") ? (
                (() => {
                  const u = JSON.parse(localStorage.getItem("user")!);
                  return u.profileImage ? (
                    <img src={u.profileImage} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    (u.displayName || u.name || "?").charAt(0)
                  );
                })()
              ) : "?"}
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

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-[10px] overflow-hidden border border-slate-100 uppercase">
                    {comment.user.profileImage ? (
                      <img src={comment.user.profileImage} alt={comment.user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      (comment.user.displayName || "?").charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block min-w-[150px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{comment.user.displayName}</span>
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

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-4 border-l-2 border-slate-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-400 text-[8px] overflow-hidden border border-slate-100 uppercase">
                          {reply.user.profileImage ? (
                            <img src={reply.user.profileImage} alt={reply.user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            (reply.user.displayName || "?").charAt(0)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block">
                            <div className="flex items-center justify-between mb-1 gap-4">
                              <span className="text-[11px] font-bold text-slate-800">{reply.user.displayName}</span>
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

// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import {
//   MoreHorizontal,
//   ArrowBigUp,
//   ArrowBigDown,
//   MessageSquare,
//   Share2,
//   ShieldCheck,
//   MapPin,
//   Tag,
//   Lock,
//   Clock,
//   Send,
//   Reply
// } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import toast from 'react-hot-toast';

// interface PostProps {
//   post: {
//     id: string;
//     title: string;
//     content: string;
//     images: string[];
//     isPremium: boolean;
//     price: number;
//     unlockPrice?: number | null;
//     isUnlocked?: boolean;
//     createdAt: string;
//     user: { displayName: string; username?: string };
//     category: { name: string };
//     neighborhood: { name: string };
//     netVotes?: number;
//     commentCount?: number;
//     userVote?: string | null;
//     shareCount?: number;
//     sharedBy?: string | null;
//   };
// }

// interface Comment {
//   id: string;
//   content: string;
//   createdAt: string;
//   user: { displayName: string };
//   replies?: Comment[];
// }

// export default function PostCard({ post: initialPost }: PostProps) {
//   const [post, setPost] = useState(initialPost);
//   const [netVotes, setNetVotes] = useState(post.netVotes || 0);
//   const [userVote, setUserVote] = useState<string | null>(post.userVote || null);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyTo, setReplyTo] = useState<string | null>(null);
//   const [shareCount, setShareCount] = useState(post.shareCount || 0);
//   const [unlocking, setUnlocking] = useState(false);

//   // Check if this premium post is locked for the current user
//   const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
//   const isOwner = currentUser?.id === (post as any).userId;
//   const isLocked = post.isPremium && post.unlockPrice && !post.isUnlocked && !isOwner;
//   const isDeleted = (post as any).isDeleted === true;

//   const handleUnlock = async () => {
//     if (isDeleted) return;
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please login to unlock this post.');
//       return;
//     }
//     setUnlocking(true);
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const res = await fetch(`${apiUrl}/payments/initiate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ type: 'UNLOCK', postId: post.id }),
//       });
//       const data = await res.json();
//       if (res.ok && data.url) {
//         window.location.href = data.url;
//       } else {
//         toast.error(data.message || 'Failed to initiate payment.');
//       }
//     } catch (e) {
//       toast.error('Something went wrong.');
//     } finally {
//       setUnlocking(false);
//     }
//   };

//   const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
//     if (isDeleted) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to vote");
//         return;
//       }

//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       const res = await fetch(`${apiUrl}/votes/${post.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ type })
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setNetVotes(data.netVotes);
//         setUserVote(data.userVote);
//       }
//     } catch (e) {
//       toast.error("Failed to vote");
//     }
//   };

//   const fetchComments = async () => {
//     if (isDeleted) return;
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       const res = await fetch(`${apiUrl}/comments/${post.id}`);
//       const data = await res.json();
//       setComments(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleAddComment = async (parentId: string | null = null) => {
//     if (isDeleted) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to comment");
//         return;
//       }

//       if (!newComment.trim()) return;

//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       const res = await fetch(`${apiUrl}/comments/${post.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ content: newComment, parentId })
//       });

//       if (res.ok) {
//         setNewComment("");
//         setReplyTo(null);
//         fetchComments();
//         toast.success(parentId ? "Reply added!" : "Comment added!");
//       }
//     } catch (e) {
//       toast.error("Failed to post comment");
//     }
//   };

//   const handleShare = async () => {
//     if (isDeleted) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to share");
//         return;
//       }

//       if (!window.confirm("Are you sure you want to share this post?")) {
//         return;
//       }

//       const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
//       const res = await fetch(`${apiUrl}/posts/${post.id}/share`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setShareCount(data.shareCount);
//         toast.success("Post shared successfully!");
//       } else {
//         toast.error("Failed to share post");
//       }
//     } catch (e) {
//       toast.error("Failed to share post");
//     }
//   };


//   useEffect(() => {
//     if (showComments && !isDeleted) {
//       fetchComments();
//     }
//   }, [showComments, isDeleted]);

//   return (
//     <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${isDeleted ? 'opacity-80' : ''}`}>
//       {post.sharedBy && (
//         <div className="bg-slate-50 px-5 py-2 flex items-center gap-2 border-b border-slate-100 text-xs text-slate-500 font-medium">
//           <Share2 size={14} className="text-primary" />
//           <span className="font-bold text-slate-700">{post.sharedBy}</span> shared this post
//         </div>
//       )}
//       {/* Post Header */}
//       <div className="p-5 flex items-center justify-between">
//         <div className="flex items-center gap-3 overflow-hidden">
//           <Link
//             href={`/profile/${post.user.username || 'me'}`}
//             className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary hover:bg-primary/20 transition-colors"
//           >
//             {post.user.displayName.charAt(0)}
//           </Link>
//           <div className="flex-1 min-w-0">
//             <Link href={`/profile/${post.user.username || 'me'}`} className="flex items-center gap-1.5 group/name overflow-hidden">
//               <h4 className="font-bold text-slate-800 text-sm group-hover/name:text-primary transition-colors truncate">{post.user.displayName}</h4>
//               <ShieldCheck size={14} className="text-primary flex-shrink-0" />
//             </Link>
//             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//               <Clock size={12} className="text-slate-300" />
//               {formatDistanceToNow(new Date(post.createdAt))} ago
//             </div>
//           </div>
//         </div>
//         <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition" disabled={isDeleted}>
//           <MoreHorizontal size={20} />
//         </button>
//       </div>

//       {/* Post Content */}
//       <div className="px-5 pb-4 space-y-4">
//         <div>
//           <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{post.title}</h3>
//           {/* ========================= CHANGED PREMIUM LOCK UI START ========================= */}
//           {isDeleted ? (
//             <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
//               <p className="text-sm text-slate-400 font-bold italic italic-mono">
//                 "This post is now unavailable"
//               </p>
//             </div>
//           ) : isLocked ? (
//             // CHANGED: Added smaller responsive container
//             <div className="relative group/lock overflow-hidden rounded-2xl">

//               {/* CHANGED: Reduced blur area from top/left/right and added responsive padding */}
//               <div className="px-2 sm:px-4 pt-2 sm:pt-3 pb-2">
//                 <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap blur-[5px] select-none opacity-40">
//                   {post.content.slice(0, 180)}
//                   {post.content.length > 180 ? "..." : ""}
//                   {"\n\n"}
//                   {post.content.slice(0, 80)}...
//                 </p>
//               </div>

//               {/* CHANGED: Smaller blur overlay so title remains visible */}
//               <div className="absolute top-2 sm:top-3 left-2 sm:left-4 right-2 sm:right-4 bottom-0 bg-white/5 backdrop-blur-[1.5px] rounded-2xl" />

//               {/* CHANGED: Reduced lock box size + responsive mobile view */}
//               <div className="absolute inset-0 flex items-center justify-center px-3 py-2 sm:p-4">
//                 <div
//                   className="
//           bg-white/85
//           backdrop-blur-xl
//           border border-white/60
//           rounded-2xl
//           w-full
//           max-w-[220px]
//           sm:max-w-[250px]
//           p-4
//           sm:p-5
//           text-center
//           shadow-xl
//           shadow-slate-200/40
//           transition-transform
//           group-hover/lock:scale-[1.02]
//         "
//                 >

//                   {/* CHANGED: Smaller icon container */}
//                   <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-amber-100">
//                     <Lock size={18} className="text-amber-600 sm:w-5 sm:h-5" />
//                   </div>

//                   {/* CHANGED: Smaller responsive text */}
//                   <p className="text-xs sm:text-sm font-black text-slate-800 mb-1 leading-snug">
//                     Premium Content
//                   </p>

//                   {/* <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mb-4 leading-relaxed">
//                     Pay once to unlock lifetime access
//                   </p> */}

//                   {/* CHANGED: Smaller responsive button */}
//                   <button
//                     onClick={handleUnlock}
//                     disabled={unlocking}
//                     className="
//             w-full
//             py-2.5
//             sm:py-3
//             bg-primary
//             text-white
//             rounded-xl
//             font-bold
//             hover:bg-primary/90
//             transition
//             flex
//             items-center
//             justify-center
//             gap-2
//             text-xs
//             sm:text-sm
//             disabled:opacity-50
//             shadow-lg
//             shadow-primary/20
//           "
//                   >
//                     {unlocking ? (
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     ) : (
//                       <>৳{post.unlockPrice} BDT — Unlock</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
//               {post.content}
//             </p>
//           )}
//           {/* ========================= CHANGED PREMIUM LOCK UI END ========================= */}
//         </div>

//         {!isDeleted && (
//           <div className="flex flex-wrap gap-2">
//             <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
//               <Tag size={12} />
//               {post.category.name}
//             </div>
//             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100">
//               <MapPin size={12} className="text-slate-400" />
//               {post.neighborhood.name}
//             </div>
//             {post.isPremium && (
//               <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">
//                 <Lock size={12} />
//                 {post.unlockPrice ? `৳${post.unlockPrice} BDT` : 'Premium'}
//               </div>
//             )}
//           </div>
//         )}

//         {!isDeleted && !isLocked && post.images && post.images.length > 0 && (
//           <div className="rounded-2xl overflow-hidden border border-slate-100 mt-2">
//             <img
//               src={post.images[0]}
//               alt={post.title}
//               className="w-full h-auto max-h-[500px] object-cover"
//               onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found")}
//             />
//           </div>
//         )}
//       </div>

//       {/* Post Footer - Engagement */}
//       <div className={`px-5 py-3 border-t border-slate-50 flex items-center justify-between ${isDeleted ? 'bg-slate-100/30 grayscale pointer-events-none' : 'bg-slate-50/30'}`}>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center bg-white border border-slate-100 rounded-xl px-1 shadow-sm">
//             <button
//               onClick={() => handleVote("UPVOTE")}
//               className={`p-2 transition-colors ${userVote === "UPVOTE" ? "text-primary scale-110" : "text-slate-400 hover:text-primary"}`}
//               disabled={isDeleted}
//             >
//               <ArrowBigUp size={24} fill={userVote === "UPVOTE" ? "currentColor" : "none"} />
//             </button>
//             <span className={`text-sm font-bold min-w-[20px] text-center ${userVote === "UPVOTE" ? "text-primary" : userVote === "DOWNVOTE" ? "text-red-500" : "text-slate-700"}`}>
//               {netVotes}
//             </span>
//             <button
//               onClick={() => handleVote("DOWNVOTE")}
//               className={`p-2 transition-colors ${userVote === "DOWNVOTE" ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500"}`}
//               disabled={isDeleted}
//             >
//               <ArrowBigDown size={24} fill={userVote === "DOWNVOTE" ? "currentColor" : "none"} />
//             </button>
//           </div>

//           <button
//             onClick={() => setShowComments(!showComments)}
//             className={`flex items-center gap-2 transition group ${showComments ? "text-primary" : "text-slate-400 hover:text-primary"}`}
//             disabled={isDeleted}
//           >
//             <div className={`p-2 rounded-xl transition ${showComments ? "bg-primary/10" : "bg-white border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10"}`}>
//               <MessageSquare size={20} />
//             </div>
//             <span className="text-sm font-bold">{post.commentCount || 0} Comments</span>
//           </button>
//         </div>

//         <button
//           onClick={handleShare}
//           className="flex items-center gap-2 text-slate-400 hover:text-primary transition group"
//           disabled={isDeleted}
//         >
//           <div className="p-2 bg-white border border-slate-100 group-hover:bg-primary/5 rounded-xl transition group-hover:border-primary/10">
//             <Share2 size={20} />
//           </div>
//           <span className="text-sm font-bold">{shareCount > 0 ? shareCount : "Share"}</span>
//         </button>
//       </div>

//       {/* Comment Section */}
//       {showComments && !isDeleted && (
//         <div className="px-5 py-5 bg-slate-50/50 border-t border-slate-100">
//           {/* Add Comment Input */}
//           <div className="flex gap-3 mb-6">
//             <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary text-xs uppercase">
//               {localStorage.getItem("user") ? (JSON.parse(localStorage.getItem("user")!).displayName || JSON.parse(localStorage.getItem("user")!).name || "?").charAt(0) : "?"}
//             </div>
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleAddComment(replyTo)}
//                 className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/20 transition-all pr-12"
//               />
//               <button
//                 onClick={() => handleAddComment(replyTo)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition"
//               >
//                 <Send size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Comments List */}
//           <div className="space-y-6">
//             {comments.map((comment) => (
//               <div key={comment.id} className="space-y-4">
//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-[10px]">
//                     {comment.user.displayName.charAt(0)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block min-w-[150px]">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-xs font-bold text-slate-800">{comment.user.displayName}</span>
//                         <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
//                       </div>
//                       <p className="text-sm text-slate-600">{comment.content}</p>
//                     </div>
//                     <div className="flex items-center gap-4 mt-2 px-1">
//                       <button
//                         onClick={() => { setReplyTo(comment.id); setNewComment(""); }}
//                         className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1 uppercase tracking-wider"
//                       >
//                         <Reply size={12} /> Reply
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Replies */}
//                 {comment.replies && comment.replies.length > 0 && (
//                   <div className="ml-11 space-y-4 border-l-2 border-slate-100 pl-4">
//                     {comment.replies.map((reply) => (
//                       <div key={reply.id} className="flex gap-3">
//                         <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-400 text-[8px]">
//                           {reply.user.displayName.charAt(0)}
//                         </div>
//                         <div className="flex-1">
//                           <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm inline-block">
//                             <div className="flex items-center justify-between mb-1 gap-4">
//                               <span className="text-[11px] font-bold text-slate-800">{reply.user.displayName}</span>
//                               <span className="text-[9px] text-slate-400">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
//                             </div>
//                             <p className="text-xs text-slate-600">{reply.content}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }