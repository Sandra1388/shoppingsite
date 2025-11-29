// Authentication functions

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

// Get current logged-in user
function getCurrentUser() {
    const email = localStorage.getItem('loggedInUser');
    if (email) {
        return getUserByEmail(email);
    }
    return null;
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    // Support both shapes: { isAdmin: true } or { role: 'admin' }
    if (user.isAdmin === true) return true;
    if (user.role && String(user.role).toLowerCase() === 'admin') return true;
    return false;
}

// Login user
function loginUser(email, password) {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
        localStorage.setItem('loggedInUser', email);
        return user;
    }
    return null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Redirect to login if not authenticated
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Redirect to login if not admin
function requireAdmin() {
    if (!isAdmin()) {
        window.location.href = 'shop.html';
    }
}

// Update navbar based on login status
function updateNavbar() {
    const logoutBtn = document.getElementById('logoutBtn');
    const adminNav = document.getElementById('adminNav');
    const cartBadge = document.getElementById('cartBadge');

    if (logoutBtn) {
        if (isLoggedIn()) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', logoutUser);
        } else {
            logoutBtn.style.display = 'none';
        }
    }

    if (adminNav) {
        adminNav.style.display = isAdmin() ? 'block' : 'none';
    }

    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
    }
}

// Show snackbar notification
function showSnackbar(message, duration = 3000) {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) return;
    
    snackbar.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, duration);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update cart badge whenever cart changes
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
    }
}

// Initialize auth on every page
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});
