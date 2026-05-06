import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthGuard from "../auth/AuthGuard";

import { PATHS } from "./paths";

import { LoginForm } from "../../features/auth/pages/LoginForm";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import DeliveryPage from "../../features/delivery/pages/DeliveryPage";
import AppLayout from "../../layout/AppLayout";
import HistoryPage from "../../features/history/pages/HistoryPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path={PATHS.LOGIN} element={<LoginForm />} />

        {/* Protected */}
        <Route
          path={PATHS.DELIVERY}
          element={
            <AuthGuard>
              <AppLayout>
                <DeliveryPage />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path={PATHS.HISTORY}
          element={
            <AuthGuard>
              <AppLayout>
                <HistoryPage />
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
