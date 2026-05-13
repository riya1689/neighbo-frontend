"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit, 
  Search,
  X,
  CheckCircle2,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import CreateUpdate from "@/components/admin/CreateUpdate";
import Link from "next/link";

interface UpdatePost {
  id: string;
  title: string;
  content: string;
  updateType: string;
  createdAt: string;
  user: { displayName: string };
  neighborhood: { name: string };
}

export default function AdminUpdatesManagement() {
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<UpdatePost | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const fetchUpdates = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/updates`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUpdates(data);
      }
    } catch (e) {
      toast.error("Failed to fetch updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this official update?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/updates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Update deleted successfully");
        fetchUpdates();
      } else {
        toast.error("Failed to delete update");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleEditOpen = (update: UpdatePost) => {
    setEditingUpdate(update);
    setEditTitle(update.title);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate) return;

    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/updates/${editingUpdate.id}`, {
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
        toast.success("Update title changed!");
        setIsEditing(false);
        fetchUpdates();
      } else {
        toast.error("Failed to update");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-red mb-2">
            <Zap size={20} className="fill-accent-red animate-thunder" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Official Channel</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">New Updates post</h1>
          <p className="text-slate-500 mt-1">Manage official announcements and feature updates.</p>
        </div>
        <CreateUpdate onSuccess={fetchUpdates} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 font-poppins text-lg">All Official Updates</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter by title..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 ring-primary/20 outline-none w-full md:w-72 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-16 text-center text-slate-400 font-medium italic animate-pulse">Loading update history...</div>
              ) : updates.length === 0 ? (
                <div className="p-16 text-center text-slate-400 font-medium">No official updates published yet.</div>
              ) : (
                updates.map((update) => (
                  <div key={update.id} className="p-8 hover:bg-slate-50/50 transition-all group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-accent-red/10 text-accent-red text-[10px] font-black rounded-full uppercase tracking-wider">
                            {update.updateType.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                            <Clock size={12} />
                            <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {update.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">
                            {update.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                           <span>Admin: {update.user.displayName}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <span>Area: {update.neighborhood.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleEditOpen(update)}
                          className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                          title="Edit Title"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(update.id)}
                          className="p-3 text-slate-400 hover:text-accent-red hover:bg-accent-red/5 rounded-2xl transition-all"
                          title="Delete Update"
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

        <div className="space-y-6">
          <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20">
            <h4 className="font-bold text-lg mb-2">Live Preview</h4>
            <p className="text-white/70 text-xs leading-relaxed mb-6">These updates appear directly on the homepage right sidebar and the dedicated updates page.</p>
            <Link 
              href="/new-updates" 
              className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors group"
            >
              <span className="font-bold text-sm">View Public Page</span>
              <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Title Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-xl font-bold text-slate-800 font-poppins">Update Official Post Title</h2>
               <button 
                 onClick={() => setIsEditing(false)}
                 className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
               >
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">New Update Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 outline-none transition-all font-medium"
                    required
                  />
                  <p className="text-[10px] text-slate-400 px-1 italic">Only title is editable to ensure historical content integrity.</p>
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
