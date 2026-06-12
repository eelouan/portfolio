// ===========================
// AVATAR FALLBACK
// ===========================
const avatarImg = document.getElementById('avatarImg');
if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    avatarImg.closest('picture').style.display = 'none';
    document.querySelector('.avatar-placeholder').style.display = 'flex';
  });
}

// ===========================
// BURGER MENU
// ===========================
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===========================
// TYPEWRITER EFFECT
// ===========================
const roles = [
  'QA Automation Engineer',
  'Python · Selenium · Playwright',
  'Expert en tests automatisés',
  'Disponible à Montréal 🍁',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .about-grid, .contact-grid, .section-title'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((sib, idx) => {
        setTimeout(() => sib.classList.add('visible'), idx * 80);
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ===========================
// ACTIVE NAV LINK ON SCROLL + BACK TO TOP
// ===========================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 80;
    if (window.scrollY >= top) current = section.id;
  });

  navItems.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
  });

  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================
// ANIMATED COUNTERS
// ===========================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
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

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ===========================
// AVAILABILITY COUNTDOWN
// ===========================
(function () {
  const target = new Date('2026-07-13T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  const el = document.getElementById('availCountdown');
  if (!el) return;
  el.textContent = diff > 0 ? `dans ${diff} jour${diff > 1 ? 's' : ''}` : 'dès maintenant';
})();

// ===========================
// CONTACT FORM — Formspree
// ===========================
// 1. Crée un compte gratuit sur https://formspree.io
// 2. Crée un nouveau formulaire avec elouan.moreau@live.fr
// 3. Remplace YOUR_FORM_ID par ton vrai ID (ex: xyzabc12)
const FORMSPREE_ID = 'xojznnpb';

document.getElementById('contactForm').addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type="submit"]');

  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    note.textContent = '⚠️ Configure ton ID Formspree dans script.js.';
    note.style.color = '#f87171';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  note.textContent = '';

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      note.textContent = 'Message envoyé ! Je te répondrai rapidement.';
      note.style.color = '#4ade80';
      btn.textContent = 'Message envoyé ✓';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Envoyer le message';
        note.textContent = '';
      }, 5000);
    } else {
      throw new Error();
    }
  } catch {
    note.textContent = 'Erreur lors de l\'envoi. Contacte-moi par email directement.';
    note.style.color = '#f87171';
    btn.disabled = false;
    btn.textContent = 'Réessayer';
  }
}
