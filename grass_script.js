// Game state
let gameState = {
    grass: 0,
    perClick: 1,
    perSecond: 0,
    level: 1,
    xp: 0,
    nextLevel: 100,
    prestigeBoost: 0,
    clickCount: 0,
    totalGrass: 0,
    floatingElements: 0,
    dmUnlocked: false,
    activeCharacters: [],
    dmResponses: 0,
    upgrades: {
        scissors: { 
            owned: 0, 
            cost: 15, 
            perClick: 2, 
            emoji: '✂️', 
            name: 'rusty scissors',
            description: 'snip snip the grass',
            unlockRequirement: 0
        },
        nerd: { 
            owned: 0, 
            cost: 300, 
            perSecond: 50, 
            emoji: '🤓', 
            name: 'grass nerd',
            description: 'actually the optimal grass cutting technique is...',
            unlockRequirement: 100
        },
        gamer: { 
            owned: 0, 
            cost: 1200, 
            perSecond: 150, 
            emoji: '🎮', 
            name: 'grass gamer',
            description: 'grinding grass xp irl',
            unlockRequirement: 500
        },
        boomer: { 
            owned: 0, 
            cost: 5000, 
            perSecond: 500, 
            emoji: '👴', 
            name: 'lawn boomer',
            description: 'back in my day we cut grass uphill both ways',
            unlockRequirement: 2000
        },
        zoomer: { 
            owned: 0, 
            cost: 12000, 
            perSecond: 1200, 
            emoji: '💅', 
            name: 'grass zoomer',
            description: 'this grass is so aesthetic no cap fr fr',
            unlockRequirement: 8000
        },
        robot: { 
            owned: 0, 
            cost: 25000, 
            perSecond: 3000, 
            emoji: '🤖', 
            name: 'grass bot',
            description: 'beep boop cutting grass',
            unlockRequirement: 15000
        },
        alien: { 
            owned: 0, 
            cost: 100000, 
            perSecond: 10000, 
            emoji: '👽', 
            name: 'grass alien',
            description: 'we don\'t have grass on my planet',
            unlockRequirement: 50000
        },
        dm: { 
            owned: 0, 
            cost: 2000, 
            perSecond: 0, 
            emoji: '💬', 
            name: 'dm upgrade',
            description: 'unlock random dms from weird people',
            unlockRequirement: 1000,
            special: 'dm'
        },
        mower: { 
            owned: 0, 
            cost: 500, 
            perClick: 10, 
            emoji: '🔪', 
            name: 'lawn mower',
            description: 'it\'s actually just a knife',
            unlockRequirement: 200
        },
        fertilizer: { 
            owned: 0, 
            cost: 3000, 
            perClick: 50, 
            emoji: '💩', 
            name: 'fertilizer',
            description: 'makes the grass grow faster... somehow',
            unlockRequirement: 1500
        },
        raincloud: { 
            owned: 0, 
            cost: 8000, 
            perSecond: 800, 
            emoji: '☁️', 
            name: 'rain cloud',
            description: 'it follows you around and waters the grass',
            unlockRequirement: 5000
        },
        grassGod: { 
            owned: 0, 
            cost: 500000, 
            perSecond: 50000, 
            emoji: '🧙‍♂️', 
            name: 'grass god',
            description: 'the ultimate grass being',
            unlockRequirement: 200000
        }
    },
    achievements: [
        { id: 'first-touch', name: 'first touch', emoji: '👆', description: 'click the grass for the first time', unlocked: false, reward: 10, requirement: () => gameState.clickCount >= 1 },
        { id: 'grass-enjoyer', name: 'grass enjoyer', emoji: '😎', description: 'reach 100 grass', unlocked: false, reward: 50, requirement: () => gameState.totalGrass >= 100 },
        { id: 'grass-addict', name: 'grass addict', emoji: '🤤', description: 'reach 1,000 grass', unlocked: false, reward: 200, requirement: () => gameState.totalGrass >= 1000 },
        { id: 'grass-overlord', name: 'grass overlord', emoji: '👑', description: 'reach 10,000 grass', unlocked: false, reward: 500, requirement: () => gameState.totalGrass >= 10000 },
        { id: 'grass-tycoon', name: 'grass tycoon', emoji: '💰', description: 'reach 100,000 grass', unlocked: false, reward: 2000, requirement: () => gameState.totalGrass >= 100000 },
        { id: 'grass-billionaire', name: 'grass billionaire', emoji: '💸', description: 'reach 1,000,000 grass', unlocked: false, reward: 10000, requirement: () => gameState.totalGrass >= 1000000 },
        { id: 'click-machine', name: 'click machine', emoji: '🖱️', description: 'click 100 times', unlocked: false, reward: 100, requirement: () => gameState.clickCount >= 100 },
        { id: 'click-addict', name: 'click addict', emoji: '👇', description: 'click 1,000 times', unlocked: false, reward: 500, requirement: () => gameState.clickCount >= 1000 },
        { id: 'upgrade-collector', name: 'upgrade collector', emoji: '🛒', description: 'own at least one of each basic upgrade', unlocked: false, reward: 300, requirement: () => 
            ['scissors', 'nerd', 'gamer', 'boomer'].every(upgrade => gameState.upgrades[upgrade].owned > 0) },
        { id: 'upgrade-hoarder', name: 'upgrade hoarder', emoji: '🏪', description: 'own at least one of each upgrade', unlocked: false, reward: 1000, requirement: () => 
            Object.values(gameState.upgrades).every(upgrade => upgrade.owned > 0) },
        { id: 'level-up', name: 'level up', emoji: '⬆️', description: 'reach level 5', unlocked: false, reward: 250, requirement: () => gameState.level >= 5 },
        { id: 'level-master', name: 'level master', emoji: '🔝', description: 'reach level 20', unlocked: false, reward: 1000, requirement: () => gameState.level >= 20 },
        { id: 'prestige-master', name: 'prestige master', emoji: '🌟', description: 'prestige for the first time', unlocked: false, reward: 500, requirement: () => gameState.prestigeBoost > 0 },
        { id: 'prestige-addict', name: 'prestige addict', emoji: '✨', description: 'prestige 5 times', unlocked: false, reward: 2000, requirement: () => gameState.prestigeBoost >= 50 },
        { id: 'dm-responder', name: 'dm responder', emoji: '📱', description: 'respond to 5 dms', unlocked: false, reward: 500, requirement: () => gameState.dmResponses >= 5 }
    ],
    dmMessages: [
        {
            sender: 'FREEMONEY1999',
            avatar: '🤑',
            message: 'hey do u want free grass? just click here',
            options: [
                { text: 'yes pls', result: 'scammed', grassEffect: -500, message: 'oops u got scammed lol -500 grass' },
                { text: 'no thx', result: 'smart', grassEffect: 100, message: 'smart choice +100 grass for being cautious' },
                { text: 'report', result: 'reported', grassEffect: 50, message: 'user reported +50 grass' }
            ]
        },
        {
            sender: 'GrassGuru42',
            avatar: '🧙‍♂️',
            message: 'i know ancient grass cutting secrets want to learn?',
            options: [
                { text: 'teach me', result: 'learned', grassEffect: 300, message: 'you learned ancient techniques +300 grass' },
                { text: 'sounds fake', result: 'missed', grassEffect: 0, message: 'the guru disappears in a puff of grass clippings' },
                { text: 'how much?', result: 'paid', grassEffect: -200, message: 'you paid 200 grass for knowledge that was actually on grassipedia for free' }
            ]
        },
        {
            sender: 'NotABot3000',
            avatar: '🤖',
            message: 'HELLO FELLOW HUMAN I ALSO ENJOY CUTTING GRASS.EXE',
            options: [
                { text: 'u seem sus', result: 'detected', grassEffect: 150, message: 'bot detection successful +150 grass' },
                { text: 'hello robot', result: 'friends', grassEffect: 250, message: 'you made a robot friend +250 grass' },
                { text: 'beep boop', result: 'confusion', grassEffect: 50, message: 'you confused the bot +50 grass' }
            ]
        },
        {
            sender: 'GrassHater666',
            avatar: '😈',
            message: 'grass is overrated concrete is better',
            options: [
                { text: 'how dare u', result: 'defended', grassEffect: 100, message: 'you defended grass honor +100 grass' },
                { text: 'blocked', result: 'blocked', grassEffect: 50, message: 'grass hater blocked +50 grass' },
                { text: 'convert them', result: 'converted', grassEffect: 500, message: 'you converted a grass hater to grass lover +500 grass' }
            ]
        },
        {
            sender: 'NiceGuy4U',
            avatar: '🎩',
            message: 'i always treat grass with respect unlike other guys',
            options: [
                { text: 'ok...', result: 'awkward', grassEffect: 0, message: 'awkward silence ensues' },
                { text: 'weird flex', result: 'offended', grassEffect: -50, message: 'they got offended -50 grass' },
                { text: 'cool story', result: 'rant', grassEffect: -100, message: 'they went on a long rant about grass respect -100 grass for your time wasted' }
            ]
        },
        {
            sender: 'GrassCEO',
            avatar: '👔',
            message: 'would you like to invest in my grass startup?',
            options: [
                { text: 'invest big', result: 'profit', grassEffect: 1000, message: 'your investment paid off +1000 grass' },
                { text: 'invest small', result: 'modest', grassEffect: 200, message: 'modest returns on your investment +200 grass' },
                { text: 'no thanks', result: 'missed', grassEffect: -300, message: 'you missed out on the next big grass thing -300 grass of potential earnings' }
            ]
        },
        {
            sender: 'GrassScientist',
            avatar: '🔬',
            message: 'i discovered a new grass species want to name it?',
            options: [
                { text: 'name after me', result: 'fame', grassEffect: 400, message: 'you now have a grass species named after you +400 grass' },
                { text: 'grassy mcgrassface', result: 'meme', grassEffect: 500, message: 'your meme name was accepted +500 grass for the lolz' },
                { text: 'decline', result: 'missed', grassEffect: 0, message: 'opportunity missed' }
            ]
        },
        {
            sender: 'GrassInfluencer',
            avatar: '📱',
            message: 'can i feature your grass on my page? i have 10 followers',
            options: [
                { text: 'yes', result: 'famous', grassEffect: 50, message: 'your grass got 3 likes +50 grass' },
                { text: 'pay me', result: 'paid', grassEffect: 100, message: 'they paid you for content +100 grass' },
                { text: 'no', result: 'missed', grassEffect: -10, message: 'they left a bad review -10 grass reputation damage' }
            ]
        }
    ]
};

