document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let guesses = { siblings: 0, dating: 0 };
    const images = [
        { src: 'image1.png', answer: 'siblings' },
        { src: 'image2.png', answer: 'siblings' },
        // Add more images here
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(images);
    let currentImageIndex = 0;

    function showChart() {
        const totalGuesses = guesses.siblings + guesses.dating;
        const siblingsPercentage = ((guesses.siblings / totalGuesses) * 100).toFixed(2);
        const datingPercentage = ((guesses.dating / totalGuesses) * 100).toFixed(2);

        gameContainer.innerHTML = '';

        const chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';
        gameContainer.appendChild(chartContainer);

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'guessChart';
        chartContainer.appendChild(chartCanvas);

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
        nextButton.onclick = loadNextImage;
        chartContainer.appendChild(nextButton);
    }

    function loadNextImage() {
        if (currentImageIndex < images.length) {
            const image = images[currentImageIndex];
            gameContainer.innerHTML = `
                <div class="image-container">
                    <img src="${image.src}" alt="Image">
                    <div class="overlay-text" id="correct-answer"></div>
                </div>
                <button onclick="checkAnswer('siblings')">Siblings</button>
                <button onclick="checkAnswer('dating')">Dating</button>
            `;
        } else {
            gameContainer.innerHTML = '<h2>Game Over! Thanks for playing.</h2>';
        }
    }

    window.checkAnswer = function (answer) {
        const correctAnswer = images[currentImageIndex].answer;
        guesses[answer]++;
        const correctAnswerElement = document.getElementById('correct-answer');
        correctAnswerElement.textContent = correctAnswer.toUpperCase();
        correctAnswerElement.style.display = 'block';

        setTimeout(showChart, 2000); // Delay to show correct answer on image before displaying chart
    }

    loadNextImage();
});
