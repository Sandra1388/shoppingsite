// Registration page script

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Reset previous errors
        clearErrors();

        // Validation
        let isValid = true;

        if (!fullName) {
            showError('nameError', 'Full name is required');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (emailExists(email)) {
            showError('emailError', 'This email is already registered');
            isValid = false;
        }

        if (!password || password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            showError('confirmError', 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            // Register user
            addUser({
                name: fullName,
                email: email,
                password: password
            });

            showSnackbar('Account created successfully! Redirecting to login...', 2000);
            
            setTimeout(() => {
                window.location.href = 'login.html';
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
