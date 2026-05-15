"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, UserCheck } from 'lucide-react';
import { API_URL } from '@/config/api';

interface FollowButtonProps {
  userId: string;
  targetUsername: string;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

/**
 * Reusable Follow Button Component
 * Handles follow/unfollow logic, state management, and permissions.
 */
export default function FollowButton({ 
  userId, 
  targetUsername, 
  onFollowChange,
  className = "" 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          
          // 1. Check if owner is viewing their own profile
          // We check both ID and username for robustness
          if (user.id === userId || user.username === targetUsername) {
            setLoading(false);
            return;
          }

          // 2. Fetch following list to see if already following
          const token = localStorage.getItem("token");
          if (token) {
            const res = await fetch(`${API_URL}/users/following`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
              const following = await res.json();
              if (Array.isArray(following)) {
                setIsFollowing(following.some((u: any) => u.id === userId));
              }
            }
          }
        } catch (e) {
          console.error("Error in FollowButton checkStatus:", e);
        }
      }
      setLoading(false);
    };

    if (userId) {
      checkStatus();
    }
  }, [userId, targetUsername]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to follow users");
        return;
      }

      const res = await fetch(`${API_URL}/users/${userId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        
        // Notify parent about the change
        if (onFollowChange) {
          onFollowChange(data.isFollowing);
        }
        
        toast.success(data.isFollowing ? "Followed successfully!" : "Unfollowed successfully!");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to perform action");
      }
    } catch (e) {
      console.error("Follow action error:", e);
      toast.error("Failed to perform action");
    }
  };

  if (loading) {
    return (
      <div className={`w-28 h-10 bg-slate-100 animate-pulse rounded-xl ${className}`} />
    );
  }

  // Owner of the account cannot follow themselves - hide button
  if (currentUser && (currentUser.id === userId || currentUser.username === targetUsername)) {
    return null;
  }

  return (
    <button 
      onClick={handleFollow}
      className={`px-6 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 group ${
        isFollowing 
          ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200" 
          : "bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
      } ${className}`}
    >
      {isFollowing ? (
        <>
          <UserCheck size={16} className="transition-transform group-hover:scale-110" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={16} className="transition-transform group-hover:scale-110" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
