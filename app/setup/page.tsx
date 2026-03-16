"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { generateQuestions } from "@/lib/questionGenerator";

export default function SetupPage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setQuestions = useGameStore((s) => s.setQuestions);
  const setSyllabusText = useGameStore((s) => s.setSyllabusText);
  const level = useGameStore((s) => s.level);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleProcessFile = async (file: File | null) => {
    setIsLoading(true);
    let extractedText = "";

    if (file) {
      const { extractTextFromFile } = await import("@/lib/parser");
      extractedText = await extractTextFromFile(file);
    }

    // Generate deep pool of 50 questions based on extracted text and current level
    const qs = generateQuestions(extractedText, level, 50);
    setSyllabusText(extractedText);
    setQuestions(qs);
    setGameState("playing");
    router.push("/battle");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file) handleProcessFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Detached background grid so it doesn't warp the main content */}
      <div className="absolute inset-0 retro-grid opacity-30 pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-md border object-contain border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden z-10"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-blue-500 to-red-600" />

        <h2 className="text-3xl font-black text-white italic tracking-tight mb-2 uppercase">
          Mission <span className="text-red-500">Intel</span>
        </h2>
        <p className="text-zinc-400 mb-8">
          Upload syllabus material (PDF, DOCX, Image) to calibrate Kaiju combat scenarios. Or skip to use standard generation.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-blue-400 font-bold tracking-widest animate-pulse uppercase">
              DECODING KAIJU DATA...
            </p>
          </div>
        ) : (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
              onDragLeave={() => setIsHovering(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isHovering ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-500"
                }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,image/*"
                className="hidden"
                id="fileUpload"
                onChange={onFileChange}
              />
              <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer w-full h-full">
                <UploadCloud className={`w-12 h-12 mb-4 ${isHovering ? "text-blue-400" : "text-zinc-500"}`} />
                <span className="text-white font-medium mb-1">Drag & drop files here</span>
                <span className="text-sm text-zinc-500 text-center">Supports PDF, DOCX, or Images.<br />Offline processing via WebAssembly.</span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <span className="h-px bg-zinc-800 w-full"></span>
              <span className="text-zinc-600 font-bold px-4 uppercase text-xs">Or</span>
              <span className="h-px bg-zinc-800 w-full"></span>
            </div>

            <button
              onClick={() => handleProcessFile(null)}
              className="w-full mt-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Standard Combat (Skip)
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}
