import { Zap, UserPlus, Calendar, MapPin } from "lucide-react";

export default function SidebarRight() {
  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      
      {/* --- NEW UPDATES SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-poppins font-bold text-dark-text flex items-center gap-2">
            <Zap size={18} className="text-accent-red fill-accent-red/10" /> New Updates
          </h3>
          <button className="text-xs text-primary font-bold hover:underline">See All</button>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 hover:bg-background border border-transparent hover:border-soft-gray rounded-xl transition cursor-pointer group">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-accent-red rounded-full" />
              <span className="text-[10px] font-bold text-dark-text/40 uppercase">Neighborhood Alert</span>
            </div>
            <p className="text-xs font-inter text-dark-text/80 group-hover:text-primary leading-relaxed">
              New community cleanup scheduled for next Sunday at Central Park...
            </p>
          </div>
        </div>
      </div>

      {/* --- SUGGESTED USERS SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-poppins font-bold text-dark-text">Suggested Users</h3>
          <button className="text-xs text-primary font-bold hover:underline">See All</button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-soft-gray border-2 border-white shadow-sm" />
              <div className="flex flex-col">
                <span className="text-sm font-poppins font-bold text-dark-text">Rahat Ahmed</span>
                <div className="flex items-center gap-1 text-[10px] text-dark-text/50">
                  <MapPin size={10} /> <span>Dhanmondi</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-lg transition-colors">
              <UserPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- UPCOMING EVENTS SECTION --- */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-soft-gray">
        <h3 className="font-poppins font-bold text-dark-text mb-5">Upcoming Events</h3>
        <div className="space-y-5">
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center justify-center bg-primary-hover min-w-[48px] h-14 rounded-xl border border-primary/10">
              <span className="text-[10px] font-bold text-primary uppercase">May</span>
              <span className="text-lg font-bold text-primary">24</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-poppins font-bold text-dark-text leading-tight">Community Picnic</h4>
              <div className="flex items-center gap-1 text-[11px] text-dark-text/50 mt-1">
                <MapPin size={10} /> <span>Central Park</span>
              </div>
              <button className="mt-2 flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all">
                Join Event <Calendar size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}