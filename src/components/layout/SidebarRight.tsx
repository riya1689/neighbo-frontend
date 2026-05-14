"use client";

import React, { useEffect, useState } from "react";
import { Zap, UserPlus, Calendar, MapPin, Check, Users } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ViewProfileButton from "../common/ViewProfileButton";

interface SuggestedUser {
  id: string;
  displayName: string;
  username: string;
  profileImage?: string;
  neighborhood?: { name: string };
}

interface UpdatePost {
  id: string;
  title: string;
  updateType: string;
  createdAt: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  neighborhood: { name: string };
}

export default function SidebarRight() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSuggestions();
    fetchUpdates();
    fetchEvents();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();;
      const res = await fetch(`${apiUrl}/users/suggested`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestedUsers(data.slice(0, 3)); // Limit to 3 for sidebar
      }
    } catch (e) {
      console.error("Failed to fetch suggestions", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();;
      const res = await fetch(`${apiUrl}/updates?limit=2`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUpdates(data);
      }
    } catch (e) {
      console.error("Failed to fetch updates", e);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();;
      const res = await fetch(`${apiUrl}/events/approved?limit=2`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (e) {
      console.error("Failed to fetch events", e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to follow users");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/users/${userId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isFollowing) {
          setFollowingIds(prev => new Set(prev).add(userId));
          toast.success("Followed successfully!");
        } else {
          setFollowingIds(prev => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
          toast.success("Unfollowed successfully!");
        }
      }
    } catch (e) {
      toast.error("Failed to perform action");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      
      {/* --- NEW UPDATES SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-poppins font-bold text-dark-text flex items-center gap-2">
            <Zap size={18} className="text-accent-red fill-accent-red animate-thunder" /> New Updates
          </h3>
          <Link href="/new-updates" className="text-xs text-primary font-bold hover:underline">See All</Link>
        </div>
        
        <div className="space-y-4">
          {loadingUpdates ? (
            <div className="animate-pulse space-y-3">
              <div className="h-2 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
          ) : updates.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">No updates yet</p>
          ) : (
            updates.map((update) => (
              <Link 
                key={update.id} 
                href="/new-updates"
                className="block p-3 hover:bg-background border border-transparent hover:border-soft-gray rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 bg-accent-red rounded-full" />
                  <span className="text-[10px] font-bold text-dark-text/40 uppercase tracking-tighter">
                    {update.updateType.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs font-inter text-dark-text/80 group-hover:text-primary leading-relaxed line-clamp-2">
                  {update.title}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* --- SUGGESTED USERS SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-poppins font-bold text-dark-text">Suggested Users</h3>
          <Link href="/suggested-users" className="text-xs text-primary font-bold hover:underline">See All</Link>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestedUsers.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">No suggestions found</p>
          ) : (
            suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/5 overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      user.displayName.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-poppins font-bold text-dark-text">{user.displayName}</span>
                    <div className="flex items-center gap-1 text-[10px] text-dark-text/50">
                      <MapPin size={10} /> <span>{user.neighborhood?.name || "Neighbor"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ViewProfileButton 
                    username={user.username} 
                    variant="icon" 
                  />
                  <button 
                    onClick={() => handleFollow(user.id)}
                    className={`p-2 rounded-lg transition-all ${
                      followingIds.has(user.id) 
                        ? "bg-slate-100 text-slate-400" 
                        : "text-primary bg-primary/5 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {followingIds.has(user.id) ? <Check size={16} /> : <UserPlus size={16} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- UPCOMING EVENTS SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-poppins font-bold text-dark-text flex items-center gap-2">
            <Calendar size={18} className="text-primary fill-primary/10 animate-thunder" /> Upcoming Events
          </h3>
          <Link href="/upcoming-events" className="text-xs text-primary font-bold hover:underline">See All</Link>
        </div>
        
        <div className="space-y-5">
          {loadingEvents ? (
            <div className="animate-pulse flex gap-4">
              <div className="w-12 h-14 bg-slate-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ) : events.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">No upcoming events</p>
          ) : (
            events.map((event) => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleString('default', { month: 'short' });
              const day = eventDate.getDate();

              return (
                <div key={event.id} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center justify-center bg-primary-hover min-w-[48px] h-14 rounded-xl border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="text-[10px] font-bold uppercase">{month}</span>
                    <span className="text-lg font-bold">{day}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-poppins font-bold text-dark-text leading-tight group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-dark-text/50 mt-1">
                      <MapPin size={10} /> <span>{event.neighborhood.name}</span>
                    </div>
                    <Link href="/upcoming-events" className="mt-2 flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all">
                      Details <Calendar size={12} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}