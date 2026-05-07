"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show splash screen once per session
    if (sessionStorage.getItem("splashShown")) {
      setIsVisible(false);
      return;
    }

    // Start animating out after 2.5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("splashShown", "true");
    }, 2500);

    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Subtle Background Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-emerald-glow/5 blur-[120px] rounded-full" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 20px rgba(74, 222, 128, 0.1)", "0 0 60px rgba(74, 222, 128, 0.3)", "0 0 20px rgba(74, 222, 128, 0.1)"] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-glow/20 blur-[60px] rounded-full" 
            />
            
            <div className="flex items-center gap-4 relative z-10 mb-8">
              <motion.span 
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.5 }}
                className="text-5xl sm:text-6xl"
              >
                🔍
              </motion.span>
              <h1 className="text-5xl sm:text-6xl font-black text-gradient-emerald tracking-tighter">
                SpendLens
              </h1>
            </div>
            
            {/* Loading bar container */}
            <div className="w-64 h-1 bg-border/30 rounded-full overflow-hidden relative z-10 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-primary rounded-full glow-sm shadow-[0_0_10px_rgba(74,222,128,0.5)]" 
              />
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              className="text-[10px] uppercase tracking-[0.3em] font-medium mt-6 text-muted-foreground"
            >
              Analyzing AI Tool Economics
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
