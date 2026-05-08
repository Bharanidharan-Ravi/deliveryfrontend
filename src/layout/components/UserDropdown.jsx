import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { PATHS } from "../../core/routing/paths";

export default function UserDropdown({ onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  
  const [lang, setLang] = useState("en"); 

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  return (
    // FIX: Added bg-black/90, backdrop-blur-2xl, heavy shadow, and z-[100]
    <div className="absolute right-0 top-14 w-60 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-fade-in origin-top-right z-[100]">

      {/* User */}
      <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
        <p className="text-sm font-bold text-white tracking-wide">
          {user?.fullName || user?.username || "Guest User"}
        </p>
        <p className="text-[11px] text-muted mt-0.5 uppercase tracking-wider font-semibold">
          {user?.role || "Driver"}
        </p>
      </div>

      {/* Language Toggle */}
      <div className="px-4 py-3.5 border-b border-white/5">
        <label className="text-xs text-muted/80 block mb-2.5 font-medium">
          Language Preference
        </label>
        
        <div className="flex bg-black/50 border border-white/10 rounded-xl p-1 shadow-inner">
          <button 
            onClick={() => setLang("en")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-white'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang("ta")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'ta' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-white'}`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3.5 text-left text-sm font-bold transition-colors hover:bg-red-500/15 text-red-400 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Sign Out
      </button>

    </div>
  );
}