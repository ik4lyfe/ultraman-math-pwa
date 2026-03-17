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
  const isProcessingRef = useRef(false);

  const currentQ = questions[currentQuestionIndex];

  // We define handleAnswer first so our interval can use it safely
  const handleAnswer = (selected: number | null) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    triggerColorTimerSFX.stop();
    if (!currentQ) return;
    const isCorrect = selected === currentQ.answer;

    const soundSrc = isCorrect ? "/assets/sounds/correct.wav" : "/assets/sounds/wrong.wav";
    new Howl({ src: [soundSrc], volume: 0.6 }).play();

    onAttack(isCorrect);
  };

  // Keep a stable ref to the LATEST handleAnswer to avoid all stale closure bugs in setInterval
  const handleAnswerRef = useRef(handleAnswer);
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
  });

  useEffect(() => {
    if (!currentQ) return;

    // Reset everything internally for the new question cycle
    setTimeLeft(15);
    isProcessingRef.current = false;
    triggerColorTimerSFX.stop();

    let seconds = 15;

    const timer = setInterval(() => {
      // If we are already displaying combat animations, pause the clock internally
      if (isProcessingRef.current) return;

      seconds--;
      setTimeLeft(seconds);

      if (seconds === 4) {
        triggerColorTimerSFX.play();
      } else if (seconds <= 0) {
        clearInterval(timer);
        handleAnswerRef.current(null); // safely triggers the time out!
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      triggerColorTimerSFX.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]); // Safe to run only on index change because index fully represents the current question

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
