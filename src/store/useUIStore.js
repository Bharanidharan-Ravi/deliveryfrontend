import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeRequests: 0,
  isLoading: false,
  globalError: null,

  // Called by Axios before a request starts
  startRequest: () => set((state) => ({
    activeRequests: state.activeRequests + 1,
    isLoading: true,
    globalError: null // Auto-clear previous errors when a new action starts
  })),

  // Called by Axios when a request succeeds or fails
  endRequest: () => set((state) => {
    const newCount = Math.max(0, state.activeRequests - 1);
    return {
      activeRequests: newCount,
      isLoading: newCount > 0 // Only stop loading if ALL requests are done
    };
  }),

  // Manual error control
  setError: (errorMsg) => set({ globalError: errorMsg }),
  clearError: () => set({ globalError: null })
}));