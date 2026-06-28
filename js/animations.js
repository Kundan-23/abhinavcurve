/**
 * ============================================================
 *  THE CURVE — Scroll Animations
 *  GSAP + ScrollTrigger powered reveal & parallax system
 * ============================================================
 *  Loaded AFTER gsap, ScrollTrigger, and main.js.
 * ============================================================
 */

window.TheCurve = window.TheCurve || {};

window.TheCurve.initAnimations = function () {
  'use strict';

  /* Guard: GSAP & ScrollTrigger required */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
   *  Utility: safely query elements
   * ---------------------------------------------------------- */
  function $$(selector, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
  }
  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  /* ----------------------------------------------------------
   *  1.  GENERAL REVEAL ANIMATIONS
   * ---------------------------------------------------------- */

  /* Fade Up */
  $$('.animate-fade-up').forEach(function (el) {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* Fade In (opacity only) */
  $$('.animate-fade-in').forEach(function (el) {
    gsap.from(el, {
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* Fade Left */
  $$('.animate-fade-left').forEach(function (el) {
    gsap.from(el, {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* Fade Right */
  $$('.animate-fade-right').forEach(function (el) {
    gsap.from(el, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* Scale In */
  $$('.animate-scale-in').forEach(function (el) {
    gsap.from(el, {
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ----------------------------------------------------------
   *  2.  STAGGER GROUPS
   * ---------------------------------------------------------- */
  $$('.animate-stagger').forEach(function (container) {
    var children = Array.prototype.slice.call(container.children);
    if (!children.length) return;

    gsap.from(children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ----------------------------------------------------------
   *  3.  HERO SECTION
   * ---------------------------------------------------------- */
  (function heroAnimations() {
    /* Parallax background image */
    var heroBgImg = $('.hero-bg img') || $('.hero-bg');
    if (heroBgImg) {
      gsap.to(heroBgImg, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    /* Hero overlay — darken on scroll */
    var heroOverlay = $('.hero-overlay');
    if (heroOverlay) {
      gsap.to(heroOverlay, {
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    /* Content reveal timeline */
    var heroContent = $('.hero-content');
    if (heroContent) {
      var tl = gsap.timeline({ delay: 0.3 });

      var eyebrow = heroContent.querySelector('.hero-eyebrow');
      var titleLines = $$('.hero-title .line', heroContent);
      var subtitle = heroContent.querySelector('.hero-subtitle');
      var price = heroContent.querySelector('.hero-price');
      var ctas = heroContent.querySelector('.hero-ctas');

      if (eyebrow) {
        tl.from(eyebrow, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
      }
      if (titleLines.length) {
        tl.from(
          titleLines,
          { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
          '-=0.3'
        );
      } else {
        var heroTitle = heroContent.querySelector('.hero-title');
        if (heroTitle) {
          tl.from(heroTitle, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        }
      }
      if (subtitle) {
        tl.from(subtitle, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4');
      }
      if (price) {
        tl.from(price, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      }
      if (ctas) {
        tl.from(ctas, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.2');
      }
    }
  })();

  /* ----------------------------------------------------------
   *  4.  ABOUT SECTION
   * ---------------------------------------------------------- */
  (function aboutAnimations() {
    /* Parallax background */
    var aboutBg = $('.about-bg');
    if (aboutBg) {
      gsap.to(aboutBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    /* About cards — fade in from right with stagger */
    var aboutCards = $$('.about-card, .about-cards > *');
    if (aboutCards.length) {
      gsap.from(aboutCards, {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.about-cards',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }
  })();

  /* ----------------------------------------------------------
   *  5.  USP CARDS
   * ---------------------------------------------------------- */
  (function uspAnimations() {
    var uspCards = $$('.usp-card');
    if (!uspCards.length) return;

    ScrollTrigger.batch(uspCards, {
      start: 'top 80%',
      onEnter: function (batch) {
        gsap.from(batch, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
        });
      },
      once: true,
    });
  })();

  /* ----------------------------------------------------------
   *  6.  LOCATION SECTION
   * ---------------------------------------------------------- */
  (function locationAnimations() {
    var locImg = $('.location-hero img');
    if (locImg) {
      gsap.to(locImg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.location-hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    var locHeading = $('.location .section-heading, .location-section .section-heading');
    if (locHeading) {
      gsap.from(locHeading, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: locHeading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  })();

  /* ----------------------------------------------------------
   *  7.  AMENITIES CAROUSEL
   * ---------------------------------------------------------- */
  (function amenitiesAnimations() {
    $$('.amenity-card img').forEach(function (img) {
      gsap.to(img, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.amenity-card') || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  })();

  /* ----------------------------------------------------------
   *  8.  FLOOR PLANS
   * ---------------------------------------------------------- */
  (function floorPlanAnimations() {
    var fpContent = $$('.floor-plans .floor-plan-content, .floor-plans .tab-content');
    fpContent.forEach(function (el) {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  })();

  /* ----------------------------------------------------------
   *  9.  BUILDER TRUST
   * ---------------------------------------------------------- */
  (function builderTrustAnimations() {
    /* Trust points — staggered fade in */
    var trustPoints = $$('.trust-point, .trust-points > *');
    if (trustPoints.length) {
      gsap.from(trustPoints, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: trustPoints[0].parentNode,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    /* Quote — fade in with subtle scale */
    var quote = $('.builder-quote, .trust-quote');
    if (quote) {
      gsap.from(quote, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  })();

  /* ----------------------------------------------------------
   *  10. GALLERY
   * ---------------------------------------------------------- */
  (function galleryAnimations() {
    var galleryItems = $$('.gallery-item');
    if (!galleryItems.length) return;

    ScrollTrigger.batch(galleryItems, {
      start: 'top 85%',
      onEnter: function (batch) {
        gsap.from(batch, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
        });
      },
      once: true,
    });
  })();

  /* ----------------------------------------------------------
   *  11. LEAD FORM
   * ---------------------------------------------------------- */
  (function formAnimations() {
    var formCard = $('.lead-form-card');
    if (formCard) {
      gsap.from(formCard, {
        scale: 0.98,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formCard,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    /* Animated gold border rotation via CSS custom property */
    var goldBorder = $('.lead-form-card .gold-border, .lead-form-card::before');
    if (goldBorder) {
      gsap.to(goldBorder, {
        '--border-angle': '360deg',
        duration: 4,
        ease: 'none',
        repeat: -1,
      });
    }
  })();

  /* ----------------------------------------------------------
   *  12. TEXT SPLIT REVEAL  (Zorge9-style)
   * ---------------------------------------------------------- */
  (function textReveal() {
    $$('.reveal-text').forEach(function (heading) {
      /* Already processed? */
      if (heading.classList.contains('reveal-text--split')) return;
      heading.classList.add('reveal-text--split');

      /* Wrap each text node / line in spans */
      var html = heading.innerHTML;
      var lines = html.split(/<br\s*\/?>|\n/).filter(Boolean);

      heading.innerHTML = lines
        .map(function (line) {
          return (
            '<span class="reveal-line" style="display:block;overflow:hidden;">' +
            '<span class="reveal-line__inner" style="display:inline-block;">' +
            line.trim() +
            '</span></span>'
          );
        })
        .join('');

      var inners = $$('.reveal-line__inner', heading);

      gsap.from(inners, {
        yPercent: 100,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  })();

  /* ----------------------------------------------------------
   *  13. PARALLAX IMAGES (generic)
   * ---------------------------------------------------------- */
  $$('.parallax-bg').forEach(function (el) {
    gsap.to(el, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentNode || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* ----------------------------------------------------------
   *  Refresh ScrollTrigger after everything is set up
   * ---------------------------------------------------------- */
  ScrollTrigger.refresh();
};
