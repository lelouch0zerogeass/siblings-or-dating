document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const images = [
        { src: 'siblings1.png', answer: 'siblings' },
        { src: 'siblings2.png', answer: 'siblings' },
        // Add more images here
    ];

    // Shuffle images to ensure a random order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(images);
    let currentImageIndex = 0;
    let currentGuesses = { siblings: 0, dating: 0 }; // Guesses for current image

    function showProgressBars() {
        const totalGuesses = currentGuesses.siblings + currentGuesses.dating;
        const siblingsPercentage = ((currentGuesses.siblings / totalGuesses) * 100).toFixed(2);
        const datingPercentage = ((currentGuesses.dating / totalGuesses) * 100).toFixed(2);

        gameContainer.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${siblingsPercentage}%;">
                    Siblings: ${siblingsPercentage}%
                </div>
                <div class="progress-bar dating" style="width: ${datingPercentage}%;">
                    Dating: ${datingPercentage}%
                </div>
            </div>
        `;

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Image';
        nextButton.onclick = () => {
            currentImageIndex++;
            currentGuesses = { siblings: 0, dating: 0 }; // Reset guesses for next image
            loadNextImage();
        };
        gameContainer.appendChild(nextButton);
    }

    function loadNextImage() {
        if (currentImageIndex < images.length) {
            const image = images[currentImageIndex];
            gameContainer.innerHTML = `
                <div class="image-container">
                    <img src="${image.src}" alt="Image">
                    <div class="overlay-text" id="correct-answer"></div>
                </div>
                <div class="button-container">
                    <button onclick="checkAnswer('siblings')">Siblings</button>
                    <button onclick="checkAnswer('dating')">Dating</button>
                </div>
            `;
        } else {
            gameContainer.innerHTML = '<h2>Game Over! Thanks for playing.</h2>';
        }
    }

    window.checkAnswer = function (answer) {
        const correctAnswer = images[currentImageIndex].answer;
        currentGuesses[answer]++;
        const correctAnswerElement = document.getElementById('correct-answer');
        correctAnswerElement.textContent = correctAnswer.toUpperCase();
        correctAnswerElement.style.display = 'block';

        setTimeout(showProgressBars, 2000);
    };

    loadNextImage();
});
