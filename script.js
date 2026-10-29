// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
//let dropMaker; // Will store our timer that creates drops regularly
let cloudMaker; // Stores ID timer that changes the cloud's weather
let cloudMover; // Stores timer that moves the cloud
let timerValue = 30; 
let scoreValue = 0;
const loseSound = new Audio('audio/freesound_community-water-drop-85731.mp3');
const winSound = new Audio('audio/universfield-water-splash-02-352021.mp3');
const backgroundMusic = new Audio('audio/dragon-studio-gentle-rain-05-437316.mp3');

// DOM elements 
const startButton = document.getElementById("start-btn");
const cloud = document.getElementById("cloud");
const gameArea = document.getElementById("game-container");
const score = document.getElementById("score");
const time = document.getElementById("time");
const message = document.querySelector(".message");

// Disable text highlighting
cloud.style.userSelect = "none";

// Messages for different game outcomes
let winMessage =["😀 Congratulations! You won!", "🎉 Great job!", "💧 You're a water collecting master!", "Nice job!"];
let loseMessage =["😢 Better luck next time!", "😴 Too slow!", "Keep trying!", "😦 Yikes! You can do better!"];
let halfTimeMessage = ["Halfway there! Keep going!", "💪 You're doing great! Halfway there!", "🏃‍♂️ Keep up the pace! You're half done!"];
let pastHalfTimeMessage = ["You're almost there! Keep going!", "Only a couple more clicks away!", "🏃‍♂️ You're so close!"];

// Level settings for different levels
const levelData = {
  Easy: {
    cloudSpeed: 2000,
    weatherSpeed: 2000,
    scoreToWin: 20
  },
  Medium: {
    cloudSpeed: 1500,
    weatherSpeed: 500,
    scoreToWin: 15
  },
  Hard: {
    cloudSpeed: 800,
    weatherSpeed: 400,
    scoreToWin: 10
  }
};

// Event listeners for user interactions
document.getElementById("start-btn").addEventListener("click", startGame); // Wait for button click to start the game
// Wait for cloud click to update score
cloud.addEventListener("click", function() {
  cloud.classList.remove("cloud-clicked");
  void cloud.offsetWidth;
  cloud.classList.add("cloud-clicked");

  if (gameRunning && cloud.textContent === "🌧️") {
    scoreValue += 1;
    score.textContent = scoreValue;
    
  }
  else if (gameRunning && cloud.textContent === "🌥") {
    scoreValue -= 1;
    score.textContent = scoreValue;
  }
});

/* GAME START */
function startGame() {

  if (gameRunning) return; // Prevent multiple games from running at once
  
  // Get the selected level from the dropdown
  let levelSelector = document.getElementById("level-selector");
  let level = levelSelector.value; 

  if (!levelData[level]) {
    message.textContent = "Choose a level to start the game!";
    return;
  }
  
  // Reset game state
  if (timerValue <= 0) {
    timerValue = 30;
    scoreValue = 0;
    score.textContent = scoreValue;
    time.textContent = timerValue;
    message.textContent = "";
    startButton.textContent = "Start Game";
  }
  
  // Start message based on level
  if (level === "Easy") 
  {
    message.textContent = "Game started! Get 20 points to win!";
  } 
  else if (level === "Medium") 
  {
    message.textContent = "Game started! Get 15 points to win!";
  } 
  else if (level === "Hard") 
  {
    message.textContent = "Game started! Get 10 points to win!";
  }

  halfCounter = 0; // Reset half-time message counter
  halfPastCounter = 0; // Reset past half-time message counter
  backgroundMusic.play();

  /* TIMER START */
  const countdownInterval = setInterval(function() {
    timerValue--;
    time.textContent = timerValue;

    // Milstone messages based on score and level
    if (timerValue != 0 && halfCounter === 0) {
      
      if(level === "Easy" && scoreValue >= 10 && scoreValue < 15) 
      {
        const randomHalfTimeMessage = halfTimeMessage[Math.floor(Math.random() * halfTimeMessage.length)];
        message.textContent = randomHalfTimeMessage;
        halfCounter++;
      }
      else if (level === "Medium" && scoreValue >= 7 && scoreValue < 12)
      {
        const randomHalfTimeMessage = halfTimeMessage[Math.floor(Math.random() * halfTimeMessage.length)];
        message.textContent = randomHalfTimeMessage;
        halfCounter++;
      }
      else if (level === "Hard" && scoreValue >= 5 && scoreValue < 10)
      {
        const randomHalfTimeMessage = halfTimeMessage[Math.floor(Math.random() * halfTimeMessage.length)];
        message.textContent = randomHalfTimeMessage;
        halfCounter++;
      }
    }

    if (timerValue != 0 && halfPastCounter === 0) {
      
      if(level === "Easy" && scoreValue >= 15 && scoreValue < 20) 
      {
        
        const randomHalfPastTimeMessage = pastHalfTimeMessage[Math.floor(Math.random() * pastHalfTimeMessage.length)];
        message.textContent = randomHalfPastTimeMessage;
        halfPastCounter++;
      }
      else if (level === "Medium" && scoreValue >= 12 && scoreValue < 15)
      {
        const randomHalfPastTimeMessage = pastHalfTimeMessage[Math.floor(Math.random() * pastHalfTimeMessage.length)];
        message.textContent = randomHalfPastTimeMessage;
        halfPastCounter++;
      }
      else if (level === "Hard" && scoreValue >= 5 && scoreValue < 10)
      {
        const randomHalfPastTimeMessage = pastHalfTimeMessage[Math.floor(Math.random() * pastHalfTimeMessage.length)];
        message.textContent = randomHalfPastTimeMessage;
        halfPastCounter++;
      }
      
    }

    // End game when timer reaches 0
    if (timerValue <= 0) {
      clearInterval(countdownInterval);
      clearTimeout(cloudMaker);
      clearInterval(cloudMover);
      // backgroundMusic.pause(); // use if audio file is longer than 30 seconds
      // backgroundMusic.currentTime = 0; // Reset audio to start
      cloud.textContent = "☁️";
      gameRunning = false;
      time.textContent = "0";
      
      // Win or lose message based on score
      if(scoreValue >= levelData[level].scoreToWin) {
        const randomWinMessage = winMessage[Math.floor(Math.random() * winMessage.length)];
        message.textContent = randomWinMessage;
        showConfetti();
        winSound.play();
        } 
      else {
        const randomLoseMessage = loseMessage[Math.floor(Math.random() * loseMessage.length)];
        message.textContent = randomLoseMessage;
        loseSound.play();
      }

      startButton.textContent = "Restart Game";
    }

  }, 1000);
  
  gameRunning = true;
  cloud.textContent = "🌧️";
  
  moveCloud(); // Move the cloud immediately when the game starts (1st second then stops)
  cloudMover = setInterval(moveCloud, levelData[level].cloudSpeed); // Move the cloud every second 
  changeCloudWeather(levelData[level].weatherSpeed); // Change the cloud's weather 
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

function changeCloudWeather(speed) {
  if (!gameRunning) return;

  cloudMaker = setTimeout(function() {
    cloud.textContent = cloud.textContent === "🌧️" ? "🌥" : "🌧️";
    changeCloudWeather(speed); // Call the function again to keep changing the weather
  }, speed + Math.random() * 1500); // Change weather every 0.5 to 2 seconds
}

function showConfetti() {
  confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    }
  );
}

