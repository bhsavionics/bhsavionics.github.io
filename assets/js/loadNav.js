document.addEventListener("DOMContentLoaded", function() {
    fetch('../nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-container').innerHTML = data;
            console.log('Navigation loaded');
            
            const navToggle = document.getElementById('navToggle');
            if (navToggle) {
                navToggle.addEventListener('click', toggleNav);
            } else {
                console.error('navToggle element not found');
            }
            
            setCurrentNavLink();
        })
        .catch(error => console.error('Error loading navigation:', error));
});

function toggleNav() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('open');
    } else {
        console.error('mobile-menu element not found');
    }
}

function setCurrentNavLink() {
    const path = window.location.pathname.split('/').pop();
    console.log('Current path:', path);
    
    const navLinks = document.querySelectorAll('#nav a, #mobile-nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        console.log('Checking link:', linkPath);
        if (linkPath === path) {
            link.parentElement.classList.add('current');
            console.log('Set current for:', link.getAttribute('href'));
        } else {
            link.parentElement.classList.remove('current');
        }
    });
}