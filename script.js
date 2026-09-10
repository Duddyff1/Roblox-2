let robux = 500;

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function changeTheme(theme) {
    if (theme === '2018') {
        document.body.classList.add('theme-2018');
    } else {
        document.body.classList.remove('theme-2018');
    }
}

function buyItem(cost, itemName) {
    if (robux >= cost) {
        robux -= cost;
        document.getElementById('robux-count').innerText = robux;
        alert('Purchased ' + itemName + ' successfully!');
    } else {
        alert('Not enough Robux!');
    }
}