// Funny slang phrases
const slangPhrases = [
    "touch grass simulator",
    "grass go brrrr",
    "grass is life fr fr",
    "no cap just grass",
    "grass be bussin",
    "sheeeesh that grass tho",
    "grass goals",
    "vibin with the grass",
    "grass is the new flex",
    "grass supremacy",
    "grass > everything",
    "grass do be lookin fresh",
    "grass gang rise up",
    "grass is my personality",
    "grass makes me pog",
    "grass is the goat",
    "grass hits different",
    "grass is my aesthetic",
    "grass is my love language",
    "grass is my therapy",
    "grass is my religion",
    "grass is my passion",
    "grass is my purpose",
    "grass is my identity",
    "grass is my vibe",
    "grass is my energy",
    "grass is my mood",
    "grass is my spirit animal",
    "grass is my soulmate",
    "grass is my bestie"
];

// Floating element emojis
const floatingEmojis = [
    "🌿", "🌱", "🍃", "🌴", "🌵", "🌲", "🌳", "🌾", "🌷", "🌻", "🌼", "🌺", "🌸", "🌹", "🍀", "🍁", "🍂", "🍄", "🌰", "🌱"
];

// DOM elements
const grassCountElement = document.getElementById('grass-count');
const perClickElement = document.getElementById('per-click');
const perSecondElement = document.getElementById('per-second');
const levelElement = document.getElementById('level');
const xpElement = document.getElementById('xp');
const nextLevelElement = document.getElementById('next-level');
const xpProgressElement = document.getElementById('xp-progress');
const grassClicker = document.getElementById('grass-clicker');
const clickTextElement = document.getElementById('click-text');
const slangTextElement = document.getElementById('slang-text');
const achievementsContainer = document.getElementById('achievements-container');
const prestigeBoostElement = document.getElementById('prestige-boost');
const notificationArea = document.getElementById('notification-area');
const floatingElementsContainer = document.getElementById('floating-elements-container');
const characterContainer = document.getElementById('character-container');
const shopItemsContainer = document.getElementById('shop-items');

