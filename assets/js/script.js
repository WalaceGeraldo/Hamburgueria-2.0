// Data
const defaultMenuItems = [
    // Burgers
    {
        id: 1,
        category: "burgers",
        name: "Clássico Premium",
        description: "Pão brioche, blend de 180g, queijo cheddar inglês, bacon crocante.",
        price: 32.90,
        image: "assets/img/hero_burger.png"
    },
    {
        id: 2,
        category: "burgers",
        name: "Double Smash",
        description: "Dois smashes de 100g, dobro de queijo, cebola caramelizada.",
        price: 38.90,
        image: "assets/img/burger_double.png"
    },
    {
        id: 3,
        category: "burgers",
        name: "Veggie Supreme",
        description: "Burger de grão de bico, cogumelos salteados, maionese verde.",
        price: 29.90,
        image: "assets/img/burger_veggie.png"
    },
    {
        id: 4,
        category: "burgers",
        name: "Chicken Crispy",
        description: "Peito de frango empanado, alface americana, molho tártaro.",
        price: 28.90,
        image: "assets/img/burger_chicken.png"
    },
    {
        id: 10,
        category: "burgers",
        name: "Bacon Blast",
        description: "Blend 180g, muito bacon, barbecue artesanal e onion rings.",
        price: 36.90,
        image: "assets/img/burger_bacon_blast.png"
    },
    {
        id: 11,
        category: "burgers",
        name: "Truffle King",
        description: "Blend 180g, maionese de trufas, rúcula e queijo brie.",
        price: 42.90,
        image: "assets/img/burger_truffle_king.png"
    },
    // Sides
    {
        id: 5,
        category: "sides",
        name: "Batata Rústica",
        description: "Batatas cortadas à mão, alecrim e maionese da casa.",
        price: 18.90,
        image: "assets/img/side_fries.png"
    },
    {
        id: 6,
        category: "sides",
        name: "Onion Rings",
        description: "Anéis de cebola empanados e crocantes.",
        price: 22.90,
        image: "assets/img/side_onion.png"
    },
    {
        id: 12,
        category: "sides",
        name: "Nuggets Artesanais",
        description: "Cubos de frango marinado empanados (8 unidades).",
        price: 24.90,
        image: "assets/img/side_nuggets.png"
    },
    // Drinks
    {
        id: 7,
        category: "drinks",
        name: "Coca-Cola Zero",
        description: "Lata 350ml.",
        price: 6.90,
        image: "assets/img/drink_coke.png"
    },
    {
        id: 8,
        category: "drinks",
        name: "Milkshake Oreo",
        description: "Sorvete de baunilha, pedaços de biscoito e chantilly.",
        price: 24.90,
        image: "assets/img/drink_shake.png"
    },
    {
        id: 9,
        category: "drinks",
        name: "Cerveja Artesanal",
        description: "IPA ou Weiss, 500ml.",
        price: 14.90,
        image: "assets/img/drink_beer.png"
    },
    {
        id: 13,
        category: "drinks",
        name: "Milkshake Morango",
        description: "Sorvete artesanal, calda da fruta e chantilly.",
        price: 19.90,
        image: "assets/img/drink_shake.png"
    },
    {
        id: 14,
        category: "drinks",
        name: "Milkshake Chocolate",
        description: "Chocolate belga 50%, calda de fudge e chantilly.",
        price: 21.90,
        image: "assets/img/drink_shake_chocolate.png"
    }
];

// Load from Storage or Use Default
let menuItems = JSON.parse(localStorage.getItem('products'));
if (!menuItems || menuItems.length === 0) {
    menuItems = defaultMenuItems;
    localStorage.setItem('products', JSON.stringify(menuItems));
} else {
    // Migration Fix: Correct old image paths in existing storage
    let updated = false;
    menuItems.forEach(item => {
        if (item.image === 'assets/img/coke.png') {
            item.image = 'assets/img/drink_coke.png';
            updated = true;
        }
        if (item.image === 'assets/img/milkshake.png') {
            item.image = 'assets/img/drink_shake.png';
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('products', JSON.stringify(menuItems));
        console.log("Product images updated in localStorage");
    }
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Only render menu if we are on a page with #menu-container
    // Only render menu if we are on a page with #menu-container
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        renderMenu();
        setupCategoryFilters();
    }

    // New: Render Homepage Highlights if present
    const highlightsSection = document.getElementById('menu-preview');
    if (highlightsSection) {
        // Find the grid inside it
        const grid = highlightsSection.querySelector('.menu-grid');
        if (grid) {
            // Render only top 6 items for example
            const highlights = menuItems.slice(0, 6);
            renderSpecificItems(highlights, grid);
        }
    }

    // Setup Cart Modal
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            // Save final cart state
            localStorage.setItem('cart', JSON.stringify(cart));
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }

    // Checkout Page Logic
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutItems();
    }

    checkAuth();
});

