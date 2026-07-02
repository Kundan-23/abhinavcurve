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
    const openLeadModalBtn = document.getElementById('open-inquiry-dialog-btn');
    const leadModal = document.getElementById('inquiry-dialog');
    const closeLeadModalBtn = document.getElementById('close-inquiry-dialog-btn');
    const leadModalBackdrop = document.getElementById('inquiry-dialog-backdrop');
    const leadForm = document.getElementById('lead-form');
    const layoutsWrapper = document.getElementById('layouts-wrapper');
    const leadPhoneInput = document.getElementById('lead-phone');
    const contactPhoneInput = document.getElementById('contact-phone');

    // Initialize intlTelInput for lead form
    if (leadPhoneInput && window.intlTelInput) {
        window.intlTelInput(leadPhoneInput, {
            initialCountry: "in",
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
    }

    // Initialize intlTelInput for contact form
    if (contactPhoneInput && window.intlTelInput) {
        window.intlTelInput(contactPhoneInput, {
            initialCountry: "in",
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
    }

    function closeLeadModal() {
        if(leadModal) {
            leadModal.classList.remove('is-active');
            leadModal.style.cssText = '';
            const content = leadModal.querySelector('.inquiry-dialog__content');
            if (content) content.style.cssText = '';
        }
    }

    const openLeadModalBtns = document.querySelectorAll('.open-inquiry-dialog-btn, #open-inquiry-dialog-btn');
    if (openLeadModalBtns.length > 0 && leadModal) {
        openLeadModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                leadModal.classList.add('is-active');
            });
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
            // Note: actual submission is handled by index.html fetch script
            // Unlock the floor plans
            layoutsWrapper.classList.add('is-unlocked');
            
            // Optionally, switch to the first tab (1 BHK) which has the real image
            const firstTab = document.querySelector('.layouts__tab[data-target="layout-1bhk"]');
            if(firstTab) firstTab.click();
        });
    }

    // --- RECURRING MODAL LOGIC (EVERY 15 SECONDS) ---
    let popupTimer;
    
    function scheduleNextPopup() {
        // Only schedule if they haven't submitted the form yet
        if (localStorage.getItem('curve_lead_submitted') !== 'true') {
            popupTimer = setTimeout(() => {
                if (leadModal && !leadModal.classList.contains('is-active')) {
                    leadModal.classList.add('is-active');
                }
            }, 15000); // 15 seconds
        }
    }

    // Start the first timer when page loads
    scheduleNextPopup();

    // Whenever they close the modal, start the timer again
    function closeLeadModal() {
        if(leadModal) {
            leadModal.classList.remove('is-active');
            clearTimeout(popupTimer);
            scheduleNextPopup();
        }
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

    // ============================================================
    // 14. Article Reader Modal
    // ============================================================
    const articleData = {
        'article-1': {
            title: 'The Future of Luxury Real Estate in Virar',
            date: 'March 15, 2026',
            image: 'assets/images/gallery/gallery-01.jpg',
            content: `
                <p>Virar West is rapidly transforming into a premium residential hub, attracting homebuyers and investors looking for luxury flats in Mumbai. With major infrastructure developments like the upcoming Bullet Train project and the coastal road extension, connectivity to South Mumbai and key business districts is faster than ever.</p>
                <h3>Why Invest in a 2 BHK or 3 BHK in Virar West?</h3>
                <p>Historically seen as an affordable market, Virar has seen a paradigm shift. Today, buyers aren't just looking for four walls; they are looking for lifestyle upgrades. MahaRERA registered projects in Virar are now offering world-class amenities—from rooftop infinity pools to smart home automation—matching the standards of prime Mumbai real estate.</p>
                <ul>
                    <li><strong>Unmatched ROI:</strong> Property rates in Virar West have shown consistent appreciation, making it a highly lucrative investment for those buying 2 BHK and 3 BHK luxury apartments.</li>
                    <li><strong>Space & Serenity:</strong> Unlike the congested city center, premium projects here, like The Curve by Abhinav Group, offer expansive floor plans and Jodi flats, ensuring you have the space to breathe without compromising on luxury.</li>
                </ul>
                <p>If you are looking to buy a 2 BHK flat in Virar or upgrade to a 3 BHK luxury apartment, now is the ideal time to invest before the next wave of infrastructure-driven price appreciation hits.</p>
            `
        },
        'article-2': {
            title: 'Minimalist Elegance: Designing Your Space',
            date: 'February 28, 2026',
            image: 'assets/images/gallery/gallery-02.jpg',
            content: `
                <p>When it comes to luxury home interiors, the philosophy of "less is more" is dominating modern architecture. Minimalist elegance focuses on maximizing natural light, utilizing open floor plans, and selecting premium, understated materials that speak for themselves.</p>
                <h3>Maximizing Space in 2 BHK & Jodi Flats</h3>
                <p>Designing a spacious apartment in Mumbai requires smart spatial planning. At The Curve Virar West, our Vastu-compliant layouts are crafted to offer zero wastage of space. But how you furnish it makes all the difference:</p>
                <ul>
                    <li><strong>Neutral Palettes:</strong> Stick to whites, beiges, and soft greys. These colors reflect light, making your 2 BHK floor plan look significantly larger.</li>
                    <li><strong>Multifunctional Furniture:</strong> Opt for sleek, built-in storage solutions that keep clutter hidden, maintaining the luxurious aesthetic of your premium residential property.</li>
                    <li><strong>Strategic Lighting:</strong> Use layered lighting—ambient, task, and accent. A statement chandelier combined with recessed LEDs adds incredible depth to the living room.</li>
                </ul>
                <p>Whether you're moving into a compact luxury apartment or expansive Jodi flats in Virar West, embracing minimalist design will elevate your everyday living experience to new heights of sophistication.</p>
            `
        },
        'article-3': {
            title: 'Integrating Smart Home Technology',
            date: 'February 10, 2026',
            image: 'assets/images/gallery/gallery-03.jpg',
            content: `
                <p>The concept of a luxury apartment in Mumbai has evolved. High-end finishes and lavish amenities are no longer the only benchmarks; the true hallmark of a premium residential project today is seamless home automation. Smart homes are reshaping the way we interact with our living spaces.</p>
                <h3>The Core Features of a Modern Smart Home</h3>
                <p>Integrating technology isn't just about convenience; it's about elevated security, energy efficiency, and creating personalized environments. For buyers looking at 3 BHK luxury apartments in Virar, these are the must-have integrations:</p>
                <ul>
                    <li><strong>Automated Lighting & Climate:</strong> Control the mood and temperature of your home from your smartphone, ensuring your space is perfect before you even step through the door.</li>
                    <li><strong>Advanced Security Systems:</strong> Biometric door locks, smart video doorbells, and 24/7 remote surveillance provide absolute peace of mind, a standard feature in top-tier real estate.</li>
                    <li><strong>Voice-Controlled Ecosystems:</strong> From motorized curtains to home entertainment systems, seamless integration with AI assistants makes managing your home effortless.</li>
                </ul>
                <p>At projects like The Curve, luxury amenities extend beyond the physical clubhouse. By bringing the future of tech into every floor plan, residents experience a lifestyle that is truly future-proof.</p>
            `
        }
    };

    const articleModal = document.getElementById('article-modal');
    const closeArticleBtn = document.getElementById('close-article-btn');
    const articleBackdrop = document.getElementById('article-modal-backdrop');
    
    const articleHeroImg = document.getElementById('article-hero-img');
    const articleDate = document.getElementById('article-date');
    const articleTitle = document.getElementById('article-title');
    const articleText = document.getElementById('article-text');

    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = card.getAttribute('data-article-id');
            const data = articleData[articleId];
            
            if (data) {
                articleHeroImg.src = data.image;
                articleDate.textContent = data.date;
                articleTitle.textContent = data.title;
                articleText.innerHTML = data.content;
                
                articleModal.classList.add('is-active');
            }
        });
    });

    function closeArticleModal() {
        if (articleModal) articleModal.classList.remove('is-active');
    }

    if (closeArticleBtn) closeArticleBtn.addEventListener('click', closeArticleModal);
    if (articleBackdrop) articleBackdrop.addEventListener('click', closeArticleModal);

});
