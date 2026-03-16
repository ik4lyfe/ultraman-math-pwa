"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { HealthBar } from "@/components/game/HealthBar";
import { BattleRenderer } from "@/components/game/BattleRenderer";
import { MathArena } from "@/components/game/MathArena";
import { Trophy, AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function BattlePage() {
  const router = useRouter();
  const { gameState, score, resetGame, answerQuestion, setGameState } = useGameStore();

  const [playerAction, setPlayerAction] = useState<"idle" | "attack" | "hurt">("idle");
  const [kaijuAction, setKaijuAction] = useState<"idle" | "attack" | "hurt">("idle");

  useEffect(() => {
    // Only allow access if user started playing
    if (gameState === "menu" || gameState === "setup") {
      router.replace("/");
    }
  }, [gameState, router]);

  const handleAttack = (isCorrect: boolean) => {
    if (isCorrect) {
      setPlayerAction("attack");
      setKaijuAction("hurt");
    } else {
      setKaijuAction("attack");
      setPlayerAction("hurt");
      // Screen shake effect
      document.body.classList.add("animate-shake");
      setTimeout(() => document.body.classList.remove("animate-shake"), 300);
    }

    // Delay call store dispatch so the combat animations finish FIRST
    setTimeout(() => {
      answerQuestion(isCorrect);
      setPlayerAction("idle");
      setKaijuAction("idle");
    }, 1200);
  };

  const playAgain = () => {
    resetGame();
    setGameState("setup");
    router.push("/setup");
  };

  if (gameState === "menu" || gameState === "setup") return null;

  return (
    <main className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-end pb-12 select-none">
      
      {/* Background Graphic */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />
      <div className="absolute inset-0 retro-grid opacity-30 z-0 pointer-events-none" />

      {(gameState === "playing" || gameState === "gameover" || gameState === "victory") && (
        <>
          <HealthBar />
          <BattleRenderer playerAction={playerAction} kaijuAction={kaijuAction} />
        </>
      )}

      {/* Main UI Area */}
      <AnimatePresence>
        {gameState === "playing" && (
          <motion.div 
            key="arena"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full z-40"
          >
            <MathArena onAttack={handleAttack} />
            <div className="text-center mt-4">
              <span className="text-zinc-500 font-mono tracking-widest text-sm uppercase">
                Score: <span className="text-blue-400 font-bold">{score}</span>
              </span>
            </div>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-50 bg-red-950/80 backdrop-blur-md border px-12 py-10 rounded-3xl flex flex-col items-center shadow-[0_0_100px_rgba(220,38,38,0.5)] border-red-500/50"
          >
            <AlertOctagon className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_10px_red] animate-pulse" />
            <h2 className="text-5xl font-black italic text-white mb-2 uppercase tracking-tighter neon-text-red">MISSION FAILED</h2>
            <p className="text-red-300 font-bold tracking-widest uppercase mb-8">Earth Has Fallen</p>
            <div className="flex gap-4">
              <button onClick={playAgain} className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest flex items-center gap-2 neon-box-red transition-all">
                <RotateCcw className="w-5 h-5" /> Retry
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "victory" && (
          <motion.div
            key="victory"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="z-50 bg-blue-950/80 backdrop-blur-md border px-12 py-10 rounded-3xl flex flex-col items-center shadow-[0_0_100px_rgba(59,130,246,0.5)] border-blue-500/50"
          >
            <Trophy className="w-24 h-24 text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
            <h2 className="text-5xl font-black italic text-white mb-2 uppercase tracking-tighter neon-text-blue">MISSION ACCOMPLISHED</h2>
            <p className="text-blue-300 font-bold tracking-widest uppercase mb-4 text-center">
              Earth is Safe.<br/>Final Score: <span className="text-white text-2xl">{score}</span>
            </p>
            <button onClick={() => router.push("/")} className="mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase tracking-widest flex items-center gap-2 neon-box-blue transition-all">
              <Home className="w-5 h-5" /> Return to Base
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
