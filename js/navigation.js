/**
 * ============================================================
 *  THE CURVE — Navigation
 *  Smooth scroll links, mobile menu, active highlighting,
 *  mobile bottom bar actions, back-to-top button
 * ============================================================
 *  Loaded AFTER main.js (depends on window.TheCurve.lenis).
 * ============================================================
 */

window.TheCurve = window.TheCurve || {};

window.TheCurve.initNavigation = function () {
  'use strict';

  /* ----------------------------------------------------------
   *  Helpers
   * ---------------------------------------------------------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  var lenis = window.TheCurve.lenis || null;
  var DESKTOP_BP = 1024; /* px — breakpoint where mobile menu is hidden */

  /* ==========================================================
   *  1.  SMOOTH SCROLL NAVIGATION
   * ========================================================== */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      /* Close mobile menu first if open */
      closeMobileMenu();

      /* Scroll to target */
      if (lenis) {
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.2,
        });
      } else {
        /* Fallback */
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================================
   *  2.  MOBILE MENU
   * ========================================================== */
  var burger = $('.header-burger, .mobile-menu-toggle');
  var mobileMenu = $('.mobile-menu');
  var isMenuOpen = false;

  function openMobileMenu() {
    if (!mobileMenu) return;
    isMenuOpen = true;
    mobileMenu.classList.add('active');
    if (burger) burger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeMobileMenu() {
    if (!mobileMenu || !isMenuOpen) return;
    isMenuOpen = false;
    mobileMenu.classList.remove('active');
    if (burger) burger.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (burger) {
    burger.addEventListener('click', function () {
      if (isMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* Close on menu link click */
  if (mobileMenu) {
    $$('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    /* Close button inside mobile menu */
    var mobileClose = mobileMenu.querySelector('.mobile-menu-close, .close-menu');
    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }
  }

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  });

  /* Close on resize to desktop */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= DESKTOP_BP && isMenuOpen) {
        closeMobileMenu();
      }
    }, 150);
  });

  /* ==========================================================
   *  3.  ACTIVE SECTION HIGHLIGHT
   * ========================================================== */
  (function activeSectionHighlight() {
    var navLinks = $$('.nav-link[href^="#"], .mobile-menu a[href^="#"]');
    if (!navLinks.length) return;

    /* Map href → link elements */
    var linkMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id !== '#') {
        if (!linkMap[id]) linkMap[id] = [];
        linkMap[id].push(link);
      }
    });

    /* Gather target sections */
    var sectionIds = Object.keys(linkMap);
    var sections = sectionIds
      .map(function (id) {
        return document.querySelector(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = '#' + entry.target.id;
          var links = linkMap[id];
          if (!links) return;

          links.forEach(function (link) {
            if (entry.isIntersecting) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  })();

  /* ==========================================================
   *  4.  MOBILE BOTTOM BAR ACTIONS
   * ========================================================== */
  (function mobileBottomBar() {
    /* Call button → tel: link */
    var callBtn = $('.bottom-bar-call, .mobile-bar .btn-call, [data-action="call"]');
    if (callBtn) {
      callBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'tel:+91XXXXXXXXXX';
      });
    }

    /* WhatsApp button */
    var waBtn = $('.bottom-bar-whatsapp, .mobile-bar .btn-whatsapp, [data-action="whatsapp"]');
    if (waBtn) {
      waBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var message = encodeURIComponent(
          'Hi, I am interested in The Curve, Bolinj, Virar. Please share more details.'
        );
        window.open('https://wa.me/91XXXXXXXXXX?text=' + message, '_blank');
      });
    }

    /* Enquire button → scroll to contact */
    var enquireBtn = $(
      '.bottom-bar-enquire, .mobile-bar .btn-enquire, [data-action="enquire"]'
    );
    if (enquireBtn) {
      enquireBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var contact = $('#contact');
        if (!contact) return;

        if (lenis) {
          lenis.scrollTo(contact, { offset: -80, duration: 1.2 });
        } else {
          contact.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  })();

  /* ==========================================================
   *  5.  BACK TO TOP BUTTON
   * ========================================================== */
  (function backToTop() {
    var btn = $('.back-to-top, .btn-back-to-top');
    if (!btn) return;

    var SHOW_THRESHOLD = 600; /* px past hero */

    function toggleVisibility(scrollY) {
      if (scrollY > SHOW_THRESHOLD) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    /* Use Lenis scroll event when available */
    if (lenis) {
      lenis.on('scroll', function (e) {
        toggleVisibility(e.scroll);
      });
    } else {
      var ticking = false;
      window.addEventListener(
        'scroll',
        function () {
          if (!ticking) {
            requestAnimationFrame(function () {
              toggleVisibility(window.scrollY);
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  })();
};
