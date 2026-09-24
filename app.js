document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll(
    '.hero > div, section .section-head, .about-grid, .skill-card, .project-card, .contact-inner'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((element) => element.classList.add('js-reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.14 });

    revealTargets.forEach((element) => {
      element.style.transitionDelay = '0ms';
      revealObserver.observe(element);
    });
  }

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + visibleSection.target.id);
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] });

    sections.forEach((section) => navigationObserver.observe(section));
  }

  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.classList.add('is-tilting');
      card.style.setProperty('--tilt-x', (-offsetY * 4) + 'deg');
      card.style.setProperty('--tilt-y', (offsetX * 4) + 'deg');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
});
