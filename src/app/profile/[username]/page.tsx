"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Users, 
  FileText,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import PostCard from '@/components/home/PostCard';
import Navbar from '@/components/layout/Navbar';
import SidebarLeft from '@/components/layout/SidebarLeft';
import SidebarRight from '@/components/layout/SidebarRight';
import Link from 'next/link';

interface UserProfile {
  id: string;
  displayName: string;
  name?: string;
  username: string;
  bio: string | null;
  profileImage?: string;
  role: string;
  neighborhood: { name: string };
  createdAt: string;
  totalPosts: number;
  totalNeighbos: number;
  isPremium: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        // Fetch Profile
        const profileRes = await fetch(`${apiUrl}/users/profile/public/${username}`);
        if (!profileRes.ok) throw new Error("Profile not found");
        const profileData = await profileRes.json();
        setProfile(profileData);

        // Fetch Posts
        const postsRes = await fetch(`${apiUrl}/users/profile/public/${username}/posts`);
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">User not found</h1>
        <Link href="/" className="text-primary font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              {/* Banner */}
              <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/20 to-primary/5 relative">
                {/* Back Button for mobile */}
                <Link href="/" className="absolute top-4 left-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-slate-700 lg:hidden">
                  <ArrowLeft size={20} />
                </Link>
              </div>

              {/* Profile Info Overlay */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-md border border-slate-50">
                      <div className="w-full h-full rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-3xl sm:text-4xl font-black text-primary overflow-hidden">
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt={profile.displayName} className="w-full h-full object-cover" />
                        ) : (
                          (profile.displayName || profile.name || "?").charAt(0)
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons (Follow or Settings) */}
                  <div className="flex gap-2">
                    <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all">
                      Follow
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-black text-slate-900">{profile.displayName || profile.name}</h1>
                      {profile.isPremium && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase border border-amber-100">
                          <ShieldCheck size={10} /> Premium
                        </div>
                      )}
                    </div>
                    <p className="text-slate-400 font-medium text-sm">@{profile.username}</p>
                  </div>

                  {profile.bio && (
                    <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-y-2 gap-x-4 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                      <MapPin size={14} className="text-primary/60" />
                      {profile.neighborhood.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                      <Calendar size={14} className="text-primary/60" />
                      Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex gap-8 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900">{profile.totalNeighbos}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Neighbos</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900">{profile.totalPosts}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content Tabs (Simple List for now) */}
            <div className="space-y-6">
              <div className="flex items-center gap-6 border-b border-slate-100 mb-2">
                <button className="pb-4 text-sm font-bold text-primary border-b-2 border-primary">
                  Posts & Shares
                </button>
                <button className="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">
                  About
                </button>
              </div>

              {posts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                  <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="font-bold text-slate-800">No activity yet</h3>
                  <p className="text-sm text-slate-500">This user hasn't posted or shared anything.</p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.feedId || post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <SidebarRight />
          </div>
        </div>
      </main>
    </div>
  );
}