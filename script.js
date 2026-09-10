let robux = localStorage.getItem('roblox_robux') ? parseInt(localStorage.getItem('roblox_robux')) : 500;
let inventory = localStorage.getItem('roblox_inventory') ? JSON.parse(localStorage.getItem('roblox_inventory')) : [];
let currentTheme = localStorage.getItem('roblox_theme') || 'modern';
let coins = localStorage.getItem('roblox_coins') ? parseInt(localStorage.getItem('roblox_coins')) : 50;

let loadTimer = null;
let dragonHp = 100;
let selectedGameName = '';

window.onload = function() {
    updateUIStats();
    document.getElementById('theme-selector').value = currentTheme;
    changeTheme(currentTheme, false);
};

function saveData() {
    localStorage.setItem('roblox_robux', robux);
    localStorage.setItem('roblox_inventory', JSON.stringify(inventory));
    localStorage.setItem('roblox_theme', currentTheme);
    localStorage.setItem('roblox_coins', coins);
}

function updateUIStats() {
    document.getElementById('robux-count').innerText = robux.toLocaleString();
    document.getElementById('profile-robux').innerText = robux.toLocaleString();
    document.getElementById('game-in-robux').innerText = robux.toLocaleString();
    document.getElementById('game-coins').innerText = coins.toLocaleString();
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'avatar') {
        renderInventory();
        updateAvatarDisplay();
    }
}

function launchGame(gameName, type = 'default') {
    selectedGameName = gameName;
    const overlay = document.getElementById('game-overlay');
    const statusText = document.getElementById('loading-status-text');
    const thumb = document.getElementById('custom-game-thumbnail');
    
    document.getElementById('loading-game-title').innerText = "Joining " + gameName + "...";
    
    if (type === 'dragon') {
        thumb.style.backgroundImage = "url('image_43c4e1.png')";
    } else {
        thumb.style.backgroundImage = "linear-gradient(135deg, #0074bd, #00a2ff)";
    }

    overlay.classList.add('active');

    let secondsLeft = 3;
    statusText.innerText = `Connecting to Roblox server (${secondsLeft}s)...`;

    if (loadTimer) clearInterval(loadTimer);

    loadTimer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            statusText.innerText = `Connecting to Roblox server (${secondsLeft}s)...`;
        } else {
            clearInterval(loadTimer);
            statusText.innerText = "Connected! Launching experience...";
            setTimeout(() => {
                overlay.classList.remove('active');
                openActiveGame(gameName);
            }, 500);
        }
    }, 1000);
}

function cancelGameLoad() {
    if (loadTimer) clearInterval(loadTimer);
    document.getElementById('game-overlay').classList.remove('active');
}

function openActiveGame(gameName) {
    document.getElementById('active-game-name-display').innerText = gameName;
    document.getElementById('active-game-window').classList.add('active');
    updateIngameAvatarDisplay();
}

function exitActiveGame() {
    document.getElementById('active-game-window').classList.remove('active');
    closeGameTab();
}

function attackDragon() {
    dragonHp -= 20;
    if (dragonHp <= 0) {
        dragonHp = 100;
        coins += 25;
        alert('🎉 Dragon Defeated! You earned +25 Coins!');
    }
    document.getElementById('dragon-hp').innerText = dragonHp;
    document.getElementById('dragon-health-fill').style.width = dragonHp + '%';
    document.getElementById('game-coins').innerText = coins;
    saveData();
}

