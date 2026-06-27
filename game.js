// Game Data
const levels = [
    {
        id: 1,
        title: "Phone Contract Verification",
        description: "You're trying to verify details of your phone contract with an AI assistant. What information is safe to share?",
        imageClass: "phone",
        items: [
            {
                id: "phone_model",
                label: "Phone Model",
                description: "The model of your phone",
                safe: true,
                explanation: "General device information is safe to share"
            },
            {
                id: "contract_number",
                label: "Contract Number",
                description: "Your personal contract reference number",
                safe: false,
                explanation: "Contract numbers can be used to access your account"
            },
            {
                id: "monthly_payment",
                label: "Monthly Payment Amount",
                description: "How much you pay each month",
                safe: true,
                explanation: "General payment amounts are safe for comparison"
            },
            {
                id: "imei",
                label: "IMEI Number",
                description: "Your phone's unique identifier",
                safe: false,
                explanation: "IMEI can be used to track or block your device"
            },
            {
                id: "data_usage",
                label: "Data Usage",
                description: "Your monthly data consumption",
                safe: true,
                explanation: "Usage statistics are safe to share"
            },
            {
                id: "password",
                label: "Account Password",
                description: "Password for your phone account",
                safe: false,
                explanation: "Never share passwords with anyone"
            }
        ]
    },
    {
        id: 2,
        title: "Medical Advice",
        description: "You're asking an AI for medical advice. What health information should you share?",
        imageClass: "medical",
        items: [
            {
                id: "symptoms",
                label: "General Symptoms",
                description: "Description of how you feel",
                safe: true,
                explanation: "General symptoms are needed for advice"
            },
            {
                id: "medical_history",
                label: "Medical History",
                description: "Your past medical conditions",
                safe: true,
                explanation: "Relevant medical history helps with accurate advice"
            },
            {
                id: "full_name",
                label: "Full Name",
                description: "Your complete legal name",
                safe: false,
                explanation: "Personal identifiers aren't needed for medical advice"
            },
            {
                id: "insurance_number",
                label: "Insurance Number",
                description: "Your health insurance policy number",
                safe: false,
                explanation: "Insurance numbers can be used for fraud"
            },
            {
                id: "age",
                label: "Age",
                description: "Your current age",
                safe: true,
                explanation: "Age is relevant for medical context"
            },
            {
                id: "social_security",
                label: "Social Security Number",
                description: "Your national identification number",
                safe: false,
                explanation: "SSN should never be shared online"
            }
        ]
    },
    {
        id: 3,
        title: "Job Application Help",
        description: "You're getting help from an AI to improve your job application. What should you share?",
        imageClass: "job",
        items: [
            {
                id: "resume_text",
                label: "Resume Content",
                description: "Text from your resume",
                safe: true,
                explanation: "Resume content is needed for improvement suggestions"
            },
            {
                id: "work_experience",
                label: "Work Experience",
                description: "Details of your past jobs",
                safe: true,
                explanation: "Work history is relevant for application help"
            },
            {
                id: "home_address",
                label: "Home Address",
                description: "Your physical home address",
                safe: false,
                explanation: "Home address should not be shared online"
            },
            {
                id: "skills",
                label: "Skills",
                description: "Your professional skills",
                safe: true,
                explanation: "Skills are important for job applications"
            },
            {
                id: "bank_account",
                label: "Bank Account Number",
                description: "Your bank account details",
                safe: false,
                explanation: "Financial information should never be shared"
            },
            {
                id: "education",
                label: "Education History",
                description: "Your educational background",
                safe: true,
                explanation: "Education is relevant for job applications"
            }
        ]
    },
    {
        id: 4,
        title: "Financial Advice",
        description: "You're seeking financial advice from an AI. What financial information can you share?",
        imageClass: "finance",
        items: [
            {
                id: "income_range",
                label: "Income Range",
                description: "Your approximate income bracket",
                safe: true,
                explanation: "General income ranges are safe for advice"
            },
            {
                id: "savings_goals",
                label: "Savings Goals",
                description: "What you're saving for",
                safe: true,
                explanation: "Goals help the AI provide better advice"
            },
            {
                id: "credit_card_number",
                label: "Credit Card Number",
                description: "Your credit card details",
                safe: false,
                explanation: "Credit card numbers should never be shared"
            },
            {
                id: "debt_amount",
                label: "Total Debt",
                description: "How much debt you have",
                safe: true,
                explanation: "General debt amounts are safe for advice"
            },
            {
                id: "cvv",
                label: "CVV Code",
                description: "Security code on your card",
                safe: false,
                explanation: "CVV codes enable fraudulent transactions"
            },
            {
                id: "investment_types",
                label: "Investment Types",
                description: "Types of investments you have",
                safe: true,
                explanation: "Investment types are safe to discuss"
            }
        ]
    },
    {
        id: 5,
        title: "Social Media Post",
        description: "You're asking an AI to help write a social media post. What information should you include?",
        imageClass: "social",
        items: [
            {
                id: "post_content",
                label: "Post Content",
                description: "The text of your post",
                safe: true,
                explanation: "Post content is needed for writing help"
            },
            {
                id: "current_location",
                label: "Current Location",
                description: "Where you are right now",
                safe: false,
                explanation: "Real-time location can compromise your safety"
            },
            {
                id: "vacation_plans",
                label: "Vacation Plans",
                description: "Your upcoming travel plans",
                safe: false,
                explanation: "Sharing vacation plans can make your home a target"
            },
            {
                id: "hobbies",
                label: "Hobbies and Interests",
                description: "What you enjoy doing",
                safe: true,
                explanation: "Hobbies are safe to share publicly"
            },
            {
                id: "birthdate",
                label: "Birthdate",
                description: "Your full date of birth",
                safe: false,
                explanation: "Full birthdate can be used for identity theft"
            },
            {
                id: "achievements",
                label: "Achievements",
                description: "Your recent accomplishments",
                safe: true,
                explanation: "Achievements are great to share publicly"
            }
        ]
    }
];

