// Products Data
const products = [
    {
        id: 1,
        name: "Laptop Dell",
        price: 899.99,
        category: "electronics",
        description: "Laptop casri ah oo degdega ah",
        icon: "fas fa-laptop"
    },
    {
        id: 2,
        name: "Telefoon Samsung",
        price: 699.99,
        category: "electronics",
        description: "Telefoon smartphone ah oo cusub",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 3,
        name: "Shaati Ragga",
        price: 29.99,
        category: "clothing",
        description: "Shaati qurux badan oo ragga",
        icon: "fas fa-tshirt"
    },
    {
        id: 4,
        name: "Jaakad Dumarka",
        price: 79.99,
        category: "clothing",
        description: "Jaakad casri ah oo dumarka",
        icon: "fas fa-female"
    },
    {
        id: 5,
        name: "Kursiga Quruxda leh",
        price: 199.99,
        category: "home",
        description: "Kursi raaxo leh oo guriga",
        icon: "fas fa-chair"
    },
    {
        id: 6,
        name: "Miiska Cunteeda",
        price: 299.99,
        category: "home",
        description: "Miis weyn oo qoyska",
        icon: "fas fa-table"
    },
    {
        id: 7,
        name: "Kubadda Cagta",
        price: 24.99,
        category: "sports",
        description: "Kubad cagta oo heer sare ah",
        icon: "fas fa-football-ball"
    },
    {
        id: 8,
        name: "Jeegga Jimicsiga",
        price: 49.99,
        category: "sports",
        description: "Jeeg jimicsi oo fudud",
        icon: "fas fa-dumbbell"
    },
    {
        id: 9,
        name: "Headphones Bluetooth",
        price: 129.99,
        category: "electronics",
        description: "Headphones wireless oo qurux badan",
        icon: "fas fa-headphones"
    },
    {
        id: 10,
        name: "Dhar Seedo",
        price: 39.99,
        category: "clothing",
        description: "Dhar jimicsi oo dumarka",
        icon: "fas fa-running"
    },
    {
        id: 11,
        name: "Nalalka Guriga",
        price: 89.99,
        category: "home",
        description: "Nalal qurux badan oo guriga",
        icon: "fas fa-lightbulb"
    },
    {
        id: 12,
        name: "Kubbadda Tennis",
        price: 19.99,
        category: "sports",
        description: "Kubbad tennis oo heer sare ah",
        icon: "fas fa-table-tennis"
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
    updateCartUI();
});

// Display products
function displayProducts(productsToShow) {
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Ku Dar Shanta
            </button>
        </div>
    `;
    
    return card;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(product.name);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Update cart items display
    updateCartItemsDisplay();
    
    // Enable/disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Update cart items display
function updateCartItemsDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Shantaadu waa baar</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Show cart notification
function showCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${productName} ayaa lagu daray shanta</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1002;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Product filtering
function filterProducts(category) {
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    displayProducts(filteredProducts);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
}

// Search functionality
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Smooth scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');
            filterProducts(category);
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            filterProducts(category);
            scrollToProducts();
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
        
        // Search button
        searchInput.nextElementSibling.addEventListener('click', searchProducts);
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-icon')) {
            cartSidebar.classList.remove('open');
        }
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Show success message
    showSuccessMessage('Farriintaada waa la soo diray! Waanu kula xiriiri doonaa dhawaan.');
    
    // Reset form
    e.target.reset();
}

// Handle newsletter form submission
function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showSuccessMessage('Waad ku biirtay liistada wararka!');
        e.target.reset();
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Show checkout modal or redirect to payment page
    const confirmMessage = `
        Alaabada: ${itemCount} shay
        Wadarta: $${total.toFixed(2)}
        
        Ma hubtaa inaad doonayso inaad bixiso?
    `;
    
    if (confirm(confirmMessage)) {
        // Simulate successful checkout
        showSuccessMessage('Bixintaadu waa guulaystay! Alaabada waa la soo geeyn doonaa 24 saacadood gudahood.');
        
        // Clear cart
        cart = [];
        updateCartUI();
        toggleCart();
    }
}

// Show success message
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 1003;
        text-align: center;
        max-width: 400px;
        animation: scaleIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'scaleOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Additional CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes scaleOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .quantity-btn {
        background: #667eea;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .quantity-btn:hover {
        background: #5a6fd8;
    }
    
    .quantity {
        background: #f8f9fa;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-weight: 600;
    }
    
    .remove-btn {
        background: #ff4757;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
    }
    
    .remove-btn:hover {
        background: #ff3838;
    }
    
    .cart-item-icon {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-open');
}

// Loading animation for products
function showLoadingProducts() {
    productGrid.innerHTML = `
        <div class="loading-products">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Alaabada la soo rarayo...</p>
        </div>
    `;
}

// Auto-close cart after 5 seconds of inactivity
let cartTimeout;
function resetCartTimeout() {
    clearTimeout(cartTimeout);
    if (cartSidebar.classList.contains('open')) {
        cartTimeout = setTimeout(() => {
            cartSidebar.classList.remove('open');
        }, 30000); // 30 seconds
    }
}

// Reset timeout on cart interaction
cartSidebar.addEventListener('mousemove', resetCartTimeout);
cartSidebar.addEventListener('click', resetCartTimeout);