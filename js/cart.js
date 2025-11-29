// Cart functions
function updateCartBadgeDisplay() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
    }
}

// Observe cart changes
window.addEventListener('storage', updateCartBadgeDisplay);
document.addEventListener('DOMContentLoaded', updateCartBadgeDisplay);
