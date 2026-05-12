import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { PATHS } from "../../core/routing/paths";
import { useTranslation } from "react-i18next";

export default function UserDropdown({ onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  
  const { theme, toggleTheme } = useThemeStore(); 
  const { t, i18n } = useTranslation();

  const savedLang = localStorage.getItem("i18nextLng") || i18n.language || "en";
  const [lang, setLang] = useState(savedLang.startsWith("ta") ? "ta" : "en"); 

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    // 🚀 FIXED: Changed to bg-card/95 with a stronger border to prevent text overlap
    <div className="absolute right-0 top-14 w-60 rounded-2xl border border-border/20 bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden animate-fade-in origin-top-right z-[100] ring-1 ring-black/5 dark:ring-white/5">

      {/* User */}
      <div className="px-4 py-3.5 border-b border-border/10 bg-foreground/5">
        <p className="text-sm font-bold text-foreground tracking-wide">
          {user?.fullName || user?.username || "Guest User"}
        </p>
      </div>

      {/* Language Toggle */}
      <div className="px-4 py-3.5 border-b border-border/10">
        <label className="text-xs text-muted block mb-2.5 font-medium">
          {t("dropdown.language")}
        </label>
        
        <div className="flex bg-foreground/5 border border-border/10 rounded-xl p-1 shadow-inner">
          <button 
            onClick={() => changeLanguage("en")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-foreground'}`}
          >
            English
          </button>
          <button 
            onClick={() => changeLanguage("ta")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'ta' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-foreground'}`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="flex items-center justify-between w-full px-4 py-3.5 border-b border-border/10 text-sm font-bold transition-colors hover:bg-foreground/5 text-foreground"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
          {t("dropdown.themeToggle", "Dark Mode")}
        </div>
        
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3.5 text-left text-sm font-bold transition-colors hover:bg-red-500/15 text-red-500 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        {t("dropdown.signOut")}
      </button>

    </div>
  );
}



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { useThemeStore } from "../../store/useThemeStore";
// import { PATHS } from "../../core/routing/paths";
// import { useTranslation } from "react-i18next";

// export default function UserDropdown({ onClose }) {
//   const navigate = useNavigate();
//   const user = useAuthStore((s) => s.user);
//   const logout = useAuthStore((s) => s.logout);
  
//   // 🚀 Get Theme State
//   const { theme, toggleTheme } = useThemeStore(); 
  
//   const { t, i18n } = useTranslation();

//   const savedLang = localStorage.getItem("i18nextLng") || i18n.language || "en";
//   const [lang, setLang] = useState(savedLang.startsWith("ta") ? "ta" : "en"); 

//   const handleLogout = () => {
//     logout();
//     navigate(PATHS.LOGIN);
//   };

//   const changeLanguage = (lng) => {
//     setLang(lng);
//     i18n.changeLanguage(lng);
//     localStorage.setItem("i18nextLng", lng);
//   };

//   return (
//     // 🚀 Changed bg-black/90 to bg-card/90, border-white/10 to border-border/10
//     <div className="absolute right-0 top-14 w-60 rounded-2xl border border-border/10 bg-card/90 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-fade-in origin-top-right z-[100]">

//       {/* User */}
//       <div className="px-4 py-3.5 border-b border-border/10 bg-foreground/5">
//         <p className="text-sm font-bold text-foreground tracking-wide">
//           {user?.fullName || user?.username || "Guest User"}
//         </p>
//       </div>

//       {/* Language Toggle */}
//       <div className="px-4 py-3.5 border-b border-border/10">
//         <label className="text-xs text-muted block mb-2.5 font-medium">
//           {t("dropdown.language")}
//         </label>
        
//         <div className="flex bg-foreground/5 border border-border/10 rounded-xl p-1 shadow-inner">
//           <button 
//             onClick={() => changeLanguage("en")}
//             className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-foreground'}`}
//           >
//             English
//           </button>
//           <button 
//             onClick={() => changeLanguage("ta")}
//             className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'ta' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-foreground'}`}
//           >
//             தமிழ்
//           </button>
//         </div>
//       </div>

//       {/* 🚀 Theme Toggle Button */}
//       <button 
//         onClick={toggleTheme}
//         className="flex items-center justify-between w-full px-4 py-3.5 border-b border-border/10 text-sm font-bold transition-colors hover:bg-foreground/5 text-foreground"
//       >
//         <div className="flex items-center gap-2">
//           <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
//           {t("dropdown.themeToggle", "Dark Mode")}
//         </div>
        
//         {/* iOS-style switch */}
//         <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
//           <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
//         </div>
//       </button>

//       {/* Logout */}
//       <button
//         onClick={handleLogout}
//         className="w-full px-4 py-3.5 text-left text-sm font-bold transition-colors hover:bg-red-500/15 text-red-500 flex items-center gap-2"
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//           <polyline points="16 17 21 12 16 7"></polyline>
//           <line x1="21" y1="12" x2="9" y2="12"></line>
//         </svg>
//         {t("dropdown.signOut")}
//       </button>

//     </div>
//   );
// }

/////--------------------------------------------//////////////////////////////////
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { PATHS } from "../../core/routing/paths";
// import { useTranslation } from "react-i18next";

// export default function UserDropdown({ onClose }) {
//   const navigate = useNavigate();
//   const user = useAuthStore((s) => s.user);
//   const logout = useAuthStore((s) => s.logout);
//   const { t, i18n } = useTranslation();

//   // 🚀 1. FIX: Read the saved language from localStorage (defaults to 'en')
//   // We use .startsWith("ta") just in case i18next saved it as "ta-IN"
//   const savedLang = localStorage.getItem("i18nextLng") || i18n.language || "en";
//   const [lang, setLang] = useState(savedLang.startsWith("ta") ? "ta" : "en"); 

//   const handleLogout = () => {
//     logout();
//     navigate(PATHS.LOGIN);
//   };

//   const changeLanguage = (lng) => {
//     setLang(lng);
//     i18n.changeLanguage(lng);
//     // 🚀 2. FIX: Explicitly save the choice to localStorage so it survives page reloads
//     localStorage.setItem("i18nextLng", lng);
//   };

//   return (
//     <div className="absolute right-0 top-14 w-60 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-fade-in origin-top-right z-[100]">

//       {/* User */}
//       <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
//         <p className="text-sm font-bold text-white tracking-wide">
//           {user?.fullName || user?.username || "Guest User"}
//         </p>
//       </div>

//       {/* Language Toggle */}
//       <div className="px-4 py-3.5 border-b border-white/5">
//         <label className="text-xs text-muted/80 block mb-2.5 font-medium">
//           {t("dropdown.language")}
//         </label>
        
//         <div className="flex bg-black/50 border border-white/10 rounded-xl p-1 shadow-inner">
//           <button 
//             onClick={() => changeLanguage("en")}
//             className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-white'}`}
//           >
//             English
//           </button>
//           <button 
//             onClick={() => changeLanguage("ta")}
//             className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'ta' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-muted hover:text-white'}`}
//           >
//             தமிழ்
//           </button>
//         </div>
//       </div>

//       {/* Logout */}
//       <button
//         onClick={handleLogout}
//         className="w-full px-4 py-3.5 text-left text-sm font-bold transition-colors hover:bg-red-500/15 text-red-400 flex items-center gap-2"
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//           <polyline points="16 17 21 12 16 7"></polyline>
//           <line x1="21" y1="12" x2="9" y2="12"></line>
//         </svg>
//         {t("dropdown.signOut")}
//       </button>

//     </div>
//   );
// }