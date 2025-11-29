// Edit Product page script

document.addEventListener('DOMContentLoaded', () => {
    // Check login and admin status
    requireLogin();
    requireAdmin();

    // Get product ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    // Load product data
    const product = getProductById(productId);
    if (!product) {
        showSnackbar('Product not found!', 2000);
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 2000);
        return;
    }

    // Populate form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.imagename;

    const form = document.getElementById('editProductForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const description = document.getElementById('productDescription').value.trim();
        const category = document.getElementById('productCategory').value;
        const imagename = document.getElementById('productImage').value;

        // Reset previous errors
        clearErrors();

        // Validation
        let isValid = true;

        if (!name) {
            showError('nameError', 'Product name is required');
            isValid = false;
        }

        if (!price || price <= 0) {
            showError('priceError', 'Please enter a valid price');
            isValid = false;
        }

        if (!description) {
            showError('descError', 'Description is required');
            isValid = false;
        }

        if (!category) {
            showError('categoryError', 'Please select a category');
            isValid = false;
        }

        if (!imagename) {
            showError('imageError', 'Please select an image');
            isValid = false;
        }

        if (isValid) {
            // Update product
            updateProduct(productId, {
                name: name,
                price: price,
                description: description,
                category: category,
                imagename: imagename
            });

            showSnackbar('Product updated successfully!', 2000);
            
            setTimeout(() => {
                window.location.href = 'shop.html';
            }, 2000);
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.invalid-feedback');
        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }
});
