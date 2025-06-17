document.addEventListener('DOMContentLoaded', () => {
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            });

            // Theme toggle
            const themeToggle = document.querySelector('.theme-toggle');
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                themeToggle.querySelector('i').classList.toggle('fa-moon');
                themeToggle.querySelector('i').classList.toggle('fa-sun');
            });

            // Image modal
            const imageModal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const closeModal = document.getElementById('closeModal');
            document.querySelectorAll('.project-image').forEach(img => {
                img.addEventListener('click', () => {
                    imageModal.style.display = 'flex';
                    modalImage.src = img.src;
                });
            });
            closeModal.addEventListener('click', () => imageModal.style.display = 'none');
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) imageModal.style.display = 'none';
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && imageModal.style.display === 'flex') {
                    imageModal.style.display = 'none';
                }
            });

            // Back to top
            const backToTop = document.getElementById('back-to-top');
            window.addEventListener('scroll', () => {
                backToTop.classList.toggle('show', window.scrollY > 300);
            });
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Progress bar animation
            const progressBars = document.querySelectorAll('.progress');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = entry.target.parentElement.querySelector('.progress').style.width;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            progressBars.forEach(bar => observer.observe(bar));
        });