// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const skillBars = document.querySelectorAll('.skill-progress');
const profileImg = document.getElementById('profile-img');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateBackToTopVisibility();
    }

    updateBackToTopVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            this.updateBackToTopVisibility();
        });

        backToTop.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
}

// Skills Animation
class SkillsAnimator {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        this.observeSkillsSection();
    }

    observeSkillsSection() {
        const skillsSection = document.querySelector('.skills-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateSkills();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }

    animateSkills() {
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const skillLevel = bar.getAttribute('data-skill');
                bar.style.width = skillLevel + '%';
            }, index * 200);
        });
    }
}

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    validateForm(formData) {
        const errors = [];
        
        if (!formData.get('name').trim()) {
            errors.push('Vui lòng nhập họ tên');
        }
        
        if (!formData.get('email').trim()) {
            errors.push('Vui lòng nhập email');
        } else if (!this.isValidEmail(formData.get('email'))) {
            errors.push('Email không hợp lệ');
        }
        
        if (!formData.get('message').trim()) {
            errors.push('Vui lòng nhập tin nhắn');
        }
        
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'success') {
        // Tạo notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Thêm CSS cho notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const errors = this.validateForm(formData);
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return;
        }

        // Hiển thị loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;

        try {
            // Giả lập gửi form (trong thực tế bạn sẽ gửi đến server)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Tin nhắn đã được gửi thành công!', 'success');
            contactForm.reset();
        } catch (error) {
            this.showNotification('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!', 'error');
        } finally {
            // Khôi phục button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    bindEvents() {
        contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

// Profile Image Effects
class ProfileImageEffects {
    constructor() {
        this.images = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    changeImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        profileImg.style.opacity = '0';
        
        setTimeout(() => {
            profileImg.src = this.images[this.currentIndex];
            profileImg.style.opacity = '1';
        }, 300);
    }

    bindEvents() {
        profileImg.addEventListener('click', () => this.changeImage());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Wait before deleting
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Wait before typing next text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Smooth Scroll for Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add navigation if needed
        this.createFloatingNav();
    }

    createFloatingNav() {
        const nav = document.createElement('nav');
        nav.className = 'floating-nav';
        nav.innerHTML = `
            <a href="#about" data-section="about-section">Giới thiệu</a>
            <a href="#skills" data-section="skills-section">Kỹ năng</a>
            <a href="#experience" data-section="experience-section">Kinh nghiệm</a>
            <a href="#education" data-section="education-section">Học vấn</a>
            <a href="#projects" data-section="projects-section">Dự án</a>
            <a href="#contact" data-section="contact-section">Liên hệ</a>
        `;

        // Add CSS for floating nav
        nav.style.cssText = `
            position: fixed;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;

        nav.addEventListener('mouseenter', () => nav.style.opacity = '1');
        nav.addEventListener('mouseleave', () => nav.style.opacity = '0.7');

        document.body.appendChild(nav);

        // Style nav links
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.style.cssText = `
                display: block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--primary-color);
                text-indent: -9999px;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            `;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionClass = link.getAttribute('data-section');
                const section = document.querySelector(`.${sectionClass}`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Update active nav item on scroll
        this.updateActiveNav(links);
    }

    updateActiveNav(links) {
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.className.split(' ').find(cls => cls.includes('-section'));
                }
            });

            links.forEach(link => {
                link.style.transform = 'scale(1)';
                link.style.background = 'var(--primary-color)';
                if (link.getAttribute('data-section') === current) {
                    link.style.transform = 'scale(1.5)';
                    link.style.background = 'var(--accent-color)';
                }
            });
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ScrollEffects();
    new SkillsAnimator();
    new ContactFormHandler();
    new ProfileImageEffects();
    new SmoothScroll();
    
    // Initialize typing animation for title
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        new TypingAnimation(titleElement, [
            'Sinh viên IT',
            'Web Developer', 
            'Mobile Developer',
            'Lập trình viên'
        ]);
    }

    // Add some easter eggs
    console.log(`
    🎓 Chào mừng bạn đến với CV của sinh viên UTH!
    
    Một số tính năng thú vị:
    - Nhấn vào ảnh đại diện để đổi ảnh
    - Thử chuyển đổi theme sáng/tối
    - Cuộn trang để xem hiệu ứng skill bars
    - Sử dụng navigation bên phải để di chuyển nhanh
    
    Made with ❤️ by Sinh viên UTH - Nguyễn Văn A
    Đại học Giao thông vận tải TP.HCM
    `);

    // Add some performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Trang web đã tải xong trong ${Math.round(loadTime)}ms`);
    });
});

// Add some utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('vi-VN').format(date);
    },

    // Generate random color
    randomColor: () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
};

// Export for potential use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        ScrollEffects,
        SkillsAnimator,
        ContactFormHandler,
        utils
    };
}