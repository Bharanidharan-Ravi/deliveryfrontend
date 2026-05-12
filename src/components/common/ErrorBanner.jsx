import { useState, useEffect } from "react";

export function ErrorBanner({ message, autoCloseTime = 5000 }) {
  // 🚀 1. Create a local state just for the banner's visibility
  const [isVisible, setIsVisible] = useState(false);

  // 🚀 2. Whenever a new error message comes in, make the banner visible again
  useEffect(() => {
    if (message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  // 🚀 3. Automatically hide the banner after 5 seconds, BUT don't clear the global error!
  useEffect(() => {
    if (!message || !isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false); // Only hides the UI, leaves the global state alone
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [message, isVisible, autoCloseTime]);

  // If there's no message OR it's visually hidden, render nothing
  if (!message || !isVisible) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm animate-fade-in"
    >
      <span className="text-lg leading-none mt-0.5">⚠️</span>
      <span className="flex-1">{message}</span>
      
      {/* 🚀 4. Clicking 'X' also only hides the UI, leaving the global state alone */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-red-400 hover:text-red-200 transition-colors ml-auto shrink-0"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}