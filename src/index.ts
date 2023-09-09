import { emitKeypressEvents, Key } from "node:readline";
import hangman from "./hangman";
import { prompt } from 'enquirer'

const words = ['hello', 'world', ''];
// TODO Get random word.
const currentWord = 'acho';
let hangmanState = 0;

const state: 'playing' | 'won' | 'lost' | 'quit' = 'playing';
type Input = { letter: string };

(async () => {
    while (state == 'playing') {
        console.log(hangman[hangmanState]);
        try {
            const response = await prompt<Input>({
                type: 'input',
                name: 'letter',
                message: 'Guess a letter',
                format: (input: string) => input.toLowerCase(),
                validate: (input: string) => {
                    if (input.length > 1) {
                        return 'Please enter a single letter'
                    }
                    if (!/[a-z]/.test(input)) {
                        return 'Please enter a letter'
                    }
                    return true
                }
            });

            if (currentWord.indexOf(response.letter) === -1) {
                hangmanState++;
                // TODO check if lost.
            }
        }
        catch (err) {
            // TODO handle quit.
            console.log(err);
        }
    }
})();

// emitKeypressEvents(process.stdin);

// if (process.stdin.isTTY)
//     process.stdin.setRawMode(true);

// process.stdin.removeAllListeners('keypress');
// process.stdin.on('keypress', keyPressHandler);

// function keyPressHandler(chunk: string, key: Key) {
//     if (key.ctrl && key.name === 'c') {
//         process.exit();
//     } else if (key.name === 'return') {
//         console.log('You typed: ' + words.join(''));
//         words.length = 0;
//     } else if (key.name === 'backspace') {
//         words.pop();
//     } else if (key.name.length === 1) {
//         words.push(key.name);
//     }
// }
