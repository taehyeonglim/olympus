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
// INFINITE CAROUSEL
// ================================================

class InfiniteCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.god-card');
        if (this.track && this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        // Clone all cards for infinite scroll effect
        this.cards.forEach(card => {
            const clone = card.cloneNode(true);
            // Fix duplicate SVG IDs by appending '-clone' suffix
            clone.querySelectorAll('[id]').forEach(el => {
                const oldId = el.id;
                const newId = oldId + '-clone';
                el.id = newId;
                // Update url(#id) references within the same cloned card
                clone.querySelectorAll(`[marker-end="url(#${oldId})"]`).forEach(ref => {
                    ref.setAttribute('marker-end', `url(#${newId})`);
                });
                clone.querySelectorAll(`[stroke="url(#${oldId})"]`).forEach(ref => {
                    ref.setAttribute('stroke', `url(#${newId})`);
                });
                clone.querySelectorAll(`[fill="url(#${oldId})"]`).forEach(ref => {
                    ref.setAttribute('fill', `url(#${newId})`);
                });
            });
            this.track.appendChild(clone);
        });
    }
}

// ================================================
// SCROLL ANIMATIONS (Hero Parallax)
// ================================================

class ScrollAnimations {
    constructor() {
        this.ticking = false;
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;

        if (this.hero && this.heroContent) {
            const heroRect = this.hero.getBoundingClientRect();
            if (heroRect.bottom > 0) {
                this.heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                this.heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            }
        }
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
        // Body starts hidden via CSS (opacity: 0), fade in on load
        document.body.style.transition = 'opacity 0.5s ease';

        if (document.readyState === 'complete') {
            document.body.style.opacity = '1';
        } else {
            window.addEventListener('load', () => {
                document.body.style.opacity = '1';
            });
        }
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
    new InfiniteCarousel();
    new ScrollAnimations();
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
