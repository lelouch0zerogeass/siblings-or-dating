document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const images = [
        'siblings1.png',
        'siblings2.png',
        'BroemmelSiblings1.png'
        // Add more images here once uploaded
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

    function getStoredGuesses(imageKey) {
        return JSON.parse(localStorage.getItem(imageKey)) || { siblings: 0, dating: 0 };
    }

    function storeGuesses(imageKey, guesses) {
        localStorage.setItem(imageKey, JSON.stringify(guesses));
    }

    function adjustFontSize(element) {
        let fontSize = 16; // Start with a default font size
        element.style.fontSize = fontSize + 'px';

        while (element.scrollWidth > element.clientWidth) {
            fontSize--;
            element.style.fontSize = fontSize + 'px';
        }
    }

    function getAnswerFromFilename(filename) {
        if (filename.includes('siblings')) {
            return 'siblings';
        } else if (filename.includes('dating')) {
            return 'dating';
        }
        return '';
    }

    function showProgressBarAndAnswer(imageKey, correctAnswer) {
        const storedGuesses = getStoredGuesses(imageKey);
        const totalGuesses = storedGuesses.siblings + storedGuesses.dating;
        const siblingsPercentage = (totalGuesses === 0) ? 0 : ((storedGuesses.siblings / totalGuesses) * 100).toFixed(2);
        const datingPercentage = (totalGuesses === 0) ? 0 : ((storedGuesses.dating / totalGuesses) * 100).toFixed(2);

        const correctAnswerElement = document.getElementById('correct-answer');
        correctAnswerElement.textContent = correctAnswer.toUpperCase();
        correctAnswerElement.style.display = 'block';

        const progressBar = document.createElement('div');
        progressBar.classList.add('overlay-bar');
        progressBar.innerHTML = `
            <div class="bar-segment siblings">Siblings: ${siblingsPercentage}%</div>
            <div class="bar-segment dating">Dating: ${datingPercentage}%</div>
        `;

        correctAnswerElement.after(progressBar);

        const siblingSegment = progressBar.querySelector('.bar-segment.siblings');
        const datingSegment = progressBar.querySelector('.bar-segment.dating');
        siblingSegment.style.width = `${siblingsPercentage}%`;
        datingSegment.style.width = `${datingPercentage}%`;

        adjustFontSize(siblingSegment);
        adjustFontSize(datingSegment);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Image';
        nextButton.classList.add('next-button');
        nextButton.onclick = () => {
            currentImageIndex++;
            loadNextImage();
        };
        gameContainer.appendChild(nextButton);
    }

    function loadNextImage() {
        if (currentImageIndex < images.length) {
            const image = images[currentImageIndex];
            const imageKey = image.replace('.png', '');
            const correctAnswer = getAnswerFromFilename(image);

            gameContainer.innerHTML = `
                <div class="image-container">
                    <img class="lazy" data-src="${image}" alt="Image"> <!-- Added lazy loading -->
                    <div class="overlay-text" id="correct-answer"></div>
                </div>
                <div class="button-container">
                    <button onclick="checkAnswer('${imageKey}', 'siblings')">Siblings</button>
                    <button onclick="checkAnswer('${imageKey}', 'dating')">Dating</button>
                </div>
            `;
        } else {
            gameContainer.innerHTML = '<h2>Game Over! Thanks for playing.</h2>';
        }
    }

    window.checkAnswer = function (imageKey, answer) {
        const correctAnswer = getAnswerFromFilename(images[currentImageIndex]);
        const storedGuesses = getStoredGuesses(imageKey);
        storedGuesses[answer]++;
        storeGuesses(imageKey, storedGuesses);

        showProgressBarAndAnswer(imageKey, correctAnswer);

        // Remove the answer buttons and show only the next button
        document.querySelector('.button-container').innerHTML = '';
    };

    loadNextImage();
});