// Game State
let gameState = {
    currentLevel: 0,
    score: 0,
    selectedItems: [],
    completedLevels: [],
    levelStats: []
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    levelSelect: document.getElementById('level-select-screen'),
    game: document.getElementById('game-screen'),
    feedback: document.getElementById('feedback-screen'),
    levelComplete: document.getElementById('level-complete-screen'),
    gameComplete: document.getElementById('game-complete-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    levelBtns: document.querySelectorAll('.level-btn'),
    backToStart: document.getElementById('back-to-start'),
    currentLevel: document.getElementById('current-level'),
    scoreDisplay: document.getElementById('score-display'),
    progressFill: document.getElementById('progress-fill'),
    scenarioTitle: document.getElementById('scenario-title'),
    scenarioDescription: document.getElementById('scenario-description'),
    scenarioImage: document.getElementById('scenario-image'),
    dataItems: document.getElementById('data-items'),
    submitBtn: document.getElementById('submit-btn'),
    hintBtn: document.getElementById('hint-btn'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackMessage: document.getElementById('feedback-message'),
    feedbackDetails: document.getElementById('feedback-details'),
    continueBtn: document.getElementById('continue-btn'),
    restartLevelBtn: document.getElementById('restart-level-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    levelSelectBtn: document.getElementById('level-select-btn'),
    levelResult: document.getElementById('level-result'),
    correctCount: document.getElementById('correct-count'),
    incorrectCount: document.getElementById('incorrect-count'),
    levelScore: document.getElementById('level-score'),
    playAgainBtn: document.getElementById('play-again-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn'),
    finalScore: document.getElementById('final-score'),
    perfectLevels: document.getElementById('perfect-levels')
};

// Initialize the game
function init() {
    setupEventListeners();
    showScreen('start');
}

// Set up event listeners
function setupEventListeners() {
    // Start button
    elements.startBtn.addEventListener('click', () => {
        showScreen('levelSelect');
    });

    // Back to start
    elements.backToStart.addEventListener('click', () => {
        showScreen('start');
    });

    // Level selection buttons
    elements.levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const levelId = parseInt(btn.dataset.level) - 1;
            startLevel(levelId);
        });
    });

    // Submit button
    elements.submitBtn.addEventListener('click', () => {
        checkAnswers();
    });

    // Continue button
    elements.continueBtn.addEventListener('click', () => {
        showLevelComplete();
    });

    // Restart level button
    elements.restartLevelBtn.addEventListener('click', () => {
        restartCurrentLevel();
    });

    // Next level button
    elements.nextLevelBtn.addEventListener('click', () => {
        goToNextLevel();
    });

    // Level select button
    elements.levelSelectBtn.addEventListener('click', () => {
        showScreen('levelSelect');
    });

    // Play again button
    elements.playAgainBtn.addEventListener('click', () => {
        resetGame();
        showScreen('levelSelect');
    });

    // Main menu button
    elements.mainMenuBtn.addEventListener('click', () => {
        resetGame();
        showScreen('start');
    });

    // Hint button
    elements.hintBtn.addEventListener('click', () => {
        showHint();
    });
}

