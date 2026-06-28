/**
 * ============================================================
 *  THE CURVE — Form Handling
 *  Validation, lead capture, modals, exit-intent, UTM capture
 * ============================================================
 *  Loaded AFTER main.js.
 * ============================================================
 */

window.TheCurve = window.TheCurve || {};

window.TheCurve.initForm = function () {
  'use strict';

  /* ----------------------------------------------------------
   *  Utility helpers
   * ---------------------------------------------------------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ==========================================================
   *  1.  UTM PARAMETER CAPTURE
   * ========================================================== */
  var utmParams = {};

  (function captureUTM() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    keys.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        utmParams[key] = val;
        /* Persist so they survive page reloads */
        try {
          sessionStorage.setItem(key, val);
        } catch (_) {
          /* Storage quota / private mode */
        }
      } else {
        /* Restore from session if not in URL */
        try {
          var stored = sessionStorage.getItem(key);
          if (stored) utmParams[key] = stored;
        } catch (_) {
          /* noop */
        }
      }
    });

    /* Populate hidden form fields if they exist */
    keys.forEach(function (key) {
      var hidden = $('input[name="' + key + '"]');
      if (hidden && utmParams[key]) {
        hidden.value = utmParams[key];
      }
    });
  })();

  /* ==========================================================
   *  2.  MAIN LEAD FORM
   * ========================================================== */
  var leadForm = $('#lead-form');

  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(leadForm)) {
        submitForm(leadForm);
      }
    });
  }

  /* ---------- Validation ---------- */
  function validateForm(form) {
    var valid = true;

    /* Clear previous errors */
    $$('.form-error', form).forEach(function (el) {
      el.textContent = '';
      el.style.display = 'none';
    });
    $$('.form-group', form).forEach(function (g) {
      g.classList.remove('has-error');
    });

    /* Name */
    var name = form.querySelector('[name="name"]');
    if (name) {
      var nameVal = name.value.trim();
      if (!nameVal || nameVal.length < 2) {
        showError(name, 'Please enter your full name (min 2 characters).');
        valid = false;
      }
    }

    /* Phone — Indian mobile: starts with 6-9, 10 digits */
    var phone = form.querySelector('[name="phone"]');
    if (phone) {
      var phoneVal = phone.value.replace(/\s+/g, '').replace(/^\+91/, '');
      if (!phoneVal || !/^[6-9]\d{9}$/.test(phoneVal)) {
        showError(phone, 'Enter a valid 10-digit mobile number.');
        valid = false;
      }
    }

    /* Email — optional but must be valid if provided */
    var email = form.querySelector('[name="email"]');
    if (email && email.value.trim()) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }
    }

    /* Unit type — required dropdown */
    var unit = form.querySelector('[name="unit_type"], [name="unit-type"]');
    if (unit && !unit.value) {
      showError(unit, 'Please select a unit type.');
      valid = false;
    }

    return valid;
  }

  function showError(field, message) {
    var group = field.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      var errEl = group.querySelector('.form-error');
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = 'block';
      }
    }
  }

  /* ---------- Submission ---------- */
  function submitForm(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });

    /* Attach UTM params */
    Object.keys(utmParams).forEach(function (k) {
      data[k] = utmParams[k];
    });

    data.submitted_at = new Date().toISOString();

    /* Store in localStorage as backup */
    try {
      var leads = JSON.parse(localStorage.getItem('thecurve_leads') || '[]');
      leads.push(data);
      localStorage.setItem('thecurve_leads', JSON.stringify(leads));
    } catch (_) {
      /* noop */
    }

    /* Show success state */
    showFormSuccess(form);
  }

  function showFormSuccess(form) {
    var card = form.closest('.lead-form-card') || form.parentNode;

    /* Build success message */
    var success = document.createElement('div');
    success.className = 'form-success';
    success.innerHTML =
      '<div class="form-success__icon">' +
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none">' +
      '<circle cx="32" cy="32" r="30" stroke="#C9A96E" stroke-width="2"/>' +
      '<path d="M20 33l8 8 16-16" stroke="#C9A96E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '</div>' +
      '<h3 class="form-success__title">Thank You!</h3>' +
      '<p class="form-success__message">Our team will contact you within 24 hours to schedule your exclusive site visit.</p>';

    /* Animate transition */
    form.style.opacity = '0';
    form.style.transform = 'translateY(10px)';
    form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(function () {
      form.style.display = 'none';
      card.appendChild(success);

      /* Fade in success */
      success.style.opacity = '0';
      success.style.transform = 'translateY(10px)';
      success.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      /* Force reflow */
      void success.offsetHeight;
      success.style.opacity = '1';
      success.style.transform = 'translateY(0)';
    }, 400);
  }

  /* ==========================================================
   *  3.  BROCHURE DOWNLOAD MODAL
   * ========================================================== */
  (function brochureModal() {
    var modal = $('#brochure-modal');
    if (!modal) return;

    var triggers = $$('.btn-brochure');
    var closeBtn = modal.querySelector('.modal-close, .close-modal');
    var overlay = modal.querySelector('.modal-overlay') || modal;
    var brochureForm = modal.querySelector('form');

    function openModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.TheCurve.lenis) window.TheCurve.lenis.stop();
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.TheCurve.lenis) window.TheCurve.lenis.start();
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    /* Close on overlay click */
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    /* Mini form submission */
    if (brochureForm) {
      brochureForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = brochureForm.querySelector('[name="name"]');
        var phone = brochureForm.querySelector('[name="phone"]');
        var valid = true;

        /* Clear errors */
        $$('.form-error', brochureForm).forEach(function (el) {
          el.textContent = '';
          el.style.display = 'none';
        });

        if (name && (!name.value.trim() || name.value.trim().length < 2)) {
          showError(name, 'Please enter your name.');
          valid = false;
        }
        if (phone) {
          var pVal = phone.value.replace(/\s+/g, '').replace(/^\+91/, '');
          if (!/^[6-9]\d{9}$/.test(pVal)) {
            showError(phone, 'Enter a valid 10-digit mobile number.');
            valid = false;
          }
        }

        if (!valid) return;

        /* Store lead */
        try {
          var leads = JSON.parse(localStorage.getItem('thecurve_leads') || '[]');
          leads.push({
            name: name ? name.value.trim() : '',
            phone: phone ? phone.value.trim() : '',
            type: 'brochure',
            submitted_at: new Date().toISOString(),
          });
          localStorage.setItem('thecurve_leads', JSON.stringify(leads));
        } catch (_) {
          /* noop */
        }

        /* Show success inside modal */
        brochureForm.innerHTML =
          '<div class="form-success" style="text-align:center;padding:2rem 0;">' +
          '<h3 style="color:var(--gold);margin-bottom:0.5rem;">Brochure Requested!</h3>' +
          '<p>The brochure will be sent to your WhatsApp shortly.</p>' +
          '</div>';
      });
    }
  })();

  /* ==========================================================
   *  4.  EXIT INTENT POPUP
   * ========================================================== */
  (function exitIntent() {
    var popup = $('.exit-popup');
    if (!popup) return;

    var shown = false;
    var pageLoadTime = Date.now();
    var hasScrolled30 = false;

    /* Track scroll depth */
    function checkScrollDepth() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0 && scrollTop / docHeight >= 0.3) {
        hasScrolled30 = true;
      }
    }

    window.addEventListener('scroll', checkScrollDepth, { passive: true });

    /* Mouse leave detection */
    document.addEventListener('mouseout', function (e) {
      if (shown) return;

      /* Check if session already saw it */
      try {
        if (sessionStorage.getItem('thecurve_exit_shown') === '1') return;
      } catch (_) {
        /* noop */
      }

      /* Must have spent ≥ 10 seconds AND scrolled 30% */
      if (Date.now() - pageLoadTime < 10000) return;
      if (!hasScrolled30) return;

      /* clientY < 0 means cursor left through top of viewport */
      if (e.clientY > 0) return;
      /* Ignore moving to child elements */
      if (e.relatedTarget || e.toElement) return;

      showExitPopup();
    });

    function showExitPopup() {
      shown = true;
      try {
        sessionStorage.setItem('thecurve_exit_shown', '1');
      } catch (_) {
        /* noop */
      }

      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.TheCurve.lenis) window.TheCurve.lenis.stop();
    }

    function closeExitPopup() {
      popup.classList.remove('active');
      document.body.style.overflow = '';
      if (window.TheCurve.lenis) window.TheCurve.lenis.start();
    }

    /* Close handlers */
    var closeBtn = popup.querySelector('.modal-close, .close-modal, .exit-popup-close');
    if (closeBtn) closeBtn.addEventListener('click', closeExitPopup);

    popup.addEventListener('click', function (e) {
      if (e.target === popup || e.target.classList.contains('modal-overlay')) {
        closeExitPopup();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('active')) {
        closeExitPopup();
      }
    });
  })();

  /* ==========================================================
   *  5.  SCROLL-TRIGGERED CTA
   * ========================================================== */
  (function scrollCTA() {
    var cta = $('.scroll-cta');
    if (!cta) return;

    var ctaShown = false;
    var pageStartTime = Date.now();

    function shouldShow() {
      /* Dismissed this session? */
      try {
        if (sessionStorage.getItem('thecurve_scroll_cta_dismissed') === '1') return false;
      } catch (_) {
        /* noop */
      }

      /* Must have spent 30+ seconds */
      if (Date.now() - pageStartTime < 30000) return false;

      /* Must have scrolled past 60% */
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      return docHeight > 0 && scrollTop / docHeight >= 0.6;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ctaShown) return;
        if (shouldShow()) {
          ctaShown = true;
          cta.classList.add('active');
        }
      },
      { passive: true }
    );

    /* Close button */
    var closeBtn = cta.querySelector('.scroll-cta-close, .close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        cta.classList.remove('active');
        try {
          sessionStorage.setItem('thecurve_scroll_cta_dismissed', '1');
        } catch (_) {
          /* noop */
        }
      });
    }
  })();
};
