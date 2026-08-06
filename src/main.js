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

  // Interactive Sticky Scroll Timeline Handler
  const timelineSection = document.getElementById('timeline');
  const timelineTrack = document.getElementById('timeline-track');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineStep = document.getElementById('timeline-step');

  if (timelineSection && timelineTrack) {
    const handleTimelineScroll = () => {
      const rect = timelineSection.getBoundingClientRect();
      const sectionHeight = timelineSection.offsetHeight - window.innerHeight;
      if (sectionHeight <= 0) return;

      const currentScroll = -rect.top;
      let progress = currentScroll / sectionHeight;
      progress = Math.max(0, Math.min(1, progress));

      if (timelineProgress) {
        timelineProgress.style.width = `${progress * 100}%`;
      }

      const totalShift = timelineTrack.scrollWidth - timelineTrack.clientWidth;
      if (totalShift > 0) {
        timelineTrack.style.transform = `translateX(-${progress * totalShift}px)`;
      }

      if (timelineStep) {
        const activeIndex = Math.min(6, Math.max(1, Math.floor(progress * 6) + 1));
        timelineStep.textContent = `MILESTONE ${activeIndex} OF 6`;
      }
    };

    window.addEventListener('scroll', handleTimelineScroll, { passive: true });
    window.addEventListener('resize', handleTimelineScroll, { passive: true });
    handleTimelineScroll();
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
