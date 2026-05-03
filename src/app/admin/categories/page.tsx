"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Layers, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  _count: { posts: number };
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (e) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        toast.success("Category created");
        setNewName("");
        fetchCategories();
      }
    } catch (e) {
      toast.error("Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      }
    } catch (e) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-poppins">Category Management</h1>
        <p className="text-slate-500 text-sm">Add or remove post categories used across the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Section */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-slate-800">Create Category</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Services, Marketplace" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-primary" />
                <h3 className="font-bold text-slate-800">Active Categories ({categories.length})</h3>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 text-slate-400">No categories active</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Tag size={16} className="text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{cat.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{cat._count.posts} posts</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
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