function openGameTab(tab) {
    const drawer = document.getElementById('game-drawer');
    const title = document.getElementById('drawer-title');
    const content = document.getElementById('drawer-content');
    drawer.classList.add('active');

    if (tab === 'shop') {
        title.innerText = 'Game Shop (Robux)';
        content.innerHTML = `
            <div class="card" style="margin-bottom: 10px;">
                <div class="card-body">
                    <div class="card-title">Dragon Slayer Sword</div>
                    <div class="card-info">R$ 50</div>
                    <button class="buy-btn" onclick="buyItem(50, 'Dragon Sword', '#e74c3c')">Buy Gear</button>
                </div>
            </div>
            <div class="card" style="margin-bottom: 10px;">
                <div class="card-body">
                    <div class="card-title">Golden Shield</div>
                    <div class="card-info">R$ 30</div>
                    <button class="buy-btn" onclick="buyItem(30, 'Golden Shield', '#f1c40f')">Buy Gear</button>
                </div>
            </div>
        `;
    } else if (tab === 'inventory') {
        title.innerText = 'My Inventory';
        if (inventory.length === 0) {
            content.innerHTML = '<p style="color: #ccc; font-size: 13px;">Your inventory is empty. Buy items from Shop or main catalog!</p>';
            return;
        }
        content.innerHTML = '';
        inventory.forEach((item, index) => {
            content.innerHTML += `
                <div class="card" style="margin-bottom: 8px;">
                    <div class="card-body">
                        <div class="card-title" style="color: #000;">${item.name}</div>
                        <div class="card-info">${item.equipped ? '🟢 Equipped' : '⚪ Unequipped'}</div>
                        <button class="buy-btn" style="background: ${item.equipped ? '#e74c3c' : '#2ecc71'};" onclick="toggleEquipInGame(${index})">
                            ${item.equipped ? 'Remove' : 'Wear'}
                        </button>
                    </div>
                </div>
            `;
        });
    } else if (tab === 'trading') {
        title.innerText = 'Trade Center';
        content.innerHTML = `
            <p style="color: #ccc; font-size: 12px;">Trade items with online players!</p>
            <div class="card" style="margin-bottom: 10px;">
                <div class="card-body">
                    <div class="card-title" style="color: #000;">Trade with RobloxNoob123</div>
                    <div class="card-info">Offers: Epic Cape</div>
                    <button class="buy-btn" onclick="executeTrade('Epic Cape', '#9b59b6')">Accept Trade</button>
                </div>
            </div>
        `;
    }
}

function closeGameTab() {
    document.getElementById('game-drawer').classList.remove('active');
}

function executeTrade(itemName, color) {
    inventory.push({ name: itemName, color: color, equipped: false });
    saveData();
    alert(`Successfully traded and received ${itemName}! Check your inventory.`);
    openGameTab('inventory');
}

function toggleEquipInGame(index) {
    inventory[index].equipped = !inventory[index].equipped;
    saveData();
    openGameTab('inventory');
    updateIngameAvatarDisplay();
}

function changeTheme(theme, save = true) {
    currentTheme = theme;
    if (theme === '2018') {
        document.body.classList.add('theme-2018');
    } else {
        document.body.classList.remove('theme-2018');
    }
    if (save) saveData();
}

function addRobux(amount) {
    robux += amount;
    updateUIStats();
    saveData();
    alert('Successfully added ' + amount.toLocaleString() + ' Robux!');
}

function buyItem(cost, itemName, color) {
    if (robux >= cost) {
        robux -= cost;
        updateUIStats();
        inventory.push({ name: itemName, color: color, equipped: false });
        saveData();
        if (document.getElementById('avatar').classList.contains('active')) renderInventory();
        alert('Successfully purchased ' + itemName + '!');
    } else {
        alert('Not enough Robux! Go to the Robux tab for free balance.');
    }
}

function toggleEquip(index) {
    inventory[index].equipped = !inventory[index].equipped;
    saveData();
    renderInventory();
    updateAvatarDisplay();
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    if (inventory.length === 0) {
        grid.innerHTML = '<p>Your inventory is empty. Buy items from the Shop tab first!</p>';
        return;
    }
    inventory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="thumbnail" style="background: ${item.color};">${item.name}</div>
            <div class="card-body">
                <div class="card-title">${item.name}</div>
                <div class="card-info">${item.equipped ? '🟢 Equipped' : '⚪ Unequipped'}</div>
                <button class="buy-btn" style="background: ${item.equipped ? '#e74c3c' : '#2ecc71'};" onclick="toggleEquip(${index})">
                    ${item.equipped ? 'Remove' : 'Wear'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateAvatarDisplay() {
    const hatContainer = document.getElementById('hat-container');
    const equippedItems = inventory.filter(item => item.equipped);
    hatContainer.innerHTML = '';
    equippedItems.forEach(item => {
        const hatPiece = document.createElement('div');
        hatPiece.className = 'equipped-hat-badge';
        hatPiece.style.background = item.color;
        hatContainer.appendChild(hatPiece);
    });
}

function updateIngameAvatarDisplay() {
    const hatContainer = document.getElementById('ingame-hat-container');
    const equippedItems = inventory.filter(item => item.equipped);
    hatContainer.innerHTML = '';
    equippedItems.forEach(item => {
        const hatPiece = document.createElement('div');
        hatPiece.className = 'equipped-hat-badge';
        hatPiece.style.background = item.color;
        hatContainer.appendChild(hatPiece);
    });
}
