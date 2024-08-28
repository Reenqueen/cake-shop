let loggedInUser = null;

// Show a page by its ID
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Load cakes from local storage on page load or when filtering
function loadCakes(filterCategory = null) {
    const cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    const cakeContainer = document.getElementById('cake-container');
    cakeContainer.innerHTML = '';

    const filteredCakes = filterCategory 
        ? cakes.filter(cake => cake.category === filterCategory)
        : cakes;

    filteredCakes.forEach(cake => {
        const cakeCard = document.createElement('div');
        cakeCard.className = 'cake-card';
        cakeCard.innerHTML = `
            <img src="${cake.image}" alt="${cake.name}" class="cake-image">
            <h3>${cake.name}</h3>
            <p>${cake.price}</p>
            <button class="buyBtn" onclick="window.location.href='https://wa.me/0716347663?text=I%20want%20to%20buy%20${encodeURIComponent(cake.name)}%20for%20${encodeURIComponent(cake.price)}'">Buy</button>
        `;
        if (loggedInUser) {
            cakeCard.innerHTML += `<button class="deleteBtn" onclick="deleteCake(${cake.id})">Delete</button>`;
        }
        cakeContainer.appendChild(cakeCard);
    });
}

// Add a new cake to local storage
function addCake(name, price, category, imageUrl) {
    const cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    const cake = {
        id: Date.now(), // Unique ID for each cake
        name: name,
        price: price,
        category: category,
        image: imageUrl
    };
    cakes.push(cake);
    localStorage.setItem('cakes', JSON.stringify(cakes));
    loadCakes();
}

// Delete a cake from local storage
function deleteCake(id) {
    if (!loggedInUser) return;
    let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    cakes = cakes.filter(cake => cake.id !== id);
    localStorage.setItem('cakes', JSON.stringify(cakes));
    loadCakes();
}

// Event listener for login form
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username === 'admin' && password === 'REEN') {
        loggedInUser = username;
        showPage('home');
        document.getElementById('addCakeBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        loadCakes();
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password.';
    }
});

// Event listener for add cake form
document.getElementById('addCakeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (!loggedInUser) {
        alert('You need to be logged in to add a cake.');
        return;
    }

    const name = document.getElementById('cakeName').value;
    const price = document.getElementById('cakePrice').value;
    const category = document.getElementById('cakeCategory').value;
    const imageFile = document.getElementById('cakeImage').files[0];

    if (!name || !price || !category || !imageFile) {
        document.getElementById('addCakeError').textContent = 'All fields are required.';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        addCake(name, price, category, imageUrl);
        showPage('home');
    };

    reader.readAsDataURL(imageFile);
});

// Function to handle logout
function logout() {
    loggedInUser = null;
    document.getElementById('addCakeBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    loadCakes();
    showPage('home');
}

// Event listeners for category filtering
document.querySelectorAll('.categoryBtn').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        loadCakes(category);
    });
});

// Load all cakes on page load
window.onload = function() {
    loadCakes();
};
