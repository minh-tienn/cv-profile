document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY) {
                // Scrolling down
                navbar.classList.add('navbar-hidden');
                navbar.classList.remove('navbar-visible');
            } else {
                // Scrolling up
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
            lastScrollY = window.scrollY;

            // Also, ensure navbar is visible when at the very top
            if (window.scrollY === 0) {
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
        });
    }

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            menuToggle.checked = !menuToggle.checked; // Toggle the checkbox state
            // The CSS handles the display based on menuToggle.checked
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.checked = false; // Close the menu
            });
        });
    }

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic Skill Bars - using Intersection Observer
    const skillBars = document.querySelectorAll('.cv-skill-level');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevel = entry.target;
                    const level = skillLevel.dataset.level; // Get level from data-level attribute
                    if (level) {
                        skillLevel.style.width = level + '%';
                    }
                    observer.unobserve(skillLevel); // Stop observing after animation
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the item is visible

        skillBars.forEach(bar => {
            bar.style.width = '0%'; // Initialize width to 0 for animation
            observer.observe(bar);
        });
    }

    // JavaScript for Counter Animation
    function animateCounter(obj, finalTarget, unit, duration = 2000) {
        let startValue = 0;
        const increment = (finalTarget - startValue) / (duration / 16);
        const startTime = performance.now();

        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = startValue + (finalTarget - startValue) * progress;

            obj.textContent = Math.floor(current) + unit;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                obj.textContent = finalTarget + unit;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer for Counters
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const numericTarget = parseInt(targetElement.dataset.target); // Get target from data-target attribute
                const unit = targetElement.dataset.unit || ''; // Get the unit from data-unit attribute

                if (!isNaN(numericTarget)) {
                    animateCounter(targetElement, numericTarget, unit, 2000);
                }
                observer.unobserve(targetElement); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    counters.forEach(counter => {
        // Store the original unit in a data-attribute for easier retrieval
        const initialUnit = counter.textContent;
        counter.setAttribute('data-unit', initialUnit);
        // Initialize text to 0 + unit
        counter.textContent = '0' + initialUnit;
        counterObserver.observe(counter);
    });
});