// Render Menu
function renderMenu(filter = 'all') {
    const container = document.getElementById('menu-container');
    if (!container) return;

    const filteredItems = filter === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === filter);

    renderSpecificItems(filteredItems, container);
}

function renderSpecificItems(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item';
        // Add data-category for filtering if needed, though simple rendering doesn't strictly need it for highlights
        card.setAttribute('data-category', item.category);

        card.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-info">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="price">R$ ${item.price.toFixed(2)}</span>
                </div>
                <p>${item.description}</p>
                <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: auto;">
                    <button class="btn-add" onclick="addToCart(${item.id})">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter Setup
function setupCategoryFilters() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Filter
            renderMenu(btn.dataset.category);
        });
    });
}

// Cart Functions
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    saveCart();

    // Animation feedback
    const btn = event.target.closest('button');
    const originalContent = btn.innerHTML; // Save original (icon)
    btn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Show Check
    btn.style.backgroundColor = '#2ecc71'; // Optional: Green color for success

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i>'; // Restore Cart Icon
        btn.style.backgroundColor = ''; // Restore Color
    }, 1000);
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartCount();
    renderCartItems();
    saveCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'flex';
    // Add open class in case CSS relies on it for opacity/transitions
    setTimeout(() => modal.classList.add('open'), 10);
    renderCartItems();
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px;">Seu carrinho está vazio</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <span style="font-weight: bold;">R$ ${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart(${item.id})" style="background: var(--primary-color); border:none; color:white; border-radius:4px; width:24px; height:24px; margin-left:10px; cursor:pointer;">-</button>
                    <button onclick="addToCart(${item.id})" style="background: var(--primary-color); border:none; color:white; border-radius:4px; width:24px; height:24px; margin-left:5px; cursor:pointer;">+</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    if (totalSpan) {
        totalSpan.textContent = total.toFixed(2);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Render Logic
function renderCheckoutItems() {
    const container = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (!container) return;

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>R$ ${itemTotal.toFixed(2)}</span>
        `;
        container.appendChild(div);
    });

    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    // Delivery fee is fixed R$ 5.00 in checkout.html
    const total = subtotal + 5.00;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}


// Auth Logic
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLinksReceiver = document.getElementById('auth-links');
    const userDisplayReceiver = document.getElementById('user-display');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const myOrdersBtn = document.getElementById('my-orders-btn');

    // On standard pages (index, menu, etc)
    // Check for auth-links container OR direct login button
    const loginBtn = document.getElementById('login-btn');
    const authContainer = authLinksReceiver || loginBtn;

    // We need to manage visibility. 
    // If we found a container/button AND a user-display:
    if (authContainer && userDisplayReceiver) {
        if (user) {
            if (authLinksReceiver) authLinksReceiver.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'none';

            userDisplayReceiver.style.display = 'flex';
            userDisplayReceiver.textContent = `Olá, ${user.name}`; // Set text directly if span is missing
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (myOrdersBtn) myOrdersBtn.style.display = 'inline-block';
        } else {
            if (authLinksReceiver) authLinksReceiver.style.display = 'flex';
            if (loginBtn) loginBtn.style.display = 'inline-block'; // or flex/block depending on CSS

            userDisplayReceiver.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (myOrdersBtn) myOrdersBtn.style.display = 'none';
        }
    }

    // Logout Helper
    if (logoutBtn) {
        logoutBtn.removeEventListener('click', logout); // Avoid duplicates
        logoutBtn.addEventListener('click', logout);
    }
}

function handleLogin(event) {
    if (event) event.preventDefault();

    // Try multiple ID variations to be safe
    const emailInput = document.getElementById("login-email") || document.getElementById("email");
    const passInput = document.getElementById("login-password") || document.getElementById("password");

    if (!emailInput || !passInput) {
        alert("Erro de versão: Por favor, pressione CTRL+F5 para atualizar o site.");
        console.error("Campos de login não encontrados no DOM. IDs esperados: login-email/email");
        return;
    }

    const email = emailInput.value;
    const password = passInput.value;
    if (email === 'admin@admin.com' && password === 'admin123') {
        const adminUser = { name: 'Administrador', email: email, role: 'seller' };
        localStorage.setItem('user', JSON.stringify(adminUser));
        window.location.href = 'dashboard.html';
        return;
    }

    // Normal User Check
    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
    const foundUser = usersDB.find(u => u.email === email && u.password === password);

    if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser));
        window.location.href = 'index.html';
    } else {
        alert('Email ou senha incorretos!');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];

    if (usersDB.find(u => u.email === email)) {
        alert('Email já cadastrado!');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        role: 'customer'
    };

    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB)); // Save DB
    localStorage.setItem('user', JSON.stringify(newUser));    // Auto login

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
