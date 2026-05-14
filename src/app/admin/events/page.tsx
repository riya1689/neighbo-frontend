"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  MoreVertical,
  Filter,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
  user: { 
    displayName: string;
    username: string;
  };
  neighborhood: { name: string };
  category: { name: string };
  createdAt: string;
}

export default function AdminEventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (e) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/admin/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Event ${newStatus.toLowerCase()}!`);
        fetchAllEvents();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Event deleted");
        fetchAllEvents();
      }
    } catch (e) {
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter(e => filter === "ALL" || e.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldCheck size={20} className="fill-primary/10" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Compliance & Safety</span>
           </div>
           <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Event Moderation</h1>
           <p className="text-slate-500 mt-1">Approve or reject user-proposed neighborhood activities.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                 filter === f 
                   ? "bg-primary text-white shadow-lg shadow-primary/20" 
                   : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
               }`}
             >
               {f.charAt(0) + f.slice(1).toLowerCase()}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="font-bold text-slate-800 font-poppins text-lg flex items-center gap-2">
            <Filter size={18} className="text-slate-400" /> 
            Proposals List
            <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-500 text-[10px] rounded-full">{filteredEvents.length}</span>
          </h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by title or user..." 
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 ring-primary/20 outline-none w-full md:w-80 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Proposed By</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Event Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Logistics</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic animate-pulse">Scanning database for proposals...</td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">No events found matching the criteria.</td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                          {event.user.displayName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{event.user.displayName}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-tight">@{event.user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-xs space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-tighter mt-1">{event.category.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                             <Calendar size={14} className="text-primary" />
                             <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <MapPin size={12} />
                             <span>{event.neighborhood.name}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         event.status === "APPROVED" ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                         event.status === "REJECTED" ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                         "bg-amber-100 text-amber-600 border-amber-200"
                       }`}>
                         {event.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {event.status === "PENDING" && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(event.id, "APPROVED")}
                                className="p-2.5 text-accent-green hover:bg-accent-green/10 rounded-xl transition-all"
                                title="Approve"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(event.id, "REJECTED")}
                                className="p-2.5 text-accent-red hover:bg-accent-red/10 rounded-xl transition-all"
                                title="Reject"
                              >
                                <XCircle size={20} />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="p-2.5 text-slate-400 hover:text-accent-red hover:bg-accent-red/5 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
