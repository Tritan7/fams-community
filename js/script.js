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
});
