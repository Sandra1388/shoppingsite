// Cart page script

document.addEventListener('DOMContentLoaded', () => {
    // Check login status
    requireLogin();

    displayCart();
});

function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.style.display = 'block';
        updateSummary(0, []);
        return;
    }

    emptyCart.style.display = 'none';
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });

    updateSummary(getCartTotal(), cart);
}

function createCartItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'card shadow-lg material-card mb-3';

    const row = document.createElement('div');
    row.className = 'row g-0';

    // Image column
    const imgCol = document.createElement('div');
    imgCol.className = 'col-md-3';
    const img = document.createElement('img');
    img.src = `images/${item.imagename}`;
    img.className = 'img-fluid rounded-start';
    img.alt = item.name;
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    imgCol.appendChild(img);

    // Details column
    const detailsCol = document.createElement('div');
    detailsCol.className = 'col-md-9';
    
    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold';
    title.textContent = item.name;

    const price = document.createElement('p');
    price.className = 'card-text';
    price.innerHTML = `<strong>Price:</strong> ₹${item.price.toFixed(2)}`;

    // Quantity control
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'd-flex align-items-center my-3';
    quantityDiv.innerHTML = '<strong class="me-3">Quantity:</strong>';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'btn btn-sm btn-outline-secondary';
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
    decreaseBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
            updateCartQuantity(item.id, item.quantity - 1);
            displayCart();
            updateCartBadgeDisplay();
        }
    });

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity;
    quantityInput.className = 'form-control form-control-sm mx-2';
    quantityInput.style.width = '60px';
    quantityInput.min = '1';
    quantityInput.addEventListener('change', () => {
        const newQty = parseInt(quantityInput.value);
        if (newQty > 0) {
            updateCartQuantity(item.id, newQty);
            displayCart();
            updateCartBadgeDisplay();
        }
    });

    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'btn btn-sm btn-outline-secondary';
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
    increaseBtn.addEventListener('click', () => {
        updateCartQuantity(item.id, item.quantity + 1);
        displayCart();
        updateCartBadgeDisplay();
    });

    quantityDiv.appendChild(decreaseBtn);
    quantityDiv.appendChild(quantityInput);
    quantityDiv.appendChild(increaseBtn);

    // Total price
    const totalPrice = document.createElement('p');
    totalPrice.className = 'card-text';
    totalPrice.innerHTML = `<strong>Subtotal:</strong> <span class="text-success fw-bold">₹${(item.price * item.quantity).toFixed(2)}</span>`;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm material-button';
    deleteBtn.innerHTML = '<i class="fas fa-trash me-1"></i>Remove';
    deleteBtn.addEventListener('click', () => {
        removeFromCart(item.id);
        showSnackbar(`${item.name} removed from cart`, 2000);
        displayCart();
        updateCartBadgeDisplay();
    });

    body.appendChild(title);
    body.appendChild(price);
    body.appendChild(quantityDiv);
    body.appendChild(totalPrice);
    body.appendChild(deleteBtn);

    detailsCol.appendChild(body);
    row.appendChild(imgCol);
    row.appendChild(detailsCol);
    itemDiv.appendChild(row);

    return itemDiv;
}

function updateSummary(total, cart) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (subtotalEl) {
        subtotalEl.textContent = `₹${total.toFixed(2)}`;
    }
    if (totalEl) {
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }
}
