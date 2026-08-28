import { NavLink } from "react-router-dom";
import { PATHS } from "../../core/routing/paths";
import { useTranslation } from "react-i18next";

export default function AppFooterNav() {
  const { t } = useTranslation(); 
  
  return (
    <footer className="w-full bg-background transition-colors duration-300 shrink-0 z-50">
      
      {/* Navigation Tabs */}
      <div className="border-t border-border/20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
        <div className="max-w-md mx-auto h-16 flex items-center justify-around">

          {/* Delivery */}
          <NavLink
            to={PATHS.DELIVERY}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs transition-all duration-300 font-bold ${
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted hover:text-foreground"
              }`
            }
          >
            <span className="text-[22px] drop-shadow-sm">🚚</span>
            <span>{t("nav.delivery")}</span>
          </NavLink>

          {/* History */}
          <NavLink
            to={PATHS.HISTORY}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs transition-all duration-300 font-bold ${
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted hover:text-foreground"
              }`
            }
          >
            <span className="text-[22px] drop-shadow-sm">📜</span>
            <span>{t("nav.history")}</span>
          </NavLink>

        </div>
      </div>

      {/* Reverse-Out Banner */}
      <div className="bg-[#050810] border-t border-white/5 py-3 px-2 flex items-center justify-center gap-2 w-full">
        
        {/* Pulsing Dot */}
        <div className="relative flex h-1.5 w-1.5 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
        </div>

        <div className="flex flex-wrap items-center justify-center text-slate-400 leading-none">
          {/* Base 9px size for the uppercase block */}
          <div className="text-[9px]">
            <span className="tracking-widest font-bold uppercase opacity-80">
              POWERED BY
            </span>
            <span className="font-black text-white tracking-widest ml-1.5 uppercase drop-shadow-md">
              WORKGLOW
            </span>
          </div>
          
          {/* 🚀 FIXED: Explicitly bumped the font size up to text-[11px] here to fix the optical illusion! */}
          <div className="text-[11px] font-bold opacity-60 ml-1.5">
            Solutions <span className="mx-1 opacity-50">•</span> v{import.meta.env.VITE_APP_VERSION}
          </div>
        </div>

      </div>

    </footer>
  );
}

// import { NavLink } from "react-router-dom";
// import { PATHS } from "../../core/routing/paths";
// import { useTranslation } from "react-i18next";

// export default function AppFooterNav() {
//   const { t } = useTranslation();
//   return (
//     // REMOVED 'fixed bottom-0'. AppLayout manages the position now!
//     <footer className="border-t border-white/5 w-full">
//       <div className="max-w-md mx-auto h-16 flex items-center justify-around">

//         {/* Delivery */}
//         <NavLink
//           to={PATHS.DELIVERY}
//           className={({ isActive }) =>
//             `flex flex-col items-center gap-1 text-xs transition-colors ${
//               isActive ? "text-primary" : "text-muted hover:text-white/80"
//             }`
//           }
//         >
//           <span className="text-xl">🚚</span>
//           <span>{t("nav.delivery")}</span>
//         </NavLink>

//         {/* History */}
//         <NavLink
//           to={PATHS.HISTORY}
//           className={({ isActive }) =>
//             `flex flex-col items-center gap-1 text-xs transition-colors ${
//               isActive ? "text-primary" : "text-muted hover:text-white/80"
//             }`
//           }
//         >
//           <span className="text-xl">📜</span>
//           <span>{t("nav.history")}</span>
//         </NavLink>

//       </div>
//     </footer>
//   );
// }
