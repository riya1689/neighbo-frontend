"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Users, Search } from "lucide-react";
import toast from "react-hot-toast";
import ViewProfileButton from "@/components/common/ViewProfileButton";

interface Neighbor {
  id: string;
  displayName: string;
  username: string;
  neighborhood?: { name: string };
}

export default function NeighbosPage() {
  const [neighbos, setNeighbos] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighbos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
        const res = await fetch(`${apiUrl}/neighborhoods/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setNeighbos(data);
        }
      } catch (e) {
        toast.error("Failed to load neighbors");
      } finally {
        setLoading(false);
      }
    };
    fetchNeighbos();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Neighbors</h1>
          <p className="text-slate-500 mt-1">People living in your area.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 font-poppins">{neighbos.length} Neighbors Nearby</h3>
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search neighbors..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-50" />
              ))}
            </div>
          ) : neighbos.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/30 py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Users size={32} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-800">No neighbors found</h3>
              <p className="text-sm text-slate-500 mt-2">Join a neighborhood to see people nearby.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {neighbos.map((neighbor) => (
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
