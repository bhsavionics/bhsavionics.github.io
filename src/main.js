import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const toggleBtn = document.querySelector('#mobile-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Polaroid Scroll Entrance Animation
  const polaroidCards = document.querySelectorAll('.polaroid-scroll-anim');
  if (polaroidCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    polaroidCards.forEach(card => observer.observe(card));
  }

  // Contact / Application Form Submission
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("➔ APPLICATION RECEIVED! A BAAP officer will review your application and email you with meeting details.");
      contactForm.reset();
    });
  }

  // Smooth Scroll for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      }
    });
  });
});
