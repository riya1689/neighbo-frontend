"use client";

import { BellRing, LogOut, User as UserIcon, Search as SearchIcon, CheckCheck, Sparkles, X, Home, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  type: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        fetchUnreadCount();
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${apiUrl}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (e) {
      toast.error("Failed to update notifications");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-softGray shadow-sm h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        {/* Mobile: Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden p-2 text-darkText hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-gray-800"></div><div className="w-6 h-0.5 bg-gray-800"></div><div className="w-6 h-0.5 bg-gray-800"></div></div>}
        </button>

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="font-poppins font-bold text-2xl text-primary">Neighbo</span>
        </Link>

        {/* Middle: Search & Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder="Search by category, area, or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-softGray rounded-full px-10 py-2 focus:ring-2 ring-primary/20 outline-none transition-all"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-darkText/40" size={18} />
          </form>
          <div className="flex gap-4 font-poppins font-medium text-sm whitespace-nowrap">
            <Link href="/" className={`${pathname === "/" ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Home</Link>
            <Link href="/explore" className={`${pathname.includes("/explore") ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Explore</Link>
            <Link href="/categories" className={`${pathname.includes("/categories") ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Category</Link>
            <Link href="/ai" className={`${pathname === "/ai" ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"} flex items-center gap-1`}>
              <Sparkles size={14} className="text-purple-500" />
              <span>Neighbo AI</span>
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleToggleNotifications}
              className={`p-2 text-darkText hover:bg-primary-hover rounded-full transition-colors relative ${showNotifications ? 'bg-primary-hover' : ''}`}
            >
              <BellRing size={20} className={unreadCount > 0 ? "text-primary animate-pulse" : ""} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] text-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-softGray overflow-hidden z-50">
                <div className="p-4 bg-primary/5 border-b border-softGray flex justify-between items-center">
                  <h3 className="font-poppins font-bold text-sm text-darkText">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <CheckCheck size={12} /> Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <BellRing size={56} className="text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">All quiet in the neighborhood!</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <Link 
                        key={n.id} 
                        href={n.link || "#"}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                      >
                        <p className={`text-xs ${!n.isRead ? "text-darkText font-bold" : "text-slate-600"}`}>{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href={`/profile/${user.username || 'me'}`}
                className="hidden sm:flex items-center gap-2 px-2 py-1.5 bg-background rounded-full border border-softGray hover:border-primary/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center bg-primary/10 text-primary font-bold text-xs uppercase">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName || user.name || "?").charAt(0)
                  )}
                </div>
                <span className="text-sm font-semibold text-darkText group-hover:text-primary transition-colors pr-1">{user.displayName || user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-darkText hover:text-accent-red hover:bg-accent-red/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <button className="font-poppins text-sm px-4 py-2 text-primary hover:bg-primary-hover rounded-lg font-semibold cursor-pointer">Login</button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <button className="font-poppins text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md cursor-pointer">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 animate-in slide-in-from-left duration-300 md:hidden overflow-y-auto">
          <div className="p-6 space-y-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 focus:ring-2 ring-primary/20 outline-none transition-all"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </form>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Navigation</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                  <div className="p-2 bg-slate-50 rounded-lg"><Home size={18} /></div> Home
                </Link>
                <Link href="/premium" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg text-amber-500"><Sparkles size={18} /></div> Premium Plan
                </Link>
                <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg"><SearchIcon size={18} /></div> Explore
                </Link>
                <Link href="/neighbos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg"><UserIcon size={18} /></div> Neighbos
                </Link>
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg"><Sparkles size={18} /></div> Category
                </Link>
                <Link href="/new-updates" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg text-accent-red"><Zap size={18} /></div> New Update
                </Link>
                <Link href="/suggested-users" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg text-blue-500"><UserIcon size={18} /></div> Suggested User
                </Link>
                <Link href="/upcoming-events" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                   <div className="p-2 bg-slate-50 rounded-lg text-accent-green"><Calendar size={18} /></div> Upcoming Event
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Account</h3>
              <div className="grid grid-cols-1 gap-2">
                {user ? (
                  <>
                    <Link href={`/profile/${user.username || 'me'}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center bg-primary/10 text-primary font-bold text-xs uppercase">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            (user.displayName || user.name || "?").charAt(0)
                          )}
                        </div> View Profile
                    </Link>
                    <Link href="/edit-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
                       <div className="p-2 bg-slate-50 rounded-lg"><Sparkles size={18} /></div> Edit Profile
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-primary font-bold bg-primary/5">
                       <div className="p-2 bg-primary/10 rounded-lg text-primary"><Sparkles size={18} /></div> My Dashboard
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-slate-100 rounded-xl font-bold text-slate-700">Login</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// "use client";

// import { BellRing, LogOut, User as UserIcon, Search as SearchIcon, CheckCheck, Sparkles, X, Home } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import toast from "react-hot-toast";

// interface Notification {
//   id: string;
//   message: string;
//   type: string;
//   link: string;
//   isRead: boolean;
//   createdAt: string;
// }

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   const router = useRouter();
//   const pathname = usePathname();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         setUser(parsed);
//         fetchUnreadCount();
//       } catch (e) {
//         localStorage.removeItem("user");
//       }
//     }

//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowNotifications(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchUnreadCount = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
//       const res = await fetch(`${apiUrl}/notifications/unread-count`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setUnreadCount(data.count || 0);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
//       const res = await fetch(`${apiUrl}/notifications`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setNotifications(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleToggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     if (!showNotifications) {
//       fetchNotifications();
//     }
//   };

//   const handleMarkAllRead = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       await fetch(`${apiUrl}/notifications/read-all`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUnreadCount(0);
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
//       toast.success("All caught up!");
//     } catch (e) {
//       toast.error("Failed to update notifications");
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     toast.success("Logged out successfully");
//     router.push("/login");
//   };

//   return (
//     <nav className="fixed top-0 w-full z-50 bg-white border-b border-softGray shadow-sm h-16">
//       <div className="container mx-auto flex items-center justify-between h-full px-4">
//         {/* Mobile: Hamburger Button */}
//          <button 
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="block md:hidden p-2 text-darkText hover:bg-slate-100 rounded-lg transition-colors"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-darkText"></div><div className="w-6 h-0.5 bg-darkText"></div><div className="w-6 h-0.5 bg-darkText"></div></div>}
//         </button>

//         {/* Left: Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
//           <span className="font-poppins font-bold text-2xl text-primary">Neighbo</span>
//         </Link>

//         {/* Middle: Search & Links (Desktop) */}
//         <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-8">
//           <form onSubmit={handleSearch} className="relative w-full">
//             <input 
//               type="text" 
//               placeholder="Search by category, area, or name..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-background border border-softGray rounded-full px-10 py-2 focus:ring-2 ring-primary/20 outline-none transition-all"
//             />
//             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-darkText/40" size={18} />
//           </form>
//           <div className="flex gap-4 font-poppins font-medium text-sm whitespace-nowrap">
//             <Link href="/" className={`${pathname === "/" ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Home</Link>
//             <Link href="/explore" className={`${pathname.includes("/explore") ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Explore</Link>
//             <Link href="/categories" className={`${pathname.includes("/categories") ? "text-primary border-b-2 border-primary" : "hover:text-primary transition"}`}>Category</Link>
//             <Link href="/ai" className="flex items-center gap-1 hover:text-primary transition group relative">
//               <Sparkles size={14} className="text-purple-500 group-hover:animate-pulse" />
//               <span>Neighbo AI</span>
//               <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-1 py-0.5 rounded ml-1">Soon</span>
//             </Link>
//           </div>
//         </div>

//         {/* Right: Actions */}
//         <div className="flex items-center gap-4">
//           <div className="relative" ref={dropdownRef}>
//             <button 
//               onClick={handleToggleNotifications}
//               className={`p-2 text-darkText hover:bg-primary-hover rounded-full transition-colors relative ${showNotifications ? 'bg-primary-hover' : ''}`}
//             >
//               <BellRing size={20} className={unreadCount > 0 ? "text-primary animate-pulse" : ""} />
//               {unreadCount > 0 && (
//                 <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] text-center">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {/* Notification Dropdown */}
//             {showNotifications && (
//               <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-softGray overflow-hidden z-50">
//                 <div className="p-4 bg-primary/5 border-b border-softGray flex justify-between items-center">
//                   <h3 className="font-poppins font-bold text-sm text-darkText">Notifications</h3>
//                   {unreadCount > 0 && (
//                     <button 
//                       onClick={handleMarkAllRead}
//                       className="text-[10px] flex items-center gap-1 text-primary hover:underline font-bold"
//                     >
//                       <CheckCheck size={12} /> Mark all as read
//                     </button>
//                   )}
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <div className="p-8 text-center">
//                       <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                          <BellRing size={24} className="text-slate-300" />
//                       </div>
//                       <p className="text-xs text-slate-500 font-medium">All quiet in the neighborhood!</p>
//                     </div>
//                   ) : (
//                     notifications.map(n => (
//                       <Link 
//                         key={n.id} 
//                         href={n.link || "#"}
//                         onClick={() => setShowNotifications(false)}
//                         className={`block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
//                       >
//                         <p className={`text-xs ${!n.isRead ? "text-darkText font-bold" : "text-slate-600"}`}>{n.message}</p>
//                         <span className="text-[10px] text-slate-400 mt-1 block">
//                           {new Date(n.createdAt).toLocaleDateString()}
//                         </span>
//                       </Link>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {user ? (
//             <div className="flex items-center gap-3">
//               <Link 
//                 href={`/profile/${user.username || 'me'}`}
//                 className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-softGray hover:border-primary/30 transition-colors group"
//               >
//                 <UserIcon size={16} className="text-primary group-hover:scale-110 transition-transform" />
//                 <span className="text-sm font-semibold text-darkText group-hover:text-primary transition-colors">{user.displayName || user.name}</span>
//               </Link>
//               <button 
//                 onClick={handleLogout}
//                 className="p-2 text-darkText hover:text-accent-red hover:bg-accent-red/10 rounded-full transition-colors"
//                 title="Logout"
//               >
//                 <LogOut size={20} />
//               </button>
//             </div>
//           ) : (
//             <>
//               <Link href="/login" className="hidden sm:block">
//                 <button className="font-poppins text-sm px-4 py-2 text-primary hover:bg-primary-hover rounded-lg font-semibold cursor-pointer">Login</button>
//               </Link>
//               <Link href="/register" className="hidden sm:block">
//                 <button className="font-poppins text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md cursor-pointer">Register</button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 top-16 bg-white z-40 animate-in slide-in-from-left duration-300 md:hidden overflow-y-auto">
//           <div className="p-6 space-y-8">
//             <form onSubmit={handleSearch} className="relative w-full">
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 focus:ring-2 ring-primary/20 outline-none transition-all"
//               />
//               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             </form>

//             <div className="space-y-4">
//               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Navigation</h3>
//               <div className="grid grid-cols-1 gap-2">
//                 <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                   <div className="p-2 bg-slate-50 rounded-lg"><Home size={18} /></div> Home
//                 </Link>
//                 <Link href="/premium" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                    <div className="p-2 bg-slate-50 rounded-lg text-amber-500"><Sparkles size={18} /></div> Premium Plan
//                 </Link>
//                 <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                    <div className="p-2 bg-slate-50 rounded-lg"><SearchIcon size={18} /></div> Explore
//                 </Link>
//                 <Link href="/neighbos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                    <div className="p-2 bg-slate-50 rounded-lg"><UserIcon size={18} /></div> Neighbos
//                 </Link>
//                 <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                    <div className="p-2 bg-slate-50 rounded-lg"><Sparkles size={18} /></div> Category
//                 </Link>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Account</h3>
//               <div className="grid grid-cols-1 gap-2">
//                 {user ? (
//                   <>
//                     <Link href={`/profile/${user.username || 'me'}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                        <div className="p-2 bg-slate-50 rounded-lg"><UserIcon size={18} /></div> View Profile
//                     </Link>
//                     <Link href="/edit-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 font-bold">
//                        <div className="p-2 bg-slate-50 rounded-lg"><Sparkles size={18} /></div> Edit Profile
//                     </Link>
//                     <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-primary font-bold bg-primary/5">
//                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Sparkles size={18} /></div> My Dashboard
//                     </Link>
//                   </>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-4 p-2">
//                     <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-slate-100 rounded-xl font-bold text-slate-700">Login</Link>
//                     <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Register</Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }