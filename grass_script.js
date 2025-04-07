// Format large numbers - rounds to integers as requested
function formatNumber(num) {
    // Round to integer first to avoid NaN issues
    num = Math.round(num);

    if (num >= 1000000) {
        return Math.floor(num / 1000000) + 'm';
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + 'k';
    } else {
        return Math.floor(num);
    }
}

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
    rebirthPoints: 0,
    rebirthCount: 0,
    multipliers: {
        clickMultiplier: 1,
        autoMultiplier: 1,
        dmMultiplier: 1,
        xpMultiplier: 1,
        criticalMultiplier: 1,
        criticalChance: 0.01, // 1% base chance
    },
    permanentUpgrades: {
        clickPower: { level: 0, cost: 100, effect: 0.15, description: "Increase click power by 15% per level" },
        autoGrass: { level: 0, cost: 200, effect: 0.15, description: "Increase passive grass by 15% per level" },
        dmBonus: { level: 0, cost: 150, effect: 0.25, description: "Increase DM rewards by 25% per level" },
        xpGain: { level: 0, cost: 100, effect: 0.25, description: "Increase XP gain by 25% per level" },
        upgradeDiscount: { level: 0, cost: 300, effect: 0.05, description: "Reduce upgrade costs by 5% per level" },
        characterBonus: { level: 0, cost: 250, effect: 0.25, description: "Increase character click rewards by 25% per level" }
    },
    multiplierUpgrades: {
        flower: {
            owned: 0,
            cost: 2000,
            baseCost: 2000,
            effect: 0.05, // +5% click multiplier per flower
            emoji: '🌸',
            name: 'magic flower',
            description: 'increases click power by 5%',
            unlockRequirement: 1000,
            type: 'click'
        },
        dmBooster: {
            owned: 0,
            cost: 5000,
            baseCost: 5000,
            effect: 0.1, // +10% DM rewards per booster
            emoji: '📱',
            name: 'dm booster',
            description: 'increases dm rewards by 10%',
            unlockRequirement: 3000,
            type: 'dm'
        },
        fertilizer: {
            owned: 0,
            cost: 10000,
            baseCost: 10000,
            effect: 0.05, // +5% auto grass per fertilizer
            emoji: '🌱',
            name: 'super fertilizer',
            description: 'increases passive grass by 5%',
            unlockRequirement: 5000,
            type: 'auto'
        },
        book: {
            owned: 0,
            cost: 7500,
            baseCost: 7500,
            effect: 0.1, // +10% XP gain per book
            emoji: '📚',
            name: 'grass encyclopedia',
            description: 'increases xp gain by 10%',
            unlockRequirement: 4000,
            type: 'xp'
        },
        clover: {
            owned: 0,
            cost: 15000,
            baseCost: 15000,
            effect: 0.01, // +1% critical chance per clover
            emoji: '🍀',
            name: 'lucky clover',
            description: 'increases critical click chance by 1%',
            unlockRequirement: 10000,
            type: 'critical_chance'
        },
        star: {
            owned: 0,
            cost: 25000,
            baseCost: 25000,
            effect: 0.25, // +25% critical multiplier per star
            emoji: '⭐',
            name: 'power star',
            description: 'increases critical click power by 25%',
            unlockRequirement: 20000,
            type: 'critical_power'
        },
        rainbow: {
            owned: 0,
            cost: 100000,
            baseCost: 100000,
            effect: 0.02, // +2% to all multipliers per rainbow
            emoji: '🌈',
            name: 'rainbow boost',
            description: 'increases all multipliers by 2%',
            unlockRequirement: 50000,
            type: 'all'
        },
        crystal: {
            owned: 0,
            cost: 500000,
            baseCost: 500000,
            effect: 0.1, // +10% prestige boost effectiveness
            emoji: '💎',
            name: 'prestige crystal',
            description: 'increases prestige boost effectiveness by 10%',
            unlockRequirement: 200000,
            type: 'prestige'
        }
    },
    upgrades: {
        scissors: {
            owned: 0,
            cost: 50,
            perClick: 1,
            emoji: '✂️',
            name: 'rusty scissors',
            description: 'snip snip the grass',
            unlockRequirement: 0,
            baseCost: 50
        },
        nerd: {
            owned: 0,
            cost: 500,
            perSecond: 5,
            emoji: '🤓',
            name: 'grass nerd',
            description: 'actually the optimal grass cutting technique is...',
            unlockRequirement: 200,
            baseCost: 500
        },
        gamer: {
            owned: 0,
            cost: 3000,
            perSecond: 20,
            emoji: '🎮',
            name: 'grass gamer',
            description: 'grinding grass xp irl',
            unlockRequirement: 1000,
            baseCost: 3000
        },
        boomer: {
            owned: 0,
            cost: 10000,
            perSecond: 80,
            emoji: '👴',
            name: 'lawn boomer',
            description: 'back in my day we cut grass uphill both ways',
            unlockRequirement: 5000,
            baseCost: 10000
        },
        zoomer: {
            owned: 0,
            cost: 40000,
            perSecond: 250,
            emoji: '💅',
            name: 'grass zoomer',
            description: 'this grass is so aesthetic no cap fr fr',
            unlockRequirement: 20000,
            baseCost: 40000
        },
        robot: {
            owned: 0,
            cost: 200000,
            perSecond: 1000,
            emoji: '🤖',
            name: 'grass bot',
            description: 'beep boop cutting grass',
            unlockRequirement: 100000,
            baseCost: 200000
        },
        alien: {
            owned: 0,
            cost: 1000000,
            perSecond: 4000,
            emoji: '👽',
            name: 'grass alien',
            description: 'we don\'t have grass on my planet',
            unlockRequirement: 500000,
            baseCost: 1000000
        },
        dm: {
            owned: 0,
            cost: 5000,
            perSecond: 0,
            emoji: '💬',
            name: 'dm upgrade',
            description: 'unlock random dms from weird people',
            unlockRequirement: 2000,
            special: 'dm',
            baseCost: 5000
        },
        mower: {
            owned: 0,
            cost: 1000,
            perClick: 5,
            emoji: '🔪',
            name: 'lawn mower',
            description: 'it\'s actually just a knife',
            unlockRequirement: 500,
            baseCost: 1000
        },
        fertilizer: {
            owned: 0,
            cost: 6000,
            perClick: 20,
            emoji: '💩',
            name: 'fertilizer',
            description: 'makes the grass grow faster... somehow',
            unlockRequirement: 3000,
            baseCost: 6000
        },
        raincloud: {
            owned: 0,
            cost: 20000,
            perSecond: 150,
            emoji: '☁️',
            name: 'rain cloud',
            description: 'it follows you around and waters the grass',
            unlockRequirement: 10000,
            baseCost: 20000
        },
        grassGod: {
            owned: 0,
            cost: 5000000,
            perSecond: 10000,
            emoji: '🧙‍♂️',
            name: 'grass god',
            description: 'the ultimate grass being',
            unlockRequirement: 1000000,
            baseCost: 5000000
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
        { id: 'dm-responder', name: 'dm responder', emoji: '📱', description: 'respond to 5 dms', unlocked: false, reward: 500, requirement: () => gameState.dmResponses >= 5 },
        { id: 'rebirth-novice', name: 'rebirth novice', emoji: '🔄', description: 'perform your first rebirth', unlocked: false, reward: 1000, requirement: () => gameState.rebirthCount >= 1 },
        { id: 'rebirth-adept', name: 'rebirth adept', emoji: '⚡', description: 'perform 5 rebirths', unlocked: false, reward: 5000, requirement: () => gameState.rebirthCount >= 5 },
        { id: 'rebirth-master', name: 'rebirth master', emoji: '🌀', description: 'perform 10 rebirths', unlocked: false, reward: 10000, requirement: () => gameState.rebirthCount >= 10 },
        { id: 'permanent-upgrader', name: 'permanent upgrader', emoji: '🔨', description: 'get a permanent upgrade to level 5', unlocked: false, reward: 2000, requirement: () => Object.values(gameState.permanentUpgrades).some(upgrade => upgrade.level >= 5) },
        { id: 'max-upgrader', name: 'max upgrader', emoji: '⚔️', description: 'max out any upgrade to level 10', unlocked: false, reward: 5000, requirement: () => Object.values(gameState.upgrades).some(upgrade => upgrade.level >= 10) }
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
                { text: 'invest big', result: 'profit', grassEffect: 300, message: 'your investment paid off +300 grass' },
                { text: 'invest small', result: 'modest', grassEffect: 50, message: 'modest returns on your investment +50 grass' },
                { text: 'no thanks', result: 'missed', grassEffect: -100, message: 'you missed out on the next big grass thing -100 grass of potential earnings' }
            ]
        },
        {
            sender: 'GrassScientist',
            avatar: '🔬',
            message: 'i discovered a new grass species want to name it?',
            options: [
                { text: 'name after me', result: 'fame', grassEffect: 100, message: 'you now have a grass species named after you +100 grass' },
                { text: 'grassy mcgrassface', result: 'meme', grassEffect: 150, message: 'your meme name was accepted +150 grass for the lolz' },
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

// Initialize multiplier upgrades
function initializeMultiplierUpgrades() {
    // Get multiplier container
    const multiplierContainer = document.getElementById('multiplier-items');
    if (!multiplierContainer) {
        console.error("Multiplier container not found!");
        return;
    }

    // Clear existing multiplier items
    multiplierContainer.innerHTML = '';

    // Make the special tab visible temporarily to ensure the container is accessible
    const specialTab = document.getElementById('special-tab');
    const wasHidden = !specialTab.classList.contains('active');
    if (wasHidden) {
        specialTab.style.display = 'block';
    }

    // Add each multiplier upgrade to shop if it meets the unlock requirement
    for (const [id, upgrade] of Object.entries(gameState.multiplierUpgrades)) {
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            addMultiplierToShop(id, upgrade);
        }
    }

    // Restore the tab's visibility
    if (wasHidden) {
        specialTab.style.display = '';
    }
}

// Add multiplier upgrade to shop
function addMultiplierToShop(id, upgrade) {
    const multiplierContainer = document.getElementById('multiplier-items');
    if (!multiplierContainer) {
        console.error("Multiplier container not found in addMultiplierToShop!");
        return;
    }

    // Make the special tab visible temporarily to ensure the container is accessible
    const specialTab = document.getElementById('special-tab');
    const wasHidden = !specialTab.classList.contains('active');
    if (wasHidden) {
        specialTab.style.display = 'block';
    }

    const multiplierItem = document.createElement('div');
    multiplierItem.className = 'multiplier-item';
    multiplierItem.id = `multiplier-item-${id}`;
    multiplierItem.onclick = () => buyMultiplierUpgrade(id);

    // Calculate current boost
    let boostText = '';
    switch(upgrade.type) {
        case 'click':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% click`;
            break;
        case 'auto':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% auto`;
            break;
        case 'dm':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% DM`;
            break;
        case 'xp':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% XP`;
            break;
        case 'critical_chance':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% crit chance`;
            break;
        case 'critical_power':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% crit power`;
            break;
        case 'all':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% all`;
            break;
        case 'prestige':
            boostText = `+${(upgrade.owned * upgrade.effect * 100).toFixed(0)}% prestige`;
            break;
    }

    // Create the main content
    multiplierItem.innerHTML = `
        <div class="multiplier-emoji">${upgrade.emoji}</div>
        <div class="multiplier-info">
            <div class="multiplier-name">${upgrade.name}</div>
            <div class="multiplier-effect">${upgrade.description}</div>
            <div class="multiplier-cost"><span id="${id}-multiplier-cost">${formatNumber(upgrade.cost)}</span> grass</div>
            <div class="multiplier-owned">owned: <span id="${id}-multiplier-owned">${upgrade.owned}</span></div>
        </div>
        ${upgrade.owned > 0 ? `<div class="multiplier-boost">${boostText}</div>` : ''}
    `;

    // Add to multiplier container
    multiplierContainer.appendChild(multiplierItem);

    // Restore the tab's visibility
    if (wasHidden) {
        specialTab.style.display = '';
    }
}

// Buy multiplier upgrade
function buyMultiplierUpgrade(id) {
    const upgrade = gameState.multiplierUpgrades[id];

    // Apply upgrade discount from permanent upgrades
    const discountMultiplier = 1 - (gameState.permanentUpgrades.upgradeDiscount.level * gameState.permanentUpgrades.upgradeDiscount.effect);
    const actualCost = Math.floor(upgrade.cost * discountMultiplier);

    if (gameState.grass >= actualCost) {
        // Deduct cost
        gameState.grass -= actualCost;

        // Increase owned count
        upgrade.owned++;

        // Increase cost for next purchase (50% increase as requested)
        upgrade.cost = Math.ceil(upgrade.cost * 1.5);

        // Apply multiplier effect
        applyMultiplierEffect(id, upgrade);

        // Recalculate values with multipliers
        recalculatePerClick();
        recalculatePerSecond();

        // Update UI
        updateUI();

        // Reinitialize multiplier shop to update boost text
        initializeMultiplierUpgrades();

        // Save game
        saveGame();

        // Show notification
        showNotification(`multiplier purchased`, `you got a ${upgrade.name}!`);

        // Add floating element
        addFloatingElement('upgrade');
    } else {
        // Show notification for not enough grass
        showNotification(`can't afford`, `you need ${formatNumber(actualCost - gameState.grass)} more grass`);
    }
}

// Apply multiplier effect
function applyMultiplierEffect(id, upgrade) {
    switch(upgrade.type) {
        case 'click':
            gameState.multipliers.clickMultiplier = 1 + (upgrade.owned * upgrade.effect);
            recalculatePerClick();
            break;
        case 'auto':
            gameState.multipliers.autoMultiplier = 1 + (upgrade.owned * upgrade.effect);
            recalculatePerSecond();
            break;
        case 'dm':
            gameState.multipliers.dmMultiplier = 1 + (upgrade.owned * upgrade.effect);
            break;
        case 'xp':
            gameState.multipliers.xpMultiplier = 1 + (upgrade.owned * upgrade.effect);
            break;
        case 'critical_chance':
            gameState.multipliers.criticalChance = 0.01 + (upgrade.owned * upgrade.effect);
            break;
        case 'critical_power':
            gameState.multipliers.criticalMultiplier = 1 + (upgrade.owned * upgrade.effect);
            break;
        case 'all':
            // Apply to all multipliers
            const allBoost = upgrade.effect;
            gameState.multipliers.clickMultiplier += allBoost;
            gameState.multipliers.autoMultiplier += allBoost;
            gameState.multipliers.dmMultiplier += allBoost;
            gameState.multipliers.xpMultiplier += allBoost;
            gameState.multipliers.criticalMultiplier += allBoost;
            recalculatePerClick();
            recalculatePerSecond();
            break;
        case 'prestige':
            // This will be applied when calculating prestige effects
            break;
    }
}

// Recalculate per click value based on all multipliers
function recalculatePerClick() {
    let basePerClick = 1;

    // Add all per click upgrades
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        if (upgrade.perClick) {
            basePerClick += upgrade.perClick * upgrade.owned;
        }
    }

    // Apply click multiplier
    basePerClick *= gameState.multipliers.clickMultiplier;

    // Apply prestige boost
    basePerClick *= (1 + gameState.prestigeBoost / 100);

    // Apply permanent upgrade boost
    const clickBoost = 1 + (gameState.permanentUpgrades.clickPower.level * gameState.permanentUpgrades.clickPower.effect);
    basePerClick *= clickBoost;

    // Update game state
    gameState.perClick = basePerClick;
}

// Recalculate per second value based on all multipliers
function recalculatePerSecond() {
    let basePerSecond = 0;

    // Add all per second upgrades
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        if (upgrade.perSecond) {
            basePerSecond += upgrade.perSecond * upgrade.owned;
        }
    }

    // Apply auto multiplier
    basePerSecond *= gameState.multipliers.autoMultiplier;

    // Apply prestige boost
    basePerSecond *= (1 + gameState.prestigeBoost / 100);

    // Apply permanent upgrade boost
    const autoBoost = 1 + (gameState.permanentUpgrades.autoGrass.level * gameState.permanentUpgrades.autoGrass.effect);
    basePerSecond *= autoBoost;

    // Update game state
    gameState.perSecond = basePerSecond;
}

// Check for unlockable upgrades
function checkForUnlockableUpgrades() {
    let newUpgradesUnlocked = false;

    // Check regular upgrades
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            const shopItem = document.getElementById(`shop-item-${id}`);
            if (!shopItem) {
                addUpgradeToShop(id, upgrade);
                newUpgradesUnlocked = true;
            }
        }
    }

    // Check multiplier upgrades
    for (const [id, upgrade] of Object.entries(gameState.multiplierUpgrades)) {
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            const multiplierItem = document.getElementById(`multiplier-item-${id}`);
            if (!multiplierItem) {
                addMultiplierToShop(id, upgrade);
                newUpgradesUnlocked = true;
            }
        }
    }

    // Show notification if new upgrades were unlocked
    if (newUpgradesUnlocked) {
        showNotification('new upgrades', 'new upgrades have been unlocked!');
    }
}

// Handle tab switching
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Get tab content id
            const tabId = tab.getAttribute('data-tab');

            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // Show selected tab pane
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Reset game to default state
function resetGame() {
    // Reset all game state values to defaults
    gameState = {
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
        rebirthPoints: 0,
        rebirthCount: 0,
        multipliers: {
            clickMultiplier: 1,
            autoMultiplier: 1,
            dmMultiplier: 1,
            xpMultiplier: 1,
            criticalMultiplier: 1,
            criticalChance: 0.01,
        },
        permanentUpgrades: {
            clickPower: { level: 0, cost: 500, effect: 0.05, description: "Increase click power by 5% per level" },
            autoGrass: { level: 0, cost: 1000, effect: 0.05, description: "Increase passive grass by 5% per level" },
            dmBonus: { level: 0, cost: 750, effect: 0.1, description: "Increase DM rewards by 10% per level" },
            xpGain: { level: 0, cost: 500, effect: 0.1, description: "Increase XP gain by 10% per level" },
            upgradeDiscount: { level: 0, cost: 1500, effect: 0.02, description: "Reduce upgrade costs by 2% per level" },
            characterBonus: { level: 0, cost: 1250, effect: 0.1, description: "Increase character click rewards by 10% per level" }
        }
    };

    // Reset upgrades to default
    for (const upgrade in gameState.upgrades) {
        gameState.upgrades[upgrade].owned = 0;
        gameState.upgrades[upgrade].cost = gameState.upgrades[upgrade].baseCost;
    }

    // Reset multiplier upgrades to default
    for (const upgrade in gameState.multiplierUpgrades) {
        gameState.multiplierUpgrades[upgrade].owned = 0;
        gameState.multiplierUpgrades[upgrade].cost = gameState.multiplierUpgrades[upgrade].baseCost;
    }

    // Clear UI elements
    if (characterContainer) characterContainer.innerHTML = '';
    if (shopItemsContainer) shopItemsContainer.innerHTML = '';

    // Clear any other UI elements as needed
}

// Add free grass (cheat function)
function addFreeGrass(amount) {
    gameState.grass += amount;
    gameState.totalGrass += amount;
    updateUI();
    showNotification('free grass', `added ${formatNumber(amount)} grass!`);
    saveGame();
}

// Super cheat - add rebirth points directly
function addRebirthPoints(amount) {
    gameState.rebirthPoints += amount;
    updateUI();
    showNotification('cheat activated', `added ${amount} rebirth points!`);
    saveGame();
}

// Mega cheat - unlock everything
function unlockEverything() {
    // Give lots of grass
    gameState.grass += 10000000;
    gameState.totalGrass += 10000000;

    // Unlock all upgrades
    for (const upgrade in gameState.upgrades) {
        gameState.upgrades[upgrade].owned = 10;
    }

    // Unlock all multiplier upgrades
    for (const upgrade in gameState.multiplierUpgrades) {
        gameState.multiplierUpgrades[upgrade].owned = 10;
    }

    // Unlock all achievements
    gameState.achievements.forEach(a => a.unlocked = true);

    // Add rebirth points
    gameState.rebirthPoints += 100;

    // Add prestige boost
    gameState.prestigeBoost += 50;

    // Update everything
    recalculatePerClick();
    recalculatePerSecond();
    updateUI();
    showNotification('mega cheat', 'unlocked everything!');
    saveGame();
}

// Initialize the game
function initGame() {
    // Load saved game if exists
    loadGame();

    // Apply permanent upgrades
    applyPermanentUpgrades();

    // Initialize shop items
    initializeShop();

    // Initialize multiplier upgrades
    initializeMultiplierUpgrades();

    // Initialize tabs
    initTabs();

    // Add cheat functions to window for console access
    window.addFreeGrass = addFreeGrass;
    window.addRebirthPoints = addRebirthPoints;
    window.unlockEverything = unlockEverything;

    // Recalculate values with multipliers
    recalculatePerClick();
    recalculatePerSecond();

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

    // Add event listeners for settings and rebirth buttons
    document.addEventListener('keydown', (e) => {
        // Press 'S' to open settings
        if (e.key.toLowerCase() === 's') {
            toggleSettings();
        }
        // Press 'R' to open rebirth menu
        if (e.key.toLowerCase() === 'r' && gameState.rebirthCount > 0) {
            toggleRebirthMenu();
        }
    });

    // Show welcome notification
    setTimeout(() => {
        showNotification('welcome back', 'click the grass to start growing!');

        // Show rebirth notification if player has rebirth points
        if (gameState.rebirthPoints > 0) {
            setTimeout(() => {
                showNotification('rebirth points', `you have ${formatNumber(gameState.rebirthPoints)} rebirth points to spend!`);
            }, 3000);
        }

        // Show tabs notification
        setTimeout(() => {
            showNotification('navigation tabs', 'use the tabs at the top to switch between different sections!');
        }, 5000);
    }, 1000);
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

    // Create the main content
    shopItem.innerHTML = `
        <div class="item-emoji">${upgrade.emoji}</div>
        <div class="item-info">
            <div class="item-name">${upgrade.name}</div>
            <div class="item-effect">${upgrade.description}</div>
            <div class="item-stats">
                ${upgrade.perClick ? `<div class="item-stat">+${formatNumber(upgrade.perClick)} per click</div>` : ''}
                ${upgrade.perSecond ? `<div class="item-stat">+${formatNumber(upgrade.perSecond)} per second</div>` : ''}
            </div>
            <div class="item-actions">
                <button class="buy-button" onclick="buyUpgrade('${id}')">
                    Buy: <span id="${id}-cost">${formatNumber(upgrade.cost)}</span> grass
                </button>
            </div>
            <div class="item-owned">owned: <span id="${id}-owned">${upgrade.owned}</span></div>
        </div>
    `;

    // Add to shop
    shopItemsContainer.appendChild(shopItem);
}

// Click the grass
grassClicker.addEventListener('click', () => {
    // Check for critical hit
    let isCritical = Math.random() < gameState.multipliers.criticalChance;
    let grassAmount = gameState.perClick;

    // Apply critical multiplier if critical hit
    if (isCritical) {
        grassAmount *= gameState.multipliers.criticalMultiplier;
        showCriticalHitEffect();
    }

    // Add grass based on per click value (with critical if applicable)
    addGrass(grassAmount);

    // Increment click count
    gameState.clickCount++;

    // Show click effect
    showClickEffect(grassAmount, isCritical);

    // Calculate XP bonus from permanent upgrades and multiplier
    const xpBonus = 1 + (gameState.permanentUpgrades.xpGain.level * gameState.permanentUpgrades.xpGain.effect);
    const xpMultiplier = gameState.multipliers.xpMultiplier;

    // Add XP with bonuses
    gameState.xp += 1 * xpBonus * xpMultiplier;
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

// Show critical hit effect
function showCriticalHitEffect() {
    // Create critical hit text
    const criticalText = document.createElement('div');
    criticalText.className = 'critical-hit';
    criticalText.textContent = 'CRITICAL!';

    // Add to clicker area
    const clickerArea = document.querySelector('.clicker-area');
    clickerArea.appendChild(criticalText);

    // Remove after animation
    setTimeout(() => {
        criticalText.remove();
    }, 1000);

    // Add special floating elements for critical
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            addFloatingElement('critical');
        }, i * 100);
    }
}

// Add grass to the counter
function addGrass(amount) {
    gameState.grass += amount;
    gameState.totalGrass += amount;
}

// Generate grass per second
function generateGrassPerSecond() {
    if (gameState.perSecond > 0) {
        addGrass(gameState.perSecond);

        // Calculate XP bonus from permanent upgrades
        const xpBonus = 1 + (gameState.permanentUpgrades.xpGain.level * gameState.permanentUpgrades.xpGain.effect);

        // Add XP with bonus
        gameState.xp += 0.2 * xpBonus;

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

    // Apply upgrade discount from permanent upgrades
    const discountMultiplier = 1 - (gameState.permanentUpgrades.upgradeDiscount.level * gameState.permanentUpgrades.upgradeDiscount.effect);
    const actualCost = Math.floor(upgrade.cost * discountMultiplier);

    if (gameState.grass >= actualCost) {
        // Deduct cost
        gameState.grass -= actualCost;

        // Increase owned count
        upgrade.owned++;

        // Increase cost for next purchase (50% increase as requested)
        upgrade.cost = Math.ceil(upgrade.cost * 1.5);

        // Handle special upgrades
        if (upgrade.special === 'dm') {
            gameState.dmUnlocked = true;
            showNotification('dm system unlocked', 'you will now receive random dms from weird people');

            // Show first DM immediately
            setTimeout(showRandomDM, 3000);
        }

        // Calculate boost from permanent upgrades
        const clickBoost = 1 + (gameState.permanentUpgrades.clickPower.level * gameState.permanentUpgrades.clickPower.effect);
        const autoBoost = 1 + (gameState.permanentUpgrades.autoGrass.level * gameState.permanentUpgrades.autoGrass.effect);
        const prestigeBoost = 1 + gameState.prestigeBoost / 100;

        // Update per click or per second values
        if (upgrade.perClick) {
            gameState.perClick += upgrade.perClick * prestigeBoost * clickBoost;
        }

        if (upgrade.perSecond) {
            gameState.perSecond += upgrade.perSecond * prestigeBoost * autoBoost;
        }

        // Recalculate values with multipliers
        recalculatePerClick();
        recalculatePerSecond();

        // Update UI
        updateUI();

        // Save game
        saveGame();

        // Show notification
        let notificationText = `you got a ${upgrade.name}!`;
        if (upgrade.perClick) {
            notificationText += ` +${formatNumber(upgrade.perClick)} per click`;
        } else if (upgrade.perSecond) {
            notificationText += ` +${formatNumber(upgrade.perSecond)} per second`;
        }

        showNotification(`upgrade purchased`, notificationText);

        // Add floating element
        addFloatingElement(type);

        // Add character to screen (except for special upgrades)
        if (!upgrade.special) {
            addCharacter(type);
        }

        // For each 10 of the same upgrade, add another character (harder to get)
        if (upgrade.owned % 10 === 0 && upgrade.owned > 1) {
            addCharacter(type);
            showNotification('bonus character', `extra ${upgrade.name} added for owning ${upgrade.owned}`);
        }
    } else {
        // Show notification for not enough grass
        showNotification(`can't afford`, `you need ${formatNumber(actualCost - gameState.grass)} more grass`);
    }
}

// Check if player can level up
function checkLevelUp() {
    if (gameState.xp >= gameState.nextLevel) {
        const oldLevel = gameState.level;
        gameState.level++;
        gameState.xp = 0;
        gameState.nextLevel = Math.floor(gameState.nextLevel * 2); // Harder level scaling

        // Bonus for leveling up (reduced)
        gameState.perClick += 0.5;

        // Show notification
        showNotification(`level up`, `you're now level ${gameState.level}! +0.5 grass per click`);

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
    if (gameState.grass >= 50000) { // Increased requirement
        if (confirm("do you want to reset everything but get a permanent 5% boost to all grass production?")) {
            // Calculate new prestige boost (reduced from 10% to 5%)
            gameState.prestigeBoost += 5;

            // Reset game but keep prestige boost
            gameState.grass = 0;
            gameState.perClick = 1 * (1 + gameState.prestigeBoost / 100);
            gameState.perSecond = 0;
            gameState.level = 1;
            gameState.xp = 0;
            gameState.nextLevel = 100;

            // Make sure to reset these values completely
            gameState.clickCount = 0;
            gameState.floatingElements = 0;

            // Reset upgrades
            for (const upgrade in gameState.upgrades) {
                gameState.upgrades[upgrade].owned = 0;
                // Reset costs to base values
                gameState.upgrades[upgrade].cost = gameState.upgrades[upgrade].baseCost;
            }

            // Reset multiplier upgrades
            for (const upgrade in gameState.multiplierUpgrades) {
                gameState.multiplierUpgrades[upgrade].owned = 0;
                gameState.multiplierUpgrades[upgrade].cost = gameState.multiplierUpgrades[upgrade].baseCost;
            }

            // Reset multipliers
            gameState.multipliers = {
                clickMultiplier: 1,
                autoMultiplier: 1,
                dmMultiplier: 1,
                xpMultiplier: 1,
                criticalMultiplier: 1,
                criticalChance: 0.01
            };

            // Remove all characters
            characterContainer.innerHTML = '';
            gameState.activeCharacters = [];

            // Keep DM system unlocked if it was unlocked
            // (don't reset dmUnlocked)

            // Reinitialize shop
            initializeShop();

            // Recalculate values to ensure they're correct
            recalculatePerClick();
            recalculatePerSecond();

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
        showNotification(`can't prestige yet`, `you need 50,000 grass first`);
    }
}

// Rebirth function - more powerful reset that gives rebirth points
function rebirth() {
    if (gameState.grass >= 1000000) { // Lower requirement to 1M grass
        // Calculate how many rebirth points would be earned based on current grass
        // Now gives 20 points per million grass
        const rebirthPointsEarned = Math.floor(gameState.grass / 1000000) * 20;

        if (confirm(`REBIRTH: Reset EVERYTHING (including prestige) but earn ${rebirthPointsEarned} rebirth points for permanent upgrades?`)) {
            // Award rebirth points based on current grass (not total grass)
            gameState.rebirthPoints += rebirthPointsEarned;
            gameState.rebirthCount++;

            // Reset everything
            gameState.grass = 0;
            gameState.perClick = 1;
            gameState.perSecond = 0;
            gameState.level = 1;
            gameState.xp = 0;
            gameState.nextLevel = 100;
            gameState.prestigeBoost = 0;
            gameState.clickCount = 0;
            gameState.totalGrass = 0;
            gameState.dmResponses = 0;

            // Reset upgrades
            for (const upgrade in gameState.upgrades) {
               // Reset costs to base values
                gameState.upgrades[upgrade].cost = gameState.upgrades[upgrade].owned = 0;
                 gameState.upgrades[upgrade].baseCost;
            }

            // Reset multiplier upgrades
            for (const upgrade in gameState.multiplierUpgrades) {
                gameState.multiplierUpgrades[upgrade].owned = 0;
                gameState.multiplierUpgrades[upgrade].cost = gameState.multiplierUpgrades[upgrade].baseCost;
            }

            // Reset multipliers
            gameState.multipliers = {
                clickMultiplier: 1,
                autoMultiplier: 1,
                dmMultiplier: 1,
                xpMultiplier: 1,
                criticalMultiplier: 1,
                criticalChance: 0.01
            };

            // Remove all characters
            characterContainer.innerHTML = '';
            gameState.activeCharacters = [];

            // Keep DM system unlocked if it was unlocked
            // (don't reset dmUnlocked)

            // Apply permanent upgrades
            applyPermanentUpgrades();

            // Reinitialize shop
            initializeShop();
            initializeMultiplierUpgrades();

            // Recalculate values to ensure they're correct
            recalculatePerClick();
            recalculatePerSecond();

            // Update UI
            updateUI();

            // Save game
            saveGame();

            // Show notification
            showNotification(`rebirth complete`, `you earned ${rebirthPointsEarned} rebirth points!`);

            // Add lots of floating elements
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    addFloatingElement('rebirth');
                }, i * 100);
            }

            // Show the rebirth menu
            showRebirthMenu();
        }
    } else {
        // Show notification
        showNotification(`can't rebirth yet`, `you need 1,000,000 total grass first`);
    }
}

// Apply effects from permanent upgrades
function applyPermanentUpgrades() {
    // Click power boost
    const clickBoost = 1 + (gameState.permanentUpgrades.clickPower.level * gameState.permanentUpgrades.clickPower.effect);
    gameState.perClick *= clickBoost;

    // Auto grass boost (will be applied when buying upgrades)

    // XP gain boost (applied when gaining XP)

    // Upgrade discount (applied when calculating costs)
}

// Buy a permanent upgrade with rebirth points
function buyPermanentUpgrade(type) {
    const upgrade = gameState.permanentUpgrades[type];
    // Reduced scaling from 1.5 to 1.2 - much gentler cost increase
    const cost = upgrade.cost * Math.pow(1.2, upgrade.level);

    if (gameState.rebirthPoints >= cost) {
        // Deduct cost
        gameState.rebirthPoints -= cost;

        // Increase level
        upgrade.level++;

        // Apply effects
        applyPermanentUpgrades();

        // Update UI
        updateUI();

        // Save game
        saveGame();

        // Show notification
        showNotification(`permanent upgrade`, `${type} upgraded to level ${upgrade.level}!`);

        // Add floating element
        addFloatingElement('upgrade');
    } else {
        // Show notification
        showNotification(`can't afford`, `you need ${cost - gameState.rebirthPoints} more rebirth points`);
    }
}

// Upgrade an existing item to increase its effectiveness
function upgradeItem(type) {
    const upgrade = gameState.upgrades[type];

    // Check if already at max level
    if (upgrade.level >= upgrade.maxLevel) {
        showNotification('max level', `${upgrade.name} is already at max level!`);
        return;
    }

    const upgradeCost = upgrade.upgradeCost * Math.pow(2, upgrade.level - 1);

    if (gameState.grass >= upgradeCost) {
        // Deduct cost
        gameState.grass -= upgradeCost;

        // Increase level
        upgrade.level++;

        // Apply upgrade effects
        if (upgrade.perClick) {
            const newPerClick = upgrade.perClick * (1 + upgrade.upgradeEffect * (upgrade.level - 1));
            gameState.perClick += (newPerClick - upgrade.perClick) * upgrade.owned * (1 + gameState.prestigeBoost / 100);
            upgrade.perClick = newPerClick;
        }

        if (upgrade.perSecond) {
            const newPerSecond = upgrade.perSecond * (1 + upgrade.upgradeEffect * (upgrade.level - 1));
            gameState.perSecond += (newPerSecond - upgrade.perSecond) * upgrade.owned * (1 + gameState.prestigeBoost / 100);
            upgrade.perSecond = newPerSecond;
        }

        // Update UI
        updateUI();

        // Save game
        saveGame();

        // Show notification
        showNotification(`upgrade improved`, `${upgrade.name} upgraded to level ${upgrade.level}!`);

        // Add floating element
        addFloatingElement('upgrade');
    } else {
        // Show notification
        showNotification(`can't afford`, `you need ${upgradeCost - gameState.grass} more grass`);
    }
}

// Show the rebirth menu
function showRebirthMenu() {
    // Create menu if it doesn't exist
    if (!document.getElementById('rebirth-menu')) {
        const rebirthMenu = document.createElement('div');
        rebirthMenu.id = 'rebirth-menu';
        rebirthMenu.className = 'rebirth-menu';

        rebirthMenu.innerHTML = `
            <div class="rebirth-header">
                <h2>rebirth upgrades</h2>
                <div class="rebirth-points">
                    <span id="rebirth-points">${formatNumber(gameState.rebirthPoints)}</span> rebirth points
                </div>
                <div class="rebirth-close" onclick="toggleRebirthMenu()">×</div>
            </div>
            <div class="rebirth-upgrades">
                ${Object.entries(gameState.permanentUpgrades).map(([id, upgrade]) => `
                    <div class="rebirth-upgrade" onclick="buyPermanentUpgrade('${id}')">
                        <div class="upgrade-name">${id.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                        <div class="upgrade-desc">${upgrade.description}</div>
                        <div class="upgrade-level">level: <span id="perm-${id}-level">${upgrade.level}</span></div>
                        <div class="upgrade-cost"><span id="perm-${id}-cost">${formatNumber(upgrade.cost * Math.pow(1.2, upgrade.level))}</span> points</div>
                    </div>
                `).join('')}
            </div>
            <div class="rebirth-footer">
                <button class="rebirth-button" onclick="rebirth()">rebirth again</button>
                <button class="rebirth-close-button" onclick="toggleRebirthMenu()">close</button>
            </div>
        `;

        document.body.appendChild(rebirthMenu);
    }

    // Show the menu
    document.getElementById('rebirth-menu').style.display = 'block';
}

// Toggle the rebirth menu
function toggleRebirthMenu() {
    const menu = document.getElementById('rebirth-menu');
    if (menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    } else if (gameState.rebirthCount > 0) {
        showRebirthMenu();
    } else {
        showNotification('locked', 'you need to rebirth first!');
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
        case 'rebirth':
            element.textContent = '🔄';
            break;
        case 'critical':
            element.textContent = '💥';
            break;
        case 'upgrade':
            element.textContent = '⚡';
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
        // Calculate character bonus from permanent upgrades
        const characterBonus = 1 + (gameState.permanentUpgrades.characterBonus.level * gameState.permanentUpgrades.characterBonus.effect);

        // Give bonus based on character type (reduced for harder gameplay)
        let bonus = 0;
        if (upgrade.perClick) {
            bonus = upgrade.perClick * 2 * characterBonus;
        } else if (upgrade.perSecond) {
            bonus = upgrade.perSecond * 0.5 * characterBonus;
        } else {
            bonus = 20 * characterBonus;
        }

        // Round the bonus
        bonus = Math.round(bonus);

        // Add bonus
        addGrass(bonus);

        // Show speech bubble
        showCharacterSpeech(character, `+${formatNumber(bonus)} grass!`);

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
    let newUpgradesUnlocked = false;

    // Check each regular upgrade
    for (const [id, upgrade] of Object.entries(gameState.upgrades)) {
        // Skip if already has an element in the shop
        if (document.getElementById(`shop-item-${id}`)) continue;

        // Check if should be unlocked
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            // Add to shop
            addUpgradeToShop(id, upgrade);
            newUpgradesUnlocked = true;
        }
    }

    // Check each multiplier upgrade
    for (const [id, upgrade] of Object.entries(gameState.multiplierUpgrades)) {
        // Skip if already has an element in the shop
        if (document.getElementById(`multiplier-item-${id}`)) continue;

        // Check if should be unlocked
        if (gameState.totalGrass >= upgrade.unlockRequirement) {
            // Add to shop
            addMultiplierToShop(id, upgrade);
            newUpgradesUnlocked = true;

            // Show special notification for first multiplier upgrade
            if (!document.querySelector('.multiplier-item')) {
                showNotification('special upgrades', 'check the "Special Upgrades" tab for new powerful upgrades!');
            }
        }
    }

    // Show notification if any new upgrades were unlocked
    if (newUpgradesUnlocked) {
        showNotification('new upgrades', 'new upgrades have been unlocked!');
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

    // Calculate DM bonus from permanent upgrades
    const dmBonus = 1 + (gameState.permanentUpgrades.dmBonus.level * gameState.permanentUpgrades.dmBonus.effect);

    // Check if dm upgrade exists and is owned before applying its bonus
    let dmUpgradeBonus = 1;
    if (gameState.upgrades.dm && gameState.upgrades.dm.owned > 0) {
        dmUpgradeBonus = 1;  // Removed level-based calculation since we removed upgrade levels
    }

    // Apply effect with bonuses
    const effectAmount = Math.round(option.grassEffect * dmBonus * dmUpgradeBonus);
    addGrass(effectAmount);

    // Update response count
    gameState.dmResponses = (gameState.dmResponses || 0) + 1;

    // Show result
    const resultElement = document.createElement('div');
    resultElement.className = 'dm-result';

    // Modify message to show actual amount
    let resultMessage = option.message;
    if (option.grassEffect !== 0) {
        const sign = option.grassEffect > 0 ? '+' : '';
        const originalAmount = `${sign}${option.grassEffect}`;
        const boostedAmount = `${effectAmount > 0 ? '+' : ''}${effectAmount}`;
        resultMessage = resultMessage.replace(originalAmount, boostedAmount);
    }

    resultElement.textContent = resultMessage;

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
    showNotification('dm response', resultMessage);

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

// Helper function to round numbers to nearest 10
function roundToNearest10(num) {
    return Math.round(num / 10) * 10;
}

// Format large numbers with K, M, B suffixes
function formatNumber(num) {
    if (num < 1000) return roundToNearest10(num);
    if (num < 1000000) return (roundToNearest10(num / 100) / 10).toFixed(1) + 'K';
    if (num < 1000000000) return (roundToNearest10(num / 100000) / 10).toFixed(1) + 'M';
    return (roundToNearest10(num / 100000000) / 10).toFixed(1) + 'B';
}

// Update rebirth button text to show potential points
function updateRebirthButton() {
    const rebirthButton = document.getElementById('rebirth-button');
    if (rebirthButton) {
        const potentialPoints = Math.floor(gameState.grass / 1000000) * 20;
        if (potentialPoints > 0) {
            rebirthButton.textContent = `rebirth now (+${potentialPoints} points)`;
        } else {
            rebirthButton.textContent = `rebirth (need 1M grass)`;
        }
    }
}

// Update UI
function updateUI() {
    // Update stats
    grassCountElement.textContent = formatNumber(gameState.grass);
    grassCountElement.dataset.value = Math.floor(gameState.grass);

    perClickElement.textContent = formatNumber(gameState.perClick);
    perClickElement.dataset.value = gameState.perClick;

    perSecondElement.textContent = formatNumber(gameState.perSecond);
    perSecondElement.dataset.value = gameState.perSecond;

    // Update rebirth button
    updateRebirthButton();

    levelElement.textContent = gameState.level;
    levelElement.dataset.value = gameState.level;

    xpElement.textContent = formatNumber(gameState.xp);
    xpElement.dataset.value = Math.floor(gameState.xp);

    nextLevelElement.textContent = formatNumber(gameState.nextLevel);
    nextLevelElement.dataset.value = gameState.nextLevel;

    prestigeBoostElement.textContent = gameState.prestigeBoost;
    prestigeBoostElement.dataset.value = gameState.prestigeBoost;

    // Update rebirth points if element exists
    const rebirthPointsElement = document.getElementById('rebirth-points');
    if (rebirthPointsElement) {
        rebirthPointsElement.textContent = formatNumber(gameState.rebirthPoints);
    }

    // Update XP progress bar
    const progressPercent = (gameState.xp / gameState.nextLevel) * 100;
    xpProgressElement.style.width = `${progressPercent}%`;

    // Update upgrade costs and owned counts
    for (const upgrade in gameState.upgrades) {
        const costElement = document.getElementById(`${upgrade}-cost`);
        const ownedElement = document.getElementById(`${upgrade}-owned`);
        const levelElement = document.getElementById(`${upgrade}-level`);

        if (costElement) {
            costElement.textContent = formatNumber(gameState.upgrades[upgrade].cost);
            costElement.dataset.value = gameState.upgrades[upgrade].cost;
        }

        if (ownedElement) {
            ownedElement.textContent = gameState.upgrades[upgrade].owned;
            ownedElement.dataset.value = gameState.upgrades[upgrade].owned;
        }

        if (levelElement) {
            levelElement.textContent = gameState.upgrades[upgrade].level;
        }
    }

    // Update permanent upgrade costs and levels
    for (const upgrade in gameState.permanentUpgrades) {
        const costElement = document.getElementById(`perm-${upgrade}-cost`);
        const levelElement = document.getElementById(`perm-${upgrade}-level`);

        if (costElement) {
            const cost = gameState.permanentUpgrades[upgrade].cost *
                         Math.pow(1.2, gameState.permanentUpgrades[upgrade].level);
            costElement.textContent = formatNumber(cost);
        }

        if (levelElement) {
            levelElement.textContent = gameState.permanentUpgrades[upgrade].level;
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
                dmResponses: loadedState.dmResponses || 0,
                rebirthPoints: loadedState.rebirthPoints || 0,
                rebirthCount: loadedState.rebirthCount || 0
            };

            // Load multipliers
            if (loadedState.multipliers) {
                gameState.multipliers = {
                    ...gameState.multipliers,
                    clickMultiplier: loadedState.multipliers.clickMultiplier || 1,
                    autoMultiplier: loadedState.multipliers.autoMultiplier || 1,
                    dmMultiplier: loadedState.multipliers.dmMultiplier || 1,
                    xpMultiplier: loadedState.multipliers.xpMultiplier || 1,
                    criticalMultiplier: loadedState.multipliers.criticalMultiplier || 1,
                    criticalChance: loadedState.multipliers.criticalChance || 0.01
                };
            }

            // Ensure upgrades have all properties
            if (loadedState.upgrades) {
                for (const upgradeId in gameState.upgrades) {
                    if (loadedState.upgrades[upgradeId]) {
                        gameState.upgrades[upgradeId].owned = loadedState.upgrades[upgradeId].owned || 0;
                        gameState.upgrades[upgradeId].cost = loadedState.upgrades[upgradeId].cost || gameState.upgrades[upgradeId].cost;
                        gameState.upgrades[upgradeId].level = loadedState.upgrades[upgradeId].level || 1;
                    }
                }
            }

            // Ensure multiplier upgrades have all properties
            if (loadedState.multiplierUpgrades) {
                for (const upgradeId in gameState.multiplierUpgrades) {
                    if (loadedState.multiplierUpgrades[upgradeId]) {
                        gameState.multiplierUpgrades[upgradeId].owned = loadedState.multiplierUpgrades[upgradeId].owned || 0;
                        gameState.multiplierUpgrades[upgradeId].cost = loadedState.multiplierUpgrades[upgradeId].cost || gameState.multiplierUpgrades[upgradeId].cost;
                    }
                }
            }

            // Ensure permanent upgrades are loaded
            if (loadedState.permanentUpgrades) {
                for (const upgradeId in gameState.permanentUpgrades) {
                    if (loadedState.permanentUpgrades[upgradeId]) {
                        gameState.permanentUpgrades[upgradeId].level = loadedState.permanentUpgrades[upgradeId].level || 0;
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

            // Apply permanent upgrades
            applyPermanentUpgrades();

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

            // Create rebirth menu if player has rebirthed
            if (gameState.rebirthCount > 0) {
                setTimeout(() => {
                    showRebirthMenu();
                    document.getElementById('rebirth-menu').style.display = 'none';
                }, 1000);
            }
        } catch (error) {
            console.error("Error loading saved game:", error);
            // If there's an error, start with a fresh game
        }
    }
}

// Export save as string
function exportSave() {
    try {
        // Create a clean copy of the game state without circular references
        const cleanState = JSON.parse(JSON.stringify(gameState));

        // Remove potentially problematic properties
        if (cleanState.activeCharacters) {
            // Remove DOM elements from active characters
            cleanState.activeCharacters = cleanState.activeCharacters.map(char => ({
                type: char.type,
                lastSpeech: char.lastSpeech
            }));
        }

        const saveData = JSON.stringify(cleanState);
        const encodedData = btoa(encodeURIComponent(saveData));

        // Create a text area with the save data
        const textArea = document.createElement('textarea');
        textArea.value = encodedData;
        textArea.style.position = 'fixed';
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.zIndex = '9999';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showNotification('save exported', 'save data copied to clipboard!');
        } catch (err) {
            showNotification('export error', 'could not copy to clipboard, please manually copy the text');
        }

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.position = 'fixed';
        closeButton.style.left = '10px';
        closeButton.style.top = '210px';
        closeButton.style.zIndex = '9999';
        closeButton.onclick = function() {
            document.body.removeChild(textArea);
            document.body.removeChild(closeButton);
        };

        document.body.appendChild(closeButton);
    } catch (error) {
        console.error("Error exporting save:", error);
        showNotification('export error', 'could not export save data');
    }
}

// Import save from string
function importSave() {
    try {
        // Create a text area for the save data
        const textArea = document.createElement('textarea');
        textArea.placeholder = 'Paste your save data here...';
        textArea.style.position = 'fixed';
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.zIndex = '9999';

        document.body.appendChild(textArea);
        textArea.focus();

        // Add import button
        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        importButton.style.position = 'fixed';
        importButton.style.left = '10px';
        importButton.style.top = '210px';
        importButton.style.zIndex = '9999';
        importButton.onclick = function() {
            try {
                const encodedData = textArea.value.trim();
                let saveData;
                let loadedState;

                try {
                    // Try the new format first (with encodeURIComponent)
                    saveData = decodeURIComponent(atob(encodedData));
                    loadedState = JSON.parse(saveData);
                } catch (e) {
                    // If that fails, try the old format
                    saveData = atob(encodedData);
                    loadedState = JSON.parse(saveData);
                }

                // Confirm import
                if (confirm('Are you sure you want to import this save? Your current progress will be overwritten.')) {
                    // Reset the game
                    resetGame();

                    // Load the imported save
                    gameState = loadedState;

                    // Refresh the game
                    initGame();

                    showNotification('import successful', 'save data imported successfully!');
                }
            } catch (error) {
                console.error("Error importing save:", error);
                showNotification('import error', 'invalid save data');
            }

            // Clean up
            document.body.removeChild(textArea);
            document.body.removeChild(importButton);
            document.body.removeChild(cancelButton);
        };

        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.position = 'fixed';
        cancelButton.style.left = '100px';
        cancelButton.style.top = '210px';
        cancelButton.style.zIndex = '9999';
        cancelButton.onclick = function() {
            document.body.removeChild(textArea);
            document.body.removeChild(importButton);
            document.body.removeChild(cancelButton);
        };

        document.body.appendChild(importButton);
        document.body.appendChild(cancelButton);
    } catch (error) {
        console.error("Error setting up import:", error);
        showNotification('import error', 'could not set up import');
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? ALL progress will be lost!')) {
        // Clear local storage
        localStorage.removeItem('grassClickerSave');

        // Reload the page
        location.reload();
    }
}

// Show settings menu
function showSettings() {
    // Create menu if it doesn't exist
    if (!document.getElementById('settings-menu')) {
        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'settings-menu';
        settingsMenu.className = 'settings-menu';

        settingsMenu.innerHTML = `
            <div class="settings-header">
                <h2>settings</h2>
                <div class="settings-close" onclick="toggleSettings()">×</div>
            </div>
            <div class="settings-options">
                <button class="settings-button" onclick="exportSave()">export save</button>
                <button class="settings-button" onclick="importSave()">import save</button>
                <button class="settings-button danger" onclick="resetGame()">reset game</button>
            </div>
            <div class="settings-footer">
                <button class="settings-close-button" onclick="toggleSettings()">close</button>
            </div>
        `;

        document.body.appendChild(settingsMenu);
    }

    // Show the menu
    document.getElementById('settings-menu').style.display = 'block';
}

// Toggle settings menu
function toggleSettings() {
    const menu = document.getElementById('settings-menu');
    if (menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    } else {
        showSettings();
    }
}

// Initialize the game when the page loads
window.onload = initGame;