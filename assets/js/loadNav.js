document.addEventListener("DOMContentLoaded", function () {
    fetch('/nav.html')
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
    const path = window.location.pathname.toLowerCase(); // Normalize the current path
    console.log('Current path:', path);

    const navLinks = document.querySelectorAll('#nav a, #mobile-nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase(); // Normalize link paths
        console.log('Checking link:', linkPath);

        // Special case for /blog/posts/
        if (path.startsWith('/blog/posts/')) {
            if (linkPath === '/blog/blog.html') {
                link.parentElement.classList.add('current');
                console.log('Set current for blog directory:', linkPath);
            }
        } 
        // Special case for /gallery/ subpaths
        else if (path.startsWith('/gallery/') && !path.endsWith('/gallery.html')) {
            if (linkPath === '/gallery/gallery.html') {
                link.parentElement.classList.add('current');
                console.log('Set current for gallery directory:', linkPath);
            }
        } 
        // General matching for other links
        else if (path === linkPath || path.startsWith(`${linkPath}/`)) {
            link.parentElement.classList.add('current');
            console.log('Set current for:', linkPath);
        } else {
            link.parentElement.classList.remove('current');
        }
    });
}