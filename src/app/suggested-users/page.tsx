"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { UserPlus, MapPin, Check, Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface SuggestedUser {
  id: string;
  name: string;
  neighborhood?: { name: string };
}

export default function SuggestedUsersPage() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/users/suggested`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (e) {
      toast.error("Failed to load suggested users");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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

  const filteredUsers = users.filter(user => 
    (user.displayName || user.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-slate-800">Discover Neighbors</h1>
                  <p className="text-sm text-slate-500">Connect with people in your neighborhood and beyond.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search neighbors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64"
                  />
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Users size={32} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-800">No neighbors found</h3>
                  <p className="text-sm text-slate-500">Try searching for someone else or check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map((user, idx) => (
                    <motion.div 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/5">
                          {(user.displayName || user.name).charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{user.displayName || user.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin size={12} />
                            <span>{user.neighborhood?.name || "Neighbor"}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleFollow(user.id)}
                        className={`p-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          followingIds.has(user.id)
                            ? "bg-slate-100 text-slate-400"
                            : "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark"
                        }`}
                      >
                        {followingIds.has(user.id) ? (
                          <>
                            <Check size={14} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </motion.div>
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
