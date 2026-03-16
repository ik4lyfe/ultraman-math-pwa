"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { Howl } from "howler";
import { triggerColorTimerSFX } from "@/components/game/BGMPlayer";

interface MathArenaProps {
  onAttack: (isCorrect: boolean) => void;
}

export function MathArena({ onAttack }: MathArenaProps) {
  const { questions, currentQuestionIndex } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  const currentQ = questions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQ) return;

    // Reset timer on new question
    setTimeLeft(15);
    setIsProcessing(false);
    isProcessingRef.current = false;
    triggerColorTimerSFX.stop();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      triggerColorTimerSFX.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQ]);

  // Handle side-effects of timer reaching certain values
  useEffect(() => {
    if (timeLeft === 4) {
      // Play requested color timer YouTube warning sound exact when the bar is about to turn red
      triggerColorTimerSFX.play();
    } else if (timeLeft === 0 && !isProcessingRef.current) {
      // Time out = wrong
      handleAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAnswer = (selected: number | null) => {
    if (isProcessingRef.current) return;
    setIsProcessing(true);
    isProcessingRef.current = true;

    triggerColorTimerSFX.stop();
    if (!currentQ) return;
    const isCorrect = selected === currentQ.answer;

    const soundSrc = isCorrect ? "/assets/sounds/correct.wav" : "/assets/sounds/wrong.wav";
    new Howl({ src: [soundSrc], volume: 0.6 }).play();

    onAttack(isCorrect);
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-2xl mx-auto z-40 relative px-4">
      {/* Timer Bar embedded */}
      <div className="mb-4">
        <div className="flex justify-between text-white font-bold mb-1 px-1">
          <span className="text-xs uppercase opacity-70">Energy Timer</span>
          <span className={`text-sm ${timeLeft <= 3 ? "text-red-500 animate-pulse" : ""}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${timeLeft <= 3 ? "bg-red-600 animate-color-timer" : "bg-cyan-400"}`}
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / 15) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      <motion.div
        key={currentQ.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      >
        <div className="text-center mb-8">
          <h3 className="text-4xl md:text-5xl font-black text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {currentQ.equation}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {currentQ.options.map((opt, i) => (
              <motion.button
                key={`${currentQ.id}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                className="py-6 text-3xl font-bold bg-zinc-800 border-2 border-zinc-600 hover:border-blue-500 hover:bg-blue-600/20 text-white rounded-xl transition-colors shadow-lg"
              >
                {opt}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
