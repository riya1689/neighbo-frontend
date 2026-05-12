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
  Eye,
  Users,
  UserPlus,
  MapPin
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import CreatePost from "@/components/home/CreatePost";

interface Stats {
  totalRevenue: number;
  totalPremiumPlanPurchases: number;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  totalNeighbos: number;
  totalPremiumContentPurchases: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalPremiumPlanPurchases: 0,
    totalPosts: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    totalNeighbos: 0,
    totalPremiumContentPurchases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
        const res = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        data.totalNeighbos = (data.totalFollowers || 0) + (data.totalFollowing || 0);
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
      bgLight: "bg-green-50",
      text: "text-green-600"
    },
    { 
      name: "Total Posts", 
      value: stats.totalPosts, 
      icon: <FileText size={24} />, 
      bgLight: "bg-purple-50",
      text: "text-purple-600"
    },
    { 
      name: "Total Followers", 
      value: stats.totalFollowers, 
      icon: <Users size={24} />, 
      bgLight: "bg-blue-50",
      text: "text-blue-600"
    },
    { 
      name: "Total Following", 
      value: stats.totalFollowing, 
      icon: <UserPlus size={24} />, 
      bgLight: "bg-indigo-50",
      text: "text-indigo-600"
    },
    { 
      name: "Total Neighbors", 
      value: stats.totalNeighbos, 
      icon: <MapPin size={24} />, 
      bgLight: "bg-emerald-50",
      text: "text-emerald-600"
    },
    { 
      name: "Premium Purchases", 
      value: stats.totalPremiumContentPurchases, 
      icon: <ShoppingBag size={24} />, 
      bgLight: "bg-amber-50",
      text: "text-amber-600"
    },
    { 
      name: "Premium Plans", 
      value: stats.totalPremiumPlanPurchases, 
      icon: <Zap size={24} />, 
      bgLight: "bg-rose-50",
      text: "text-rose-600"
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
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm hidden md:flex">
               <Eye size={18} />
               View Posts
            </button>
           </Link>
           <CreatePost asButton={true} buttonText="Create Post" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bgLight} rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`}></div>
            <div className={`p-3 rounded-2xl ${card.bgLight} ${card.text} w-fit mb-4 relative z-10`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">{card.name}</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Zap size={24} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-poppins tracking-tight">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
             {/* We use a hidden CreatePost or just a styled div that triggers it? 
                 The CreatePost component has its own UI. User said "add create post link ... dont change ui design". 
                 I'll make the card itself act as a trigger or contain the button. 
             */}
             <Link href="/dashboard/neighbos">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group h-full">
               <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={28} className="text-blue-500" />
                  </div>
                  <ArrowUpRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">My Neighbos</h4>
               <p className="text-sm text-slate-500 leading-relaxed">Connecting neighbos make more strong and happy.</p>
            </div>
          </Link>
          </div>

          <Link href="/dashboard/plans">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group h-full">
               <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <DollarSign size={28} className="text-blue-500" />
                  </div>
                  <ArrowUpRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">My Premium Plans</h4>
               <p className="text-sm text-slate-500 leading-relaxed">Manage your active subscriptions and view billing history.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
