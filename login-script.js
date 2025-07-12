// Login Page JavaScript

// Demo users database
const demoUsers = {
    'macaamiil@fadal.so': {
        password: 'macaamiil123',
        name: 'Ahmed Macaamiil',
        role: 'customer'
    },
    'admin@fadal.so': {
        password: 'admin123',
        name: 'Xaasan Maamule',
        role: 'admin'
    }
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const successModal = document.getElementById('successModal');
const forgotModal = document.getElementById('forgotModal');
const welcomeUser = document.getElementById('welcomeUser');

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    setupModals();
    checkExistingLogin();
    addInputAnimations();
});

// Setup login form
function setupLoginForm() {
    loginForm.addEventListener('submit', handleLogin);
    
    // Add real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    // Add enter key support
    emailInput.addEventListener('keypress', handleEnterKey);
    passwordInput.addEventListener('keypress', handleEnterKey);
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // Validate inputs
    if (!validateLoginInputs(email, password)) {
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate server request delay
    setTimeout(() => {
        const loginResult = authenticateUser(email, password);
        
        if (loginResult.success) {
            handleSuccessfulLogin(loginResult.user, remember);
        } else {
            handleFailedLogin(loginResult.message);
        }
        
        hideLoading();
    }, 1500);
}

// Validate login inputs
function validateLoginInputs(email, password) {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate email
    if (!email) {
        showError(emailInput, 'Fadlan gali email-kaaga');
        isValid = false;
    } else if (!isValidEmail(email) && !isValidUsername(email)) {
        showError(emailInput, 'Email ama username sax ah gali');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError(passwordInput, 'Fadlan gali fincaankaaga');
        isValid = false;
    } else if (password.length < 6) {
        showError(passwordInput, 'Fincaanku waa inuu 6 xaraf ka badan yahay');
        isValid = false;
    }
    
    return isValid;
}

// Authenticate user
function authenticateUser(email, password) {
    const user = demoUsers[email.toLowerCase()];
    
    if (!user) {
        return {
            success: false,
            message: 'Email-kan ma jiro nidaamka'
        };
    }
    
    if (user.password !== password) {
        return {
            success: false,
            message: 'Fincaanku waa khalad'
        };
    }
    
    return {
        success: true,
        user: {
            email: email,
            name: user.name,
            role: user.role
        }
    };
}

// Handle successful login
function handleSuccessfulLogin(user, remember) {
    // Store user data
    const loginData = {
        user: user,
        loginTime: new Date().toISOString(),
        remember: remember
    };
    
    if (remember) {
        localStorage.setItem('fadal_user', JSON.stringify(loginData));
    } else {
        sessionStorage.setItem('fadal_user', JSON.stringify(loginData));
    }
    
    // Show success message
    welcomeUser.textContent = user.name;
    showSuccessModal();
    
    // Clear form
    loginForm.reset();
    
    // Show success notification
    showNotification('Soo galitaankii waa guulaystay!', 'success');
}

// Handle failed login
function handleFailedLogin(message) {
    showNotification(message, 'error');
    
    // Shake the form
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
    
    // Focus on email input
    emailInput.focus();
}

// Show loading state
function showLoading() {
    const submitBtn = loginForm.querySelector('.login-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Soo galitaan...';
    submitBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
    const submitBtn = loginForm.querySelector('.login-btn');
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Soo Gal';
    submitBtn.disabled = false;
}

// Toggle password visibility
function togglePassword() {
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Fill demo user credentials
function fillDemoUser(email, password) {
    emailInput.value = email;
    passwordInput.value = password;
    
    // Add highlight animation
    emailInput.style.background = '#e8f5e8';
    passwordInput.style.background = '#e8f5e8';
    
    setTimeout(() => {
        emailInput.style.background = '';
        passwordInput.style.background = '';
    }, 1000);
    
    showNotification('Demo akoonka waa la buuxiyay!', 'info');
}

// Social login functions
function loginWithGoogle() {
    showNotification('Google login waa la dhisi doonaa mustaqbalka', 'info');
}

function loginWithFacebook() {
    showNotification('Facebook login waa la dhisi doonaa mustaqbalka', 'info');
}

// Forgot password functionality
function showForgotPassword() {
    forgotModal.classList.add('show');
}

function closeForgotModal() {
    forgotModal.classList.remove('show');
}

function sendResetEmail() {
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showNotification('Fadlan gali email-kaaga', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email sax ah gali', 'error');
        return;
    }
    
    // Simulate sending email
    showNotification('Email-ka dib u hela waa la diray!', 'success');
    closeForgotModal();
    document.getElementById('forgotEmail').value = '';
}

// Modal functions
function setupModals() {
    // Close modals when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    forgotModal.addEventListener('click', function(e) {
        if (e.target === forgotModal) {
            closeForgotModal();
        }
    });
}

function showSuccessModal() {
    successModal.classList.add('show');
}

function closeModal() {
    successModal.classList.remove('show');
}

function redirectToHome() {
    window.location.href = 'dashboard.html';
}

// Validation functions
function validateEmail() {
    const email = emailInput.value.trim();
    clearError(emailInput);
    
    if (email && !isValidEmail(email) && !isValidUsername(email)) {
        showError(emailInput, 'Email ama username sax ah gali');
    }
}

function validatePassword() {
    const password = passwordInput.value;
    clearError(passwordInput);
    
    if (password && password.length < 6) {
        showError(passwordInput, 'Fincaanku waa inuu 6 xaraf ka badan yahay');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Error handling functions
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorMsg = formGroup.querySelector('.error-message');
    
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-message');
    
    if (errorMsg) {
        errorMsg.remove();
    }
    
    input.classList.remove('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
}

// Notification system
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
    
    // Style the notification
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
    
    // Auto remove after 5 seconds
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

// Check for existing login
function checkExistingLogin() {
    const savedLogin = localStorage.getItem('fadal_user') || sessionStorage.getItem('fadal_user');
    
    if (savedLogin) {
        const loginData = JSON.parse(savedLogin);
        const loginTime = new Date(loginData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // Check if login is still valid (30 days for remember me, 24 hours for session)
        const maxHours = loginData.remember ? 24 * 30 : 24;
        
        if (hoursDiff < maxHours) {
            // User is already logged in
            showNotification(`Ku soo dhawoow dib, ${loginData.user.name}!`, 'info');
            
            // Option to continue to homepage
            setTimeout(() => {
                if (confirm('Adigu si horeba u soo gashay. Ma doonaysaa inaad aadid bogga hore?')) {
                    window.location.href = 'index.html';
                }
            }, 2000);
        } else {
            // Login expired, clear it
            localStorage.removeItem('fadal_user');
            sessionStorage.removeItem('fadal_user');
        }
    }
}

// Input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-group input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.form-group').classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.closest('.form-group').classList.add('focused');
        }
    });
}

// Handle enter key press
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        
        if (e.target === emailInput) {
            passwordInput.focus();
        } else if (e.target === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
}

// Add CSS for animations and error states
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
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
    
    .form-group input.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .error-message::before {
        content: '⚠️';
        font-size: 0.875rem;
    }
    
    .form-group.focused label {
        color: #667eea;
    }
    
    .close-notification {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    }
    
    .close-notification:hover {
        opacity: 0.8;
    }
    
    .notification {
        word-wrap: break-word;
    }
`;
document.head.appendChild(style);