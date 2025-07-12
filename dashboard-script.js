// Dashboard JavaScript

// Sample data
const userData = {
    fullName: "Ahmed Maxamed Ali",
    firstName: "Ahmed",
    lastName: "Maxamed Ali",
    email: "ahmed@email.com",
    phone: "+252 61 234 5678",
    birthDate: "1990-01-15",
    gender: "male",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 1245,
    wishlistCount: 8
};

const ordersData = [
    {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered",
        total: 89.99,
        items: ["Laptop Dell", "Mouse"],
        itemCount: 2
    },
    {
        id: "ORD-002",
        date: "2024-01-10",
        status: "shipped",
        total: 156.50,
        items: ["Telefoon Samsung", "Kaardhka"],
        itemCount: 2
    },
    {
        id: "ORD-003",
        date: "2024-01-05",
        status: "pending",
        total: 245.00,
        items: ["Shaati Ragga", "Jaakad", "Kabo"],
        itemCount: 3
    }
];

const wishlistData = [
    {
        id: 1,
        name: "Laptop HP",
        price: 799.99,
        image: "fas fa-laptop",
        category: "electronics"
    },
    {
        id: 2,
        name: "Shaati Casri ah",
        price: 45.99,
        image: "fas fa-tshirt",
        category: "clothing"
    },
    {
        id: 3,
        name: "Kursi Qurux badan",
        price: 299.99,
        image: "fas fa-chair",
        category: "home"
    }
];

const addressesData = [
    {
        id: 1,
        type: "Guriga",
        name: "Ahmed Maxamed",
        street: "Wadada Makka Al-Mukarrama",
        city: "Muqdisho",
        country: "Soomaaliya",
        phone: "+252 61 234 5678",
        isDefault: true
    },
    {
        id: 2,
        type: "Shaqada",
        name: "Ahmed Maxamed",
        street: "Wadada Villa Somalia",
        city: "Muqdisho", 
        country: "Soomaaliya",
        phone: "+252 61 234 5678",
        isDefault: false
    }
];

const paymentMethodsData = [
    {
        id: 1,
        type: "Visa",
        number: "**** **** **** 1234",
        expiry: "12/26",
        isDefault: true
    },
    {
        id: 2,
        type: "MasterCard",
        number: "**** **** **** 5678",
        expiry: "08/25",
        isDefault: false
    }
];

// DOM Elements
const userNameSpan = document.getElementById('userName');
const userFullNameSpan = document.getElementById('userFullName');
const userDropdown = document.getElementById('userDropdown');
const totalOrdersSpan = document.getElementById('totalOrders');
const wishlistCountSpan = document.getElementById('wishlistCount');
const totalSpentSpan = document.getElementById('totalSpent');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    loadUserData();
    setupNavigation();
    setupEventListeners();
    loadDashboardData();
});

// Check if user is logged in
function checkUserLogin() {
    const savedLogin = localStorage.getItem('fadal_user') || sessionStorage.getItem('fadal_user');
    
    if (!savedLogin) {
        window.location.href = 'login.html';
        return;
    }
    
    const loginData = JSON.parse(savedLogin);
    const loginTime = new Date(loginData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    // Check if login is still valid
    const maxHours = loginData.remember ? 24 * 30 : 24;
    
    if (hoursDiff >= maxHours) {
        localStorage.removeItem('fadal_user');
        sessionStorage.removeItem('fadal_user');
        window.location.href = 'login.html';
        return;
    }
    
    // Update user data from login
    if (loginData.user) {
        userData.fullName = loginData.user.name;
        userData.email = loginData.user.email;
        userData.firstName = loginData.user.name.split(' ')[0];
    }
}

// Load user data
function loadUserData() {
    if (userNameSpan) userNameSpan.textContent = userData.firstName;
    if (userFullNameSpan) userFullNameSpan.textContent = userData.fullName;
    if (totalOrdersSpan) totalOrdersSpan.textContent = userData.totalOrders;
    if (wishlistCountSpan) wishlistCountSpan.textContent = userData.wishlistCount;
    if (totalSpentSpan) totalSpentSpan.textContent = `$${userData.totalSpent}`;
    
    // Load profile form data
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('profileEmail').value = userData.email;
        document.getElementById('profilePhone').value = userData.phone;
        document.getElementById('birthDate').value = userData.birthDate;
        document.getElementById('gender').value = userData.gender;
    }
}

