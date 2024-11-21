const gameContainer = document.getElementById('game-container');

const images = [
    { src: 'image1.jpg', answer: 'siblings' },
    { src: 'image2.jpg', answer: 'dating' },
    // Add more images here
];

let currentImageIndex = 0;

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
    if (answer === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong! Try again.');
    }
    currentImageIndex++;
    loadNextImage();
}

loadNextImage();
