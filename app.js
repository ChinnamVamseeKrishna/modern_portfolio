// Global variables
let particles = [];
let mouseX = 0;
let mouseY = 0;
let cursorTrail = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all features
    initLoadingScreen();
    initCustomCursor();
    initParticleSystem();
    initTypingAnimation();
    initScrollAnimations();
    initSmoothScrolling();
    initSkillBars();
    initContactForm();
    initNavigationHighlight();
    initGlitchEffects();
    
    // Start main animations after loading
    setTimeout(() => {
        hideLoadingScreen();
        startMainAnimations();
    }, 2000);
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.querySelector('.loading-text');
    
    const loadingTexts = ['INITIALIZING...', 'LOADING ASSETS...', 'COMPILING CODE...', 'READY TO LAUNCH...'];
    let currentIndex = 0;
    
    const textInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingTexts.length;
        if (loadingText) {
            loadingText.textContent = loadingTexts[currentIndex];
        }
    }, 500);
    
    setTimeout(() => {
        clearInterval(textInterval);
    }, 2000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!cursor || !cursorTrail) return;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        setTimeout(() => {
            cursorTrail.style.left = mouseX + 'px';
            cursorTrail.style.top = mouseY + 'px';
        }, 100);
    });
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-tilt, .hover-scale');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = '#64ffda';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = '#00ffff';
        });
    });
}

// Particle System
function initParticleSystem() {
    const particlesContainer = document.querySelector('.particles-background');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: #00ffff;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            opacity: ${opacity};
            pointer-events: none;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            box-shadow: 0 0 ${size * 2}px rgba(0, 255, 255, 0.3);
        `;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle when animation ends and create a new one
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
            createParticle();
        }, (Math.random() * 10 + 10) * 1000);
    }
    
    // Add CSS animation for particles
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(100vh) translateX(0px);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    const text = 'Chinnam Vamsee Krishna';
    const cursorElement = document.querySelector('.cursor-blink');
    
    if (!typingElement) return;
    
    typingElement.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            // Hide cursor after typing is complete
            setTimeout(() => {
                if (cursorElement) {
                    cursorElement.style.display = 'none';
                }
            }, 3000);
        }
    }, 100);
}

// Smooth Scrolling - Fixed implementation
function initSmoothScrolling() {
    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let external links work normally
            if (this.target !== '_blank') {
                this.target = '_blank';
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bars animation if in skills section
                if (entry.target.classList.contains('skills-section')) {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                }
                
                // Trigger specific animations for different elements
                if (entry.target.classList.contains('education-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, Math.random() * 300);
                }
                
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.opacity = '1';
                    }, Math.random() * 300);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, Math.random() * 300);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.education-card, .timeline-item, .project-card, .skill-category, .award-item, .skills-section'
    );
    
    animatableElements.forEach(element => {
        // Set initial state
        if (!element.classList.contains('skills-section')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'all 0.6s ease-out';
        }
        
        observer.observe(element);
    });
}

// Skill Bars Animation - Fixed implementation
function initSkillBars() {
    // Make sure skill bars are visible initially
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = width;
                bar.style.transition = 'width 1.5s ease-out';
            }
        }, index * 200);
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Add floating label functionality
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const submitSpan = submitBtn.querySelector('span');
        const originalText = submitSpan.textContent;
        
        submitSpan.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitSpan.textContent = 'Message Sent!';
            form.reset();
            
            // Reset focus states
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            setTimeout(() => {
                submitSpan.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Navigation Highlight
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call once on load
}

// Glitch Effects
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        element.addEventListener('mouseenter', () => {
            triggerGlitch(element);
        });
    });
}

function triggerGlitch(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = '';
    }, 10);
}

// Parallax Effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Tilt Effect
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.hover-tilt');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Button Ripple Effect
function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Main animations after loading
function startMainAnimations() {
    initParallaxEffect();
    initTiltEffect();
    initButtonRipples();
    
    // Start hero text animations
    const heroElements = document.querySelectorAll('.fade-in-up');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'all 0.8s ease-out';
        }, index * 200 + 500); // Add delay after loading screen
    });
    
    // Animate section lines
    const sectionLines = document.querySelectorAll('.section-line');
    sectionLines.forEach(line => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    line.style.width = '100px';
                    line.style.transition = 'width 1s ease-out';
                }
            });
        });
        observer.observe(line);
        
        // Set initial state
        line.style.width = '0px';
    });
    
    // Animate floating shapes
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    shapes.forEach((shape, index) => {
        setTimeout(() => {
            shape.style.opacity = '0.1';
            shape.style.animation = `float${index + 1} ${6 + index}s ease-in-out infinite`;
        }, index * 500);
    });
    
    // Ensure skills section is visible
    setTimeout(() => {
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            skillsSection.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            setTimeout(() => {
                skillsSection.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }, 100);
        }
    }, 100);
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ffff, #64ffda);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Scroll-dependent animations
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Reinitialize particle system on resize
    const particlesContainer = document.querySelector('.particles-background');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initParticleSystem();
    }
}, 250));

// Add navigation active state styling
if (!document.querySelector('#nav-styles')) {
    const style = document.createElement('style');
    style.id = 'nav-styles';
    style.textContent = `
        .nav-link.active {
            color: var(--primary-cyan) !important;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

// Preload animations and interactions
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        console.log('Fonts loaded, animations ready');
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add final styling for keyboard navigation
if (!document.querySelector('#keyboard-styles')) {
    const keyboardStyle = document.createElement('style');
    keyboardStyle.id = 'keyboard-styles';
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary-cyan) !important;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(keyboardStyle);
}