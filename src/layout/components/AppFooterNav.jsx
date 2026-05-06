import {
  NavLink,
} from "react-router-dom";

import { PATHS }
from "../../core/routing/paths";

export default function AppFooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-card/95 backdrop-blur">

      <div className="max-w-md mx-auto h-16 flex items-center justify-around">

        {/* Delivery */}
        <NavLink
          to={PATHS.DELIVERY}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs ${
              isActive
                ? "text-primary"
                : "text-muted"
            }`
          }
        >
          <span className="text-xl">
            🚚
          </span>

          <span>Delivery</span>
        </NavLink>

        {/* History */}
        <NavLink
          to={PATHS.HISTORY}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs ${
              isActive
                ? "text-primary"
                : "text-muted"
            }`
          }
        >
          <span className="text-xl">
            📜
          </span>

          <span>History</span>
        </NavLink>

      </div>

    </footer>
  );
}