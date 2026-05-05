"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { Users, UserCheck, UserPlus, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ViewProfileButton from "@/components/common/ViewProfileButton";

interface Neighbor {
  id: string;
  name: string;
  username: string;
  neighborhood?: { name: string };
}

interface Stats {
  followers: number;
  following: number;
  totalNeighbos: number;
}

export default function NeighbosHub() {
  const [stats, setStats] = useState<Stats>({ followers: 0, following: 0, totalNeighbos: 0 });
  const [followers, setFollowers] = useState<Neighbor[]>([]);
  const [following, setFollowing] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const [statsRes, followersRes, followingRes] = await Promise.all([
        fetch(`${apiUrl}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/users/followers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/users/following`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const [statsData, followersData, followingData] = await Promise.all([
        statsRes.json(),
        followersRes.json(),
        followingRes.json()
      ]);

      setStats(statsData);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (e) {
      toast.error("Failed to load neighbor data");
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === "followers" ? followers : following;

  return (
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarLeft />
          </aside>

          <section className="col-span-1 lg:col-span-6 space-y-6">
            {/* Stats Header */}
            <div className="bg-white rounded-3xl p-8 border border-soft-gray shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-slate-800">Your Neighbos</h1>
                  <p className="text-sm text-slate-500">Managing your community connections.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-primary/20 transition-all cursor-pointer" onClick={() => setActiveTab("followers")}>
                  <p className="text-2xl font-bold text-slate-800">{stats.followers}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Followers</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-primary/20 transition-all cursor-pointer" onClick={() => setActiveTab("following")}>
                  <p className="text-2xl font-bold text-slate-800">{stats.following}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Following</p>
                </div>
                <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
                  <p className="text-2xl font-bold text-primary">{stats.totalNeighbos}</p>
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Total Neighbos</p>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-3xl border border-soft-gray shadow-sm overflow-hidden">
              <div className="flex border-b border-soft-gray">
                <button 
                  onClick={() => setActiveTab("followers")}
                  className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                    activeTab === "followers" ? "text-primary" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Followers
                  {activeTab === "followers" && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("following")}
                  className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                    activeTab === "following" ? "text-primary" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Following
                  {activeTab === "following" && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : currentList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserPlus size={24} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No {activeTab} found yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentList.map((neighbor) => (
                      <div key={neighbor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {neighbor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{neighbor.name}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <MapPin size={10} />
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
          </section>

          <aside className="hidden lg:block lg:col-span-3">
            <SidebarRight />
          </aside>

        </div>
      </main>
    </div>
  );
}
