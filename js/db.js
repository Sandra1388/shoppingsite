// Database functions for managing users and products in LocalStorage

// Initialize database with default data
function initializeDatabase() {
    // Initialize users if not exists
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'admin123',
                isAdmin: true
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Initialize products if not exists
    if (!localStorage.getItem('products')) {
        const defaultProducts = getDefaultProducts();
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // If products exist but none belong to allowed categories, append sample lamps/walls
    else {
        const products = getAllProducts();
        const allowedCategories = ['lamps', 'walls'];
        const hasAllowed = products.some(p => allowedCategories.includes(p.category));
        if (!hasAllowed) {
            const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
            const sample = [
                {
                    id: maxId + 1,
                    name: 'Scandinavian Desk Lamp',
                    price: 39.99,
                    description: 'Minimalist desk lamp with warm LED light and wooden base',
                    category: 'lamps',
                    imagename: 'lamp1.jpeg'
                },
                {
                    id: maxId + 2,
                    name: 'Brass Accent Lamp',
                    price: 69.99,
                    description: 'Elegant brass accent lamp for bedside or living room',
                    category: 'lamps',
                    imagename: 'lamp5.jpeg'
                },
                {
                    id: maxId + 3,
                    name: 'Large Abstract Canvas',
                    price: 89.99,
                    description: 'Statement abstract canvas to elevate any wall',
                    category: 'walls',
                    imagename: 'wall1.jpeg'
                },
                {
                    id: maxId + 4,
                    name: 'Framed Geometric Print',
                    price: 49.99,
                    description: 'Modern geometric print in a sleek frame',
                    category: 'walls',
                    imagename: 'wall2.jpeg'
                }
            ];
            const merged = products.concat(sample);
            localStorage.setItem('products', JSON.stringify(merged));
        }
    }
}

// Return the default product list (kept in a function for reuse)
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Modern Table Lamp',
            price: 49.99,
            description: 'Elegant LED table lamp with adjustable brightness and USB charging port',
            category: 'lamps',
            imagename: 'lamp1.jpeg'
        },
        {
            id: 2,
            name: 'Vintage Floor Lamp',
            price: 79.99,
            description: 'Classic vintage-style floor lamp perfect for living rooms and bedrooms',
            category: 'lamps',
            imagename: 'lamp5.jpeg'
        },
        {
            id: 3,
            name: 'Abstract Wall Art',
            price: 34.99,
            description: 'Contemporary abstract wall art print on canvas with vibrant colors',
            category: 'walls',
            imagename: 'wall1.jpeg'
        },
        {
            id: 4,
            name: 'Geometric Wall Decor',
            price: 44.99,
            description: 'Modern geometric wall decoration with minimalist design',
            category: 'walls',
            imagename: 'wall2.jpeg'
        },
        {
            id: 5,
            name: 'Nature Wall Painting',
            price: 54.99,
            description: 'Beautiful nature-inspired wall painting for bedroom or living room',
            category: 'walls',
            imagename: 'wall3.jpeg'
        },
        {
            id: 6,
            name: 'Boho Wall Tapestry',
            price: 39.99,
            description: 'Bohemian style wall tapestry with intricate patterns',
            category: 'walls',
            imagename: 'wall4.jpeg'
        },
        {
            id: 7,
            name: 'Ocean Scene Canvas',
            price: 59.99,
            description: 'Stunning ocean landscape canvas print for beach-themed rooms',
            category: 'walls',
            imagename: 'wall5.jpeg'
        },
        {
            id: 8,
            name: 'Floral Wall Art',
            price: 44.99,
            description: 'Colorful floral wall art prints perfect for any room',
            category: 'walls',
            imagename: 'wall6.jpeg'
        },
        {
            id: 9,
            name: 'Sunset Wall Poster',
            price: 29.99,
            description: 'Beautiful sunset landscape wall poster with warm colors',
            category: 'walls',
            imagename: 'wall7.jpeg'
        },
        {
            id: 10,
            name: 'Minimalist Bedside Lamp',
            price: 34.99,
            description: 'Sleek bedside lamp with touch control and dimmable LED',
            category: 'lamps',
            imagename: 'lamp1.jpeg'
        },
        {
            id: 11,
            name: 'Industrial Pendant Lamp',
            price: 74.99,
            description: 'Matte black industrial pendant lamp for dining and kitchen islands',
            category: 'lamps',
            imagename: 'lamp5.jpeg'
        },
        {
            id: 12,
            name: 'Monochrome Line Art',
            price: 39.99,
            description: 'Stylish monochrome line art print for modern interiors',
            category: 'walls',
            imagename: 'wall3.jpeg'
        },
        {
            id: 13,
            name: 'Botanical Framed Print',
            price: 44.99,
            description: 'Framed botanical print set to bring nature indoors',
            category: 'walls',
            imagename: 'wall4.jpeg'
        }
    ];
}

// Reset products to the default set (admin helper)
function resetProductsToDefault() {
    localStorage.setItem('products', JSON.stringify(getDefaultProducts()));
}

// User functions
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email);
}

function addUser(userData) {
    const users = getAllUsers();
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
        isAdmin: false
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

function emailExists(email) {
    const users = getAllUsers();
    return users.some(user => user.email === email);
}

// Product functions
function getAllProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id === id);
}

function addProduct(productData) {
    const products = getAllProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...productData
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
}

function updateProduct(id, productData) {
    const products = getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        localStorage.setItem('products', JSON.stringify(products));
        return products[index];
    }
    return null;
}

function deleteProduct(id) {
    const products = getAllProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    return true;
}

function getProductsByCategory(category) {
    const products = getAllProducts();
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Cart functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    return filteredCart;
}

function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Initialize the database on page load
document.addEventListener('DOMContentLoaded', initializeDatabase);
