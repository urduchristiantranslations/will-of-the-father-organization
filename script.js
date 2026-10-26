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
const revealTargets = document.querySelectorAll('.hero-copy, .hero-scroll, .intro-photo, .intro-copy, .intro-band, .section-heading, .ministry-feature, .ministry-list-item, .photo-story-item, .ministry-card, .story-photo, .story-copy, .quote-band, .faith-heading, .faith-copy, .give-mark, .give-copy, .give-section > .button, .contact-section > *, .site-footer > *, .ministry-page-intro-inner, .ministry-gallery-heading, .ministry-gallery-grid figure, .ministry-page-cta > *, .ministry-back');
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


// Accessible, lightweight hero slideshow. The first two images are ready up front;
// remaining photos load just before they are needed.
const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
if (heroSlides.length > 1 && heroDots.length === heroSlides.length) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let timer;
  const loadSlide = index => {
    const slide = heroSlides[index];
    if (slide.dataset.src && !slide.getAttribute('src')) {
      slide.src = slide.dataset.src;
      delete slide.dataset.src;
    }
    if (slide.complete) return Promise.resolve(slide.naturalWidth > 0);
    return new Promise(resolve => {
      slide.addEventListener('load', () => resolve(slide.naturalWidth > 0), { once: true });
      slide.addEventListener('error', () => resolve(false), { once: true });
    });
  };
  const showSlide = async index => {
    if (!await loadSlide(index) || index === activeIndex) return;
    heroSlides[activeIndex].classList.remove('is-active');
    heroDots[activeIndex].classList.remove('is-active');
    heroDots[activeIndex].setAttribute('aria-pressed', 'false');
    activeIndex = index;
    heroSlides[activeIndex].classList.add('is-active');
    heroDots[activeIndex].classList.add('is-active');
    heroDots[activeIndex].setAttribute('aria-pressed', 'true');
    loadSlide((activeIndex + 1) % heroSlides.length);
  };
  const stopSlideshow = () => window.clearInterval(timer);
  const startSlideshow = () => {
    stopSlideshow();
    if (!reduceMotion.matches) timer = window.setInterval(() => showSlide((activeIndex + 1) % heroSlides.length), 7000);
  };
  heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
    stopSlideshow();
    showSlide(index);
    startSlideshow();
  }));
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', stopSlideshow);
  hero?.addEventListener('mouseleave', startSlideshow);
  hero?.addEventListener('focusin', stopSlideshow);
  hero?.addEventListener('focusout', event => {
    if (!event.currentTarget.contains(event.relatedTarget)) startSlideshow();
  });
  reduceMotion.addEventListener?.('change', startSlideshow);
  Promise.all([loadSlide(0), loadSlide(1)]).then(([firstReady, nextReady]) => {
    if (firstReady && nextReady) {
      document.documentElement.classList.add('hero-ready');
      startSlideshow();
    }
  });
}

const header = document.querySelector('.site-header');
if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}
