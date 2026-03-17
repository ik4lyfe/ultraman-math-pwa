import { create } from "zustand";
import { generateQuestions } from "./questionGenerator";

// ============================================================================
// 🎮 STAGE CONFIGURATION 🎮
// Change the names and image files for each of the 5 stages here!
// 
// - ultramanName: The name displayed on the top left.
// - ultramanImage: The image file used for the player (place in public/assets/images/)
// - kaijuName: The name displayed on the top right.
// - kaijuImage: The image file used for the enemy (place in public/assets/images/)
// ============================================================================
export const STAGE_CONFIG = [
  { level: 1, ultramanName: "ULTRAMAN TIGA", ultramanImage: "ultraman_tiga.png", kaijuName: "KING MOLERAT", kaijuImage: "king_molerat.png" },
  { level: 2, ultramanName: "ULTRAMAN MEBIUS", ultramanImage: "ultraman_mebius.png", kaijuName: "GUDON", kaijuImage: "gudon.png" },
  { level: 3, ultramanName: "ULTRAMAN ZERO", ultramanImage: "ultraman_idle.png", kaijuName: "ZETTON", kaijuImage: "zetton.png" },
  { level: 4, ultramanName: "ULTRAMAN BLAZAR", ultramanImage: "ultraman_idle.png", kaijuName: "TYRANT", kaijuImage: "gomora.png" },
  { level: 5, ultramanName: "ULTRAMAN NOA", ultramanImage: "ultraman_idle.png", kaijuName: "BELIAL", kaijuImage: "zetton.png" },
];

export type Question = {
  id: string;
  equation: string;
  answer: number;
  options: number[];
  level: number;
};

type GameState = {
  playerHP: number;
  maxPlayerHP: number;
  kaijuHP: number;
  maxKaijuHP: number;
  score: number;
  level: number; 
  questions: Question[];
  currentQuestionIndex: number;
  gameState: "menu" | "setup" | "playing" | "gameover" | "victory";
  isMusicPlaying: boolean;
  syllabusText: string;
  
  // Actions
  setGameState: (state: GameState["gameState"]) => void;
  setMusicPlaying: (val: boolean) => void;
  setQuestions: (qs: Question[]) => void;
  setSyllabusText: (text: string) => void;
  answerQuestion: (isCorrect: boolean) => void;
  resetGame: () => void;
  nextLevel: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  playerHP: 100,
  maxPlayerHP: 100,
  kaijuHP: 100,
  maxKaijuHP: 100,
  score: 0,
  level: 1,
  questions: [],
  currentQuestionIndex: 0,
  gameState: "menu",
  isMusicPlaying: false,
  syllabusText: "",

  setGameState: (state) => set({ gameState: state }),
  setMusicPlaying: (val) => set({ isMusicPlaying: val }),
  setSyllabusText: (text) => set({ syllabusText: text }),
  
  setQuestions: (qs) => set({ questions: qs, currentQuestionIndex: 0 }),

  answerQuestion: (isCorrect) => {
    const state = get();
    if (isCorrect) {
      const newKaijuHP = Math.max(0, state.kaijuHP - 20); // 5 hits to kill
      set({
        kaijuHP: newKaijuHP,
        score: state.score + 100 * state.level,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      });

      if (newKaijuHP === 0) {
        if (state.level >= 5) {
          set({ gameState: "victory" });
        } else {
          // Kaiju defeated, move to next level
          setTimeout(() => state.nextLevel(), 2000);
        }
      }
    } else {
      const newPlayerHP = Math.max(0, state.playerHP - 25); // 4 hits to die
      set({
        playerHP: newPlayerHP,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      });

      if (newPlayerHP === 0) {
        set({ gameState: "gameover" });
      }
    }
  },

  nextLevel: () => {
    const state = get();
    const nextLvl = state.level + 1;
    
    // Generate a fresh deep pool of 50 questions for the new level
    const newQs = generateQuestions(state.syllabusText, nextLvl, 50);

    set({
      level: nextLvl,
      kaijuHP: 100 + (nextLvl * 20), 
      maxKaijuHP: 100 + (nextLvl * 20),
      questions: newQs,
      currentQuestionIndex: 0,
    });
  },

  resetGame: () => set({
    playerHP: 100,
    kaijuHP: 100,
    maxKaijuHP: 100,
    score: 0,
    level: 1,
    currentQuestionIndex: 0,
    gameState: "menu",
    questions: [],
    isMusicPlaying: false,
    syllabusText: "",
  })
}));