// Initialize the game
function initGame() {
    // Load saved game if exists
    loadGame();
    
    // Initialize shop items
    initializeShop();
    
    // Update UI
    updateUI();
    
    // Start the automatic grass generation
    setInterval(generateGrassPerSecond, 1000);
    
    // Check achievements every second
    setInterval(checkAchievements, 1000);
    
    // Change slang phrase every 8 seconds
    setInterval(changeSlangPhrase, 8000);
    changeSlangPhrase(); // Initial phrase
    
    // Add random floating elements periodically
    setInterval(addRandomFloatingElement, 5000);
    
    // Move characters around
    setInterval(moveCharacters, 50);
    
    // Check for random DM if unlocked
    setInterval(checkForRandomDM, 60000); // Check every minute
    
    // Check for new unlockable upgrades
    setInterval(checkForUnlockableUpgrades, 2000);
}

// Initialize shop with available upgrades
function initializeShop() {
    // Clear existing shop items
    shopItemsContainer.innerHTML = '';
    
    // Add available upgrades
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            addUpgradeToShop(id, upgrade);
        }
    }
}

// Add upgrade to shop
function addUpgradeToShop(id, upgrade) {
    const shopItem = document.createElement('div');
    shopItem.className = 'shop-item';
    shopItem.id = `shop-item-${id}`;
    shopItem.onclick = () => buyUpgrade(id);
    
    shopItem.innerHTML = `
        <div class="item-emoji">${upgrade.emoji}</div>
        <div class="item-info">
            <div class="item-name">${upgrade.name}</div>
            <div class="item-effect">${upgrade.description}</div>
            <div class="item-cost"><span id="${id}-cost">${upgrade.cost}</span> grass</div>
            <div class="item-owned">owned: <span id="${id}-owned">${upgrade.owned}</span></div>
        </div>
    `;
    
    // Add to shop
    shopItemsContainer.appendChild(shopItem);
}

