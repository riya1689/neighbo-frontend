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
  ShieldCheck,
  Menu,
  X,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Checking permissions...</div>;
  if (!isAdmin) return null;

  const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin" },
    { name: "User Management", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Category Management", icon: <Layers size={20} />, href: "/admin/categories" },
    { name: "Neighborhood Management", icon: <MapIcon size={20} />, href: "/admin/neighborhoods" },
    { name: "Premium Plan Management", icon: <CreditCard size={20} />, href: "/admin/plans" },
    { name: "Payment Overview", icon: <History size={20} />, href: "/admin/payments" },
    { name: "New Update Post", icon: <Zap size={20} className="text-accent-red" />, href: "/admin/updates" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
    toast.success("Logged out from Admin");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 fixed top-0 w-full z-30 shadow-xs">
        <div className="flex-1 flex items-center">
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="p-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-all"
           >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <Link href="/admin" className="text-2xl font-bold text-primary font-poppins tracking-tight">
            Neighbo
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hidden sm:flex">
            <LayoutDashboard size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Hi, Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex pt-16 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          w-64 bg-[#0F172A] text-white flex flex-col fixed h-[calc(100vh-64px)] z-20
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
            <div className="bg-primary p-2 rounded-lg">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="font-poppins font-bold text-xl tracking-tight text-white">Admin Panel</span>
          </div>

          <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
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

          <div className="p-4 border-t border-slate-700/50 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <LogOut size={20} className="text-slate-500" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
