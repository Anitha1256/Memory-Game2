let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isChecking = false;

const cardSymbols = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎪', '🎲', '🎸'];
const cardPairs = [...cardSymbols, ...cardSymbols];

const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const gameMessage = document.getElementById('gameMessage');


function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isChecking = false;
    
    updateDisplay();
    shuffleCards();
    createGameBoard();
    updateMessage("Flip cards to find matching pairs!");
}


function shuffleCards() {
    const shuffled = [...cardPairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    cards = shuffled;
}


function createGameBoard() {
    gameBoard.innerHTML = '';
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${symbol}</div>
                <div class="card-back">?</div>
            </div>
        `;
        
        card.addEventListener('click', () => handleCardClick(card));
        gameBoard.appendChild(card);
    });
}

/**
 * Handle card click events
 * @param {HTMLElement} card
 */
function handleCardClick(card) {
    // Prevent clicking if currently checking for matches or card is already flipped/matched
    if (isChecking || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);


    if (flippedCards.length === 2) {
        moves++;
        updateDisplay();
        checkForMatch();
    }
}


function checkForMatch() {
    isChecking = true;
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateDisplay();
            
            if (matchedPairs === cardSymbols.length) {
                setTimeout(() => {
                    gameMessage.textContent = `🎉 Congratulations! You won in ${moves} moves!`;
                    gameMessage.classList.add('congratulations');
                }, 300);
            } else {
                updateMessage("Great match! Keep going!");
            }
            
            flippedCards = [];
            isChecking = false;
        }, 300);
    } else {
        updateMessage("No match! Try again.");
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isChecking = false;
            updateMessage("Keep trying to find matching pairs!");
        }, 1000);
    }
}


function updateDisplay() {
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = matchedPairs;
}

/**
 * Update the game message
 * @param {string} message - The message to display
 */
function updateMessage(message) {
    gameMessage.textContent = message;
    gameMessage.classList.remove('congratulations');
}


function restartGame() {

    gameMessage.classList.remove('congratulations');

    updateMessage("Shuffling cards...");
    
    setTimeout(() => {
        initGame();
    }, 500);
}

document.addEventListener('DOMContentLoaded', initGame);