// Click the grass
grassClicker.addEventListener('click', () => {
    // Add grass based on per click value
    addGrass(gameState.perClick);
    
    // Increment click count
    gameState.clickCount++;
    
    // Show click effect
    showClickEffect();
    
    // Add XP
    gameState.xp += 1;
    checkLevelUp();
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
    
    // Randomly add floating element
    if (Math.random() < 0.2) {
        addRandomFloatingElement();
    }
    
    // Make grass emoji bounce
    bounceGrassEmoji();
});

// Add grass to the counter
function addGrass(amount) {
    gameState.grass += amount;
    gameState.totalGrass += amount;
}

// Generate grass per second
function generateGrassPerSecond() {
    if (gameState.perSecond > 0) {
        addGrass(gameState.perSecond);
        gameState.xp += 0.2;
        checkLevelUp();
        updateUI();
        saveGame();
    }
}

// Show click effect
function showClickEffect() {
    // Random position around the grass clicker
    const x = Math.random() * 150 - 50;
    const y = Math.random() * 150 - 100;
    
    // Set position and content
    clickTextElement.style.left = `${x}px`;
    clickTextElement.style.top = `${y}px`;
    clickTextElement.textContent = `+${gameState.perClick}`;
    
    // Show and animate
    clickTextElement.style.opacity = '1';
    clickTextElement.style.transform = 'translateY(-20px)';
    
    // Hide after animation
    setTimeout(() => {
        clickTextElement.style.opacity = '0';
        clickTextElement.style.transform = 'translateY(0)';
    }, 500);
}

// Bounce grass emoji
function bounceGrassEmoji() {
    const grassEmoji = document.querySelector('.grass-emoji');
    grassEmoji.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        grassEmoji.style.transform = 'scale(1)';
    }, 200);
}

// Buy upgrade
function buyUpgrade(type) {
    const upgrade = gameState.upgrades[type];
    
    if (gameState.grass >= upgrade.cost) {
        // Deduct cost
        gameState.grass -= upgrade.cost;
        
        // Increase owned count
        upgrade.owned++;
        
        // Increase cost for next purchase (30% increase)
        upgrade.cost = Math.floor(upgrade.cost * 1.3);
        
        // Handle special upgrades
        if (upgrade.special === 'dm') {
            gameState.dmUnlocked = true;
            showNotification('dm system unlocked', 'you will now receive random dms from weird people');
            
            // Show first DM immediately
            setTimeout(showRandomDM, 3000);
        }
        
        // Update per click or per second values
        if (upgrade.perClick) {
            gameState.perClick += upgrade.perClick * (1 + gameState.prestigeBoost / 100);
        }
        
        if (upgrade.perSecond) {
            gameState.perSecond += upgrade.perSecond * (1 + gameState.prestigeBoost / 100);
        }
        
        // Update UI
        updateUI();
        
        // Save game
        saveGame();
        
        // Show notification
        let notificationText = `you got a ${upgrade.name}!`;
        if (upgrade.perClick) {
            notificationText += ` +${upgrade.perClick} per click`;
        } else if (upgrade.perSecond) {
            notificationText += ` +${upgrade.perSecond} per second`;
        }
        
        showNotification(`upgrade purchased`, notificationText);
        
        // Add floating element
        addFloatingElement(type);
        
        // Add character to screen (except for special upgrades)
        if (!upgrade.special) {
            addCharacter(type);
        }
        
        // For each 5 of the same upgrade, add another character
        if (upgrade.owned % 5 === 0 && upgrade.owned > 1) {
            addCharacter(type);
            showNotification('bonus character', `extra ${upgrade.name} added for owning ${upgrade.owned}`);
        }
    } else {
        // Show notification for not enough grass
        showNotification(`can't afford`, `you need ${upgrade.cost - gameState.grass} more grass`);
    }
}

// Check if player can level up
function checkLevelUp() {
    if (gameState.xp >= gameState.nextLevel) {
        const oldLevel = gameState.level;
        gameState.level++;
        gameState.xp = 0;
        gameState.nextLevel = Math.floor(gameState.nextLevel * 1.5);
        
        // Bonus for leveling up
        gameState.perClick += 1;
        
        // Show notification
        showNotification(`level up`, `you're now level ${gameState.level}! +1 grass per click`);
        
        // Add floating elements based on level difference
        for (let i = 0; i < gameState.level - oldLevel; i++) {
            addFloatingElement('level');
        }
    }
    
    // Update XP progress bar
    const progressPercent = (gameState.xp / gameState.nextLevel) * 100;
    xpProgressElement.style.width = `${progressPercent}%`;
}

