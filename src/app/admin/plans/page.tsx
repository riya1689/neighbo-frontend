"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, CreditCard, Clock, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export default function PlanManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
      }
    } catch (e) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/plans`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Premium plan created");
        setFormData({ name: "", description: "", price: "", duration: "" });
        fetchPlans();
      }
    } catch (e) {
      toast.error("Failed to create plan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove the plan for future subscribers.")) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Plan deleted");
        fetchPlans();
      }
    } catch (e) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-poppins">Premium Plan Management</h1>
        <p className="text-slate-500 text-sm">Configure subscription plans, pricing, and validity periods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-slate-800">Create New Plan</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Plan Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Gold Member" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price (৳)</label>
                  <input 
                    type="number" 
                    placeholder="999" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                  <input 
                    type="number" 
                    placeholder="90" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  placeholder="What's included in this plan?" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-primary/20 focus:border-primary outline-none transition-all min-h-[80px]"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                Create Plan
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-primary" />
              <h3 className="font-bold text-slate-800">Current Plans ({plans.length})</h3>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="text-center py-20 text-slate-400">No premium plans defined</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="border-2 border-slate-100 rounded-2xl p-6 hover:border-purple-200 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2">
                      <button 
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                      <Check size={14} /> Premium Tier
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold text-slate-900">৳{plan.price}</span>
                      <span className="text-xs text-slate-500 font-medium">/ {plan.duration} days</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{plan.description}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock size={14} /> Valid for {plan.duration} days
                      </div>
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
