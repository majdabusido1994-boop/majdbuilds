/* ============================================
   MAJD ABUSIDO — Website Scripts
   ============================================ */

// --- Nav scroll effect ---
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- Mobile menu ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// --- Portfolio filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// --- Contact form → WhatsApp ---
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const budget = document.getElementById('budget').value;
    const project = document.getElementById('project').value.trim();

    const message = `Hi Majd! I'm interested in working with you.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Budget: ${budget || 'Not specified'}\n` +
        `Project: ${project}`;

    const url = `https://api.whatsapp.com/send?phone=962799090933&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});

// --- Smooth anchor scrolling (fallback for Safari) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = nav.offsetHeight + 16;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// --- Animated counter for stats ---
function animateValue(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + range * eased);
        el.textContent = current + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// Observe stats
const statEls = document.querySelectorAll('.stat strong');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            if (text.includes('%')) {
                el.dataset.suffix = '%';
                animateValue(el, 0, parseInt(text), 1200);
            } else if (text.match(/^\d+\+?$/)) {
                el.dataset.suffix = text.includes('+') ? '+' : '';
                animateValue(el, 0, parseInt(text), 1000);
            }
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
statEls.forEach(el => statsObserver.observe(el));
