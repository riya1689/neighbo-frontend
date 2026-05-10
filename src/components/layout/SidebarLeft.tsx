"use client";
import { motion } from "framer-motion";
import { 
  Home, 
  Gem, 
  Users, 
  UserPlus, 
  ChevronDown, 
  ChevronRight, 
  Compass, 
  TrendingUp, 
  UserCheck, 
  LayoutGrid, 
  UserCircle, 
  Settings, 
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLeft() {
  const pathname = usePathname();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Auto-open explore if on an explore route
  useEffect(() => {
    if (pathname.includes("/explore") || pathname.includes("/followers") || pathname.includes("/following") || pathname.includes("/suggested-users")) {
      setExploreOpen(true);
    }
  }, [pathname]);

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, href: "/" },
    { name: "Premium Plan", icon: <Gem size={20} />, href: "/premium" },
    { name: "Neighbo AI", icon: <Sparkles size={20} className="text-purple-500" />, href: "/ai", comingSoon: true },
    { 
      name: "Explore", 
      icon: <Compass size={20} />, 
      href: "/explore",
      hasSubmenu: true,
      isOpen: exploreOpen,
      toggle: () => setExploreOpen(!exploreOpen),
      submenu: [
        { name: "Trendings", icon: <TrendingUp size={16} />, href: "/explore" },
        { name: "Suggested User", icon: <UserPlus size={16} />, href: "/suggested-users" },
        { name: "Followers", icon: <UserCheck size={16} />, href: "/followers" },
        { name: "Following", icon: <Users size={16} />, href: "/following" },
      ]
    },
    { name: "Neighbos", icon: <Users size={20} />, href: "/neighbos" },
    { name: "Category", icon: <LayoutGrid size={20} />, href: "/categories" },
    { name: "View Profile", icon: <UserCircle size={20} />, href: user ? `/profile/${user.username || 'me'}` : "/login" },
    { name: "Edit Profile", icon: <Settings size={20} />, href: "/edit-profile" },
    { name: "My Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* --- MENU ITEMS SECTION --- */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-soft-gray overflow-hidden">
        <ul className="space-y-1 font-poppins font-medium">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.hasSubmenu ? (
                <div>
                  <button 
                    onClick={item.toggle}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition group ${pathname.includes(item.href) && !exploreOpen ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {item.isOpen && (
                    <ul className="mt-1 ml-4 border-l-2 border-slate-50 pl-2 space-y-1">
                      {item.submenu?.map((sub) => (
                        <Link href={sub.href} key={sub.name}>
                          <li className={`flex items-center gap-3 p-2.5 rounded-lg transition text-sm ${pathname === sub.href ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50 text-dark-text/60"}`}>
                            {sub.icon}
                            <span>{sub.name}</span>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link href={item.href}>
                  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition group ${pathname === item.href ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.comingSoon && (
                      <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                    )}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* --- INVITE NEIGHBO SECTION --- */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-soft-gray text-center space-y-4"
      >
        <div className="w-full h-32 bg-background rounded-xl flex flex-col items-center justify-center border border-dashed border-soft-gray gap-2">
           <div className="p-3 bg-primary/10 rounded-full text-primary">
             <UserPlus size={32} />
           </div>
           <span className="text-[10px] uppercase font-bold text-dark-text/30 tracking-widest">Community Growth</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-poppins font-bold text-lg text-dark-text leading-snug">Build a better neighborhood together.</h3>
          <p className="font-inter text-xs text-dark-text/60 px-2">
            Invite nearby friends to join and strengthen your community.
          </p>
        </div>

        <button className="w-full bg-primary text-white font-poppins font-bold py-3 rounded-xl shadow-md hover:bg-primary-dark hover:shadow-primary/20 transition-all">
          Invite Neighbo
        </button>
      </motion.div>
    </div>
  );
}