// Show a specific screen
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// Start a level
function startLevel(levelId) {
    gameState.currentLevel = levelId;
    gameState.selectedItems = [];
    
    const level = levels[levelId];
    
    // Update UI
    elements.currentLevel.textContent = `Level ${level.id}: ${level.title}`;
    elements.scenarioTitle.textContent = level.title;
    elements.scenarioDescription.textContent = level.description;
    elements.scenarioImage.className = `scenario-image ${level.imageClass}`;
    
    // Clear previous items
    elements.dataItems.innerHTML = '';
    
    // Create data items
    level.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'data-item';
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <div class="data-item-label">${item.label}</div>
            <div class="data-item-desc">${item.description}</div>
        `;
        
        itemElement.addEventListener('click', () => {
            toggleItemSelection(itemElement, item.id);
        });
        
        elements.dataItems.appendChild(itemElement);
    });
    
    // Update progress
    updateProgress();
    
    // Disable submit button initially
    elements.submitBtn.disabled = true;
    
    showScreen('game');
}

// Toggle item selection
function toggleItemSelection(element, itemId) {
    const index = gameState.selectedItems.indexOf(itemId);
    
    if (index === -1) {
        // Add to selected
        gameState.selectedItems.push(itemId);
        element.classList.add('selected');
    } else {
        // Remove from selected
        gameState.selectedItems.splice(index, 1);
        element.classList.remove('selected');
    }
    
    // Enable/disable submit button
    elements.submitBtn.disabled = gameState.selectedItems.length === 0;
}

// Check answers
function checkAnswers() {
    const level = levels[gameState.currentLevel];
    let correctCount = 0;
    let incorrectCount = 0;
    const feedbackItems = [];
    
    // Check each item
    level.items.forEach(item => {
        const isSelected = gameState.selectedItems.includes(item.id);
        const isCorrect = isSelected === item.safe;
        
        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }
        
        // Store feedback
        feedbackItems.push({
            id: item.id,
            label: item.label,
            isCorrect: isCorrect,
            isSafe: item.safe,
            explanation: item.explanation
        });
    });
    
    // Calculate score for this level
    const levelScore = Math.round((correctCount / level.items.length) * 100);
    
    // Update game state
    gameState.score += levelScore;
    gameState.completedLevels.push(gameState.currentLevel);
    gameState.levelStats.push({
        levelId: gameState.currentLevel,
        correct: correctCount,
        incorrect: incorrectCount,
        score: levelScore
    });
    
    // Update score display
    elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
    
    // Show feedback
    showFeedback(correctCount, incorrectCount, levelScore, feedbackItems);
}

// Show feedback
function showFeedback(correctCount, incorrectCount, levelScore, feedbackItems) {
    const level = levels[gameState.currentLevel];
    
    // Set feedback title based on performance
    let title = '';
    let message = '';
    
    if (levelScore === 100) {
        title = 'Perfect! 🎉';
        message = 'You selected all the correct data to share!';
    } else if (levelScore >= 75) {
        title = 'Great Job! 👍';
        message = 'You did well, but there are a few things to learn.';
    } else if (levelScore >= 50) {
        title = 'Good Effort! 🤔';
        message = 'You have some correct answers, but review the feedback below.';
    } else {
        title = 'Keep Learning! 📚';
        message = 'Review the feedback to understand what data is safe to share.';
    }
    
    elements.feedbackTitle.textContent = title;
    elements.feedbackMessage.textContent = message;
    
    // Build feedback details
    let feedbackHtml = '<h3>Your Selections:</h3>';
    
    feedbackItems.forEach(item => {
        const status = item.isCorrect ? 'correct' : 'incorrect';
        const action = item.isSafe ? 'share' : 'NOT share';
        
        feedbackHtml += `
            <div class="feedback-item ${status}">
                <strong>${item.label}</strong>: You should ${action} this data.
                <br><small>${item.explanation}</small>
            </div>
        `;
    });
    
    elements.feedbackDetails.innerHTML = feedbackHtml;
    
    showScreen('feedback');
}

// Show level complete screen
function showLevelComplete() {
    const currentLevelStat = gameState.levelStats[gameState.levelStats.length - 1];
    
    elements.levelResult.textContent = getLevelResultMessage(currentLevelStat.score);
    elements.correctCount.textContent = currentLevelStat.correct;
    elements.incorrectCount.textContent = currentLevelStat.incorrect;
    elements.levelScore.textContent = currentLevelStat.score;
    
    // Check if all levels are completed
    if (gameState.completedLevels.length === levels.length) {
        showGameComplete();
    } else {
        showScreen('levelComplete');
    }
}

// Get level result message
function getLevelResultMessage(score) {
    if (score === 100) return 'Perfect! You got all answers correct!';
    if (score >= 75) return 'Great job! You understand most of the concepts.';
    if (score >= 50) return 'Good effort! Review the feedback to improve.';
    return 'Keep practicing! You\'ll get better with more experience.';
}

// Restart current level
function restartCurrentLevel() {
    startLevel(gameState.currentLevel);
}

// Go to next level
function goToNextLevel() {
    const nextLevel = gameState.currentLevel + 1;
    if (nextLevel < levels.length) {
        startLevel(nextLevel);
    } else {
        showScreen('levelSelect');
    }
}

// Show game complete screen
function showGameComplete() {
    // Calculate final stats
    const totalScore = gameState.score;
    const perfectLevelsCount = gameState.levelStats.filter(stat => stat.score === 100).length;
    
    elements.finalScore.textContent = totalScore;
    elements.perfectLevels.textContent = perfectLevelsCount;
    
    showScreen('gameComplete');
}

// Update progress bar
function updateProgress() {
    const progress = ((gameState.completedLevels.length + 1) / levels.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

// Show hint
function showHint() {
    const level = levels[gameState.currentLevel];
    const safeItems = level.items.filter(item => item.safe);
    const unsafeItems = level.items.filter(item => !item.safe);
    
    const hintMessage = `Hint: In this scenario, you should share ${safeItems.length} items and NOT share ${unsafeItems.length} items.`;
    
    alert(hintMessage);
}

// Reset game
function resetGame() {
    gameState = {
        currentLevel: 0,
        score: 0,
        selectedItems: [],
        completedLevels: [],
        levelStats: []
    };
    
    elements.scoreDisplay.textContent = 'Score: 0';
    elements.progressFill.style.width = '0%';
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', init);
