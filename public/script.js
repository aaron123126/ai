document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const higherButton = document.getElementById('higherButton');
    const lowerButton = document.getElementById('lowerButton');
    const correctButton = document.getElementById('correctButton');
    const messageDiv = document.getElementById('message');
    const guessDisplay = document.getElementById('guess');
    const minDisplay = document.getElementById('min');
    const maxDisplay = document.getElementById('max');

    let currentGuess = null;
    let minRange = 1;
    let maxRange = 100;

    const updateUI = (data) => {
        if (data.guess !== undefined) {
            guessDisplay.textContent = data.guess;
            currentGuess = data.guess;
        }
        if (data.min !== undefined) {
            minRange = data.min;
            minDisplay.textContent = minRange;
        }
        if (data.max !== undefined) {
            maxRange = data.max;
            maxDisplay.textContent = maxRange;
        }
        if (data.message) {
            messageDiv.textContent = data.message;
        }

        if (data.gameOver) {
            higherButton.disabled = true;
            lowerButton.disabled = true;
            correctButton.disabled = true;
            startButton.textContent = 'Play Again';
        } else {
            higherButton.disabled = false;
            lowerButton.disabled = false;
            correctButton.disabled = false;
            startButton.textContent = 'Start New Game';
        }
    };

    startButton.addEventListener('click', async () => {
        try {
            messageDiv.textContent = 'Starting new game...';
            console.log('Attempting to start new game...');
            const response = await fetch('/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                messageDiv.textContent = `Error starting game: HTTP error! status: ${response.status}. See console for details.`;
                return;
            }

            const responseText = await response.text();
            console.log('Raw response for /start:', responseText);

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed data for /start:', data);
                updateUI(data);
            } catch (jsonError) {
                console.error('Error parsing JSON for /start:', jsonError);
                messageDiv.textContent = `Error starting game: JSON parse error. Raw response: "${responseText}". See console for details.`;
            }

        } catch (error) {
            console.error('Network or unexpected error starting game:', error);
            messageDiv.textContent = `Error starting game: ${error.message}. Check console.`;
        }
    });

    higherButton.addEventListener('click', async () => {
        try {
            messageDiv.textContent = 'Processing "Higher"...';
            const response = await fetch('/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: 'higher' }),
            });
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            console.error('Error with "Higher" feedback:', error);
        }
    });

    lowerButton.addEventListener('click', async () => {
        try {
            messageDiv.textContent = 'Processing "Lower"...';
            const response = await fetch('/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: 'lower' }),
            });
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            console.error('Error with "Lower" feedback:', error);
        }
    });

    correctButton.addEventListener('click', async () => {
        try {
            messageDiv.textContent = 'Processing "Correct!"...';
            const response = await fetch('/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: 'correct' }),
            });
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            console.error('Error with "Correct" feedback:', error);
        }
    });
});