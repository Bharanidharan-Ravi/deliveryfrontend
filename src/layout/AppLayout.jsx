import AppHeader from "./components/AppHeader";
import AppFooterNav from "./components/AppFooterNav";

export default function AppLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">

      {/* Header */}
      <AppHeader />

      {/* Content */}
      <main className="flex-1 px-4 py-4 pb-28 max-w-md mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <AppFooterNav />

      {/* Copyright */}
      <div className="pb-3 text-center text-[11px] text-muted border-t border-white/5 bg-background">
        © Antiq Gravity Pvt Ltd
      </div>

    </div>
  );
}