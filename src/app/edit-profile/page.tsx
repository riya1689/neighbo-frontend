"use client";

import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Lock,
  Shield,
  CheckCircle2,
  Clock,
  KeyRound,
  Gem,
  Info,
} from "lucide-react"; // FIXED: removed unused AlertCircle import

import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      const res = await fetch(`${apiUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUser(data);
      setDisplayName(data.displayName || data.name || "");
      setBio(data.bio || "");
      setProfileImage(data.profileImage || "");
    } catch (e) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      const res = await fetch(`${apiUrl}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          bio,
          profileImage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");

        setUser(data.user);

        // Update local storage user object
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            displayName: data.user.displayName,
            bio: data.user.bio,
            profileImage: data.user.profileImage,
          })
        );
      } else {
        toast.error(
          data.message || "Failed to update profile"
        );
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      const res = await fetch(`${apiUrl}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        fetchProfile();
      } else {
        toast.error(
          data.message || "Failed to update password"
        );
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const isNameLocked = () => {
    if (!user?.nameLastUpdatedAt) return false;

    const lastUpdate = new Date(user.nameLastUpdatedAt);

    const diff =
      new Date().getTime() - lastUpdate.getTime();

    return diff < 28 * 24 * 60 * 60 * 1000;
  };

  const getRemainingDays = () => {
    if (!user?.nameLastUpdatedAt) return 0;

    const lastUpdate = new Date(user.nameLastUpdatedAt);

    const diff =
      new Date().getTime() - lastUpdate.getTime();

    return Math.ceil(
      28 - diff / (24 * 60 * 60 * 1000)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto w-full">

            {/* Page Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <UserIcon size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Edit Profile
                </h1>

                <p className="text-sm text-slate-500 font-medium">
                  Manage your personal information and security.
                </p>
              </div>
            </div>

            <div className="space-y-8">

              {/* Profile Information Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">

                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-4 flex items-center gap-2">
                    <UserIcon
                      size={18}
                      className="text-primary"
                    />
                    Public Information
                  </h2>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      Username

                      <div className="group relative">
                        <Info
                          size={14}
                          className="text-slate-300 cursor-help"
                        />

                        <span className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10 font-medium normal-case">
                          Your username is permanent and cannot be changed.
                        </span>
                      </div>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={user?.username || ""}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-3.5 text-sm text-slate-500 font-medium cursor-not-allowed outline-none"
                      />

                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Display Name
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) =>
                          setDisplayName(e.target.value)
                        }
                        disabled={isNameLocked()}
                        placeholder="What should we call you?"
                        className={`w-full border rounded-2xl px-12 py-3.5 text-sm font-semibold transition-all outline-none ${
                          isNameLocked()
                            ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-white border-slate-200 focus:border-primary focus:ring-4 ring-primary/5 text-slate-800"
                        }`}
                      />

                      <UserIcon
                        size={18}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                          isNameLocked()
                            ? "text-slate-300"
                            : "text-primary/60"
                        }`}
                      />
                    </div>

                    {isNameLocked() && (
                      <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1 bg-amber-50 p-2 rounded-lg">
                        <Clock size={12} />
                        You can update your name in{" "}
                        {getRemainingDays()} days.
                      </p>
                    )}
                  </div>

                  {/* FIXED: Added missing Bio wrapper */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Bio
                    </label>

                    <textarea
                      value={bio}
                      onChange={(e) =>
                        setBio(e.target.value)
                      }
                      placeholder="Tell your neighbors about yourself..."
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 outline-none focus:border-primary focus:ring-4 ring-primary/5 transition-all resize-none"
                    />
                  </div>

                  {/* Profile Image URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      Avatar Image URL

                      <span className="text-[10px] lowercase font-medium text-slate-300 italic">
                        Optional • Suggest square image
                      </span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={profileImage}
                        onChange={(e) =>
                          setProfileImage(e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-primary focus:ring-4 ring-primary/5 transition-all"
                      />

                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center bg-slate-50">

                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <UserIcon
                            size={14}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium px-1">
                      Mention: Max image size 2MB recommended for better performance.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Password Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">

                <form
                  onSubmit={handleUpdatePassword}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">

                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <KeyRound
                        size={18}
                        className="text-primary"
                      />
                      Security
                    </h2>

                    {user?.passwordLastUpdatedAt && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} />
                        Updated{" "}
                        {formatDistanceToNow(
                          new Date(user.passwordLastUpdatedAt)
                        )}{" "}
                        ago
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Current Password
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 ring-primary/5 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        New Password
                      </label>

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 ring-primary/5 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      "Updating..."
                    ) : (
                      <>
                        <Lock size={18} />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">

                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-800">
                    Account Standing
                  </h2>

                  <p className="text-xs text-slate-400 font-medium">
                    Your current roles and privileges within Neighbo.
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                      user?.role === "ADMIN"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                        : "bg-primary/5 text-primary border-primary/10"
                    }`}
                  >
                    <Shield size={12} />
                    {user?.role}
                  </div>

                  {(user?.subscriptions?.length > 0 ||
                    user?.isPremium) && (
                    <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                      <Gem
                        size={12}
                        fill="currentColor"
                      />
                      ★ Premium
                    </div>
                  )}
                </div>
              </div>
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