import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  // Default to light mode for field apps, but check if they saved a preference
  theme: localStorage.getItem('app-theme') || 'light',
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    
    // Save to local storage
    localStorage.setItem('app-theme', newTheme);
    
    // Apply the class to the root HTML element
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),

  // Call this once in your App.jsx to set the initial theme
  initTheme: () => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}));