// Prestige function
function prestige() {
    if (gameState.grass >= 10000) {
        if (confirm("do you want to reset everything but get a permanent 10% boost to all grass production?")) {
            // Calculate new prestige boost
            gameState.prestigeBoost += 10;
            
            // Reset game but keep prestige boost
            gameState.grass = 0;
            gameState.perClick = 1 * (1 + gameState.prestigeBoost / 100);
            gameState.perSecond = 0;
            gameState.level = 1;
            gameState.xp = 0;
            gameState.nextLevel = 100;
            
            // Reset upgrades
            for (const upgrade in gameState.upgrades) {
                gameState.upgrades[upgrade].owned = 0;
                // Reset costs to base values
                const baseValue = {
                    scissors: 15,
                    nerd: 300,
                    gamer: 1200,
                    boomer: 5000,
                    zoomer: 12000,
                    robot: 25000,
                    alien: 100000,
                    dm: 2000,
                    mower: 500,
                    fertilizer: 3000,
                    raincloud: 8000,
                    grassGod: 500000
                };
                gameState.upgrades[upgrade].cost = baseValue[upgrade] || gameState.upgrades[upgrade].cost / 1.3;
            }
            
            // Remove all characters
            characterContainer.innerHTML = '';
            gameState.activeCharacters = [];
            
            // Keep DM system unlocked if it was unlocked
            // (don't reset dmUnlocked)
            
            // Reinitialize shop
            initializeShop();
            
            // Update UI
            updateUI();
            
            // Save game
            saveGame();
            
            // Show notification
            showNotification(`prestige complete`, `you now have a ${gameState.prestigeBoost}% permanent boost!`);
            
            // Add lots of floating elements
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    addFloatingElement('prestige');
                }, i * 100);
            }
        }
    } else {
        // Show notification
        showNotification(`can't prestige yet`, `you need 10,000 grass first`);
    }
}

// Check achievements
function checkAchievements() {
    let newAchievements = false;
    
    gameState.achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.requirement()) {
            achievement.unlocked = true;
            newAchievements = true;
            
            // Add to achievement container
            addAchievementToUI(achievement);
            
            // Bonus for achievement
            gameState.grass += achievement.reward;
            
            // Show notification
            showNotification(`achievement unlocked`, `${achievement.name}: +${achievement.reward} grass`);
            
            // Add floating element
            addFloatingElement('achievement');
        }
    });
    
    if (newAchievements) {
        saveGame();
    }
}

// Add achievement to UI
function addAchievementToUI(achievement) {
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    achievementElement.innerHTML = `
        <div class="achievement-title">
            <span class="achievement-emoji">${achievement.emoji}</span>
            ${achievement.name}
        </div>
        <div class="achievement-desc">${achievement.description}</div>
        <div class="achievement-reward">+${achievement.reward} grass</div>
    `;
    achievementsContainer.appendChild(achievementElement);
}

// Change slang phrase
function changeSlangPhrase() {
    const randomIndex = Math.floor(Math.random() * slangPhrases.length);
    slangTextElement.textContent = slangPhrases[randomIndex];
    
    // Random rotation
    const randomRotation = Math.random() * 6 - 3;
    slangTextElement.style.transform = `rotate(${randomRotation}deg)`;
}

// Show notification
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;
    notificationArea.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add random floating element
function addRandomFloatingElement() {
    addFloatingElement('random');
}

