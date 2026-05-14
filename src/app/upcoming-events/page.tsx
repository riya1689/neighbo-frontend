"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { 
  Calendar, 
  MapPin, 
  User,
  ShieldCheck,
  ChevronLeft,
  Search,
  Clock,
  Tag
} from "lucide-react";
import Link from "next/link";

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  user: { displayName: string; username: string };
  neighborhood: { name: string };
  category: { name: string };
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/approved`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (e) {
      console.error("Failed to fetch events", e);
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
          <section className="col-span-1 lg:col-span-6 space-y-6 pb-20">
            
            <div className="flex items-center justify-between mb-2">
               <Link href="/" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                  <ChevronLeft size={16} /> Back to Hub
               </Link>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community Driven</span>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-soft-gray shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 text-primary mb-5">
                     <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Calendar size={32} />
                     </div>
                     <div>
                        <h1 className="text-3xl font-black font-poppins tracking-tight">Upcoming Events</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Discover neighborhood happenings</p>
                     </div>
                  </div>
                  <p className="text-slate-500 font-medium max-w-md leading-relaxed">
                     Connect with your neighbors through local meetups, workshops, and community activities.
                  </p>
               </div>
            </div>

            <div className="space-y-8">
               {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-soft-gray animate-pulse space-y-5">
                       <div className="flex gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                          <div className="flex-1 space-y-3 pt-2">
                             <div className="h-4 bg-slate-100 rounded w-1/4" />
                             <div className="h-6 bg-slate-100 rounded w-3/4" />
                          </div>
                       </div>
                       <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                    </div>
                  ))
               ) : events.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-20 text-center border border-soft-gray">
                     <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
                     <p className="text-slate-400 font-bold">No upcoming events found.</p>
                     <p className="text-slate-300 text-xs mt-2 italic">Be the first to propose one from your dashboard!</p>
                  </div>
               ) : (
                  events.map((event) => {
                    const eventDate = new Date(event.date);
                    return (
                      <div key={event.id} className="bg-white rounded-[2.5rem] border border-soft-gray shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                         <div className="p-8 md:p-10 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                               <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-center justify-center bg-primary text-white w-14 h-14 rounded-2xl shadow-lg shadow-primary/20">
                                     <span className="text-[10px] font-black uppercase leading-none">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                                     <span className="text-xl font-black leading-tight mt-0.5">{eventDate.getDate()}</span>
                                  </div>
                                  <div className="flex flex-col">
                                     <div className="flex items-center gap-2">
                                        <span className="px-3 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase tracking-widest">{event.category.name}</span>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                           <Clock size={12} />
                                           <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                                        <ShieldCheck size={14} className="text-primary/40" />
                                        <span>Verified Event</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div>
                               <h2 className="text-3xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                  {event.title}
                               </h2>
                               <p className="text-slate-600 mt-5 leading-relaxed text-lg font-medium whitespace-pre-wrap italic opacity-80">
                                  "{event.description}"
                               </p>
                            </div>

                            {event.imageUrl && (
                               <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                                  <img 
                                    src={event.imageUrl} 
                                    alt={event.title} 
                                    className="w-full h-auto max-h-[450px] object-cover group-hover:scale-[1.03] transition-transform duration-1000" 
                                  />
                               </div>
                            )}

                            <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                               <div className="flex items-center gap-8">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                        <User size={18} />
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black tracking-tighter text-slate-300">Organized by</span>
                                        <span className="text-sm font-bold text-slate-600">{event.user.displayName}</span>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                        <MapPin size={18} />
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black tracking-tighter text-slate-300">Location</span>
                                        <span className="text-sm font-bold text-slate-600">{event.neighborhood.name}</span>
                                     </div>
                                  </div>
                               </div>
                               
                               <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group/btn">
                                  Add to Calendar <Calendar size={20} className="group-hover/btn:scale-110 transition-transform" />
                               </button>
                            </div>
                         </div>
                      </div>
                    )
                  })
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
