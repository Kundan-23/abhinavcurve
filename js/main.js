/**
 * THE CURVE — ZORGE 9 STYLE REWRITE
 * Phase 1: Core Initialization & Hero Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Mobile Menu Logic
    const menuBtn = document.querySelector('.header__menu-btn');
    const headerNav = document.querySelector('.header__nav');
    if (menuBtn && headerNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('is-open');
            headerNav.classList.toggle('is-open');
            document.body.style.overflow = headerNav.classList.contains('is-open') ? 'hidden' : '';
        });

        const navLinks = headerNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('is-open');
                headerNav.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Prepare Hero Logo Letters for Stagger
    // (Already wrapped in spans in HTML: .hero__huge-logo span)

    // 3. Preloader Sequence — plays immediately, no blocking
    const preloaderTl = gsap.timeline();

    // Quick logo flash
    preloaderTl.to('.preloader__card-progress', {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.inOut'
    })
    .to('.preloader__brand-logo, .preloader__logo-text, .preloader__developer-logo', {
        opacity: 1,
        y: -10,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
    }, "-=0.3")
    // Hide preloader fast
    .to('.preloader', {
        yPercent: -100,
        duration: 0.6,
        ease: 'expo.inOut',
        delay: 0.2,
        onComplete: () => {
            document.getElementById('preloader').style.display = 'none';
        }
    })
    .fromTo('.hero__title', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 
        "-=0.3"
    )
    .fromTo('.hero__arrow', 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 
        "-=0.4"
    )
    .fromTo('.hero__huge-logo span',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.04, ease: 'expo.out' },
        "-=0.6"
    );


    // 4. Hero Parallax on Scroll (Disabled to prevent cropping of text-heavy poster image)
    /*
    gsap.to('.hero__bg-inner', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }

    });
    */

    // 5. Story Section (Zorge 9 Layout Reveal)
    const storyVideo = document.querySelector('.story__video');
    if (storyVideo) {
        // Ensure video plays from exactly 0:58 (avoiding infinite canplay loops)
        let initialized = false;
        
        const setTime = () => {
            if (!initialized) {
                initialized = true;
                storyVideo.currentTime = 58;
                // Force play after seek in case it gets paused
                storyVideo.play().catch(e => console.log("Autoplay prevented", e));
            }
        };
        
        storyVideo.addEventListener('loadedmetadata', setTime);
        if (storyVideo.readyState >= 1) {
            setTime();
        }

        // When the video ends, loop it back to 0:58 instead of 0:00
        storyVideo.addEventListener('timeupdate', () => {
            if (storyVideo.currentTime >= storyVideo.duration - 0.5) {
                storyVideo.currentTime = 58;
                storyVideo.play();
            }
        });
    }

    const storyTitle = document.querySelector('.story__title-large');
    const storyCards = document.querySelectorAll('.zorge-card');
    const storyLogo = document.querySelector('.story__huge-logo');
    
    if (storyTitle && storyCards.length) {
        if (storyLogo) {
            gsap.fromTo(storyLogo,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.5,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.story',
                        start: 'top 60%',
                    }
                }
            );
        }

        gsap.fromTo(storyTitle, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.story',
                    start: 'top 60%',
                }
            }
        );

        gsap.fromTo(storyCards,
            { opacity: 0, y: 100 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.story',
                    start: 'top 40%',
                }
            }
        );
    }

    // 6. Location Section Reveal
    const locationCards = document.querySelectorAll('.location__card');
    if (locationCards.length) {
        gsap.fromTo(locationCards,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.location',
                    start: 'top 70%',
                }
            }
        );
    }

    // 7. Location Slider Navigation Widget
    const locationSlider = document.querySelector('.location__slider');
    const btnPrev = document.querySelector('.location__nav-prev');
    const btnNext = document.querySelector('.location__nav-next');

    if (locationSlider && btnPrev && btnNext) {
        btnNext.addEventListener('click', () => {
            // Scroll right by roughly the width of one card + gap
            const scrollAmount = window.innerWidth > 768 ? 508 : window.innerWidth * 0.85;
            locationSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        btnPrev.addEventListener('click', () => {
            // Scroll left
            const scrollAmount = window.innerWidth > 768 ? 508 : window.innerWidth * 0.85;
            locationSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // 8. Custom Map Pins Reveal (Updated for new split layout)
    const locationGroups = document.querySelectorAll('.location-group');
    if (locationGroups.length) {
        gsap.fromTo(locationGroups,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.custom-map',
                    start: 'top 60%',
                }
            }
        );
    }
    
    // 9. Layouts Tab Switching
    const layoutTabs = document.querySelectorAll('.tabs__btn');
    const layoutItems = document.querySelectorAll('.tabs__pane');

    layoutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            layoutTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all layout items
            layoutItems.forEach(item => {
                item.classList.remove('active');
            });

            // Show target layout item
            const targetId = tab.getAttribute('data-tab');
            const targetItem = document.getElementById(targetId);
            if (targetItem) {
                targetItem.classList.add('active');
            }
        });
    });

    // Amenities section uses standard CSS grid now. No GSAP needed here.

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-item__btn');
        const content = item.querySelector('.faq-item__content');

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-item__content').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 11. Gallery Preview & Modals
    const openGalleryBtn = document.getElementById('open-gallery-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    
    const lightbox = document.getElementById('lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox-btn');
    const lightboxImg = document.getElementById('lightbox-img');

    // Open Gallery Modal
    if (openGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // GSAP stagger animation for gallery items
            const items = galleryModal.querySelectorAll('.gallery-modal__item');
            gsap.fromTo(items, 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            );
        });
    }

    // Close Gallery Modal
    if (closeGalleryBtn && galleryModal) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.remove('is-active');
            document.body.style.overflow = ''; // Restore background scrolling
        });
    }

    // Open Lightbox from Gallery Item
    const galleryItems = document.querySelectorAll('.gallery-modal__item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            if (imgSrc && lightbox && lightboxImg) {
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.classList.add('is-active');
            }
        });
    });

    // Close Lightbox
    if (closeLightboxBtn && lightbox) {
        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.remove('is-active');
            // Give time for fade out before removing source
            setTimeout(() => {
                lightboxImg.setAttribute('src', '');
            }, 400);
        });
    }

    // ============================================================
    // 9. Lead Modal & Floor Plan Unlock
    // ============================================================
    const openLeadModalBtn = document.getElementById('open-lead-modal-btn');
    const leadModal = document.getElementById('lead-modal');
    const closeLeadModalBtn = document.getElementById('close-lead-modal-btn');
    const leadModalBackdrop = document.getElementById('lead-modal-backdrop');
    const leadForm = document.getElementById('lead-form');
    const layoutsWrapper = document.getElementById('layouts-wrapper');

    function closeLeadModal() {
        if(leadModal) leadModal.classList.remove('is-active');
    }

    if (openLeadModalBtn && leadModal) {
        openLeadModalBtn.addEventListener('click', () => {
            leadModal.classList.add('is-active');
        });
    }

    if (closeLeadModalBtn) {
        closeLeadModalBtn.addEventListener('click', closeLeadModal);
    }
    
    if (leadModalBackdrop) {
        leadModalBackdrop.addEventListener('click', closeLeadModal);
    }

    if (leadForm && layoutsWrapper) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            // In a real app, send data to server here.
            // For now, simulate success:
            closeLeadModal();
            
            // Unlock the floor plans
            layoutsWrapper.classList.add('is-unlocked');
            
            // Optionally, switch to the first tab (1 BHK) which has the real image
            const firstTab = document.querySelector('.layouts__tab[data-target="layout-1bhk"]');
            if(firstTab) firstTab.click();
        });
    }

    // 10. Header Theme Toggling + Scroll Shadow
    const header = document.querySelector('.header');
    if (header) {
        header.classList.add('header--light-text'); // Start white on Hero
        const darkSections = document.querySelectorAll('.hero, .custom-map, .gallery-preview');
        
        darkSections.forEach(sec => {
            ScrollTrigger.create({
                trigger: sec,
                start: 'top 80px',
                end: 'bottom 40px',
                onEnter: () => header.classList.add('header--light-text'),
                onLeave: () => header.classList.remove('header--light-text'),
                onEnterBack: () => header.classList.add('header--light-text'),
                onLeaveBack: () => header.classList.remove('header--light-text')
            });
        });

        // Add shadow on scroll for premium depth effect
        let isScrolled = false;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const shouldBeScrolled = window.scrollY > 60;
                    if (shouldBeScrolled !== isScrolled) {
                        isScrolled = shouldBeScrolled;
                        if (isScrolled) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 11. Scroll to Top on Logo Click
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 12. Init Scroll Animations
    if (window.TheCurve && typeof window.TheCurve.initAnimations === 'function') {
        window.TheCurve.initAnimations();
    }
    // 13. Amenities Interactive Showcase
    const amenityItems = document.querySelectorAll('.amenity-list-item');
    const showcaseImg = document.getElementById('amenity-showcase-img');
    
    if (amenityItems.length) {
        amenityItems.forEach(item => {
            // Dynamically inject mobile image container
            const imgSrc = item.getAttribute('data-image');
            if (imgSrc) {
                const mobileImg = document.createElement('div');
                mobileImg.className = 'amenity-list-item__mobile-img';
                mobileImg.innerHTML = `<img src="${imgSrc}" alt="Amenity Image">`;
                item.appendChild(mobileImg);
            }

            const handleInteract = () => {
                if (item.classList.contains('active')) return;
                
                amenityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                if (showcaseImg) {
                    const newImgSrc = item.getAttribute('data-image');
                    if (newImgSrc && !showcaseImg.src.includes(newImgSrc)) {
                        showcaseImg.classList.add('fade-out');
                        setTimeout(() => {
                            showcaseImg.src = newImgSrc;
                            showcaseImg.classList.remove('fade-out');
                        }, 250);
                    }
                }
            };

            item.addEventListener('mouseenter', handleInteract);
            item.addEventListener('click', handleInteract);
        });
    }

});
