/* app.js - utilities + page logic for Home Decor Shop (Lamps + Wall Art) */

/* ---------------------------
   Utilities (localStorage helpers)
   --------------------------- */
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getProducts() { return JSON.parse(localStorage.getItem('products') || '[]'); }
function saveProducts(p) { localStorage.setItem('products', JSON.stringify(p)); }
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function formatPrice(p) { return '₹' + Number(p).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
function generateId() { return Date.now() + Math.floor(Math.random() * 9999); }

function showSnackbar(message, type = 'success', duration = 2200) {
  const id = type === 'success' ? 'successSnackbar' : 'errorSnackbar';
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

(function initDemo() {
  if (!localStorage.getItem('products')) {
    const demoProducts = [
      // Lamps
      { id: generateId(), name: 'Aurora Table Lamp', description: 'Dim-to-warm glass lamp with wood base', price: 2499, image: 'lamp1.jpeg', category: 'Lamps' },
      { id: generateId(), name: 'Nimbus Floor Lamp', description: 'Tall minimalist floor lamp with fabric shade', price: 5999, image: 'lamp2.jpeg', category: 'Lamps' },
      { id: generateId(), name: 'Elegance Desk Lamp', description: 'Sleek metal desk lamp', price: 1999, image: 'lamp3.jpeg', category: 'Lamps' },
      { id: generateId(), name: 'Cosmo Night Lamp', description: 'Soft ambient lighting for bedroom', price: 1499, image: 'lamp4.jpeg', category: 'Lamps' },
      { id: generateId(), name: 'Luna Floor Lamp', description: 'Modern arc floor lamp with LED', price: 7999, image: 'lamp5.jpeg', category: 'Lamps' },

      // Wall Art
      { id: generateId(), name: 'Blossom Wall Art', description: 'Floral canvas print with pastel tones', price: 1999, image: 'wall1.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Geometric Trio', description: 'Set of three framed geometric prints', price: 3499, image: 'wall2.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Serenity Landscape', description: 'Peaceful nature canvas art', price: 2999, image: 'wall3.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Abstract Colors', description: 'Vibrant abstract painting for living room', price: 3999, image: 'wall4.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Vintage Poster', description: 'Retro-style decorative poster', price: 1599, image: 'wall5.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Ocean Breeze', description: 'Blue ocean themed wall decor', price: 2599, image: 'wall6.jpeg', category: 'Wall Art' },
      { id: generateId(), name: 'Mountain Peaks', description: 'Majestic mountain landscape print', price: 2899, image: 'wall7.jpeg', category: 'Wall Art' },
    ];
    saveProducts(demoProducts);
  }

  if (!localStorage.getItem('users')) {
    const demoUsers = [
      { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', isAdmin: true, createdAt: new Date().toISOString() },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'password', isAdmin: false, createdAt: new Date().toISOString() }
    ];
    saveUsers(demoUsers);
  }

  if (!localStorage.getItem('cart')) saveCart([]);
})();

/* ---------------------------
   Authentication helpers
   --------------------------- */
function currentUser() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
function loggedIn() { return !!localStorage.getItem('loggedInUser'); }

/* ---------------------------
   Common UI helpers
   --------------------------- */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  badge.textContent = total;
}

/* ---------------------------
   Render products for shop & featured
   --------------------------- */
function renderProducts(containerSelector, products) {
  const cont = document.querySelector(containerSelector);
  if (!cont) return;
  cont.innerHTML = '';
  if (!products.length) {
    cont.innerHTML = '<div class="text-muted">No products found</div>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid';
  products.forEach(p => {
    const col = document.createElement('div');
    col.className = 'card';
    col.innerHTML = `
      <img class="card-img" src="${p.image}" alt="${p.name}" style="height:200px;object-fit:cover;border-radius:6px">
      <div class="card-body">
        <div class="card-title fw-bold">${p.name}</div>
        <div class="card-text">${p.description}</div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="text-primary fw-bold">${formatPrice(p.price)}</div>
          <button class="btn btn-sm btn-success add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  cont.appendChild(grid);

  // attach add to cart handlers
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      addToCartById(id);
    });
  });
}

/* ---------------------------
   Cart functions
   --------------------------- */
function addToCartById(id) {
  const products = getProducts();
  const p = products.find(x => String(x.id) === String(id));
  if (!p) { showSnackbar('Product not found', 'error'); return; }
  const cart = getCart();
  const found = cart.find(i => String(i.id) === String(p.id));
  if (found) found.quantity += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
  saveCart(cart);
  updateCartBadge();
  showSnackbar('Added to cart', 'success');
}

/* ---------------------------
   Expose to window
   --------------------------- */
window.ShopApp = {
  getUsers, saveUsers,
  getProducts, saveProducts,
  getCart, saveCart,
  isValidEmail, formatPrice, generateId,
  showSnackbar, updateCartBadge, renderProducts, addToCartById,
  currentUser, loggedIn
};
