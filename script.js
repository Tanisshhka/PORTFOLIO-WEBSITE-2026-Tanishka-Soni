/* ============================================
   TANISHKA SONI — PORTFOLIO
   Interactive Features & Animations
   ============================================ */

(function () {
    'use strict';

    /* ---------- DOM References ---------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const loader = $('#loader');
    const scrollProgress = $('#scroll-progress');
    const cursorGlow = $('#cursor-glow');
    const navbar = $('#navbar');
    const navToggle = $('#nav-toggle');
    const navLinks = $('#nav-links');
    const canvas = $('#particles-canvas');
    const typedOutput = $('#typed-output');
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxCaption = $('#lightbox-caption');
    const lightboxClose = $('.lightbox-close');
    const contactForm = $('#contact-form');

    /* ---------- Loading Screen ---------- */
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }, 1200);
    });

    document.body.style.overflow = 'hidden';

    /* ---------- Scroll Progress ---------- */
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    /* ---------- Cursor Glow ---------- */
    function initCursorGlow() {
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        } else {
            cursorGlow.style.display = 'none';
        }
    }

    /* ---------- Navbar ---------- */
    function initNavbar() {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            updateScrollProgress();
            updateActiveNavLink();
        });

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        $$('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    function updateActiveNavLink() {
        const sections = $$('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                $$('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ---------- Particles ---------- */
    function initParticles() {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = ['168,85,247', '59,130,246', '6,182,212'][Math.floor(Math.random() * 3)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > w) this.speedX *= -1;
                if (this.y < 0 || this.y > h) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
                ctx.fill();
            }
        }

        function init() {
            resize();
            const count = Math.min(Math.floor((w * h) / 12000), 100);
            particles = Array.from({ length: count }, () => new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(168,85,247,${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animFrame = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animFrame);
            init();
            animate();
        });

        init();
        animate();
    }

    /* ---------- Typed Effect ---------- */
    function initTyped() {
        const strings = [
            'Full Stack Developer',
            'AI Enthusiast',
            'Problem Solver',
            'React Developer',
            'Node.js Developer',
            'Open Source Contributor'
        ];

        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let pauseTimer = 0;

        function type() {
            const currentString = strings[stringIndex];

            if (isDeleting) {
                typedOutput.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedOutput.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentString.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                speed = 500;
            }

            setTimeout(type, speed);
        }

        type();
    }

    /* ---------- Scroll Reveal ---------- */
    function initScrollReveal() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');

                        // Animate skill bars when visible
                        if (entry.target.closest('#skills')) {
                            animateSkillBars();
                        }

                        // Animate counters when visible
                        if (entry.target.closest('#stats') || entry.target.closest('#about')) {
                            animateCounters(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        $$('.reveal-up, .reveal-left, .reveal-right, .pop-in, .bounce-in, .slide-up-fade').forEach(el => observer.observe(el));
    }

    /* ---------- Skill Bars ---------- */
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBarsAnimated = true;

        $$('.skill-fill').forEach((bar, i) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, i * 100);
        });
    }

    /* ---------- Counter Animation ---------- */
    function animateCounters(container) {
        const counters = container ? $$('.highlight-number, .stat-number', container) : $$('.highlight-number, .stat-number');

        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            counter.dataset.animated = 'true';

            const target = parseFloat(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const isDecimal = target % 1 !== 0;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    counter.textContent = current.toFixed(2) + suffix;
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    /* ---------- Lightbox ---------- */
    function initLightbox() {
        $$('.gallery-item, .certificate-placeholder').forEach(item => {
            item.addEventListener('click', () => {
                const placeholder = item.querySelector('.gallery-placeholder, .certificate-placeholder');
                const caption = item.querySelector('.gallery-caption, .certificate-info h4');
                const icon = placeholder ? placeholder.querySelector('i') : null;
                const text = placeholder ? placeholder.querySelector('span') : null;

                // For placeholder images, create a data URI
                lightboxImg.style.display = 'none';
                lightboxCaption.textContent = caption ? caption.textContent : '';

                lightbox.classList.add('active');
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    /* ---------- Contact Form ---------- */
    function initContactForm() {
        // Contact section now uses direct links - no form needed
    }

    /* ---------- Smooth Scroll for Anchor Links ---------- */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    /* ---------- Hero Photo Parallax ---------- */
    function initParallax() {
        const heroPhoto = $('#hero-photo');
        if (!heroPhoto) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            heroPhoto.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    /* ---------- Achievement Badge Float ---------- */
    function initBadgeAnimations() {
        $$('.floating-badge').forEach((badge, i) => {
            badge.style.animationDelay = (i * 0.5) + 's';
        });
    }

    /* ---------- Magnetic Buttons ---------- */
    function initMagneticButtons() {
        $$('.btn, .social-link').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(pointer: fine)').matches) {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                }
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ---------- Tilt Card Effect ---------- */
    function initTiltCards() {
        if (window.matchMedia('(pointer: fine)').matches) {
            $$('.tilt-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const tiltX = (y - 0.5) * 8;
                    const tiltY = (x - 0.5) * -8;
                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
    }

    /* ---------- Contact Card Ripple ---------- */
    function initContactRipple() {
        $$('.contact-big-card').forEach(card => {
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute; border-radius: 50%; background: rgba(124,58,237,0.3);
                    width: 100px; height: 100px; transform: translate(-50%, -50%) scale(0);
                    animation: rippleEffect 0.6s ease-out; pointer-events: none;
                `;
                const rect = this.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple keyframe if not exists
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes rippleEffect {
                    to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ---------- Parallax Tilt on Hero ---------- */
    function initHeroTilt() {
        const hero = document.getElementById('hero');
        if (!hero || !window.matchMedia('(pointer: fine)').matches) return;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const badges = hero.querySelectorAll('.floating-badge');
            badges.forEach((badge, i) => {
                const depth = (i + 1) * 8;
                badge.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }

    /* ---------- Section Reveal Stagger ---------- */
    function initStaggerReveal() {
        $$('.about-grid .about-card, .skills-grid .skill-category, .projects-grid .project-card, .achievements-grid .achievement-card, .hire-grid .hire-card, .certificates-masonry .certificate-card, .gallery-grid .gallery-item, .contact-cards-grid .contact-big-card').forEach((card, i) => {
            card.style.transitionDelay = (i % 4) * 0.1 + 's';
        });
    }

    /* ---------- Initialize Everything ---------- */
    function initAnimations() {
        initTyped();
        initScrollReveal();
        initLightbox();
        initContactForm();
        initSmoothScroll();
        initParallax();
        initBadgeAnimations();
        initMagneticButtons();
        initStaggerReveal();
        initTiltCards();
        initContactRipple();
        initHeroTilt();

        // Initial counters for about section
        setTimeout(() => {
            animateCounters($('#about'));
        }, 1500);
    }

    // Start
    initNavbar();
    initCursorGlow();
    initParticles();
    updateScrollProgress();

})();
