// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
//let dropMaker; // Will store our timer that creates drops regularly
let cloudMaker; // Stores ID timer that changes the cloud's weather
let cloudMover; // Stores timer that moves the cloud
let timerValue = 30; 
let scoreValue = 0;

// DOM elements 
const startButton = document.getElementById("start-btn");
const cloud = document.getElementById("cloud");
const gameArea = document.getElementById("game-container");
const score = document.getElementById("score");
const time = document.getElementById("time");
const message = document.querySelector(".message");

let winMessage =["😀 Congratulations! You won!", "🎉 Great job!", "💧 You're a water collecting master!"];
let loseMessage =["😢 Better luck next time!", "😴 Too slow!", "Keep trying!", "😦 Yikes! You can do better!"];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

cloud.addEventListener("click", function() {
  if (gameRunning && cloud.textContent === "🌧️") {
    scoreValue += 1;
    score.textContent = scoreValue;
  }
  else if (gameRunning && cloud.textContent === "☁️") {
    scoreValue -= 1;
    score.textContent = scoreValue;
  }
});

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  if (timerValue <= 0) {
    timerValue = 30;
    scoreValue = 0;
    score.textContent = scoreValue;
    time.textContent = timerValue;
    message.textContent = "";
    startButton.textContent = "Start Game";
  }
  
  const countdownInterval = setInterval(function() {
    timerValue--;
    time.textContent = timerValue;

    if (timerValue <= 0) {
      clearInterval(countdownInterval);
      clearTimeout(cloudMaker);
      clearInterval(cloudMover);
      gameRunning = false;
      time.textContent = "0";
      message.textContent = "Game over!";

      if(scoreValue >= 5) {
        const randomWinMessage = winMessage[Math.floor(Math.random() * winMessage.length)];
        message.textContent = randomWinMessage;
        showConfetti();

      } else {
        const randomLoseMessage = loseMessage[Math.floor(Math.random() * loseMessage.length)];
        message.textContent = randomLoseMessage;
      }

      startButton.textContent = "Restart Game";
    }

  }, 1000);
  
  gameRunning = true;
  cloud.textContent = "🌧️";

  // Create new drops every second (1000 milliseconds)
  //dropMaker = setInterval(createDrop, 1000);

  moveCloud(); // Move the cloud immediately when the game starts (1st second then stops)
  cloudMover = setInterval(moveCloud, 1000); 
  changeCloudWeather();
}

function moveCloud() {
  // Find the available space for the cloud
  const maxX = gameArea.clientWidth - cloud.offsetWidth;
  const maxY = gameArea.clientHeight - cloud.offsetHeight;

  // Pick a random position
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  // Move the cloud to that position
  cloud.style.left = randomX + "px";
  cloud.style.top = randomY + "px";
}

function changeCloudWeather() {
  if (!gameRunning) return;

  cloudMaker = setTimeout(function() {
    cloud.textContent = cloud.textContent === "🌧️" ? "☁️" : "🌧️";
    changeCloudWeather();
  }, 500 + Math.random() * 1500);
}

function showConfetti() {
  confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    }
  );
}

/*
function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

} */
