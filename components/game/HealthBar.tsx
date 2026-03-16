import { motion } from "framer-motion";
import { useGameStore, STAGE_CONFIG } from "@/lib/store";

export function HealthBar() {
  const { playerHP, maxPlayerHP, kaijuHP, maxKaijuHP, level } = useGameStore();
  const currentStage = STAGE_CONFIG[Math.min(level - 1, STAGE_CONFIG.length - 1)];

  const playerPercent = Math.max(0, (playerHP / maxPlayerHP) * 100);
  const kaijuPercent = Math.max(0, (kaijuHP / maxKaijuHP) * 100);

  return (
    <div className="flex w-full justify-between items-start gap-4 p-4 z-50 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent">
      
      {/* Player HP */}
      <div className="flex-1 max-w-xs">
        <div className="flex justify-between items-end mb-1">
          <span className="text-blue-400 font-bold italic uppercase drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">
            {currentStage.ultramanName}
          </span>
          <span className="text-white text-sm font-mono">{playerHP} / {maxPlayerHP}</span>
        </div>
        <div className="h-4 w-full bg-zinc-900 rounded border border-white/20 overflow-hidden relative skew-x-[-10deg]">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: "100%" }}
            animate={{ width: `${playerPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Timer / Level Indicator */}
      <div className="flex flex-col items-center px-4">
        <span className="text-amber-500 font-black text-2xl drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
          STAGE {level}
        </span>
      </div>

      {/* Kaiju HP */}
      <div className="flex-1 max-w-xs text-right">
        <div className="flex justify-between items-end mb-1 flex-row-reverse">
          <span className="text-red-500 font-bold italic uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
            {currentStage.kaijuName}
          </span>
          <span className="text-white text-sm font-mono">{kaijuHP} / {maxKaijuHP}</span>
        </div>
        <div className="h-4 w-full bg-zinc-900 rounded border border-white/20 overflow-hidden relative skew-x-[10deg] flex justify-end">
          <motion.div 
            className="h-full bg-red-600"
            initial={{ width: "100%" }}
            animate={{ width: `${kaijuPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

    </div>
  );
}
