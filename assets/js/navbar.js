const navigationTemplate = `
    <nav id="nav">
        <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/blog/blog.html">Blog</a></li>
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/gallery/gallery.html">Our Gallery</a></li>
            <li><a href="/resources.html">Resources</a></li>
            <li><a href="/timeline.html">Timeline</a></li>
        </ul>
    </nav>

    <nav id="mobile-nav">
        <div class="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul id="mobile-menu">
            <li><a href="/index.html">Home</a></li>
            <li><a href="/blog/blog.html">Blog</a></li>
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/gallery/gallery.html">Our Gallery</a></li>
            <li><a href="/resources.html">Resources</a></li>
            <li><a href="/timeline.html">Timeline</a></li>
        </ul>
    </nav>
`;

// Function to initialize the navigation
function initializeNavigation() {
    // Insert the navigation template
    const navContainer = document.createElement('div');
    navContainer.innerHTML = navigationTemplate;
    
    // Replace existing nav elements
    const existingNav = document.getElementById('nav');
    const existingMobileNav = document.getElementById('mobile-nav');
    
    if (existingNav) {
        existingNav.replaceWith(navContainer.querySelector('#nav'));
    }
    
    if (existingMobileNav) {
        existingMobileNav.replaceWith(navContainer.querySelector('#mobile-nav'));
    }

    // Set up mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('current');
            navToggle.classList.toggle('current');
        });
    }

    // Set up current page highlighting
    highlightCurrentPage();
}

// Function to highlight the current page
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const allNavLinks = document.querySelectorAll('#nav a, #mobile-nav a');

    allNavLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname; // Get absolute path
        link.classList.remove('current'); // Clear previous highlights

        // Match exact path or nested paths
        if (
            currentPath === linkPath || 
            currentPath.startsWith(linkPath) && linkPath !== '/'
        ) {
            link.classList.add('current');
        }
    });
}


// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Handle dynamic navigation changes
window.addEventListener('popstate', highlightCurrentPage);