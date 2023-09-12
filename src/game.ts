import hangman from './hangman.js';
import enquirer from 'enquirer'
import { getRandomWord } from './word.js';

export type Difficulty = 'easy' | 'medium' | 'hard';

type GameState = 'playing' | 'won' | 'lost' | 'quit';
type UserInput = { letter: string };
type GameContext = {
    currentState: GameState,
    failedAttempts: number,
    currentWord: string,
    wordProgress: string,
    usedLetters: string[]
}

export async function start(difficulty: Difficulty = 'medium'): Promise<void> {
    let context = init(difficulty);
    console.log(context);

    while (context.currentState == 'playing') {
        // Print the current hangman frame.
        draw(context);
        try {
            const response = await enquirer.prompt<UserInput>({
                type: 'input',
                name: 'letter',
                message: 'Enter a letter',
                prefix: '>', // Remove the default prefix.
                format: (input: string) => input.toUpperCase(),
                result: (input: string) => input.toUpperCase(),

                validate: (input: string) => {
                    if (input.length > 1) {
                        return 'Please enter a single letter';
                    }
                    if (!/[a-z]/.test(input)) {
                        return 'Please enter a letter';
                    }
                    return true;
                }
            });

            if (context.currentWord.indexOf(response.letter) === -1) {
                console.log(`You entered ${response.letter} and it was not in the word ${context.currentWord}`);
                context.failedAttempts++;
                context.usedLetters.push(response.letter);
                if (context.failedAttempts == Object.keys(hangman).length - 1) {
                    context.currentState = 'lost';
                }
            }
            else {
                context.wordProgress = updateWordProgress(context, response.letter);
                if (context.wordProgress == context.currentWord) {
                    context.currentState = 'won';
                }
            }
        }
        catch (err) {
            if (!err) {
                // enquirer will throw an empty error if the user presses ctrl+c.
                context.currentState = 'quit';
            }
            else throw err;
        }
    }

    // Draw the last frame.
    draw(context);
}

function init(difficulty: Difficulty): GameContext {
    const randomWord = getRandomWord(difficulty).toLocaleUpperCase();
    return {
        currentState: 'playing',
        failedAttempts: 0,
        currentWord: randomWord,
        wordProgress: Array(randomWord.length).fill('_').join(''),
        usedLetters: []
    }
}

function draw(context: GameContext): void {
    console.clear();
    console.log(hangman[context.failedAttempts]);
    process.stdout.cursorTo(16, 5);
    console.log(context.wordProgress.split('').join(' '));
    console.log('\n');
    if (context.usedLetters.length > 0)
        console.log(`Used letters: ${context.usedLetters.join(', ')}`);
    console.log('\n\n');

    if (context.currentState == 'won') {
        console.log('Congratulations! You won!');
    }
    else if (context.currentState == 'lost') {
        console.log(`You lost! The word was ${context.currentWord}`);
    }
}

function updateWordProgress({ currentWord, wordProgress }: GameContext, letter: string): string {
    let newWordProgress = wordProgress.split('');
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] == letter)
            newWordProgress[i] = letter;
    }
    return newWordProgress.join('');
}
