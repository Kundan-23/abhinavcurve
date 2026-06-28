/**
 * ============================================================
 *  THE CURVE — Gallery Lightbox
 *  Full-screen image viewer with keyboard & touch support
 * ============================================================
 *  Loaded AFTER main.js.
 * ============================================================
 */

window.TheCurve = window.TheCurve || {};

window.TheCurve.initGallery = function () {
  'use strict';

  /* ----------------------------------------------------------
   *  Collect gallery items
   * ---------------------------------------------------------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  var images = items.map(function (item) {
    var img = item.querySelector('img');
    return {
      src: img ? img.getAttribute('data-full') || img.src : '',
      alt: img ? img.alt || '' : '',
    };
  });

  var currentIndex = 0;
  var lightboxEl = null;

  /* ----------------------------------------------------------
   *  Build lightbox DOM (once)
   * ---------------------------------------------------------- */
  function buildLightbox() {
    /* Re-use existing DOM element if present */
    lightboxEl = document.querySelector('.lightbox');
    if (lightboxEl) return;

    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.setAttribute('role', 'dialog');
    lightboxEl.setAttribute('aria-modal', 'true');
    lightboxEl.setAttribute('aria-label', 'Image gallery');

    lightboxEl.innerHTML =
      '<div class="lightbox-overlay"></div>' +
      '<button class="lightbox-close" aria-label="Close gallery">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
      '</svg>' +
      '</button>' +
      '<button class="lightbox-prev" aria-label="Previous image">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="15 18 9 12 15 6"/>' +
      '</svg>' +
      '</button>' +
      '<button class="lightbox-next" aria-label="Next image">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="9 6 15 12 9 18"/>' +
      '</svg>' +
      '</button>' +
      '<div class="lightbox-image-wrap">' +
      '<img class="lightbox-image" src="" alt="" />' +
      '</div>' +
      '<div class="lightbox-counter"></div>';

    document.body.appendChild(lightboxEl);

    /* Event listeners (once) */
    lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightboxEl.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    lightboxEl.querySelector('.lightbox-prev').addEventListener('click', function () {
      navigate(-1);
    });
    lightboxEl.querySelector('.lightbox-next').addEventListener('click', function () {
      navigate(1);
    });
  }

  /* ----------------------------------------------------------
   *  Open / Close / Navigate
   * ---------------------------------------------------------- */
  function openLightbox(index) {
    if (!lightboxEl) buildLightbox();
    currentIndex = index;
    updateImage();
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.TheCurve.lenis) window.TheCurve.lenis.stop();

    /* Bind keyboard */
    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
    if (window.TheCurve.lenis) window.TheCurve.lenis.start();
    document.removeEventListener('keydown', handleKeydown);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    updateImage();
  }

  function updateImage() {
    var img = lightboxEl.querySelector('.lightbox-image');
    var counter = lightboxEl.querySelector('.lightbox-counter');
    var data = images[currentIndex];

    /* Quick fade transition */
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.25s ease';

    setTimeout(function () {
      img.src = data.src;
      img.alt = data.alt;
      img.onload = function () {
        img.style.opacity = '1';
      };
    }, 150);

    counter.textContent = (currentIndex + 1) + ' / ' + images.length;

    /* Preload adjacent */
    preloadAdjacent(currentIndex);
  }

  /* ----------------------------------------------------------
   *  Preload adjacent images
   * ---------------------------------------------------------- */
  function preloadAdjacent(idx) {
    [-1, 1].forEach(function (offset) {
      var i = (idx + offset + images.length) % images.length;
      var preImg = new Image();
      preImg.src = images[i].src;
    });
  }

  /* ----------------------------------------------------------
   *  Keyboard navigation
   * ---------------------------------------------------------- */
  function handleKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
      case 'Escape':
        closeLightbox();
        break;
    }
  }

  /* ----------------------------------------------------------
   *  Touch / swipe detection
   * ---------------------------------------------------------- */
  var touchStartX = 0;
  var touchStartY = 0;
  var isSwiping = false;

  function handleTouchStart(e) {
    if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
    var touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwiping = true;
  }

  function handleTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;

    var touch = e.changedTouches[0];
    var deltaX = touch.clientX - touchStartX;
    var deltaY = touch.clientY - touchStartY;

    /* Only horizontal swipes — ignore if vertical movement is dominant */
    if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX > 0) {
      navigate(-1); /* swipe right → previous */
    } else {
      navigate(1); /* swipe left → next */
    }
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  /* ----------------------------------------------------------
   *  Bind gallery item clicks
   * ---------------------------------------------------------- */
  buildLightbox();

  items.forEach(function (item, idx) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(idx);
    });
  });
};
