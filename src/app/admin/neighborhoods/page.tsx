"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Map as MapIcon, Navigation } from "lucide-react";
import toast from "react-hot-toast";

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  _count: { users: number };
}

export default function NeighborhoodManagement() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNeighborhoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/neighborhoods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setNeighborhoods(data);
      } else {
        setNeighborhoods([]);
        toast.error(data.message || "Failed to load neighborhoods");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch neighborhoods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/neighborhoods`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        toast.success("Neighborhood created");
        setName("");
        setDescription("");
        fetchNeighborhoods();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to create neighborhood");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to create neighborhood");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may affect users in this neighborhood.")) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/neighborhoods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Neighborhood deleted");
        fetchNeighborhoods();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete neighborhood");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to delete neighborhood");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-poppins">Neighborhood Management</h1>
        <p className="text-slate-500 text-sm">Define and manage the geographic districts available for users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-slate-800">Create District</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">District Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Dhanmondi, Banani" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  placeholder="Brief overview of the area..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                Add District
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <MapIcon size={20} className="text-primary" />
              <h3 className="font-bold text-slate-800">Active Districts ({neighborhoods.length})</h3>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400">Loading districts...</div>
            ) : neighborhoods.length === 0 ? (
              <div className="text-center py-20 text-slate-400">No districts active</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {neighborhoods.map((n) => (
                  <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-primary/30 transition-all relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Navigation size={14} className="text-primary" />
                        <p className="font-bold text-slate-800">{n.name}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">{n.description || "No description provided."}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{n._count.users} members</span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-primary">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
