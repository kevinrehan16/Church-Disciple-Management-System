import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LoadingScreen() {
  // Lazy initialization para makuha agad ang kulay mula sa localStorage
  const [color] = useState(() => {
    try {
      const storedTheme = localStorage.getItem('salus-theme');
      if (storedTheme) {
        const themeData = JSON.parse(storedTheme);
        return themeData.activeParentBg || '#0284c7';
      }
    } catch (e) {
      console.error("Error parsing theme:", e);
    }
    return '#0284c7'; // Fallback
  });

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Slow Pulsing Divine Gold & Royal Purple Glow Background */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />

      {/* MASSIVE CENTERED "JESUS" WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <motion.span 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="font-black text-[12rem] sm:text-[18rem] md:text-[25rem] tracking-tight text-white/[0.03] uppercase leading-none"
        >
          JESUS
        </motion.span>
      </div>

      {/* TOP PILLAR TAGS: Discipleship & Disciplemaking */}
      <div className="absolute top-8 sm:top-12 w-full max-w-2xl px-6 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-white/10 text-amber-200 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Discipleship
        </span>
        <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-white/10 text-amber-200 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Disciplemaking
        </span>
      </div>

      {/* CENTERED CONTENT: CROSS & BRANDING */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* DIVINE CROSS & GLOW CORE */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-8">
          {/* Rotating Golden Divine Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-amber-400/50 rounded-full"
          />
          
          {/* Counter-Rotating Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 border-b-2 border-l-2 border-white/20 rounded-full"
          />

          {/* Pulsing Cross Icon in Center */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
            style={{ color }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 sm:w-24 sm:h-24">
              <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
            </svg>
          </motion.div>
        </div>

        {/* BRANDING SECTION */}
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl tracking-tight text-white font-extrabold uppercase drop-shadow-lg"
          >
            <span>GCF</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-amber-200/90"
          >
            Disciple Network System
          </motion.p>
        </div>
      </div>

      {/* CORE MISSION TAGLINE AT BOTTOM */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute bottom-10 sm:bottom-12 w-full text-center z-10 px-4 pointer-events-none"
      >
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.35em] text-amber-100/80 uppercase drop-shadow">
          KNOW <span className="text-amber-400 font-extrabold mx-1.5">•</span> LOVE <span className="text-amber-400 font-extrabold mx-1.5">•</span> ABIDE <span className="text-amber-400 font-extrabold mx-1.5">•</span> SERVE <span className="text-amber-400 font-extrabold mx-1.5">•</span> PROCLAIM
        </p>
      </motion.div>
    </motion.div>
  );
}