// HyprWings - Enhanced JavaScript with Advanced Animations
// ========================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeParticles();
    initializeScrollAnimations();
    initializeIntersectionObserver();
    initializeFormHandlers();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeEnhancedEffects();
});

// Enhanced Navigation functionality
function initializeNavigation() {
    const nav = document.querySelector('.modern-nav');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Enhanced scroll effect for navigation
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavigation() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll with smooth transition
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    });
    
    // Enhanced mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking nav items
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Enhanced active nav item highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavItem() {
        const scrollY = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-item[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem(); // Initial call
}

// Enhanced animated particles background
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;
    
    // Set canvas size with device pixel ratio support
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Recreate particles after resize
        createParticles();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Enhanced Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.life = Math.random() * 200 + 200;
            this.maxLife = this.life;
            this.color = this.getRandomColor();
            this.pulse = Math.random() * Math.PI * 2;
        }
        
        getRandomColor() {
            const colors = [
                'rgba(102, 126, 234',
                'rgba(118, 75, 162',
                'rgba(79, 172, 254',
                'rgba(240, 147, 251',
                'rgba(168, 237, 234'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            this.pulse += 0.02;
            
            // Mouse interaction with enhanced physics
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                this.vx += dx * force * 0.002;
                this.vy += dy * force * 0.002;
            }
            
            // Apply friction
            this.vx *= 0.99;
            this.vy *= 0.99;
            
            // Boundary check with wrap-around
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
            
            // Respawn particle when life ends
            if (this.life <= 0) {
                this.reset();
            }
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.life = this.maxLife;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = this.getRandomColor();
        }
        
        draw() {
            const lifeRatio = this.life / this.maxLife;
            const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
            const currentOpacity = this.opacity * lifeRatio;
            const currentRadius = this.radius * pulseScale;
            
            // Main particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}, ${currentOpacity})`;
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = `${this.color}, ${currentOpacity * 0.8})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Inner bright core
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}, ${Math.min(currentOpacity * 2, 1)})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop with enhanced effects
    function animate() {
        // Create trailing effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw enhanced connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.15;
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(102, 126, 234, ${opacity})`);
                    gradient.addColorStop(1, `rgba(79, 172, 254, ${opacity})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Enhanced mouse tracking
    function updateMousePosition(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    }
    
    canvas.addEventListener('mousemove', updateMousePosition);
    
    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateMousePosition(touch);
    });
    
    createParticles();
    animate();
    
    // Performance optimization - pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced intersection observer for scroll effects
function initializeIntersectionObserver() {
    // Staggered fade in for cards
    const cardElements = document.querySelectorAll('.bento-item, .project-card, .team-card, .contact-item');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    cardElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        fadeObserver.observe(el);
    });
    
    // Enhanced counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => {
        numberObserver.observe(num);
    });
}

// Enhanced number animation
function animateNumber(element) {
    const target = element.textContent;
    const number = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d,]/g, '');
    const isK = target.includes('K') || target.includes('k');
    const duration = 2500;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(current);
        if (isK && displayNumber >= 1000) {
            displayNumber = Math.floor(displayNumber / 1000) + 'K';
        } else if (displayNumber >= 1000) {
            displayNumber = displayNumber.toLocaleString();
        }
        
        element.textContent = displayNumber + suffix.replace(/\d+K?/g, '');
    }, 16);
}

// Enhanced form handlers
function initializeFormHandlers() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple form reset without notifications
            contactForm.reset();
        });
        
        // Enhanced form field animations
        const formFields = contactForm.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// Enhanced theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Animate icon
            const icon = themeToggle.querySelector('i');
            icon.style.transform = 'scale(0)';
            
            setTimeout(() => {
                icon.className = document.body.classList.contains('light-theme') 
                    ? 'fas fa-sun' 
                    : 'fas fa-moon';
                icon.style.transform = 'scale(1)';
            }, 150);
            
            // Save preference
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('section:not(#home)');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// New enhanced effects
function initializeEnhancedEffects() {
    // Magnetic hover effect for buttons
    const magneticElements = document.querySelectorAll('.btn, .service-icon, .tech-item');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
    
    // Text reveal animation
    const textElements = document.querySelectorAll('.hero-title, .section-title');
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = text.split('').map(char => 
            `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        const chars = element.querySelectorAll('span');
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
                char.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, index * 50);
        });
    });
    
    // Floating animation for hero elements
    const floatingElements = document.querySelectorAll('.floating-card, .floating-orb');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Enhanced scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Log performance metrics in development
    if (window.location.hostname === 'localhost') {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
}

// Initialize performance monitoring
initializePerformanceMonitoring();
