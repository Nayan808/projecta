// Authentication State
let currentUser = null;

// Google Sign-in Handler
function handleCredentialResponse(response) {
    // Decode the JWT token
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Set current user
    currentUser = {
        email: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture,
        provider: 'google'
    };
    
    // Update UI
    updateAuthUI();
    closeModal('login-modal');
    showSuccess('Successfully signed in with Google!');
}

// Decode JWT token
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Email Sign-in Handler
function handleEmailSignIn(email, password) {
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful sign-in
    currentUser = {
        email: email,
        name: email.split('@')[0],
        provider: 'email'
    };
    
    updateAuthUI();
    closeModal('login-modal');
    showSuccess('Successfully signed in!');
}

// Email Sign-up Handler
function handleEmailSignUp(email, password, confirmPassword) {
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful sign-up
    currentUser = {
        email: email,
        name: email.split('@')[0],
        provider: 'email'
    };
    
    updateAuthUI();
    closeModal('signup-modal');
    showSuccess('Successfully signed up!');
}

// Forgot Password Handler
function handleForgotPassword(email) {
    // Simulate sending OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // In a real application, you would send this OTP via email
    console.log('OTP for', email, ':', otp);
    
    // Store OTP in sessionStorage for verification
    sessionStorage.setItem('passwordResetOTP', otp);
    sessionStorage.setItem('passwordResetEmail', email);
    
    showSuccess('OTP has been sent to your email!');
    showOTPVerificationModal();
}

// OTP Verification Handler
function verifyOTP(enteredOTP) {
    const storedOTP = sessionStorage.getItem('passwordResetOTP');
    const email = sessionStorage.getItem('passwordResetEmail');
    
    if (enteredOTP === storedOTP) {
        showPasswordResetModal();
    } else {
        showError('Invalid OTP! Please try again.');
    }
}

// Password Reset Handler
function handlePasswordReset(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    const email = sessionStorage.getItem('passwordResetEmail');
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful password reset
    showSuccess('Password successfully reset!');
    closeModal('password-reset-modal');
    
    // Clear session storage
    sessionStorage.removeItem('passwordResetOTP');
    sessionStorage.removeItem('passwordResetEmail');
}

// Sign Out Handler
function handleSignOut() {
    currentUser = null;
    updateAuthUI();
    showSuccess('Successfully signed out!');
}

// Update UI based on authentication state
function updateAuthUI() {
    const authButtons = document.querySelector('.nav-actions');
    if (currentUser) {
        authButtons.innerHTML = `
            <button id="theme-toggle" onclick="toggleTheme()">
                <i class="fas fa-moon"></i>
            </button>
            <div class="user-profile">
                ${currentUser.picture ? 
                    `<img src="${currentUser.picture}" alt="Profile" class="profile-pic">` :
                    `<i class="fas fa-user"></i>`
                }
                <span>${currentUser.name}</span>
            </div>
            <button class="logout-btn" onclick="handleSignOut()">Sign Out</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button id="theme-toggle" onclick="toggleTheme()">
                <i class="fas fa-moon"></i>
            </button>
            <button class="login-btn" onclick="showLoginModal()">Sign In</button>
            <button class="signup-btn" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sign-in
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleCredentialResponse
    });
    
    // Handle Email Sign-in Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            handleEmailSignIn(email, password);
        });
    }
    
    // Handle Email Sign-up Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            const confirmPassword = this.querySelector('input[name="confirm-password"]').value;
            handleEmailSignUp(email, password, confirmPassword);
        });
    }
    
    // Handle Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            handleForgotPassword(email);
        });
    }
    
    // Handle OTP Verification Form
    const otpForm = document.getElementById('otp-form');
    if (otpForm) {
        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const otp = this.querySelector('input[type="text"]').value;
            verifyOTP(otp);
        });
    }
    
    // Handle Password Reset Form
    const passwordResetForm = document.getElementById('password-reset-form');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPassword = this.querySelector('input[name="new-password"]').value;
            const confirmPassword = this.querySelector('input[name="confirm-password"]').value;
            handlePasswordReset(newPassword, confirmPassword);
        });
    }
});