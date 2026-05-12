"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, MapPin, Users, Search } from "lucide-react";
import toast from "react-hot-toast";
import ViewProfileButton from "@/components/common/ViewProfileButton";

interface Neighbor {
  id: string;
  displayName: string;
  username: string;
  neighborhood?: { name: string };
}

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
        const res = await fetch(`${apiUrl}/users/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setFollowers(data);
        }
      } catch (e) {
        toast.error("Failed to load followers");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Followers</h1>
          <p className="text-slate-500 mt-1">Neighbors who follow your updates.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="pb-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="font-bold text-slate-800 font-poppins">{followers.length} Total Followers</h3>
           <div className="relative w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search followers..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-full sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           </div>
        </div>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-50" />
              ))}
            </div>
          ) : followers.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/30 py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Users size={32} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-800">No followers yet</h3>
              <p className="text-sm text-slate-500 mt-2">Grow your neighborhood presence to connect with others.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {followers.map((neighbor) => (
                <div
                  key={neighbor.id}
                  className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white font-bold text-primary text-xl shadow-sm">
                      {(neighbor.displayName || "").charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 transition-colors group-hover:text-primary">
                        {neighbor.displayName}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin size={14} className="text-slate-300" />
                        <span>{neighbor.neighborhood?.name || "Neighbor"}</span>
                      </div>
                    </div>
                  </div>
                  <ViewProfileButton username={neighbor.username} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
