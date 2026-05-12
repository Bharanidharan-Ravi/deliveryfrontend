import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next"; 
import UserDropdown from "./UserDropdown";

export default function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation(); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/10 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          
          <div>
            {/* 🚀 FIXED: Added text-foreground to force correct theme color */}
            <h1 className="text-sm font-bold tracking-wide text-foreground">
              {t("header.title", "Delivery App")}
            </h1>
            <p className="text-[11px] text-muted font-medium">
              {t("header.subtitle", "Clarion Field Delivery")}
            </p>
          </div>
        </div>

        {/* User */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold shadow-sm hover:bg-primary/20 transition-colors"
          >
            {user?.username?.[0]?.toUpperCase()}
          </button>

          {open && (
            <UserDropdown onClose={() => setOpen(false)} />
          )}
        </div>

      </div>
    </header>
  );
}



// import { useState, useRef, useEffect } from "react";
// import { useAuthStore } from "../../store/useAuthStore";
// import { useTranslation } from "react-i18next"; // 🚀 Added Translation Hook
// import UserDropdown from "./UserDropdown";

// export default function AppHeader() {
//   const user = useAuthStore((s) => s.user);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { t } = useTranslation(); // 🚀 Initialize Translation

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-white/5">
//       <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">

//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           {/* 🚀 NEW PROFESSIONAL ICON: Modern 3D Package/Box for FMCG goods */}
//           <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
//               <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
//               <line x1="12" y1="22.08" x2="12" y2="12"></line>
//             </svg>
//           </div>
          
//           <div>
//             <h1 className="text-sm font-bold tracking-wide">
//               {t("header.title", "Delivery App")}
//             </h1>
//             <p className="text-[11px] text-muted font-medium">
//               {t("header.subtitle", "Clarion Field Delivery")}
//             </p>
//           </div>
//         </div>

//         {/* User */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen((v) => !v)}
//             className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold shadow-sm hover:bg-primary/30 transition-colors"
//           >
//             {user?.username?.[0]?.toUpperCase()}
//           </button>

//           {open && (
//             <UserDropdown onClose={() => setOpen(false)} />
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }