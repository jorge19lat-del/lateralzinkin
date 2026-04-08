/**
 * Lateral Zinkin — Main JavaScript
 * Vanilla JS, no dependencies
 */

(function () {
  'use strict';

  /* =========================================
     1. NAV SCROLL EFFECT
     ========================================= */
  const nav = document.getElementById('main-nav');
  const SCROLL_THRESHOLD = 80;

  function handleNavScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* =========================================
     2. MOBILE MENU TOGGLE
     ========================================= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  let overlay = null;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Create overlay
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);

    // Trigger reflow for animation
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (overlay) {
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', () => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        overlay = null;
      }, { once: true });
    }
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* =========================================
     8. MOBILE MENU AUTO-CLOSE ON NAV LINK CLICK
     ========================================= */
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  /* =========================================
     3. INTERSECTION OBSERVER — FADE IN
     ========================================= */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: just show everything
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* =========================================
     4. CONTACT FORM SUBMISSION
     ========================================= */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const formData = new FormData(contactForm);

      // Validate
      const nombre = formData.get('nombre');
      const email = formData.get('email');
      const mensaje = formData.get('mensaje');

      if (!nombre || !email || !mensaje) {
        showFormMessage('Por favor, completa todos los campos obligatorios.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Por favor, introduce un email válido.', 'error');
        return;
      }

      // Loading state
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      // Simulate API call
      setTimeout(() => {
        submitBtn.textContent = 'Mensaje enviado';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        showFormMessage('¡Gracias! Nos pondremos en contacto contigo pronto.', 'success');
        contactForm.reset();

        // Reset button after delay
        setTimeout(() => {
          submitBtn.textContent = 'Enviar mensaje';
          submitBtn.disabled = false;
          submitBtn.classList.remove('success');
        }, 4000);
      }, 1500);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(message, type) {
    // Remove existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.className = 'form-message form-message--' + type;
    msg.textContent = message;

    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);

    setTimeout(() => {
      if (msg.parentNode) msg.remove();
    }, 5000);
  }

  /* =========================================
     5. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================= */
  const navHeight = nav ? nav.offsetHeight : 70;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* =========================================
     6. ACTIVE NAV LINK TRACKING
     ========================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    let current = '';
    const scrollPos = window.scrollY + navHeight + 50;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* =========================================
     7. FLOATING CTA BUTTON
     ========================================= */
  const floatingCta = document.getElementById('floating-cta');
  const FLOATING_THRESHOLD = 600;

  function handleFloatingCta() {
    if (!floatingCta) return;
    if (window.scrollY > FLOATING_THRESHOLD) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleFloatingCta, { passive: true });
  handleFloatingCta();

  /* =========================================
     UTILITY: Stagger children animations
     ========================================= */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

})();
