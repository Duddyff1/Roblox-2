let robux = 500;
let inventory = [];

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'profile') {
        updateProfileDisplay();
    }
}

function launchGame(gameName) {
    switchPage('game-player');
    document.getElementById('playing-title').innerText = "Joining " + gameName + "...";
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
        
        alert('Purchased ' + itemName + ' successfully! Check your Shop/Inventory tab.');
    } else {
        alert('Not enough Robux! Visit the Robux tab to get more for free.');
    }
}

function toggleEquip(index) {
    inventory[index].equipped = !inventory[index].equipped;
    renderInventory();
    updateProfileDisplay();
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    
    if (inventory.length === 0) {
        grid.innerHTML = '<p>Your inventory is empty. Buy items from the Catalog tab!</p>';
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

function updateProfileDisplay() {
    const avatarBox = document.getElementById('avatar-display');
    const equippedItems = inventory.filter(item => item.equipped);
    
    if (equippedItems.length === 0) {
        avatarBox.innerHTML = '<span>No Items Equipped</span>';
        return;
    }
    
    avatarBox.innerHTML = '';
    equippedItems.forEach(item => {
        const badge = document.createElement('div');
        badge.className = 'equipped-badge-item';
        badge.style.background = item.color;
        badge.innerText = item.name;
        avatarBox.appendChild(badge);
    });
}
