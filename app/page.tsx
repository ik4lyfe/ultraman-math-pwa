"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { Play } from "lucide-react";
import { Howl } from "howler";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const setMusicPlaying = useGameStore((s) => s.setMusicPlaying);

  useEffect(() => {
    // Only play BGM if not already playing inside layout (handle in layout for persistence is better, 
    // but just in case we need a start menu specific sound)
  }, []);

  const playBeamSound = () => {
    new Howl({ src: ["/assets/sounds/spacium_beam.wav"], volume: 0.5 }).play();
  };

  const handleStart = () => {
    playBeamSound();
    resetGame();
    useGameStore.getState().setGameState("setup");
    setMusicPlaying(true);
    router.push("/setup");
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-black overflow-hidden select-none">
      {/* Background with Grid */}
      <div className="absolute inset-x-0 bottom-0 h-[80vh] w-full retro-grid pointer-events-none" />
      
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white neon-text-red mb-4">
          ULTRA<span className="text-blue-500 neon-text-blue">MATH</span>
        </h1>
        <p className="text-red-500 font-bold uppercase tracking-widest text-lg md:text-2xl neon-text-red">
          EARTH DEFENSE FORCE - MYS KSSR
        </p>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 w-full max-w-4xl h-64 md:h-[28rem] relative mb-12 pointer-events-none flex items-center justify-center"
      >
        <div className="absolute w-3/4 h-3/4 bg-blue-500/20 blur-[80px] rounded-full -z-10" />
        <img
          src="/assets/images/banner.jpg" // OVERWRITE THIS FILE WITH YOUR UPLOADED IMAGE (or rename your file to banner.jpg)
          alt="Ultraman Hero Banner"
          className="w-full h-full object-cover rounded-3xl"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
            maskImage: "radial-gradient(ellipse, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)"
          }}
        />
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="z-10 flex flex-col gap-4 w-full max-w-sm"
      >
        <button
          onClick={handleStart}
          className="group relative flex items-center justify-center gap-3 w-full py-4 text-xl font-bold uppercase tracking-widest text-white bg-red-600 rounded-lg overflow-hidden transition-transform active:scale-95 hover:bg-red-500 neon-box-red border-2 border-red-400"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Play className="w-6 h-6 fill-white" />
          <span>START MISSION</span>
        </button>
      </motion.div>

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />
    </main>
  );
}
