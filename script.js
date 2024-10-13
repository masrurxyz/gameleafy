let totalBalance = 0; // Overall balance across games
let currentGameBalance = 0; // Balance during the current game
let gameInterval;
let gameTime = 30;
let timerInterval;

// Generate a unique username and referral link to the game
const username = `User_${Math.floor(Math.random() * 100000)}`;
const gameURL = window.location.href; // Get the current game URL
const referralLink = `${gameURL}?ref=${username}`; // Referral link including unique username

// Load saved data on page load
window.onload = function () {
    loadUserData();
    checkReferralBonus();
};

// Save user data to local storage
function saveUserData() {
    const userData = {
        totalBalance: totalBalance,
        username: username
    };
    localStorage.setItem('gameUserData', JSON.stringify(userData));
}

// Load user data from local storage
function loadUserData() {
    const savedData = localStorage.getItem('gameUserData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        totalBalance = userData.totalBalance;
        updateBalance(); // Update the balance display after loading
        console.log(`Welcome back, ${userData.username}! Your balance is ${userData.totalBalance}.`);
    }
}

// Update balance displays
function updateBalance() {
    document.getElementById('balance').innerText = totalBalance;
    document.getElementById('game-balance').innerText = currentGameBalance;
}

// Show or hide the current game balance
function toggleGameBalance(show) {
    const gameBalanceSection = document.querySelector('.game-balance-section');
    if (show) {
        gameBalanceSection.style.display = 'block';
    } else {
        gameBalanceSection.style.display = 'none';
    }
}

// Random position generator for falling items
function randomPosition(maxWidth, maxHeight) {
    return {
        x: Math.floor(Math.random() * (maxWidth - 40)),
        y: Math.floor(Math.random() * (maxHeight - 40)),
    };
}

// Create a leaf or bomb element
function createFallingEmoji(emoji, className, clickHandler) {
    const gameArea = document.getElementById('game-content');
    const element = document.createElement('span');
    element.innerText = emoji;
    element.classList.add(className);
    const { x, y } = randomPosition(gameArea.clientWidth, gameArea.clientHeight);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    element.addEventListener('click', () => {
        clickHandler();
        element.remove(); // Emoji disappears after being clicked
    });
    gameArea.appendChild(element);

    setTimeout(() => element.remove(), 2000); // Emoji disappears after 2 seconds if not clicked
}

// Start the game
function startGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.classList.remove('hidden');
    currentGameBalance = 0; // Reset current game balance
    toggleGameBalance(true); // Show the game balance when the game starts
    updateBalance();
    gameTime = 30;
    document.getElementById('timer').innerText = `${gameTime}s`;

    gameInterval = setInterval(() => {
        // Generate more emojis (increased frequency of leaves and bombs)
        const isLeaf = Math.random() > 0.2; // 80% chance for a leaf
        if (isLeaf) {
            createFallingEmoji('🍁', 'leaf', () => {
                currentGameBalance += 1; // Increase current game balance by 1
                updateBalance();
            });
        } else {
            createFallingEmoji('💣', 'bomb', () => {
                currentGameBalance = 0; // Reset current game balance
                updateBalance();
            });
        }
    }, 300); // Increased speed for more elements

    timerInterval = setInterval(() => {
        gameTime -= 1;
        document.getElementById('timer').innerText = `${gameTime}s`;
        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    totalBalance += currentGameBalance; // Add current game balance to total balance
    currentGameBalance = 0; // Reset current game balance
    updateBalance();
    saveUserData(); // Save the updated balance
    document.getElementById('game-area').classList.add('hidden');
    toggleGameBalance(false); // Hide game balance when the game ends
    alert(`Game over! Your final balance is ${totalBalance}`);
}

// Copy referral link to clipboard
function copyReferralLink() {
    const tempInput = document.createElement('input');
    tempInput.value = referralLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert(`Referral link copied! Share this with your friends: ${referralLink}`);
}

// Check if a referral is present in the URL and apply the bonus
function checkReferralBonus() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');
    if (referrer) {
        alert(`You were referred by ${referrer}! You and your friend both get 300 points.`);
        totalBalance += 300; // Add 300 points for the new user
        saveUserData(); // Save the new balance
        updateBalance(); // Update balance display
    }
}

// Referral button click handler
document.getElementById('refer-btn').addEventListener('click', copyReferralLink);

// Play button click handler
document.getElementById('play-btn').addEventListener('click', startGame);