// Setup navigation
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
                
                // Update active menu item
                menuItems.forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Setup tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            filterOrders(status);
            
            // Update active tab
            tabButtons.forEach(tb => tb.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Switch dashboard sections
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'overview':
                loadOverviewData();
                break;
            case 'orders':
                loadOrdersData();
                break;
            case 'wishlist':
                loadWishlistData();
                break;
            case 'addresses':
                loadAddressesData();
                break;
            case 'payment':
                loadPaymentMethodsData();
                break;
        }
    }
}

// Load overview data
function loadOverviewData() {
    loadRecentOrders();
}

// Load recent orders
function loadRecentOrders() {
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (!recentOrdersList) return;
    
    const recentOrders = ordersData.slice(0, 3);
    
    recentOrdersList.innerHTML = recentOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">#${order.id}</span>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <p><strong>Taariikhda:</strong> ${formatDate(order.date)}</p>
                <p><strong>Alaabada:</strong> ${order.itemCount} shay</p>
                <p><strong>Wadarta:</strong> $${order.total}</p>
            </div>
            <div class="order-actions">
                <button class="btn-secondary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Eeg
                </button>
            </div>
        </div>
    `).join('');
}

// Load orders data
function loadOrdersData() {
    const ordersGrid = document.getElementById('ordersGrid');
    if (!ordersGrid) return;
    
    displayOrders(ordersData);
}

// Display orders
function displayOrders(orders) {
    const ordersGrid = document.getElementById('ordersGrid');
    
    ordersGrid.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">#${order.id}</span>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <p><strong>Taariikhda:</strong> ${formatDate(order.date)}</p>
                <p><strong>Alaabada:</strong> ${order.items.join(', ')}</p>
                <p><strong>Tirada:</strong> ${order.itemCount} shay</p>
                <p><strong>Wadarta:</strong> $${order.total}</p>
            </div>
            <div class="order-actions">
                <button class="btn-primary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Eeg Faahfaahin
                </button>
                ${order.status === 'delivered' ? `
                    <button class="btn-secondary" onclick="reorderItems('${order.id}')">
                        <i class="fas fa-redo"></i> Iibso Mar kale
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Filter orders by status
function filterOrders(status) {
    let filteredOrders = ordersData;
    
    if (status !== 'all') {
        filteredOrders = ordersData.filter(order => order.status === status);
    }
    
    displayOrders(filteredOrders);
}

// Load wishlist data
function loadWishlistData() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!wishlistGrid) return;
    
    wishlistGrid.innerHTML = wishlistData.map(item => `
        <div class="wishlist-item">
            <div class="product-image">
                <i class="${item.image}"></i>
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <div class="product-price">$${item.price}</div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCartFromWishlist(${item.id})">
                        <i class="fas fa-shopping-cart"></i> Ku dar Shanta
                    </button>
                    <button class="btn-secondary" onclick="removeFromWishlist(${item.id})">
                        <i class="fas fa-trash"></i> Ka saar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load addresses data
function loadAddressesData() {
    const addressesGrid = document.getElementById('addressesGrid');
    if (!addressesGrid) return;
    
    addressesGrid.innerHTML = addressesData.map(address => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            <div class="address-type">${address.type}</div>
            <h4>${address.name}</h4>
            <p>${address.street}</p>
            <p>${address.city}, ${address.country}</p>
            <p>${address.phone}</p>
            ${address.isDefault ? '<p style="color: #28a745; font-weight: 500;">Ciwaanka Aasaasiga ah</p>' : ''}
            <div class="address-actions" style="margin-top: 1rem;">
                <button class="btn-secondary" onclick="editAddress(${address.id})">
                    <i class="fas fa-edit"></i> Beddel
                </button>
                <button class="btn-danger" onclick="deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i> Tirtir
                </button>
                ${!address.isDefault ? `
                    <button class="btn-primary" onclick="setDefaultAddress(${address.id})">
                        <i class="fas fa-star"></i> Ka dhig Aasaasi
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Load payment methods data
function loadPaymentMethodsData() {
    const paymentMethods = document.getElementById('paymentMethods');
    if (!paymentMethods) return;
    
    paymentMethods.innerHTML = paymentMethodsData.map(method => `
        <div class="payment-card ${method.isDefault ? 'default' : ''}">
            <div class="card-type">
                <i class="fab fa-cc-${method.type.toLowerCase()}"></i>
                <span>${method.type}</span>
                ${method.isDefault ? '<span style="color: #28a745; margin-left: auto; font-weight: 500;">Aasaasi</span>' : ''}
            </div>
            <div class="card-number">${method.number}</div>
            <div class="card-expiry">Ku dhacda: ${method.expiry}</div>
            <div class="card-actions" style="margin-top: 1rem;">
                <button class="btn-secondary" onclick="editPaymentMethod(${method.id})">
                    <i class="fas fa-edit"></i> Beddel
                </button>
                <button class="btn-danger" onclick="deletePaymentMethod(${method.id})">
                    <i class="fas fa-trash"></i> Tirtir
                </button>
                ${!method.isDefault ? `
                    <button class="btn-primary" onclick="setDefaultPayment(${method.id})">
                        <i class="fas fa-star"></i> Ka dhig Aasaasi
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // User dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            userDropdown.classList.remove('show');
        }
    });
}

