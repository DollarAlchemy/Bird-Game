// Canvas Setup
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Game Variables
let score = 0;
let birds = [];
const winningScore = 20; // Score to beat the game

// Audio Elements
const ambientAudio = new Audio("sounds/ambient.mp3");
const birdNoise = new Audio("sounds/bird.mp3");
const clickNoise = new Audio("sounds/click.mp3");

// Start Ambient Sound After User Interaction
document.addEventListener("click", () => {
    if (ambientAudio.paused) {
        ambientAudio.loop = true; // Loop the ambient sound
        ambientAudio.play().catch((error) => {
            console.error("Error playing ambient audio:", error);
        });
    }
});

// Tree and Bush Drawing
function drawBackground() {
    // Draw tree trunk
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(100, 200, 40, 100);

    // Draw tree foliage
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.arc(120, 180, 60, 0, Math.PI * 2);
    ctx.fill();

    // Draw bushes
    ctx.beginPath();
    ctx.arc(300, 350, 40, 0, Math.PI * 2);
    ctx.arc(350, 350, 40, 0, Math.PI * 2);
    ctx.arc(400, 350, 40, 0, Math.PI * 2);
    ctx.fill();
}

// Bird Class
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = Math.random() * 2 + 2; // Random speed
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.speed; // Move right
    }
}

// Spawn Birds
function spawnBird() {
    const bird = new Bird(120, Math.random() * 200 + 50); // Start near the tree
    birds.push(bird);
}

// Handle Bird Click
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    birds.forEach((bird, index) => {
        const dist = Math.sqrt((bird.x - clickX) ** 2 + (bird.y - clickY) ** 2);
        if (dist < bird.size) {
            birds.splice(index, 1); // Remove bird
            score++; // Increment score
            document.getElementById("score").textContent = score; // Update score display
            birdNoise.play().catch((error) => {
                console.error("Error playing bird noise:", error);
            });

            // Check if the player has won
            if (score === winningScore) {
                endGame();
            }
        }
    });
});

// End Game
function endGame() {
    // Stop spawning birds
    clearInterval(birdSpawner);

    // Display winning message
    alert("Congratulations! You've beaten the game!");

    // Optionally reset the game
    resetGame();
}

// Reset Game
function resetGame() {
    score = 0;
    birds = [];
    document.getElementById("score").textContent = score;
    startGame();
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawBackground(); // Draw tree and bushes

    // Update and draw birds
    birds.forEach((bird, index) => {
        bird.update();
        bird.draw();

        // Remove bird if it flies off screen
        if (bird.x > canvas.width) {
            birds.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

// Start Game
let birdSpawner;
function startGame() {
    birdSpawner = setInterval(spawnBird, 1000); // Spawn a bird every second
    gameLoop();
}

// Initialize the game
startGame();
