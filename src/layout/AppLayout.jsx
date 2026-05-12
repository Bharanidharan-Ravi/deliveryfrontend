import AppHeader from "./components/AppHeader";
import AppFooterNav from "./components/AppFooterNav";
import { useUIStore } from "../store/useUIStore";
import { ErrorBanner } from "../components/common/ErrorBanner";

export default function AppLayout({ children }) {
  const { isLoading, globalError, clearError } = useUIStore();

  return (
    <div className="h-[100dvh] w-full bg-background text-white flex flex-col overflow-hidden relative">
      
      {/* Header */}
      <div className="shrink-0 z-50">
        <AppHeader />
      </div>

      {/* 🔴 REUSABLE GLOBAL ERROR BANNER */}
      {globalError && (
        <div className="shrink-0 z-40 px-4 pt-3 pb-1">
          {/* 🚀 Pass the Zustand state into your common component */}
          <ErrorBanner message={globalError} onDismiss={clearError} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-0 overflow-y-auto relative">
        
        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-fade-in">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--primary)] mb-3"></div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Processing...</p>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>

      {/* Footer Area */}
      <div className="shrink-0 w-full z-40 bg-card/95 backdrop-blur-md">
        <AppFooterNav />
        
        <div className="pt-1.5 pb-4 flex items-center justify-center gap-1.5 border-t border-white/5 bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="relative flex h-1.5 w-1.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
            <span className="relative inline-flex rounded-full h-1 w-1 bg-primary shadow-[0_0_8px_var(--primary)]"></span>
          </div>
          <div className="text-[9px] flex items-center text-muted/70">
            <span className="tracking-widest font-medium uppercase">POWERED BY</span>
            <span className="font-black text-gray-200 tracking-widest ml-1.5 uppercase">WORKGLOW</span>
            <span className="font-medium text-muted/60 ml-1 capitalize">Solutions</span>
          </div>
        </div>
      </div>

    </div>
  );
}