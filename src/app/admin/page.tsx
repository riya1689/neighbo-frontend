"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  Map as MapIcon, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  History 
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalPremiumUsers: number;
  totalRevenue: number;
  totalPremiumPlanPurchases: number;
  totalCategories: number;
  totalNeighborhoods: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading metrics...</div>;

  const cards = [
    { 
      name: "TOTAL REVENUE", 
      value: `৳ ${(stats?.totalRevenue ?? 0).toLocaleString()}`, 
      icon: <DollarSign className="text-green-600" />, 
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    { 
      name: "PREMIUM PURCHASES", 
      value: stats?.totalPremiumPlanPurchases, 
      icon: <ShoppingBag className="text-blue-600" />, 
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    { 
      name: "TOTAL USERS", 
      value: stats?.totalUsers, 
      icon: <Users className="text-purple-600" />, 
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    { 
      name: "ACTIVE CATEGORIES", 
      value: stats?.totalCategories, 
      icon: <Layers className="text-primary" />, 
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-2xl ${card.bgColor}`}>
              {React.cloneElement(card.icon as React.ReactElement, { size: 24 })}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">{card.name}</p>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="text-primary" fill="currentColor" />
          <h3 className="text-xl font-bold text-slate-800 font-poppins">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/admin/users" className="group">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary-dark/30 hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} className="text-slate-400 group-hover:text-primary" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Manage Users</h4>
              <p className="text-sm text-slate-500 mb-4">Suspend or activate customer accounts and manage permissions.</p>
              <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Configure Users <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          <Link href="/admin/payments" className="group">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <History size={24} className="text-slate-400 group-hover:text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">View All Orders</h4>
              <p className="text-sm text-slate-500 mb-4">Monitor all transactions and subscription statuses globally.</p>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Review Payments <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="group">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-200 hover:bg-purple-50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Layers size={24} className="text-slate-400 group-hover:text-purple-500" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Edit Categories</h4>
              <p className="text-sm text-slate-500 mb-4">Add, remove or update content categories for the platform.</p>
              <div className="flex items-center gap-2 text-sm font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Modify Structure <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
