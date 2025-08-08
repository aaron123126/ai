
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let game = {
    min: 1,
    max: 100,
    guess: 50,
    gameOver: false,
    attempts: 0
};

app.post('/start', (req, res) => {
    game = {
        min: 1,
        max: 100,
        guess: 50,
        gameOver: false,
        attempts: 0
    };
    res.json({ guess: game.guess, message: "Think of a number between 1 and 100. Is your number " + game.guess + "?" });
});

app.post('/feedback', (req, res) => {
    const feedback = req.body.feedback;
    let message = "";
    let status = "playing";

    if (game.gameOver) {
        return res.json({ guess: game.guess, message: "Game is over! Please start a new game.", status: "gameOver" });
    }

    game.attempts++;

    if (feedback === 'higher') {
        game.min = game.guess + 1;
    } else if (feedback === 'lower') {
        game.max = game.guess - 1;
    } else if (feedback === 'correct') {
        game.gameOver = true;
        status = "win";
        message = `Yes! I guessed your number ${game.guess} in ${game.attempts} attempts!`;
    } else {
        message = "Invalid feedback. Please use 'higher', 'lower', or 'correct'.";
        status = "error";
    }

    if (!game.gameOver) {
        if (game.min > game.max) {
            game.gameOver = true;
            status = "error";
            message = "It seems there was an issue. Did you change your number or provide incorrect feedback? Please start a new game.";
        } else {
            game.guess = Math.floor((game.min + game.max) / 2);
            message = `Is your number ${game.guess}?`;
        }
    }

    res.json({ guess: game.guess, message: message, status: status, attempts: game.attempts });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
