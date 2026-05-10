"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Trash2, 
  Edit, 
  PlusCircle, 
  Search,
  MessageSquare,
  ArrowUpRight,
  X,
  CheckCircle2,
  Lock,
  Globe,
  ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import CreatePost from "@/components/home/CreatePost";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPremium: boolean;
  unlockPrice: number | null;
  category: { name: string };
  neighborhood: { name: string };
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter(p => p.id !== id));
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
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent
        })
      });

      if (res.ok) {
        toast.success("Post updated successfully!");
        setIsEditing(false);
        fetchPosts(); // Refresh list
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Post Management</h1>
          <p className="text-slate-500 mt-1">Manage your contributions to the community.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">My Contributions</p>
               <div className="flex items-end gap-3">
                  <h2 className="text-5xl font-bold text-slate-800">{posts.length}</h2>
                  <span className="text-slate-400 font-bold mb-1.5 uppercase text-[10px]">Total Posts</span>
               </div>
               <div className="h-2 w-full bg-slate-50 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
               </div>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <CreatePost />
            </div>
         </div>

         <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 font-poppins">All Posts</h3>
                  <div className="relative">
                     <input 
                       type="text" 
                       placeholder="Search your posts..." 
                       className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-64"
                     />
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
               </div>

               <div className="divide-y divide-slate-50">
                  {loading ? (
                    <div className="p-12 text-center text-slate-400 font-medium">Loading your posts...</div>
                  ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">You haven't shared any posts yet.</div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                         <div className="flex justify-between items-start">
                            <div className="space-y-3 flex-1">
                               <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">{post.category.name}</span>
                                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                     {post.isPremium ? <Lock size={12} className="text-amber-500" /> : <Globe size={12} />}
                                     {post.isPremium ? "Premium" : "Public"}
                                  </div>
                               </div>
                               <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{post.title}</h4>
                               <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                               <div className="flex items-center gap-6 pt-2">
                                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                     <CheckCircle2 size={14} className="text-slate-300" />
                                     <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                     <MessageSquare size={14} className="text-slate-300" />
                                     <span>12 Comments</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => handleEditOpen(post)}
                                 className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                                 title="Edit Post"
                               >
                                  <Edit size={20} />
                               </button>
                               <button 
                                 onClick={() => handleDelete(post.id)}
                                 className="p-3 text-slate-400 hover:text-accent-red hover:bg-accent-red/5 rounded-2xl transition-all"
                                 title="Delete Post"
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

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-xl font-bold text-slate-800 font-poppins">Edit Post</h2>
               <button 
                 onClick={() => setIsEditing(false)}
                 className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
               >
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Post Title</label>
                  <input 
                    type="text" 
                    placeholder="Title" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Description</label>
                  <textarea 
                    placeholder="Content" 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
                  />
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
                      <>Save Changes <CheckCircle2 size={18} /></>
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
