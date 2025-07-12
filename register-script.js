// Register Page JavaScript

// DOM Elements
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const newsletterCheckbox = document.getElementById('newsletter');
const successModal = document.getElementById('successModal');
const termsModal = document.getElementById('termsModal');
const welcomeUser = document.getElementById('welcomeUser');
const userEmail = document.getElementById('userEmail');

// Initialize register page
document.addEventListener('DOMContentLoaded', function() {
    setupRegisterForm();
    setupModals();
    addInputAnimations();
    setupRealTimeValidation();
});

// Setup register form
function setupRegisterForm() {
    registerForm.addEventListener('submit', handleRegister);
    
    // Add enter key support
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput && nextInput.type !== 'checkbox') {
                    nextInput.focus();
                } else {
                    registerForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        terms: termsCheckbox.checked,
        newsletter: newsletterCheckbox.checked
    };
    
    // Validate inputs
    if (!validateRegistrationInputs(formData)) {
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate server request delay
    setTimeout(() => {
        const registrationResult = processRegistration(formData);
        
        if (registrationResult.success) {
            handleSuccessfulRegistration(registrationResult.user);
        } else {
            handleFailedRegistration(registrationResult.message);
        }
        
        hideLoading();
    }, 2000);
}

// Validate registration inputs
function validateRegistrationInputs(data) {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate full name
    if (!data.fullName) {
        showError(fullNameInput, 'Fadlan gali magacaaga dhamaystiran');
        isValid = false;
    } else if (data.fullName.length < 3) {
        showError(fullNameInput, 'Magaca waa inuu 3 xaraf ka badan yahay');
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(data.fullName)) {
        showError(fullNameInput, 'Magaca kaliya xaraf iyo space ku qor');
        isValid = false;
    }
    
    // Validate email
    if (!data.email) {
        showError(emailInput, 'Fadlan gali email-kaaga');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showError(emailInput, 'Email sax ah gali');
        isValid = false;
    } else if (isEmailTaken(data.email)) {
        showError(emailInput, 'Email-kan horay loo isticmaalay');
        isValid = false;
    }
    
    // Validate phone
    if (!data.phone) {
        showError(phoneInput, 'Fadlan gali lambarkaaga telefoonka');
        isValid = false;
    } else if (!isValidSomaliPhone(data.phone)) {
        showError(phoneInput, 'Lambar telefoon sax ah gali (+252...)');
        isValid = false;
    }
    
    // Validate password
    if (!data.password) {
        showError(passwordInput, 'Fadlan gali fincaankaaga');
        isValid = false;
    } else if (!isStrongPassword(data.password)) {
        showError(passwordInput, 'Fincaanku waa inuu 8 xaraf, xaraf weyn, yar, iyo lambar leeyhay');
        isValid = false;
    }
    
    // Validate confirm password
    if (!data.confirmPassword) {
        showError(confirmPasswordInput, 'Fadlan xaqiiji fincaankaaga');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showError(confirmPasswordInput, 'Fincaannada ma isku mid aha');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!data.terms) {
        showError(termsCheckbox.closest('.checkbox-label'), 'Waa inaad aqbashaa shuruudaha');
        isValid = false;
    }
    
    return isValid;
}

// Process registration
function processRegistration(data) {
    // Simulate registration processing
    try {
        // In real app, this would be an API call
        const newUser = {
            id: Date.now(),
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            newsletter: data.newsletter,
            registrationDate: new Date().toISOString(),
            verified: false
        };
        
        // Store user (in real app, this would be on server)
        let users = JSON.parse(localStorage.getItem('fadal_users') || '[]');
        users.push(newUser);
        localStorage.setItem('fadal_users', JSON.stringify(users));
        
        return {
            success: true,
            user: newUser
        };
    } catch (error) {
        return {
            success: false,
            message: 'Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.'
        };
    }
}

// Handle successful registration
function handleSuccessfulRegistration(user) {
    // Update modal content
    welcomeUser.textContent = user.fullName;
    userEmail.textContent = user.email;
    
    // Show success modal
    showSuccessModal();
    
    // Clear form
    registerForm.reset();
    
    // Show success notification
    showNotification('Iscaddinta waa guulaystay! Email-ka xaqiijinta eeg.', 'success');
    
    // Send welcome email (simulation)
    sendWelcomeEmail(user);
}

// Handle failed registration
function handleFailedRegistration(message) {
    showNotification(message, 'error');
    
    // Shake the form
    registerForm.classList.add('shake');
    setTimeout(() => {
        registerForm.classList.remove('shake');
    }, 500);
    
    // Focus on first input with error
    const firstError = registerForm.querySelector('.error');
    if (firstError) {
        firstError.focus();
    }
}

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidSomaliPhone(phone) {
    // Somali phone number patterns
    const patterns = [
        /^\+252[0-9]{8,9}$/, // +252xxxxxxxx
        /^252[0-9]{8,9}$/, // 252xxxxxxxx
        /^0[0-9]{8,9}$/, // 0xxxxxxxx
        /^[1-9][0-9]{7,8}$/ // xxxxxxxx
    ];
    
    return patterns.some(pattern => pattern.test(phone.replace(/\s+/g, '')));
}