// Toggle user menu
function toggleUserMenu() {
    userDropdown.classList.toggle('show');
}

// Navigate to specific section
function goToSection(sectionName) {
    // Update sidebar
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    switchSection(sectionName);
}

// Profile functions
function showProfile() {
    goToSection('profile');
    userDropdown.classList.remove('show');
}

function showSettings() {
    goToSection('settings');
    userDropdown.classList.remove('show');
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedData = {
        firstName: formData.get('firstName') || document.getElementById('firstName').value,
        lastName: formData.get('lastName') || document.getElementById('lastName').value,
        email: formData.get('email') || document.getElementById('profileEmail').value,
        phone: formData.get('phone') || document.getElementById('profilePhone').value,
        birthDate: formData.get('birthDate') || document.getElementById('birthDate').value,
        gender: formData.get('gender') || document.getElementById('gender').value
    };
    
    // Update userData
    Object.assign(userData, updatedData);
    userData.fullName = `${updatedData.firstName} ${updatedData.lastName}`;
    
    // Update displayed data
    loadUserData();
    
    showNotification('Profile waa la cusboonaysiiyay!', 'success');
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Sugitaan',
        'shipped': 'La diray',
        'delivered': 'La gaadhsiiyay',
        'cancelled': 'La joojiyay'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('so-SO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Order functions
function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        showNotification(`Eegitaan faahfaahinta dalabka #${orderId}`, 'info');
        // In real app, would open order details modal or page
    }
}

function reorderItems(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        showNotification(`Alaabada dalabka #${orderId} waa lagu daray shanta!`, 'success');
    }
}

// Wishlist functions
function addToCartFromWishlist(itemId) {
    const item = wishlistData.find(i => i.id === itemId);
    if (item) {
        showNotification(`${item.name} waa lagu daray shanta!`, 'success');
        // In real app, would add to shopping cart
    }
}

function removeFromWishlist(itemId) {
    const itemIndex = wishlistData.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        const item = wishlistData[itemIndex];
        wishlistData.splice(itemIndex, 1);
        userData.wishlistCount--;
        loadWishlistData();
        loadUserData();
        showNotification(`${item.name} waa laga saaray liiska jecelka!`, 'success');
    }
}

