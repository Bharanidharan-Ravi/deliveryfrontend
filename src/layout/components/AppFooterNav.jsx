import { NavLink } from "react-router-dom";
import { PATHS } from "../../core/routing/paths";

export default function AppFooterNav() {
  return (
    // REMOVED 'fixed bottom-0'. AppLayout manages the position now!
    <footer className="border-t border-white/5 w-full">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around">

        {/* Delivery */}
        <NavLink
          to={PATHS.DELIVERY}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? "text-primary" : "text-muted hover:text-white/80"
            }`
          }
        >
          <span className="text-xl">🚚</span>
          <span>Delivery</span>
        </NavLink>

        {/* History */}
        <NavLink
          to={PATHS.HISTORY}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? "text-primary" : "text-muted hover:text-white/80"
            }`
          }
        >
          <span className="text-xl">📜</span>
          <span>History</span>
        </NavLink>

      </div>
    </footer>
  );
}