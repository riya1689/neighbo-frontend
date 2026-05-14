"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import PostCard from "@/components/home/PostCard";
import { Search as SearchIcon, Filter, LayoutGrid, List } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/posts/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

          <aside className="hidden md:block md:col-span-3">
            <SidebarLeft />
          </aside>

          <section className="col-span-1 md:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-soft-gray shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-poppins font-bold text-slate-800 flex items-center gap-2">
                    <SearchIcon size={20} className="text-primary" />
                    Search Results for "{query}"
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Found {results.length} results matching your search.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <SearchIcon size={32} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-800">No results found</h3>
                  <p className="text-sm text-slate-500">Try adjusting your search terms to find what you're looking for.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="hidden md:block md:col-span-3">
            <SidebarRight />
          </aside>

        </div>
      </main>
    </div>
  );
}
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
