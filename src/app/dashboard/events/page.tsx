"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit, 
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import toast from "react-hot-toast";
import CreateEventModal from "@/components/events/CreateEventModal";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  neighborhood: { name: string };
  category: { name: string };
  createdAt: string;
}

export default function UserEventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/my-events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (e) {
      toast.error("Failed to fetch your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Event deleted");
        fetchMyEvents();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleEditOpen = (event: Event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/events/${editingEvent.id}/title`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTitle })
      });

      if (res.ok) {
        toast.success("Event title updated!");
        setIsEditing(false);
        fetchMyEvents();
      } else {
        toast.error("Failed to update title");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-accent-green/10 text-accent-green border-accent-green/20";
      case "REJECTED": return "bg-accent-red/10 text-accent-red border-accent-red/20";
      default: return "bg-amber-100 text-amber-600 border-amber-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Events Hub</h1>
          <p className="text-slate-500 mt-1">Propose and manage your neighborhood activities.</p>
        </div>
        <CreateEventModal onSuccess={fetchMyEvents} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-slate-400 font-medium italic">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No Events Yet</h3>
            <p className="text-slate-400 mt-2 max-w-xs mx-auto">Start by proposing your first neighborhood event using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${getStatusColor(event.status)}`}>
                            {event.status}
                         </span>
                         <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                            <Clock size={12} />
                            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                        {event.title}
                      </h4>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleEditOpen(event)}
                         className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                         title="Edit Title"
                       >
                         <Edit size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(event.id)}
                         className="p-2.5 text-slate-400 hover:text-accent-red hover:bg-accent-red/5 rounded-xl transition-all"
                         title="Delete Event"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Calendar size={14} className="text-primary" />
                       <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <MapPin size={14} className="text-primary" />
                       <span>{event.neighborhood.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Title Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-8 border-b border-slate-50">
               <h2 className="text-2xl font-bold text-slate-800 font-poppins tracking-tight">Update Event Title</h2>
               <button 
                 onClick={() => setIsEditing(false)}
                 className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400"
               >
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">New Event Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 ring-primary/20 outline-none transition-all font-bold"
                    required
                  />
                  <div className="bg-amber-50 rounded-xl p-3 flex gap-2 items-center border border-amber-100">
                    <AlertCircle size={14} className="text-amber-500" />
                    <p className="text-[10px] text-amber-600 font-medium italic">Only title is editable to ensure event context remains consistent.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Update Title <CheckCircle2 size={18} /></>
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
