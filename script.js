let robux = 500;
let inventory = [];

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'avatar') {
        renderInventory();
        updateAvatarDisplay();
    }
}

function launchGame(gameName) {
    const overlay = document.getElementById('game-overlay');
    document.getElementById('loading-game-title').innerText = "Joining " + gameName + "...";
    overlay.classList.add('active');
}

function leaveGame() {
    const overlay = document.getElementById('game-overlay');
    overlay.classList.remove('active');
}

function changeTheme(theme) {
    if (theme === '2018') {
        document.body.classList.add('theme-2018');
    } else {
        document.body.classList.remove('theme-2018');
    }
}

function addRobux(amount) {
    robux += amount;
    document.getElementById('robux-count').innerText = robux.toLocaleString();
    document.getElementById('profile-robux').innerText = robux.toLocaleString();
    alert('Successfully added ' + amount.toLocaleString() + ' Robux (Free Fake Money)!');
}

function buyItem(cost, itemName, color) {
    if (robux >= cost) {
        robux -= cost;
        document.getElementById('robux-count').innerText = robux.toLocaleString();
        document.getElementById('profile-robux').innerText = robux.toLocaleString();
        
        inventory.push({ name: itemName, color: color, equipped: false });
        renderInventory();
        
        alert('Successfully purchased ' + itemName + '! Go to your Avatar tab to wear it.');
    } else {
        alert('Not enough Robux! Visit the Robux tab to get more for free.');
    }
}

function toggleEquip(index) {
    inventory[index].equipped = !inventory[index].equipped;
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
