import { Navigate } from "react-router-dom";

import { PATHS } from "../routing/paths";

import { useAuthStore } from "../../store/useAuthStore";

export default function AuthGuard({ children }) {
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return null;
  }

  if (!token) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return children;
}