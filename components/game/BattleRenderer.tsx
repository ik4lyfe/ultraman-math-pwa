"use client";

import { motion } from "framer-motion";
import { useGameStore, STAGE_CONFIG } from "@/lib/store";
import { useEffect, useState } from "react";

interface BattleRendererProps {
  playerAction: "idle" | "attack" | "hurt";
  kaijuAction: "idle" | "attack" | "hurt";
}

export function BattleRenderer({ playerAction, kaijuAction }: BattleRendererProps) {
  const playerHP = useGameStore(s => s.playerHP);
  const level = useGameStore(s => s.level);
  const currentStage = STAGE_CONFIG[Math.min(level - 1, STAGE_CONFIG.length - 1)];

  // Render Spacium Beam effect
  const [showBeam, setShowBeam] = useState(false);

  useEffect(() => {
    if (playerAction === "attack") {
      setShowBeam(true);
      const t = setTimeout(() => setShowBeam(false), 800);
      return () => clearTimeout(t);
    } else {
      setShowBeam(false);
    }
  }, [playerAction]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-between px-10 md:px-32 pointer-events-none">
      
      {/* Player Side */}
      <div className="relative w-48 h-64 md:w-80 md:h-96 z-10 flex flex-col items-center justify-end">
        <motion.div
          animate={{
            x: playerAction === "attack" ? [0, 20, 0] : playerAction === "hurt" ? [-20, 20, -20, 0] : 0,
            y: playerAction === "idle" ? [0, -5, 0] : 0,
            filter: playerAction === "hurt" ? "brightness(0.5) sepia(1)" : "none",
          }}
          transition={{ 
            duration: playerAction === "hurt" ? 0.3 : playerAction === "idle" ? 3 : 0.5,
            repeat: playerAction === "idle" ? Infinity : 0
          }}
          className="w-full h-full relative"
        >
          <img 
            src={`/assets/images/${currentStage.ultramanImage}`}
            alt={currentStage.ultramanName}
            className="w-full h-full object-cover mix-blend-screen"
            style={{
              WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
              maskImage: "radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)"
            }}
          />
          {/* Color Timer (Blinks red if low hp) */}
          <div className={`absolute top-[40%] left-[48%] w-4 h-4 rounded-full ${playerHP <= 25 ? 'bg-red-500 animate-color-timer' : 'bg-blue-400 drop-shadow-[0_0_10px_blue]'}`} />
        </motion.div>

        {/* Beam effect */}
        {showBeam && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="absolute top-1/2 left-[80%] w-[150vw] h-12 bg-blue-300 origin-left z-20 mix-blend-screen -translate-y-1/2 rounded-r-full"
            style={{
              boxShadow: "0 0 20px #fff, 0 0 40px #fff, 0 0 80px #0ff, 0 0 120px #0ff"
            }}
          />
        )}
      </div>

      {/* Kaiju Side */}
      <div className="relative w-48 h-64 md:w-80 md:h-96 z-10">
        <motion.div
           animate={{
            x: kaijuAction === "attack" ? [0, -40, 0] : kaijuAction === "hurt" ? [20, -20, 20, 0] : 0,
            y: kaijuAction === "idle" ? [0, 5, 0] : 0,
            filter: kaijuAction === "hurt" ? "brightness(2) contrast(1.5)" : "none",
          }}
          transition={{ 
            duration: kaijuAction === "hurt" ? 0.3 : kaijuAction === "idle" ? 4 : 0.5,
            repeat: kaijuAction === "idle" ? Infinity : 0,
            repeatType: "reverse"
          }}
          className="w-full h-full"
        >
           <img 
            src={`/assets/images/${currentStage.kaijuImage}`}
            alt={currentStage.kaijuName}
            className="w-full h-full object-cover scale-x-[-1] mix-blend-screen"
            style={{
              WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
              maskImage: "radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)"
            }}
          />
        </motion.div>
      </div>

    </div>
  );
}
