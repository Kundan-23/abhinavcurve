/**
 * THE CURVE — Scroll Animations
 * Pure CSS transitions driven by IntersectionObserver.
 * No dependency on GSAP class-binding quirks.
 */

window.TheCurve = window.TheCurve || {};

window.TheCurve.initAnimations = function () {
  'use strict';

  // Inject animation CSS directly
  const style = document.createElement('style');
  style.textContent = `
    /* ── Base hidden states ── */
    [data-reveal] {
      opacity: 0;
      will-change: opacity, transform;
    }
    [data-reveal="up"]        { transform: translateY(60px); }
    [data-reveal="down"]      { transform: translateY(-40px); }
    [data-reveal="left"]      { transform: translateX(-60px); }
    [data-reveal="right"]     { transform: translateX(60px); }
    [data-reveal="scale"]     { transform: scale(0.85); }
    [data-reveal="fade"]      { transform: none; }

    /* ── Visible state ── */
    [data-reveal].is-visible {
      opacity: 1;
      transform: none;
      transition:
        opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ── Stagger delays for children ── */
    [data-reveal-group] > * {
      opacity: 0;
      transform: translateY(50px);
      will-change: opacity, transform;
    }
    [data-reveal-group].is-visible > * {
      opacity: 1;
      transform: none;
      transition:
        opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-reveal-group].is-visible > *:nth-child(1) { transition-delay: 0ms; }
    [data-reveal-group].is-visible > *:nth-child(2) { transition-delay: 100ms; }
    [data-reveal-group].is-visible > *:nth-child(3) { transition-delay: 200ms; }
    [data-reveal-group].is-visible > *:nth-child(4) { transition-delay: 300ms; }
    [data-reveal-group].is-visible > *:nth-child(5) { transition-delay: 400ms; }
    [data-reveal-group].is-visible > *:nth-child(6) { transition-delay: 500ms; }
    [data-reveal-group].is-visible > *:nth-child(7) { transition-delay: 600ms; }
    [data-reveal-group].is-visible > *:nth-child(8) { transition-delay: 700ms; }
    [data-reveal-group].is-visible > *:nth-child(9) { transition-delay: 800ms; }
    [data-reveal-group].is-visible > *:nth-child(10) { transition-delay: 900ms; }
    [data-reveal-group].is-visible > *:nth-child(n+11) { transition-delay: 1000ms; }

    /* ── Line reveal ── */
    [data-line-reveal] {
      overflow: hidden;
    }
    [data-line-reveal] span {
      display: block;
      opacity: 0;
      transform: translateY(110%);
      will-change: opacity, transform;
    }
    [data-line-reveal].is-visible span {
      opacity: 1;
      transform: none;
      transition:
        opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ── Count up number animation ── */
    .counter-done {
      transition: none;
    }

    /* ── Respect reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
      [data-reveal], [data-reveal-group] > *, [data-line-reveal] span {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Assign data-reveal attributes to existing animate-* classes ──
  // This bridges old class-based markup with new attribute system
  const classMap = {
    'animate-fade-up':    'up',
    'animate-fade-down':  'down',
    'animate-fade-left':  'left',
    'animate-fade-right': 'right',
    'animate-scale-in':   'scale',
    'animate-fade-in':    'fade',
  };
  Object.entries(classMap).forEach(function([cls, dir]) {
    document.querySelectorAll('.' + cls).forEach(function(el) {
      el.setAttribute('data-reveal', dir);
    });
  });

  // ── IntersectionObserver for [data-reveal] ──
  const revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function(el) {
    revealObs.observe(el);
  });

  // ── IntersectionObserver for [data-reveal-group] ──
  const groupObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        groupObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-reveal-group]').forEach(function(el) {
    groupObs.observe(el);
  });

  // ── Line reveal observer ──
  const lineObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        lineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-line-reveal]').forEach(function(el) {
    lineObs.observe(el);
  });

  // ── GSAP-based counter animation (for stat numbers) ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.counter-number, [data-count]').forEach(function(el) {
      const target = parseFloat(el.getAttribute('data-count') || el.textContent) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].innerText) + suffix;
          }
        }
      );
    });

    // ── Smooth parallax on hero image ──
    const heroBg = document.querySelector('.hero__img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // ── Horizontal marquee-speed binding (gallery auto-scroll) ──
    ScrollTrigger.refresh();
  }
};
