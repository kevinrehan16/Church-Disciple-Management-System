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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* FUTURISTIC GEOMETRIC CORE */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ borderColor: color }}
          className="absolute w-full h-full border-t-2 rounded-full opacity-60"
        />
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 border-r-2 border-b-2 border-slate-900 rounded-full"
        />

        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
          className="w-5 h-5 rounded-full"
        />
      </div>

      {/* BRANDING SECTION */}
      <div className="text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl tracking-tighter"
        >
          <span style={{ color: color }} className="font-black">Med</span>
          <span className="font-heading font-normal text-slate-900">Salus</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ color: color }}
          className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase"
        >
          Clinic Management System
        </motion.p>
      </div>

      {/* IRREGULAR EKG ANIMATION */}
      <div className="mt-12 w-full max-w-xs flex items-center justify-center overflow-hidden">
        <motion.svg 
          width="100%" 
          height="60" 
          viewBox="0 0 250 60" 
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.path
            d="M0 30 L 40 30 L 50 10 L 60 50 L 70 30 L 100 30 L 110 5 L 120 55 L 130 30 L 160 30 L 170 15 L 180 45 L 190 30 L 220 30 L 230 10 L 240 50 L 250 30"
            fill="transparent"
            strokeWidth="3"
            style={{ stroke: color }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1] 
            }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}