// Add floating element
function addFloatingElement(type) {
    // Limit the number of floating elements
    if (document.querySelectorAll('.floating-element').length >= 100) {
        return;
    }
    
    const element = document.createElement('div');
    element.className = 'floating-element';
    
    // Set content based on type
    switch(type) {
        case 'scissors':
            element.textContent = '✂️';
            break;
        case 'nerd':
            element.textContent = '🤓';
            break;
        case 'gamer':
            element.textContent = '🎮';
            break;
        case 'boomer':
            element.textContent = '👴';
            break;
        case 'zoomer':
            element.textContent = '💅';
            break;
        case 'robot':
            element.textContent = '🤖';
            break;
        case 'alien':
            element.textContent = '👽';
            break;
        case 'dm':
            element.textContent = '💬';
            break;
        case 'mower':
            element.textContent = '🔪';
            break;
        case 'fertilizer':
            element.textContent = '💩';
            break;
        case 'raincloud':
            element.textContent = '☁️';
            break;
        case 'grassGod':
            element.textContent = '🧙‍♂️';
            break;
        case 'level':
            element.textContent = '⬆️';
            break;
        case 'achievement':
            element.textContent = '🏆';
            break;
        case 'prestige':
            element.textContent = '🌟';
            break;
        case 'random':
        default:
            element.textContent = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
    }
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    element.style.left = `${startX}px`;
    element.style.top = `${startY}px`;
    
    // Random end position
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;
    element.style.setProperty('--float-x', `${endX}px`);
    element.style.setProperty('--float-y', `${endY}px`);
    
    // Random rotation
    const rotation = Math.random() * 720 - 360;
    element.style.setProperty('--float-rotate', `${rotation}deg`);
    
    // Random duration
    const duration = 10 + Math.random() * 20;
    element.style.animationDuration = `${duration}s`;
    
    // Add to container
    floatingElementsContainer.appendChild(element);
    
    // Remove after animation completes
    setTimeout(() => {
        if (element.parentNode) {
            element.remove();
        }
    }, duration * 1000);
}

// Add character
function addCharacter(type) {
    const upgrade = gameState.upgrades[type];
    
    // Create character element
    const character = document.createElement('div');
    character.className = 'character';
    character.dataset.type = type;
    character.style.setProperty('--index', Math.floor(Math.random() * 10));
    
    // Set character appearance
    character.innerHTML = `
        <div class="character-emoji">${upgrade.emoji}</div>
        <div class="character-speech-bubble"></div>
    `;
    
    // Random starting position
    const startX = Math.random() * (window.innerWidth - 100);
    const startY = Math.random() * (window.innerHeight - 100);
    character.style.left = `${startX}px`;
    character.style.top = `${startY}px`;
    
    // Random movement values
    character.dataset.speedX = (Math.random() * 6 - 3).toFixed(2);
    character.dataset.speedY = (Math.random() * 6 - 3).toFixed(2);
    character.dataset.lastSpeech = '0';
    
    // Add to container
    characterContainer.appendChild(character);
    
    // Add to active characters array
    gameState.activeCharacters.push({
        element: character,
        type: type,
        lastSpeech: 0
    });
    
    // Make character clickable for bonus
    character.addEventListener('click', () => {
        // Give bonus based on character type
        let bonus = 0;
        if (upgrade.perClick) {
            bonus = upgrade.perClick * 5;
        } else if (upgrade.perSecond) {
            bonus = upgrade.perSecond;
        } else {
            bonus = 50;
        }
        
        // Add bonus
        addGrass(bonus);
        
        // Show speech bubble
        showCharacterSpeech(character, `+${bonus} grass!`);
        
        // Update UI
        updateUI();
        
        // Save game
        saveGame();
    });
}

// Move characters around the screen
function moveCharacters() {
    const characters = document.querySelectorAll('.character');
    
    characters.forEach(character => {
        // Get current position
        let x = parseFloat(character.style.left);
        let y = parseFloat(character.style.top);
        
        // Get speed
        const speedX = parseFloat(character.dataset.speedX);
        const speedY = parseFloat(character.dataset.speedY);
        
        // Update position
        x += speedX;
        y += speedY;
        
        // Check boundaries and reverse direction if needed
        if (x <= 0 || x >= window.innerWidth - 80) {
            character.dataset.speedX = (-speedX).toFixed(2);
            // Maybe say something when bouncing off walls
            if (Math.random() < 0.1) {
                showCharacterSpeech(character, getRandomSpeechForType(character.dataset.type));
            }
        }
        
        if (y <= 0 || y >= window.innerHeight - 80) {
            character.dataset.speedY = (-speedY).toFixed(2);
            // Maybe say something when bouncing off walls
            if (Math.random() < 0.1) {
                showCharacterSpeech(character, getRandomSpeechForType(character.dataset.type));
            }
        }
        
        // Apply new position
        character.style.left = `${x}px`;
        character.style.top = `${y}px`;
        
        // Random chance to say something
        const now = Date.now();
        const lastSpeech = parseInt(character.dataset.lastSpeech) || 0;
        if (now - lastSpeech > 10000 && Math.random() < 0.005) {
            showCharacterSpeech(character, getRandomSpeechForType(character.dataset.type));
            character.dataset.lastSpeech = now;
        }
    });
}

// Show character speech bubble
function showCharacterSpeech(character, text) {
    const speechBubble = character.querySelector('.character-speech-bubble');
    speechBubble.textContent = text;
    speechBubble.style.display = 'block';
    
    // Hide after a few seconds
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, 3000);
}

