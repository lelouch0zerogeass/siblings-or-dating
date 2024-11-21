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

function updateDisplay() {
    const totalGuesses = guesses.siblings + guesses.dating;
    const siblingsPercentage = ((guesses.siblings / totalGuesses) * 100).toFixed(2);
    const datingPercentage = ((guesses.dating / totalGuesses) * 100).toFixed(2);

    const percentagesHTML = `
        <div class="percentage">
            <p>Siblings: ${siblingsPercentage}%</p>
            <p>Dating: ${datingPercentage}%</p>
        </div>
    `;
    gameContainer.innerHTML += percentagesHTML;
}

function loadNextImage() {
    if (currentImageIndex < images.length) {
        const image = images[currentImageIndex];
        gameContainer.innerHTML = `
