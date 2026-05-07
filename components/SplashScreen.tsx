"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Only show splash screen once per session
    if (sessionStorage.getItem("splashShown")) {
      setIsVisible(false);
      return;
    }

    // Start animating out after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsAnimatingOut(true);
      sessionStorage.setItem("splashShown", "true");
    }, 2000);

    // Completely unmount after animation finishes (0.8s)
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ease-in-out ${
        isAnimatingOut ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center animate-in fade-in duration-1000 zoom-in-95">
        <div className="absolute inset-0 bg-emerald-glow/20 blur-[60px] rounded-full animate-pulse" />
        <div className="flex items-center gap-3 relative z-10 mb-8">
          <span className="text-4xl sm:text-5xl">🔍</span>
          <h1 className="text-4xl sm:text-5xl font-black text-gradient-emerald tracking-tight">
            SpendLens
          </h1>
        </div>
        
        {/* Loading bar container */}
        <div className="w-48 h-1 bg-border/50 rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
