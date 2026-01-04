/**
 * THE OLYMPUS PROJECTS
 * Divine Interactive Effects
 */

// ================================================
// PARTICLE SYSTEM - Golden Dust & Stars
// ================================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    init() {
        // Create floating golden particles
        for (let i = 0; i < 80; i++) {
            this.particles.push(this.createParticle());
        }

        // Create background stars
        for (let i = 0; i < 150; i++) {
            this.stars.push(this.createStar());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -Math.random() * 0.5 - 0.2,
            opacity: Math.random() * 0.5 + 0.3,
            golden: Math.random() > 0.3,
            pulse: Math.random() * Math.PI * 2
        };
    }

    createStar() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Add sparkles near mouse
            if (Math.random() > 0.85) {
                this.particles.push({
                    x: e.clientX + (Math.random() - 0.5) * 50,
                    y: e.clientY + (Math.random() - 0.5) * 50,
                    size: Math.random() * 4 + 2,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: -Math.random() * 2 - 1,
                    opacity: 1,
                    golden: true,
                    pulse: 0,
                    lifetime: 60
                });
            }
        });
    }

    update() {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.05;

            // Mouse interaction
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                p.x -= dx * 0.01;
                p.y -= dy * 0.01;
            }

            // Lifetime particles (mouse sparkles)
            if (p.lifetime !== undefined) {
                p.lifetime--;
                p.opacity = p.lifetime / 60;
                if (p.lifetime <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }

            // Reset particles that go off screen
            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;
        }

        // Update stars
        for (const star of this.stars) {
            star.twinkle += star.twinkleSpeed;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw stars
        for (const star of this.stars) {
            const opacity = (Math.sin(star.twinkle) + 1) / 2 * 0.8 + 0.2;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
            this.ctx.fill();
        }

        // Draw particles
        for (const p of this.particles) {
            const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );

            if (p.golden) {
                gradient.addColorStop(0, `rgba(212, 175, 55, ${pulseOpacity})`);
                gradient.addColorStop(0.5, `rgba(212, 175, 55, ${pulseOpacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
            } else {
                gradient.addColorStop(0, `rgba(200, 200, 255, ${pulseOpacity})`);
                gradient.addColorStop(0.5, `rgba(200, 200, 255, ${pulseOpacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Core
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            if (p.golden) {
                this.ctx.fillStyle = `rgba(255, 223, 100, ${pulseOpacity})`;
            } else {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            }
            this.ctx.fill();
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// LIGHTNING EFFECT
// ================================================

class LightningEffect {
    constructor() {
        this.element = document.querySelector('.lightning');
        this.scheduleNext();
    }

    flash() {
        this.element.classList.add('flash');
        setTimeout(() => {
            this.element.classList.remove('flash');
        }, 200);
    }

    scheduleNext() {
        // Random interval between flashes (5-15 seconds)
        const delay = Math.random() * 10000 + 5000;
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% chance to flash
                this.flash();
            }
            this.scheduleNext();
        }, delay);
    }
}

// ================================================
// SCROLL ANIMATIONS
// ================================================

class ScrollAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.god-card');
        this.header = document.querySelector('.section-header');
        this.init();
    }

    init() {
        // Intersection Observer for cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        this.cards.forEach(card => observer.observe(card));

        // Parallax effect on scroll
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent) {
            // Parallax effect for hero
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom > 0) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            }
        }
    }
}

// ================================================
// CARD TILT EFFECT
// ================================================

// CardTilt removed - replaced by CSS flip effect

// ================================================
// CONSTELLATION CONNECTOR
// ================================================

class ConstellationEffect {
    constructor() {
        this.cards = document.querySelectorAll('.god-card');
        this.lines = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas for constellation lines
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getCardCenters() {
        const centers = [];
        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                centers.push({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    visible: card.classList.contains('visible')
                });
            }
        });
        return centers;
    }

    drawLines() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centers = this.getCardCenters();
        if (centers.length < 2) return;

        // Draw constellation lines between adjacent cards
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < centers.length - 1; i++) {
            if (centers[i].visible && centers[i + 1] && centers[i + 1].visible) {
                const dist = Math.sqrt(
                    Math.pow(centers[i + 1].x - centers[i].x, 2) +
                    Math.pow(centers[i + 1].y - centers[i].y, 2)
                );

                if (dist < 500) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(centers[i].x, centers[i].y);
                    this.ctx.lineTo(centers[i + 1].x, centers[i + 1].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.drawLines();
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// AUDIO AMBIENT (Optional - Hover sounds)
// ================================================

class AmbientAudio {
    constructor() {
        this.audioContext = null;
        this.init();
    }

    init() {
        // Initialize on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });

        // Add hover sounds to cards
        const cards = document.querySelectorAll('.god-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.playHoverSound());
        });
    }

    playHoverSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Divine chord
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
}

// ================================================
// TYPING EFFECT FOR SUBTITLE
// ================================================

class TypingEffect {
    constructor() {
        this.subtitle = document.querySelector('.subtitle');
        if (this.subtitle) {
            this.originalText = this.subtitle.textContent;
            this.init();
        }
    }

    init() {
        // Wait for animation to complete then add cursor blink
        setTimeout(() => {
            this.subtitle.style.borderRight = '2px solid var(--gold)';
            this.subtitle.style.animation = 'none';
            this.subtitle.style.opacity = '1';

            // Blink cursor
            setInterval(() => {
                this.subtitle.style.borderRightColor =
                    this.subtitle.style.borderRightColor === 'transparent'
                        ? 'var(--gold)'
                        : 'transparent';
            }, 530);
        }, 2500);
    }
}

// ================================================
// SMOOTH REVEAL ON LOAD
// ================================================

class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }
}

// ================================================
// INITIALIZE EVERYTHING
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleSystem(canvas);
    }

    // Initialize effects
    new LightningEffect();
    new ScrollAnimations();
    // CardTilt removed - using CSS flip effect instead
    new ConstellationEffect();
    new AmbientAudio();
    new TypingEffect();
    new PageLoader();

    // Log divine message
    console.log('%c⚡ THE OLYMPUS PROJECTS ⚡', 'color: #d4af37; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%cWhere Divine Ideas Become Reality', 'color: #f5f5f5; font-size: 14px; font-style: italic;');
});

// ================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
