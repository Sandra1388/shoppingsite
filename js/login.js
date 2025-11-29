// Login page script

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Reset previous errors
        clearErrors();

        // Validation
        let isValid = true;

        if (!email) {
            showError('emailError', 'Email is required');
            isValid = false;
        }

        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }

        if (isValid) {
            // Authenticate user
            const user = loginUser(email, password);
            
            if (user) {
                showSnackbar('Login successful!', 1500);
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showSnackbar('Invalid email or password', 2000);
                showError('emailError', 'Invalid credentials');
            }
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
