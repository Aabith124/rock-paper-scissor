// Score management
let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

// Auto play state
let isAutoPlaying = false;
let intervalId;

// DOM elements
const elements = {
  result: document.querySelector('.js-result'),
  playerMove: document.querySelector('.js-player-move'),
  computerMove: document.querySelector('.js-computer-move'),
  movesDisplay: document.querySelector('.js-moves-display'),
  wins: document.querySelector('.js-wins'),
  losses: document.querySelector('.js-losses'),
  ties: document.querySelector('.js-ties'),
  autoPlayButton: document.querySelector('.js-auto-play-button'),
  autoPlayText: document.querySelector('.js-auto-play-text')
};

// Initialize game
function initGame() {
  updateScoreElement();
  hideResultAndMoves();
  setupEventListeners();
}

// Hide result and moves initially
function hideResultAndMoves() {
  elements.result.textContent = 'Choose your move!';
  elements.movesDisplay.style.visibility = 'hidden';
}

// Setup event listeners
function setupEventListeners() {
  // Move buttons
  document.querySelector('.js-rock-button').addEventListener('click', () => {
    playGame('rock');
    addClickEffect(document.querySelector('.js-rock-button'));
  });

  document.querySelector('.js-paper-button').addEventListener('click', () => {
    playGame('paper');
    addClickEffect(document.querySelector('.js-paper-button'));
  });

  document.querySelector('.js-scissors-button').addEventListener('click', () => {
    playGame('scissors');
    addClickEffect(document.querySelector('.js-scissors-button'));
  });

  // Keyboard controls
  document.body.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key === 'r') {
      playGame('rock');
      addClickEffect(document.querySelector('.js-rock-button'));
    } else if (key === 'p') {
      playGame('paper');
      addClickEffect(document.querySelector('.js-paper-button'));
    } else if (key === 's') {
      playGame('scissors');
      addClickEffect(document.querySelector('.js-scissors-button'));
    }
  });

  // Reset button
  document.querySelector('.js-reset-score-button').addEventListener('click', () => {
    resetScore();
    showNotification('Score has been reset!');
  });

  // Auto play button
  elements.autoPlayButton.addEventListener('click', () => {
    autoPlay();
  });
}

// Add visual click effect
function addClickEffect(button) {
  button.classList.add('clicked');
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 200);
}

// Show temporary notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.3s ease';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Auto play functionality
function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1500);
    isAutoPlaying = true;
    elements.autoPlayButton.classList.add('auto-play-active');
    elements.autoPlayText.textContent = 'Stop Auto Play';
    showNotification('Auto Play started');
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    elements.autoPlayButton.classList.remove('auto-play-active');
    elements.autoPlayText.textContent = 'Auto Play';
    showNotification('Auto Play stopped');
  }
}

// Reset score
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
  hideResultAndMoves();
}

// Main game logic
function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = determineWinner(playerMove, computerMove);
  
  updateScore(result);
  displayResult(result, playerMove, computerMove);
  saveScore();
}

// Determine winner
function determineWinner(playerMove, computerMove) {
  if (playerMove === computerMove) {
    return 'tie';
  }
  
  const winConditions = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  
  return winConditions[playerMove] === computerMove ? 'win' : 'lose';
}

// Update score based on result
function updateScore(result) {
  if (result === 'win') {
    score.wins += 1;
  } else if (result === 'lose') {
    score.losses += 1;
  } else if (result === 'tie') {
    score.ties += 1;
  }
}

// Save score to localStorage
function saveScore() {
  localStorage.setItem('score', JSON.stringify(score));
}

// Display game result
function displayResult(result, playerMove, computerMove) {
  // Update result text with appropriate color
  const resultText = result === 'win' ? 'You win!' : 
                     result === 'lose' ? 'You lose!' : 'Tie!';
  
  elements.result.textContent = resultText;
  elements.result.className = 'js-result result';
  elements.result.classList.add(result);
  
  // Show moves
  elements.movesDisplay.style.visibility = 'visible';
  elements.playerMove.innerHTML = `<img src="images/${playerMove}-emoji.png" class="move-icon">`;
  elements.computerMove.innerHTML = `<img src="images/${computerMove}-emoji.png" class="move-icon">`;
  
  // Add animation effect
  const moveIcons = document.querySelectorAll('.moves-display .move-icon');
  moveIcons.forEach(icon => {
    icon.animate([
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1.2)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  });
  
  // Update score display
  updateScoreElement();
}

// Update score display
function updateScoreElement() {
  elements.wins.textContent = score.wins;
  elements.losses.textContent = score.losses;
  elements.ties.textContent = score.ties;
}

// Pick computer move
function pickComputerMove() {
  const randomNumber = Math.random();
  
  if (randomNumber < 1/3) {
    return 'rock';
  } else if (randomNumber < 2/3) {
    return 'paper';
  } else {
    return 'scissors';
  }
}

// Initialize game when DOM content is loaded
document.addEventListener('DOMContentLoaded', initGame);