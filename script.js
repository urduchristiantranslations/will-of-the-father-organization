const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


// Reveal content as it enters view, unless the visitor prefers reduced motion.
const revealTargets = document.querySelectorAll('.hero-copy, .hero-visual, .intro-band, .section-heading, .ministry-card, .story-photo, .story-copy, .quote-band, .faith-heading, .faith-copy, .give-mark, .give-copy, .give-section > .button, .contact-section > *, .site-footer > *, .ministry-page-intro-inner, .ministry-gallery-heading, .ministry-gallery-grid figure, .ministry-page-cta > *, .ministry-back');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });

  revealTargets.forEach((element, index) => {
    element.classList.add('motion-reveal');
    if (element.matches('.ministry-card, .ministry-gallery-grid figure')) {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    }
    revealObserver.observe(element);
  });
}
