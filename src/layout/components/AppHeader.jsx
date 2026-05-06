import { useState } from "react";

import { useAuthStore }
from "../../store/useAuthStore";

import UserDropdown from "./UserDropdown";

export default function AppHeader() {
  const user =
    useAuthStore((s) => s.user);

  const [open, setOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-white/5">

      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            🚚
          </div>

          <div>
            <h1 className="text-sm font-bold">
              Delivery App
            </h1>

            <p className="text-[11px] text-muted">
              Field Delivery
            </p>
          </div>

        </div>

        {/* User */}
        <div className="relative">

          <button
            onClick={() =>
              setOpen((v) => !v)
            }
            className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold"
          >
            {user?.username?.[0]
              ?.toUpperCase()}
          </button>

          {open && (
            <UserDropdown
              onClose={() =>
                setOpen(false)
              }
            />
          )}

        </div>

      </div>

    </header>
  );
}