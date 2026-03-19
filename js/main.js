(() => {
  const menuBtn = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const mobileQuery = window.matchMedia('(max-width: 860px)');

  const setMenuState = (isOpen) => {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuBtn.classList.toggle('is-open', isOpen);
    nav.classList.toggle('is-open', isOpen);
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!expanded);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        menuBtn.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        menuBtn.getAttribute('aria-expanded') === 'true' &&
        header &&
        event.target instanceof Node &&
        !header.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    const handleBreakpoint = (event) => {
      if (!event.matches) {
        setMenuState(false);
      }
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleBreakpoint);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleBreakpoint);
    }

    window.addEventListener('resize', () => {
      if (!mobileQuery.matches) {
        setMenuState(false);
      }
    });

    setMenuState(false);
  }

  const slider = document.querySelector('.hero-slider');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let timer;

  const setSlide = (index) => {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === active;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      const isActive = i === active;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      dot.tabIndex = isActive ? 0 : -1;
    });
  };

  const stopAuto = () => {
    clearInterval(timer);
    timer = undefined;
  };

  const startAuto = () => {
    if (prefersReducedMotion || slides.length < 2 || document.visibilityState !== 'visible') {
      stopAuto();
      return;
    }

    stopAuto();
    timer = setInterval(() => {
      const next = (active + 1) % slides.length;
      setSlide(next);
    }, 6400);
  };

  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', `hero-slide-${index + 1}`);

    dot.addEventListener('click', () => {
      setSlide(index);
      startAuto();
    });

    dot.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (index + 1) % dots.length;
        setSlide(nextIndex);
        dots[nextIndex]?.focus();
        startAuto();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (index - 1 + dots.length) % dots.length;
        setSlide(prevIndex);
        dots[prevIndex]?.focus();
        startAuto();
      }
    });
  });

  slides.forEach((slide, index) => {
    slide.id = `hero-slide-${index + 1}`;
    slide.setAttribute('role', 'tabpanel');
  });

  if (slider) {
    slider.setAttribute('aria-live', prefersReducedMotion ? 'polite' : 'off');
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', (event) => {
      if (!(event.relatedTarget instanceof Node) || !slider.contains(event.relatedTarget)) {
        startAuto();
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startAuto();
    } else {
      stopAuto();
    }
  });

  if (slides.length) {
    setSlide(0);
    startAuto();
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();


