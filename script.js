document.addEventListener('DOMContentLoaded', () => {

    // ─── Particle Canvas ──────────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 1;
            this.speedX = (Math.random() - 0.5) * 6;
            this.speedY = (Math.random() - 0.5) * 6 - 3;
            this.gravity = 0.12;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.008;
            // Gold / petal tones
            const hue = Math.random() > 0.5 ? `${Math.floor(40 + Math.random() * 20)}` : `${Math.floor(340 + Math.random() * 30)}`;
            this.color = `hsla(${hue}, 80%, 70%, `;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.opacity -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.beginPath();
            // Petal-like shape
            ctx.ellipse(this.x, this.y, this.size, this.size * 2, this.x * 0.02, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function spawnBurst(x, y, count = 80) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.opacity > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        if (particles.length > 0) requestAnimationFrame(animateParticles);
        else {
            // Done, hide canvas again
            canvas.style.opacity = '0';
        }
    }

    // ─── Envelope Opening Logic ───────────────────────────────────────
    const openBtn = document.getElementById('open-invitation');
    const envelopeFlap = document.getElementById('env-flap');
    const envelopeCard = document.getElementById('env-card');
    const envelopeWrap = document.getElementById('envelope-wrapper');
    const sealWrap = document.getElementById('wax-seal-wrap');
    const envelopeOverlay = document.getElementById('envelope-overlay');

    openBtn.addEventListener('click', () => {

        // 1. Hide wax seal
        sealWrap.classList.add('hiding');

        // 2. Spawn confetti burst from seal center
        const rect = openBtn.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        canvas.style.opacity = '1';
        spawnBurst(bx, by, 100);
        requestAnimationFrame(animateParticles);

        // 3. Open the flap
        setTimeout(() => {
            envelopeFlap.classList.add('opened');
        }, 150);

        // 4. Reveal card content (card text appears)
        setTimeout(() => {
            envelopeCard.classList.add('revealed');
        }, 1200);

        // 5. Card rises out of envelope
        setTimeout(() => {
            envelopeCard.classList.add('rising');
        }, 2000);

        // 6. Envelope floats/fades, overlay disappears
        setTimeout(() => {
            envelopeWrap.style.transition = 'transform 1.2s ease-in, opacity 1.2s ease-in';
            envelopeWrap.style.transform = 'scale(0.88) translateY(30px)';
            envelopeWrap.style.opacity = '0';
        }, 3000);

        setTimeout(() => {
            envelopeOverlay.classList.add('hidden');
            document.body.classList.remove('envelope-active');
            document.body.classList.add('invitation-opened');
        }, 4000);
    });

    // ─── Navbar Scroll Effect ─────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─── Countdown Timer ──────────────────────────────────────────────
    const weddingDate = new Date('September 25, 2026 16:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.querySelector('.countdown-wrapper').innerHTML = '<h3>Just Married!</h3>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('mins').innerText = String(minutes).padStart(2, '0');
        document.getElementById('secs').innerText = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ─── Scroll Animations (Intersection Observer) ──────────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => observer.observe(el));
    document.querySelector('.hero').classList.add('visible');

    // ─── RSVP Form Logic ─────────────────────────────────────────────
    const radioButtons = document.querySelectorAll('input[name="attending"]');
    const guestGroup = document.getElementById('guest-count-group');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                guestGroup.style.display = 'flex';
                guestGroup.style.opacity = '0';
                setTimeout(() => {
                    guestGroup.style.transition = 'opacity 0.3s ease';
                    guestGroup.style.opacity = '1';
                }, 10);
            } else {
                guestGroup.style.opacity = '0';
                setTimeout(() => { guestGroup.style.display = 'none'; }, 300);
            }
        });
    });

    const form = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerText;
        btn.innerText = 'እየላኩ…';
        btn.disabled = true;

        setTimeout(() => {
            const isAttending = document.querySelector('input[name="attending"]:checked').value;
            formMessage.innerText = isAttending === 'yes'
                ? "አመሰግናለሁ! ከእናንተ ጋር ለማክበር ጓጉተናል።"
                : "ስለ አሳወቁን እናመሰግናለን። ሳያችሁ ያስቆጫናል!";
            formMessage.style.color = isAttending === 'yes' ? '#d4af37' : '#ffffff';
            formMessage.style.opacity = '1';
            form.reset();
            guestGroup.style.display = 'none';
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });
});
