import { Question } from "./store";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrongAnswers = new Set<number>();
  while (wrongAnswers.size < count) {
    const offset = randomInt(-10, 10);
    const wrong = correct + offset;
    if (wrong !== correct && wrong >= 0 && !wrongAnswers.has(wrong)) {
      wrongAnswers.add(wrong);
    }
  }
  return Array.from(wrongAnswers);
}

function shuffleOptions(options: number[]) {
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generates math questions. Uses text as a seed or heuristic if possible.
 * If no text is provided, generates pure random questions based on KSSR level.
 */
export function generateQuestions(text: string, level: number, count: number = 5): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    let equation = "";
    let answer = 0;

    switch (level) {
      case 1: // Addition
        const a1 = randomInt(1, 100);
        const a2 = randomInt(1, 100);
        equation = `${a1} + ${a2} = ?`;
        answer = a1 + a2;
        break;
      case 2: // Subtraction
        const s1 = randomInt(20, 100);
        const s2 = randomInt(1, s1); // Ensure positive result
        equation = `${s1} - ${s2} = ?`;
        answer = s1 - s2;
        break;
      case 3: // Multiplication
        const m1 = randomInt(1, 12);
        const m2 = randomInt(1, 12);
        equation = `${m1} × ${m2} = ?`;
        answer = m1 * m2;
        break;
      case 4: // Division
        const d2 = randomInt(1, 12);
        const answerDiv = randomInt(1, 12);
        const d1 = d2 * answerDiv;
        equation = `${d1} ÷ ${d2} = ?`;
        answer = answerDiv;
        break;
      case 5: // Simple Fractions (Same denominator)
        const fDenom = randomInt(2, 10);
        const fNum1 = randomInt(1, fDenom * 2); 
        const fNum2 = randomInt(1, fDenom * 2);
        equation = `(${fNum1}/${fDenom}) + (${fNum2}/${fDenom}) = ?/${fDenom}`;
        answer = fNum1 + fNum2; // Only ask for the numerator for simplicity
        break;
      default:
        const x = randomInt(1, 10);
        equation = `${x} + 1 = ?`;
        answer = x + 1;
    }

    const options = shuffleOptions([answer, ...generateWrongAnswers(answer, 3)]);

    questions.push({
      id: Math.random().toString(36).substr(2, 9),
      equation,
      answer,
      options,
      level
    });
  }

  return questions;
}
