const gameContainer = document.getElementById('game-container');

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

let currentImageIndex = 0;
let siblingsCount = 0;
let datingCount = 0;

function loadNextImage() {
    if (currentImageIndex < images.length) {
        const image = images[currentImageIndex];
        gameContainer.innerHTML = `
            <img src="${image.src}" alt="Image">
            <button onclick="checkAnswer('siblings')">Siblings</button>
            <button onclick="checkAnswer('dating')">Dating</button>
        `;
    } else {
        gameContainer.innerHTML = '<h2>Game Over! Thanks for playing.</h2>';
    }
}

function checkAnswer(answer) {
    const correctAnswer = images[currentImageIndex].answer;
    if (answer === 'siblings') {
        siblingsCount++;
    } else {
        datingCount++;
    }

    const totalGuesses = siblingsCount + datingCount;
    const siblingsPercentage = ((siblingsCount / totalGuesses) * 100).toFixed(2);
    const datingPercentage = ((datingCount / totalGuesses) * 100).toFixed(2);

    gameContainer.innerHTML += `
        <div>
            <p>Siblings: ${siblingsPercentage}%</p>
            <p>Dating: ${datingPercentage}%</p>
        </div>
    `;

    setTimeout(() => {
        alert(`The correct answer was: ${correctAnswer}`);
        currentImageIndex++;
        loadNextImage();
    }, 2000); // Delay to show percentages before moving to the next image
}

shuffleArray(images);
loadNextImage();
