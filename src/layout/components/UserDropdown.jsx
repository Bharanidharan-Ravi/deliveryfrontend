import { useNavigate }
from "react-router-dom";

import { useAuthStore }
from "../../store/useAuthStore";

import { PATHS }
from "../../core/routing/paths";

export default function UserDropdown({
  onClose,
}) {
  const navigate = useNavigate();

  const user =
    useAuthStore((s) => s.user);

  const logout =
    useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();

    navigate(PATHS.LOGIN);
  };

  return (
    <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-card shadow-2xl overflow-hidden">

      {/* User */}
      <div className="px-4 py-3 border-b border-white/5">

        <p className="text-sm font-semibold">
          {user?.fullName ||
            user?.username}
        </p>

        <p className="text-xs text-muted">
          {user?.role}
        </p>

      </div>

      {/* Language */}
      <div className="px-4 py-3 border-b border-white/5">

        <label className="text-xs text-muted block mb-2">
          Language
        </label>

        <select className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm">

          <option value="en">
            English
          </option>

          <option value="ta">
            தமிழ்
          </option>

        </select>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-left text-sm hover:bg-red-500/10 text-red-400"
      >
        Sign Out
      </button>

    </div>
  );
}