// Get random speech for character type
function getRandomSpeechForType(type) {
    const speeches = {
        scissors: ["snip snip", "cutting edge tech", "i'm sharp", "cut it out"],
        nerd: ["actually...", "well technically", "interesting fact", "did you know?", "according to my calculations"],
        gamer: ["gg ez", "poggers", "grass diff", "touch grass", "grass gaming"],
        boomer: ["back in my day", "kids these days", "when i was young", "get off my lawn", "in this economy?"],
        zoomer: ["no cap fr fr", "bussin", "sheesh", "vibing with the grass", "it's giving grass"],
        robot: ["beep boop", "grass.exe", "calculating optimal grass", "01100111 01110010 01100001 01110011 01110011"],
        alien: ["take me to your grass", "earth grass superior", "probing the lawn", "grass technology primitive"],
        mower: ["slice", "dice", "cut cut cut", "sharp and ready"],
        fertilizer: ["stinky but effective", "nutrients!", "grow grow grow", "smelly good"],
        raincloud: ["drip drop", "watering time", "moisture is the essence of wetness"],
        grassGod: ["bow to me", "i am the grass", "unlimited power", "grass is my domain"]
    };
    
    // Default speeches if type not found
    const defaultSpeeches = ["grass!", "more grass!", "click me!", "grass is life", "grass power!"];
    
    // Get speeches for this type or use default
    const typeSpeeches = speeches[type] || defaultSpeeches;
    
    // Return random speech
    return typeSpeeches[Math.floor(Math.random() * typeSpeeches.length)];
}

// Check for unlockable upgrades
function checkForUnlockableUpgrades() {
    // Check each upgrade
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        // Skip if already has an element in the shop
        if (document.getElementById(`shop-item-${id}`)) continue;
        
        // Check if should be unlocked
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            // Add to shop
            addUpgradeToShop(id, upgrade);
            
            // Show notification
            showNotification('new upgrade unlocked', `${upgrade.name} is now available!`);
        }
    }
}

// Show a DM from a random person
function showRandomDM() {
    if (!gameState.dmUnlocked) return;
    
    // Get random DM
    const randomDM = gameState.dmMessages[Math.floor(Math.random() * gameState.dmMessages.length)];
    
    // Create DM element
    const dmElement = document.createElement('div');
    dmElement.className = 'dm-popup';
    
    dmElement.innerHTML = `
        <div class="dm-header">
            <div class="dm-avatar">${randomDM.avatar}</div>
            <div class="dm-sender">${randomDM.sender}</div>
            <div class="dm-close" onclick="this.parentElement.parentElement.remove()">×</div>
        </div>
        <div class="dm-message">${randomDM.message}</div>
        <div class="dm-options">
            ${randomDM.options.map((option, index) => 
                `<button class="dm-option" onclick="respondToDM(${index}, this.parentElement.parentElement)">${option.text}</button>`
            ).join('')}
        </div>
    `;
    
    // Store the DM data in the element
    dmElement.dataset.dmData = JSON.stringify(randomDM);
    
    // Add to document
    document.body.appendChild(dmElement);
    
    // Position randomly on screen
    const x = 50 + Math.random() * (window.innerWidth - 400);
    const y = 50 + Math.random() * (window.innerHeight - 300);
    dmElement.style.left = `${x}px`;
    dmElement.style.top = `${y}px`;
    
    // Make draggable
    makeDraggable(dmElement);
}

// Make an element draggable
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // Get the header to use as drag handle
    const header = element.querySelector('.dm-header');
    
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get mouse position at start
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate new position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Respond to a DM
function respondToDM(optionIndex, dmElement) {
    // Get DM data
    const dmData = JSON.parse(dmElement.dataset.dmData);
    const option = dmData.options[optionIndex];
    
    // Apply effect
    addGrass(option.grassEffect);
    
    // Update response count
    gameState.dmResponses = (gameState.dmResponses || 0) + 1;
    
    // Show result
    const resultElement = document.createElement('div');
    resultElement.className = 'dm-result';
    resultElement.textContent = option.message;
    
    // Replace options with result
    const optionsDiv = dmElement.querySelector('.dm-options');
    optionsDiv.innerHTML = '';
    optionsDiv.appendChild(resultElement);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'dm-close-button';
    closeButton.textContent = 'close';
    closeButton.onclick = () => dmElement.remove();
    optionsDiv.appendChild(closeButton);
    
    // Show notification
    showNotification('dm response', option.message);
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
}

// Check for random DM
function checkForRandomDM() {
    if (gameState.dmUnlocked && Math.random() < 0.3) {
        showRandomDM();
    }
}

