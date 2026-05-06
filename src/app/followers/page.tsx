"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { UserCheck, MapPin, Users } from "lucide-react";
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

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarLeft />
          </aside>

          <section className="col-span-1 space-y-6 lg:col-span-6">
            <div className="rounded-3xl border border-soft-gray bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <UserCheck size={24} />
                  </div>

                  <div>
                    <h1 className="font-poppins text-2xl font-bold text-slate-800">
                      Followers
                    </h1>

                    <p className="text-sm text-slate-500">
                      Neighbors who follow your updates.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
                  <span className="text-sm font-bold text-slate-800">
                    {followers.length} Total
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-2xl bg-slate-50"
                    />
                  ))}
                </div>
              ) : followers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <Users size={32} className="text-slate-300" />
                  </div>

                  <h3 className="font-bold text-slate-800">
                    No followers yet
                  </h3>

                  <p className="text-sm text-slate-500">
                    Grow your neighborhood presence to connect with others.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {followers.map((neighbor) => (
                    <div
                      key={neighbor.id}
                      className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700">
                          {(neighbor.displayName || neighbor.name || "").charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 transition-colors group-hover:text-primary">
                            {neighbor.displayName || neighbor.name}
                          </h4>

                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={12} />

                            <span>
                              {neighbor.neighborhood?.name || "Neighbor"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ViewProfileButton username={neighbor.username} />
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

