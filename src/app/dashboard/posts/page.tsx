"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit, 
  Search,
  MessageSquare,
  ArrowUpRight,
  X,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  ThumbsUp,
  BarChart3
} from "lucide-react";
import toast from "react-hot-toast";
import CreatePost from "@/components/home/CreatePost";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPremium: boolean;
  isDeleted: boolean;
  category: { name: string };
  _count: {
    comments: number;
    votes: number;
    shares: number;
  };
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/dashboard/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (e) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This will make it unavailable on the feed.")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Post deleted successfully (Soft Deleted)");
        fetchPosts(); // Refresh to see state
      } else {
        toast.error("Failed to delete post");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleEditOpen = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: editTitle
        })
      });

      if (res.ok) {
        toast.success("Title updated successfully!");
        setIsEditing(false);
        fetchPosts();
      } else {
        toast.error("Failed to update post");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Post Management</h1>
        <p className="text-slate-500 mt-1">Manage and track your content performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-28">
               <h3 className="font-bold text-slate-800 mb-6 text-center">Creator Hub</h3>
               <div className="relative">
                  <CreatePost />
               </div>
               <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Posts</span>
                     <span className="text-sm font-bold text-primary">{posts.filter(p => !p.isDeleted).length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 font-poppins text-lg">My All Posts</h3>
                  <div className="relative">
                     <input 
                       type="text" 
                       placeholder="Filter by title..." 
                       className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-64"
                     />
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
               </div>

               <div className="divide-y divide-slate-50">
                  {loading ? (
                    <div className="p-12 text-center text-slate-400 font-medium italic">Scanning neighborhood archive...</div>
                  ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">You haven't shared any posts yet.</div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                         <div className="flex justify-between items-start">
                            <div className="space-y-4 flex-1">
                               <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                                     {post.category.name}
                                  </span>
                                  {post.isPremium && (
                                     <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase">
                                        <Lock size={12} />
                                        <span>Premium</span>
                                     </div>
                                  )}
                               </div>
                               <div>
                                  <h4 className={`text-xl font-bold transition-colors ${post.isDeleted ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-primary'}`}>
                                     {post.title}
                                  </h4>
                                  {post.isDeleted && <p className="text-[10px] text-accent-red font-bold uppercase mt-1">Status: Soft Deleted</p>}
                               </div>
                               
                               <div className="flex items-center gap-6 pt-2">
                                  <div className="flex flex-col items-center gap-1">
                                     <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                                        <MessageSquare size={14} className="text-slate-300" />
                                        <span>{post._count.comments}</span>
                                     </div>
                                     <span className="text-[8px] text-slate-300 uppercase font-bold tracking-tighter">Comments</span>
                                  </div>

                                  <div className="flex flex-col items-center gap-1">
                                     <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                                        <ThumbsUp size={14} className="text-slate-300" />
                                        <span>{post._count.votes}</span>
                                     </div>
                                     <span className="text-[8px] text-slate-300 uppercase font-bold tracking-tighter">Votes</span>
                                  </div>

                                  <div className="flex flex-col items-center gap-1">
                                     <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                                        <Share2 size={14} className="text-slate-300" />
                                        <span>{post._count.shares}</span>
                                     </div>
                                     <span className="text-[8px] text-slate-300 uppercase font-bold tracking-tighter">Shares</span>
                                  </div>

                                  <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

                                  <div className="flex flex-col items-start gap-1">
                                     <span className="text-[8px] text-slate-300 uppercase font-bold tracking-tighter">Published On</span>
                                     <span className="text-[10px] text-slate-500 font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                               {!post.isDeleted && (
                                  <button 
                                    onClick={() => handleEditOpen(post)}
                                    className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                                    title="Edit Title"
                                  >
                                     <Edit size={20} />
                                  </button>
                               )}
                               <button 
                                 onClick={() => handleDelete(post.id)}
                                 className={`p-3 transition-all rounded-2xl ${post.isDeleted ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-accent-red hover:bg-accent-red/5'}`}
                                 disabled={post.isDeleted}
                                 title="Soft Delete"
                               >
                                  <Trash2 size={20} />
                               </button>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Edit Title Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-xl font-bold text-slate-800 font-poppins">Update Post Title</h2>
               <button 
                 onClick={() => setIsEditing(false)}
                 className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
               >
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">New Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter catchy title..." 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                    required
                  />
                  <p className="text-[10px] text-slate-400 px-1">Only the title can be updated here for quick adjustments.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {editLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Update Title <CheckCircle2 size={18} /></>
                    )}
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
