// Shop page script

let currentFilter = 'all';

// Robust admin check (reads LocalStorage). Returns true if logged-in user is admin.
function isAdminLocal() {
    try {
        const logged = localStorage.getItem('loggedInUser');
        if (!logged) return false;
        const usersRaw = localStorage.getItem('users');
        if (!usersRaw) return false;
        const users = JSON.parse(usersRaw);
        // loggedInUser may be email string or user object string
        let email = logged;
        try {
            const parsed = JSON.parse(logged);
            if (parsed && parsed.email) email = parsed.email;
        } catch (e) {
            // not JSON, assume email string
        }
        const user = users.find(u => u.email === email);
        // Support both legacy shapes: { isAdmin: true } or { role: 'admin' }
        if (!user) return false;
        return !!(user.isAdmin === true || (user.role && String(user.role).toLowerCase() === 'admin'));
    } catch (e) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check login status
    requireLogin();

    // Ensure navbar reflects current auth state (show admin link if admin)
    updateNavbar();

    // Determine admin status now (use auth.isAdmin() when available, otherwise read LocalStorage)
    const adminNow = (typeof isAdmin === 'function' && isAdmin()) || isAdminLocal();

    // Check for category filter in URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
        // Only accept allowed categories from the URL
        const allowed = ['lamps', 'walls', 'all'];
        if (allowed.includes(category)) {
            currentFilter = category;
            document.querySelector(`[data-filter="${category}"]`)?.classList.add('active');
            document.querySelector(`[data-filter="all"]`)?.classList.remove('active');
        }
    }

    // Load and display products
    displayProducts();

    // Show admin toolbar when admin is logged in
    const adminToolbar = document.getElementById('adminToolbar');
    if (adminNow && adminToolbar) {
        adminToolbar.style.display = 'block';

        const resetBtn = document.getElementById('resetProductsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('This will reset products to the default set. Continue?')) {
                    resetProductsToDefault();
                    showSnackbar('Products reset to default.', 1500);
                    displayProducts();
                }
            });
        }
    }

    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayProducts();
        });
    });
});

function displayProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const noProducts = document.getElementById('noProducts');
    
    productsContainer.innerHTML = '';
    
    // Get products based on filter
    let products;
    if (currentFilter === 'all') {
        products = getAllProducts();
    } else {
        products = getProductsByCategory(currentFilter);
    }

    // Enforce allowed categories (only show lamps and walls)
    const allowedCategories = ['lamps', 'walls'];
    products = products.filter(p => allowedCategories.includes(p.category));

    if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card shadow-lg material-card h-100 product-card';

    const image = document.createElement('img');
    image.src = `images/${product.imagename}`;
    image.className = 'card-img-top product-image';
    image.alt = product.name;

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold';
    title.textContent = product.name;

    const description = document.createElement('p');
    description.className = 'card-text text-muted flex-grow-1';
    description.textContent = product.description;

    const price = document.createElement('div');
    price.className = 'mb-3';
    price.innerHTML = `<h4 class="text-success fw-bold">₹${product.price.toFixed(2)}</h4>`;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'btn-group-vertical w-100 gap-2';

    // Add to Cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn btn-primary material-button fw-bold';
    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Add to Cart';
    addToCartBtn.addEventListener('click', () => {
        addToCart(product, 1);
        updateCartBadgeDisplay();
        showSnackbar(`${product.name} added to cart!`, 2000);
    });

    buttonsDiv.appendChild(addToCartBtn);

    // Admin buttons (use robust check at render-time)
    if (isAdminLocal() || (typeof isAdmin === 'function' && isAdmin())) {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn btn-warning material-button fw-bold';
        editBtn.innerHTML = '<i class="fas fa-edit me-2"></i>Edit';
        editBtn.addEventListener('click', () => {
            // Navigate explicitly to edit page
            window.location.href = `edit-product.html?id=${product.id}`;
        });
        buttonsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger material-button fw-bold';
        deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                try {
                    deleteProduct(product.id);
                    showSnackbar('Product deleted successfully!', 2000);
                    // Re-render products and ensure UI updates
                    displayProducts();
                } catch (e) {
                    console.error('Delete failed', e);
                    showSnackbar('Failed to delete product', 2000);
                }
            }
        });
        buttonsDiv.appendChild(deleteBtn);
    }

    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(price);
    body.appendChild(buttonsDiv);

    card.appendChild(image);
    card.appendChild(body);
    col.appendChild(card);

    return col;
}
