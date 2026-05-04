"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { UserCheck, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";

interface Neighbor {
  id: string;
  name: string;
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

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/users/followers`, {
          headers: { Authorization: `Bearer ${token}` }
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
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarLeft />
          </aside>

          <section className="col-span-1 lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-soft-gray shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-poppins font-bold text-slate-800">Followers</h1>
                    <p className="text-sm text-slate-500">Neighbors who follow your updates.</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                   <span className="text-sm font-bold text-slate-800">{followers.length} Total</span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : followers.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-800">No followers yet</h3>
                  <p className="text-sm text-slate-500">Grow your neighborhood presence to connect with others.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {followers.map((neighbor) => (
                    <div key={neighbor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {neighbor.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{neighbor.name}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <MapPin size={12} />
                            <span>{neighbor.neighborhood?.name || "Neighbor"}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="hidden lg:block lg:col-span-3">
            <SidebarRight />
          </aside>

        </div>
      </main>
    </div>
  );
}
