document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGameButton');
    const messageDisplay = document.getElementById('message');
    const currentGuessDisplay = document.getElementById('currentGuess');
    const feedbackButtons = document.getElementById('feedbackButtons');
    const higherButton = document.getElementById('higherButton');
    const lowerButton = document.getElementById('lowerButton');
    const correctButton = document.getElementById('correctButton');
    const attemptsDisplay = document.getElementById('attempts');

    let gameStarted = false;

    const updateUI = (data) => {
        messageDisplay.textContent = data.message;
        if (data.guess) {
            currentGuessDisplay.textContent = `My guess: ${data.guess}`;
        } else {
            currentGuessDisplay.textContent = '';
        }

        if (data.attempts !== undefined) {
            attemptsDisplay.textContent = `Attempts: ${data.attempts}`;
        } else {
            attemptsDisplay.textContent = '';
        }

        if (data.status === 'playing') {
            feedbackButtons.classList.remove('hidden');
            startGameButton.classList.add('hidden');
        } else if (data.status === 'win' || data.status === 'error') {
            feedbackButtons.classList.add('hidden');
            startGameButton.classList.remove('hidden');
            gameStarted = false;
        } else {
            // Initial state or after start game
            feedbackButtons.classList.add('hidden');
            startGameButton.classList.remove('hidden');
        }
    };

    const sendFeedback = async (feedback) => {
        try {
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: feedback }),
            });
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Error sending feedback:', error);
            messageDisplay.textContent = 'Error communicating with the game. Please try again.';
        }
    };

    startGameButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/start', {
                method: 'POST',
            });
            const data = await response.json();
            gameStarted = true;
            updateUI(data);
        } catch (error) {
            console.error('Error starting game:', error);
            messageDisplay.textContent = 'Error starting game. Please try again.';
        }
    });

    higherButton.addEventListener('click', () => sendFeedback('higher'));
    lowerButton.addEventListener('click', () => sendFeedback('lower'));
    correctButton.addEventListener('click', () => sendFeedback('correct'));

    // Initial UI setup
    updateUI({
        message: 'Click \'Start New Game\' to begin.',
        guess: null,
        status: 'initial'
    });
});
