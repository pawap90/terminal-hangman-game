import { generate } from 'random-words'
import { Difficulty } from './game.js';


let wordLengthByDifficulty: Record<Difficulty, number> = {
    'easy': 4,
    'medium': 6,
    'hard': 8
}

export function getRandomWord(difficulty: Difficulty = 'medium'): string {
    let wordLength = wordLengthByDifficulty[difficulty];
    return generate({ minLength: wordLength, maxLength: wordLength, exactly: 1 })[0];
}