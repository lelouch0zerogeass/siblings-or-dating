document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let guesses = JSON.parse(localStorage.getItem('guesses')) || { siblings: 0, dating: 0 }; // Load from local storage or initialize
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
    let currentImageIndex = parseInt(localStorage.getItem('currentImageIndex')) || 0; // Load from local storage or initialize

    // Display the chart with percentages
    function showChart() {
        const totalGuesses = guesses.siblings + guesses.dating;
        const siblingsPercentage = ((guesses.siblings / totalGuesses) * 100).toFixed(2);
        const datingPercentage = ((guesses.dating / totalGuesses) * 100).toFixed(2);

        const chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'guessChart';
        chartContainer.appendChild(chartCanvas);

        gameContainer.innerHTML = '';
        gameContainer.appendChild(chartContainer);

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Siblings', 'Dating'],
                datasets: [{
                    label: 'Percentage of Guesses',
                    data: [siblingsPercentage, datingPercentage],
                    backgroundColor: ['#ff5722', '#4caf50'],
                    borderColor: ['#ff5722', '#4caf50'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Image';
        nextButton.onclick = () => {
            currentImageIndex++;
            if (currentImageIndex < images.length) {
                localStorage.setItem('currentImageIndex', currentImageIndex); // Save to local storage
                loadNextImage();
            } else {
                localStorage.removeItem('currentImageIndex'); // Clear index after the game ends
                localStorage.removeItem('guesses'); // Clear guesses after the game ends
                gameContainer.innerHTML = '<h2>Game Over! Thanks for playing.</h2>';
            }
        };
        gameContainer.appendChild(nextButton);
    }

    // Load the next image in the sequence
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
        guesses[answer]++;
        localStorage.setItem('guesses', JSON.stringify(guesses)); // Save to local storage

        const correctAnswerElement = document.getElementById('correct-answer');
        correctAnswerElement.textContent = correctAnswer.toUpperCase();
        correctAnswerElement.style.display = 'block';

        setTimeout(showChart, 2000); // Delay to show correct answer on image before displaying chart
    }

    loadNextImage();
});
