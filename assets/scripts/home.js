document.addEventListener("DOMContentLoaded", function () {
    // Animation for welcome text
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        setTimeout(() => {
            welcomeText.classList.add('fade-in');
        }, 300);
    }

    // Button hover effect
    const loginButton = document.querySelector('.btn-masuk');
    if (loginButton) {
        loginButton.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        loginButton.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    }
});