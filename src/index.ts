import { Difficulty, start } from "./game.js";
import enquirer from 'enquirer';

type UserInput = { difficulty: Difficulty };

try {
    const response = await enquirer.prompt<UserInput>({
        type: 'select',
        name: 'difficulty',
        message: 'Select a difficulty',
        choices: [
            { name: 'easy', value: 'easy' },
            { name: 'medium', value: 'medium' },
            { name: 'hard', value: 'hard' }
        ]
    });

    await start(response.difficulty);
}
catch (err) {
    if (!err)
        // Enquirer throws an empty error when the user quits.
        console.log('Thanks for playing!');
    else
        console.error(err);
}