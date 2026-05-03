"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Map as MapIcon, 
  CreditCard, 
  History, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Access denied. Admin only.");
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "ADMIN") {
        toast.error("Access denied. Admin only.");
        router.push("/");
        return;
      }
      setIsAdmin(true);
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Checking permissions...</div>;
  if (!isAdmin) return null;

  const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin" },
    { name: "User Management", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Category Management", icon: <Layers size={20} />, href: "/admin/categories" },
    { name: "Neighborhood Management", icon: <MapIcon size={20} />, href: "/admin/neighborhoods" },
    { name: "Premium Plan Management", icon: <CreditCard size={20} />, href: "/admin/plans" },
    { name: "Payment Overview", icon: <History size={20} />, href: "/admin/payments" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-primary-dark"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/login");
              toast.success("Logged out from Admin");
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut size={20} className="text-slate-500" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-poppins">Neighbo Platform</h2>
            <p className="text-slate-500 text-sm">Manage your community and platform health.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Hi, Admin</p>
              <p className="text-xs text-slate-500">System Administrator</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <ShieldCheck size={20} className="text-primary" />
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
