document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const images = [
        'HoganSiblings1.png',
        'TomlinsonSiblings1.png',
        'BroemmelSiblings1.png'
        // Add more images here once uploaded
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initializeGame() {
        shuffleArray(images);
        currentImageIndex = 0;
        usedGroups.clear();
        loadNextImage();
    }

    shuffleArray(images);
    let currentImageIndex = 0;
    let usedGroups = new Set();
    const totalGroups = new Set(images.map(img => getGroupFromFilename(img))).size;

    function getStoredGuesses(imageKey) {
        return JSON.parse(localStorage.getItem(imageKey)) || { siblings: 0, dating: 0 };
    }

    function storeGuesses(imageKey, guesses) {
        localStorage.setItem(imageKey, JSON.stringify(guesses));
    }

    function adjustFontSize(element) {
        let fontSize = 16;
        element.style.fontSize = fontSize + 'px';

        while (element.scrollWidth > element.clientWidth) {
            fontSize--;
            element.style.fontSize = fontSize + 'px';
        }
    }

    function getAnswerFromFilename(filename) {
        const lowerCaseFilename = filename.toLowerCase();
        if (lowerCaseFilename.includes('siblings')) {
            return 'siblings';
        } else if (lowerCaseFilename.includes('dating')) {
            return 'dating';
        }
        return '';
    }

    function getGroupFromFilename(filename) {
        const match = filename.match(/([a-zA-Z]+)(Siblings|Dating)\d+/);
        return match ? match[1] : '';
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
        nextButton.addEventListener('click', loadNextImage);
        nextButton.addEventListener('touchstart', loadNextImage); // Handle touch events
        gameContainer.appendChild(nextButton);
    }

    function loadNextImage() {
        if (usedGroups.size >= totalGroups) {
            gameContainer.innerHTML = `
                <h2>Game Over! Thanks for playing.</h2>
                <button id="restart-button">Restart Game</button>
            `;
            document.getElementById('restart-button').addEventListener('click', initializeGame);
            document.getElementById('restart-button').addEventListener('touchstart', initializeGame); // Handle touch events
            return;
        }

        while (currentImageIndex < images.length) {
            const image = images[currentImageIndex];
            const group = getGroupFromFilename(image);
            if (!usedGroups.has(group)) {
                usedGroups.add(group);
                const imageKey = image.replace('.png', '');
                const correctAnswer = getAnswerFromFilename(image);
                console.log(`Loading image: ${image}, with key: ${imageKey} and answer: ${correctAnswer}`);

                gameContainer.innerHTML = `
                    <div class="image-container">
                        <img src="${image}" alt="Image">
                        <div class="overlay-text" id="correct-answer"></div>
                    </div>
                    <div class="button-container">
                        <button class="answer-button" data-answer="siblings">Siblings</button>
                        <button class="answer-button" data-answer="dating">Dating</button>
                    </div>
                `;

                document.querySelectorAll('.answer-button').forEach(button => {
                    button.addEventListener('click', () => {
                        console.log(`Button clicked: ${button.getAttribute('data-answer')}`);
                        checkAnswer(imageKey, button.getAttribute('data-answer'));
                    });
                    button.addEventListener('touchstart', () => {
                        console.log(`Button clicked: ${button.getAttribute('data-answer')}`);
                        checkAnswer(imageKey, button.getAttribute('data-answer'));
                    }); // Handle touch events
                });

                currentImageIndex++;
                return;
            } else {
                currentImageIndex++;
            }
        }
    }

    window.checkAnswer = function (imageKey, answer) {
        console.log(`Checking answer for imageKey: ${imageKey}, answer: ${answer}`);
        const correctAnswer = getAnswerFromFilename(images[currentImageIndex - 1]);
        const storedGuesses = getStoredGuesses(imageKey);
        storedGuesses[answer]++;
        storeGuesses(imageKey, storedGuesses);

        showProgressBarAndAnswer(imageKey, correctAnswer);

        document.querySelector('.button-container').innerHTML = '';
    };

    initializeGame(); // Start the game when the page loads
});
