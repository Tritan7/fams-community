document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.about-stats .counter');
    const speed = 100; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');

                const inc = target / speed;

                if (count < target) {
                    // Calculate increment and update
                    counter.innerText = Math.ceil(count + inc).toLocaleString('en-US');
                    setTimeout(updateCount, 20);
                } else {
                    // To handle the 12,39,000 Indian format specifically if needed
                    if (target === 1239000) {
                        counter.innerText = "12,39,000";
                    } else {
                        counter.innerText = target.toLocaleString('en-US');
                    }
                }
            };
            
            // Set initial state
            counter.innerText = '0';
            updateCount();
        });
    };

    // Use Intersection Observer to trigger animation when the about section is in view
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    const aboutSection = document.querySelector('.about-stats');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // Hero Stats Counter
    const countUpElements = document.querySelectorAll('.count-up');
    const animateHeroCounters = () => {
        countUpElements.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                const inc = target / 40; // Speed of counting

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString('en-US');
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target.toLocaleString('en-US');
                }
            };
            
            counter.innerText = '0';
            updateCount();
        });
    };

    const heroObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateHeroCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const heroSectionStats = document.querySelector('.hero-stats-small');
    if (heroSectionStats) {
        heroObserver.observe(heroSectionStats);
    }

    // Scroll animation for sticky about text (word by word)
    const aboutStickySection = document.querySelector('.about-new');
    const aboutText = document.querySelector('.about-main-text');
    if (aboutStickySection && aboutText) {
        const words = aboutText.innerText.trim().split(/\s+/);
        aboutText.innerHTML = '';
        const spans = [];
        
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.style.color = 'rgba(26, 32, 44, 0.2)';
            span.style.transition = 'color 0.1s ease-out';
            aboutText.appendChild(span);
            spans.push(span);
        });

        window.addEventListener('scroll', () => {
            const rect = aboutStickySection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const scrollDistance = rect.height - windowHeight;
            
            let progress = 0;
            if (rect.top <= 0) {
                progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
            }
            
            const wordsToColor = Math.floor(progress * spans.length);
            
            spans.forEach((span, index) => {
                if (index < wordsToColor) {
                    span.style.color = '#1a202c';
                } else {
                    span.style.color = 'rgba(26, 32, 44, 0.2)';
                }
            });
        });
    }

    // Bento Grid Sticky Hover Logic
    const bentoItems = document.querySelectorAll('.bento-item');
    if (bentoItems.length > 0) {
        bentoItems[0].classList.add('bento-active');
        
        bentoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                bentoItems.forEach(el => el.classList.remove('bento-active'));
                item.classList.add('bento-active');
            });
        });
    }

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const navLinksToClose = navMenu.querySelectorAll('a');
        navLinksToClose.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Facilities automatic active rotation and click handling
    const facilitiesList = document.getElementById('facilities-list');
    const facilitiesImg = document.getElementById('facilities-img');
    
    if (facilitiesList && facilitiesImg) {
        const items = facilitiesList.querySelectorAll('li');
        let currentIndex = 0;
        let intervalId;

        const changeActiveItem = (newIndex) => {
            // Remove active from current
            items[currentIndex].classList.remove('active');
            
            // Update index and add active
            currentIndex = newIndex;
            const nextItem = items[currentIndex];
            nextItem.classList.add('active');
            
            // Cross-fade image
            facilitiesImg.style.opacity = 0;
            setTimeout(() => {
                const newSrc = nextItem.getAttribute('data-image');
                if (newSrc) {
                    facilitiesImg.src = newSrc;
                }
                facilitiesImg.style.opacity = 1;
            }, 300);
        };

        const startRotation = () => {
            intervalId = setInterval(() => {
                changeActiveItem((currentIndex + 1) % items.length);
            }, 3000);
        };

        // Start initial rotation
        startRotation();

        // Add click listeners to items
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index === currentIndex) return; // Ignore if already active
                
                // Clear existing interval to restart timer
                clearInterval(intervalId);
                
                // Change to clicked item immediately
                changeActiveItem(index);
                
                // Resume rotation
                startRotation();
            });
        });
    }

    // Scroll Reveal Animations with Stagger
    const revealElements = document.querySelectorAll('.reveal');
    let staggerTimeout = null;
    let staggerCounter = 0;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        // Filter out intersecting entries
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        visibleEntries.forEach(entry => {
            // Apply dynamic stagger delay
            const delay = staggerCounter * 150;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
            
            // Clean up the inline delay after animation completes so hover effects aren't delayed
            setTimeout(() => {
                entry.target.style.transitionDelay = '';
            }, delay + 1000);
            
            staggerCounter++;
            
            // Reset counter after batch
            if (staggerTimeout) clearTimeout(staggerTimeout);
            staggerTimeout = setTimeout(() => {
                staggerCounter = 0;
            }, 100);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
});