function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return password.length >= minLength && hasUpper && hasLower && hasNumber;
}

function isEmailTaken(email) {
    const users = JSON.parse(localStorage.getItem('fadal_users') || '[]');
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Password toggle functions
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Real-time validation
function setupRealTimeValidation() {
    // Full name validation
    fullNameInput.addEventListener('input', function() {
        clearError(this);
        const value = this.value.trim();
        if (value && value.length < 3) {
            showError(this, 'Magaca waa inuu 3 xaraf ka badan yahay');
        } else if (value && !/^[a-zA-Z\s]+$/.test(value)) {
            showError(this, 'Magaca kaliya xaraf iyo space ku qor');
        }
    });
    
    // Email validation
    emailInput.addEventListener('input', function() {
        clearError(this);
        const value = this.value.trim();
        if (value && !isValidEmail(value)) {
            showError(this, 'Email sax ah gali');
        } else if (value && isEmailTaken(value)) {
            showError(this, 'Email-kan horay loo isticmaalay');
        }
    });
    
    // Phone validation
    phoneInput.addEventListener('input', function() {
        clearError(this);
        const value = this.value.trim();
        if (value && !isValidSomaliPhone(value)) {
            showError(this, 'Lambar telefoon sax ah gali (+252...)');
        }
    });
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        clearError(this);
        const password = this.value;
        if (password) {
            showPasswordStrength(password);
            if (!isStrongPassword(password)) {
                showError(this, 'Fincaanku waa inuu 8 xaraf, xaraf weyn, yar, iyo lambar leeyhay');
            }
        }
    });
    
    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        clearError(this);
        const password = passwordInput.value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            showError(this, 'Fincaannada ma isku mid aha');
        }
    });
}

// Show password strength
function showPasswordStrength(password) {
    const strengthDiv = passwordInput.closest('.form-group').querySelector('.password-strength') || 
                       createPasswordStrengthIndicator();
    
    const strength = calculatePasswordStrength(password);
    strengthDiv.className = `password-strength ${strength.class}`;
    strengthDiv.textContent = strength.text;
}

function createPasswordStrengthIndicator() {
    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength';
    passwordInput.closest('.form-group').appendChild(strengthDiv);
    return strengthDiv;
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { class: 'weak', text: 'Fincaan daciif ah' };
    if (score <= 3) return { class: 'medium', text: 'Fincaan dhexdhexaad ah' };
    if (score <= 4) return { class: 'strong', text: 'Fincaan adag' };
    return { class: 'very-strong', text: 'Fincaan aad u adag' };
}

// Social registration
function registerWithGoogle() {
    showNotification('Google registration waa la dhisi doonaa mustaqbalka', 'info');
}

function registerWithFacebook() {
    showNotification('Facebook registration waa la dhisi doonaa mustaqbalka', 'info');
}

// Terms and privacy modals
function showTerms() {
    termsModal.classList.add('show');
}

function showPrivacy() {
    showNotification('Siyaasadda sirta waa la dhisi doonaa dhawaan', 'info');
}

function closeTermsModal() {
    termsModal.classList.remove('show');
}

function acceptTerms() {
    termsCheckbox.checked = true;
    clearError(termsCheckbox.closest('.checkbox-label'));
    closeTermsModal();
    showNotification('Shuruudaha waa la aqbalay', 'success');
}

// Modal functions
function setupModals() {
    // Close modals when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    termsModal.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            closeTermsModal();
        }
    });
}

function showSuccessModal() {
    successModal.classList.add('show');
}

function closeModal() {
    successModal.classList.remove('show');
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

// Loading states
function showLoading() {
    const submitBtn = registerForm.querySelector('.login-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iscaddinta...';
    submitBtn.disabled = true;
}

function hideLoading() {
    const submitBtn = registerForm.querySelector('.login-btn');
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Samee Akoonta';
    submitBtn.disabled = false;
}

// Send welcome email (simulation)
function sendWelcomeEmail(user) {
    setTimeout(() => {
        showNotification('Email ku soo dhawoowa ayaa la diray!', 'info');
    }, 1000);
}

// Error handling functions (reuse from login-script.js)
function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.closest('.checkbox-label');
    let errorMsg = formGroup.querySelector('.error-message');
    
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    if (input.tagName === 'INPUT') {
        input.classList.add('error');
    } else {
        formGroup.classList.add('error');
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group') || input.closest('.checkbox-label');
    const errorMsg = formGroup.querySelector('.error-message');
    
    if (errorMsg) {
        errorMsg.remove();
    }
    
    if (input.tagName === 'INPUT') {
        input.classList.remove('error');
    } else {
        formGroup.classList.remove('error');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.error').forEach(element => element.classList.remove('error'));
}

// Notification system (reuse from login-script.js)
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
        
        if (input.value) {
            input.closest('.form-group').classList.add('focused');
        }
    });
}

// Additional CSS for password strength and animations
const style = document.createElement('style');
style.textContent = `
    .password-strength {
        margin-top: 0.5rem;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
    }
    
    .password-strength.weak {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .password-strength.medium {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
    }
    
    .password-strength.strong {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .password-strength.very-strong {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-group input.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .checkbox-label.error {
        color: #dc3545;
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
`;
document.head.appendChild(style);