// Update UI
function updateUI() {
    // Update stats
    grassCountElement.textContent = Math.floor(gameState.grass);
    grassCountElement.dataset.value = Math.floor(gameState.grass);
    
    perClickElement.textContent = gameState.perClick.toFixed(1);
    perClickElement.dataset.value = gameState.perClick.toFixed(1);
    
    perSecondElement.textContent = gameState.perSecond.toFixed(1);
    perSecondElement.dataset.value = gameState.perSecond.toFixed(1);
    
    levelElement.textContent = gameState.level;
    levelElement.dataset.value = gameState.level;
    
    xpElement.textContent = Math.floor(gameState.xp);
    xpElement.dataset.value = Math.floor(gameState.xp);
    
    nextLevelElement.textContent = gameState.nextLevel;
    nextLevelElement.dataset.value = gameState.nextLevel;
    
    prestigeBoostElement.textContent = gameState.prestigeBoost;
    prestigeBoostElement.dataset.value = gameState.prestigeBoost;
    
    // Update XP progress bar
    const progressPercent = (gameState.xp / gameState.nextLevel) * 100;
    xpProgressElement.style.width = `${progressPercent}%`;
    
    // Update upgrade costs and owned counts
    for (const upgrade in gameState.upgrades) {
        const costElement = document.getElementById(`${upgrade}-cost`);
        const ownedElement = document.getElementById(`${upgrade}-owned`);
        
        if (costElement) {
            costElement.textContent = gameState.upgrades[upgrade].cost;
            costElement.dataset.value = gameState.upgrades[upgrade].cost;
        }
        
        if (ownedElement) {
            ownedElement.textContent = gameState.upgrades[upgrade].owned;
            ownedElement.dataset.value = gameState.upgrades[upgrade].owned;
        }
    }
    
    // Update chaos level based on game progress
    document.body.dataset.chaosLevel = calculateChaosLevel();
}

// Calculate chaos level based on game progress
function calculateChaosLevel() {
    let chaosLevel = 0;
    
    // Based on total upgrades owned
    const totalUpgrades = Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.owned, 0);
    chaosLevel += Math.floor(totalUpgrades / 5);
    
    // Based on level
    chaosLevel += Math.floor(gameState.level / 3);
    
    // Based on prestige
    chaosLevel += gameState.prestigeBoost / 10;
    
    // Based on achievements
    const unlockedAchievements = gameState.achievements.filter(a => a.unlocked).length;
    chaosLevel += Math.floor(unlockedAchievements / 2);
    
    // Based on active characters
    chaosLevel += Math.floor(document.querySelectorAll('.character').length / 3);
    
    return Math.floor(chaosLevel);
}

// Save game
function saveGame() {
    localStorage.setItem('grassClickerSave', JSON.stringify(gameState));
}

// Load game
function loadGame() {
    const savedGame = localStorage.getItem('grassClickerSave');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            
            // Merge saved state with default state to ensure all properties exist
            gameState = {
                ...gameState,
                grass: loadedState.grass || 0,
                perClick: loadedState.perClick || 1,
                perSecond: loadedState.perSecond || 0,
                level: loadedState.level || 1,
                xp: loadedState.xp || 0,
                nextLevel: loadedState.nextLevel || 100,
                prestigeBoost: loadedState.prestigeBoost || 0,
                clickCount: loadedState.clickCount || 0,
                totalGrass: loadedState.totalGrass || loadedState.grass || 0,
                dmUnlocked: loadedState.dmUnlocked || false,
                dmResponses: loadedState.dmResponses || 0
            };
            
            // Ensure upgrades have all properties
            if (loadedState.upgrades) {
                for (const upgradeId in gameState.upgrades) {
                    if (loadedState.upgrades[upgradeId]) {
                        gameState.upgrades[upgradeId].owned = loadedState.upgrades[upgradeId].owned || 0;
                        gameState.upgrades[upgradeId].cost = loadedState.upgrades[upgradeId].cost || gameState.upgrades[upgradeId].cost;
                    }
                }
            }
            
            // Ensure achievements are loaded
            if (loadedState.achievements) {
                for (let i = 0; i < gameState.achievements.length; i++) {
                    if (i < loadedState.achievements.length) {
                        gameState.achievements[i].unlocked = loadedState.achievements[i].unlocked || false;
                    }
                }
            }
            
            // Populate achievement list with unlocked achievements
            gameState.achievements.forEach(achievement => {
                if (achievement.unlocked) {
                    addAchievementToUI(achievement);
                }
            });
            
            // Recreate characters based on owned upgrades
            for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
                // Skip special upgrades like DM
                if (upgrade.special) continue;
                
                // Add characters based on owned count
                for (let i = 0; i < upgrade.owned; i++) {
                    // Add one character for each upgrade, plus an extra for each 5 owned
                    if (i === 0 || i % 5 === 0) {
                        addCharacter(id);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading saved game:", error);
            // If there's an error, start with a fresh game
        }
    }
}

// Initialize the game when the page loads
window.onload = initGame;