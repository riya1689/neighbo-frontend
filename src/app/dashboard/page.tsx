"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  Zap,
  PlusCircle,
  Eye
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Stats {
  totalRevenue: number;
  totalSales: number;
  totalPosts: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalSales: 0,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (e) {
        toast.error("Could not load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading metrics...</div>;

  const cards = [
    { 
      name: "Total Revenue", 
      value: `৳ ${stats.totalRevenue.toLocaleString()}`, 
      icon: <DollarSign size={24} />, 
      color: "bg-green-500",
      bgLight: "bg-green-50",
      text: "text-green-600"
    },
    { 
      name: "Premium Purchases", 
      value: stats.totalSales, 
      icon: <ShoppingBag size={24} />, 
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      text: "text-blue-600"
    },
    { 
      name: "Total Posts", 
      value: stats.totalPosts, 
      icon: <FileText size={24} />, 
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      text: "text-purple-600"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your content today.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/dashboard/posts">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
               <Eye size={18} />
               View Posts
            </button>
           </Link>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              <PlusCircle size={18} />
              Create New
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgLight} rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`}></div>
            <div className={`p-4 rounded-2xl ${card.bgLight} ${card.text} w-fit mb-6 relative z-10`}>
              {card.icon}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">{card.name}</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
               <div className={`flex items-center gap-1 text-[10px] font-bold ${card.text} bg-white px-2 py-1 rounded-full border border-slate-100 shadow-xs`}>
                  <TrendingUp size={12} />
                  <span>+12%</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Zap size={24} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-poppins tracking-tight">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer group">
             <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <FileText size={28} className="text-primary" />
                </div>
                <ArrowUpRight size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-2">Create Premium Content</h4>
             <p className="text-sm text-slate-500 leading-relaxed">Monetize your knowledge by sharing exclusive insights with your neighbors.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
             <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <DollarSign size={28} className="text-blue-500" />
                </div>
                <ArrowUpRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-2">Withdraw Earnings</h4>
             <p className="text-sm text-slate-500 leading-relaxed">Transfer your earned revenue to your preferred payment method securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