// Address functions
function editAddress(addressId) {
    showNotification('Bedelka ciwaanka waa la furi doonaa', 'info');
    // In real app, would open edit address modal
}

function deleteAddress(addressId) {
    if (confirm('Ma hubtaa inaad doonayso inaad tirtirid ciwaankan?')) {
        const addressIndex = addressesData.findIndex(a => a.id === addressId);
        if (addressIndex > -1) {
            addressesData.splice(addressIndex, 1);
            loadAddressesData();
            showNotification('Ciwaanka waa la tirtiray!', 'success');
        }
    }
}

function setDefaultAddress(addressId) {
    // Remove default from all addresses
    addressesData.forEach(address => address.isDefault = false);
    
    // Set new default
    const address = addressesData.find(a => a.id === addressId);
    if (address) {
        address.isDefault = true;
        loadAddressesData();
        showNotification('Ciwaanka cusub waa lagu dhigay aasaasi!', 'success');
    }
}

// Payment functions
function editPaymentMethod(methodId) {
    showNotification('Bedelka kaadhka waa la furi doonaa', 'info');
    // In real app, would open edit payment modal
}

function deletePaymentMethod(methodId) {
    if (confirm('Ma hubtaa inaad doonayso inaad tirtirid kaadhkan?')) {
        const methodIndex = paymentMethodsData.findIndex(m => m.id === methodId);
        if (methodIndex > -1) {
            paymentMethodsData.splice(methodIndex, 1);
            loadPaymentMethodsData();
            showNotification('Kaadhka waa la tirtiray!', 'success');
        }
    }
}

function setDefaultPayment(methodId) {
    // Remove default from all methods
    paymentMethodsData.forEach(method => method.isDefault = false);
    
    // Set new default
    const method = paymentMethodsData.find(m => m.id === methodId);
    if (method) {
        method.isDefault = true;
        loadPaymentMethodsData();
        showNotification('Kaadhka cusub waa lagu dhigay aasaasi!', 'success');
    }
}

// Modal functions
function showAddAddressModal() {
    showNotification('Modal darida ciwaanka waa la furi doonaa', 'info');
    // In real app, would open add address modal
}

function showAddPaymentModal() {
    showNotification('Modal darida kaadhka waa la furi doonaa', 'info');
    // In real app, would open add payment modal
}

function showChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.add('show');
}

function showDeleteAccountModal() {
    if (confirm('MA HUBAA INAAD DOONAYSO INAAD TIRTIRID AKOONKAAGA? Tallaabadan lama celin karo!')) {
        showNotification('Akoonka waa la tirtiray. Waxaad dib ugu soo noqon kartaa 30 maalood!', 'warning');
        // In real app, would delete account and logout
        setTimeout(() => {
            logout();
        }, 3000);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Logout function
function logout() {
    if (confirm('Ma hubtaa inaad doonayso inaad ka baxdo?')) {
        localStorage.removeItem('fadal_user');
        sessionStorage.removeItem('fadal_user');
        showNotification('Waa la ka baxay! Ku soo dhawoow mar kale.', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Load dashboard data
function loadDashboardData() {
    loadOverviewData();
}

// Notification system (reuse from previous files)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="close-notification" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1004;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInNotification 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        closeNotification(notification.querySelector('.close-notification'));
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

function closeNotification(btn) {
    const notification = btn.closest('.notification');
    notification.style.animation = 'slideOutNotification 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .btn-danger:hover {
        background: #c82333;
        transform: translateY(-1px);
    }
    
    .product-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .product-actions button {
        flex: 1;
        padding: 0.6rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .order-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    
    .order-actions button {
        padding: 0.6rem 1rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .close-notification {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
    }
    
    .modal.show {
        display: flex;
    }
`;
document.head.appendChild(style);