"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { 
  Zap, 
  Clock, 
  MapPin, 
  User,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

interface UpdatePost {
  id: string;
  title: string;
  content: string;
  updateType: string;
  images: string[];
  createdAt: string;
  user: { displayName: string };
  neighborhood: { name: string };
}

export default function NewUpdatesPage() {
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/updates`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUpdates(data);
      }
    } catch (e) {
      console.error("Failed to fetch updates", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarLeft />
          </aside>

          {/* MAIN CONTENT */}
          <section className="col-span-1 lg:col-span-6 space-y-6">
            
            <div className="flex items-center justify-between mb-2">
               <Link href="/" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                  <ChevronLeft size={16} /> Back to Home
               </Link>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-soft-gray shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 text-accent-red mb-4">
                     <Zap size={24} className="fill-accent-red animate-thunder" />
                     <h1 className="text-3xl font-black font-poppins tracking-tight">New Updates</h1>
                  </div>
                  <p className="text-slate-500 font-medium max-w-md leading-relaxed">
                     Stay informed with the latest feature launches, community announcements, and official neighborhood alerts.
                  </p>
               </div>
            </div>

            <div className="space-y-6">
               {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 border border-soft-gray animate-pulse space-y-4">
                       <div className="h-4 bg-slate-100 rounded w-1/4" />
                       <div className="h-6 bg-slate-100 rounded w-3/4" />
                       <div className="h-20 bg-slate-100 rounded-2xl w-full" />
                    </div>
                  ))
               ) : updates.length === 0 ? (
                  <div className="bg-white rounded-[2rem] p-12 text-center border border-soft-gray">
                     <p className="text-slate-400 font-bold">No official updates found yet.</p>
                  </div>
               ) : (
                  updates.map((update) => (
                    <div key={update.id} className="bg-white rounded-[2rem] border border-soft-gray shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                       <div className="p-6 md:p-8 space-y-5">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                             <div className="flex items-center gap-2">
                                <span className="px-4 py-1.5 bg-accent-red/10 text-accent-red text-[10px] font-black rounded-full uppercase tracking-widest border border-accent-red/5">
                                   {update.updateType.replace(/_/g, ' ')}
                                </span>
                                <div className="h-4 w-[1px] bg-slate-100 mx-1"></div>
                                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                   <Clock size={12} />
                                   <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 text-slate-300">
                                <ShieldCheck size={18} className="text-primary/40" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Verified Official</span>
                             </div>
                          </div>

                          <div>
                             <h2 className="text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                {update.title}
                             </h2>
                             <p className="text-slate-600 mt-4 leading-relaxed whitespace-pre-wrap">
                                {update.content}
                             </p>
                          </div>

                          {update.images && update.images.length > 0 && (
                             <div className="rounded-2xl overflow-hidden border border-slate-100">
                                <img 
                                  src={update.images[0]} 
                                  alt={update.title} 
                                  className="w-full h-auto max-h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                                />
                             </div>
                          )}

                          <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                             <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                      <User size={14} />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-black tracking-tighter text-slate-300">Posted by</span>
                                      <span className="text-xs font-bold text-slate-600">{update.user.displayName}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                      <MapPin size={14} />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-black tracking-tighter text-slate-300">Affected Area</span>
                                      <span className="text-xs font-bold text-slate-600">{update.neighborhood.name}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarRight />
          </aside>

        </div>
      </main>
    </div>
  );
}
