// ===========================
// CONFIG
// ===========================
const FORMSPREE_ID = 'xojznnpb';

const TYPEWRITER_ROLES = [
  'QA Automation Engineer',
  'Python · Selenium · Playwright',
  'Expert en tests automatisés',
  'Disponible à Montréal 🍁',
];

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initAvatarFallback();
  initBurgerMenu();
  initTypewriter();
  initScrollReveal();
  initNavAndBackToTop();
  initStatsCounter();
  initAvailabilityCountdown();
  initContactForm();
});

// ===========================
// AVATAR FALLBACK
// ===========================
function initAvatarFallback() {
  const img = document.getElementById('avatarImg');
  if (!img) return;
  img.addEventListener('error', () => {
    img.closest('picture').style.display = 'none';
    document.querySelector('.avatar-placeholder').classList.add('visible');
  });
}

// ===========================
// BURGER MENU
// ===========================
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===========================
// TYPEWRITER
// ===========================
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = TYPEWRITER_ROLES[roleIndex];

    el.textContent = isDeleting
      ? current.substring(0, --charIndex)
      : current.substring(0, ++charIndex);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % TYPEWRITER_ROLES.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

// ===========================
// SCROLL REVEAL
// ===========================
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.skill-card, .project-card, .about-grid, .contact-grid, .section-title'
  );

  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.parentElement.querySelectorAll('.reveal').forEach((sib, i) => {
        setTimeout(() => sib.classList.add('visible'), i * 80);
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ===========================
// NAV ACTIVE + BACK TO TOP
// ===========================
function initNavAndBackToTop() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 80) current = section.id;
    });

    navItems.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
    });

    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===========================
// ANIMATED COUNTERS
// ===========================
function initStatsCounter() {
  const section = document.querySelector('.stats-section');
  if (!section) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      observer.disconnect();
    });
  }, { threshold: 0.5 });

  observer.observe(section);
}

// ===========================
// AVAILABILITY COUNTDOWN
// ===========================
function initAvailabilityCountdown() {
  const el = document.getElementById('availCountdown');
  if (!el) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date('2026-07-13T00:00:00') - today) / 86_400_000);
  el.textContent = diff > 0 ? `dans ${diff} jour${diff > 1 ? 's' : ''}` : 'dès maintenant';
}

// ===========================
// CONTACT FORM
// ===========================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  note.textContent = '';

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error();

    note.textContent = 'Message envoyé ! Je te répondrai rapidement.';
    note.style.color = '#4ade80';
    btn.textContent = 'Message envoyé ✓';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Envoyer le message';
      note.textContent = '';
    }, 5000);
  } catch {
    note.textContent = "Erreur lors de l'envoi. Contacte-moi par email directement.";
    note.style.color = '#f87171';
    btn.disabled = false;
    btn.textContent = 'Réessayer';
  }
}
