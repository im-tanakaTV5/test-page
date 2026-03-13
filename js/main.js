'use strict';

/* ============================================================
   NAVBAR
============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ============================================================
   MOBILE MENU
============================================================ */
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('hidden', !menuOpen);
  const lines = menuBtn.querySelectorAll('.ham-line');
  if (menuOpen) {
    lines[0].style.transform = 'translateY(7px) rotate(45deg)';
    lines[1].style.opacity   = '0';
    lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
  }
});

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.add('hidden');
  const lines = menuBtn.querySelectorAll('.ham-line');
  lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Hero reveals fire immediately
document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));

/* ============================================================
   ACTIVE NAV LINK
============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a.nav-link');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('text-white',   active);
        link.classList.toggle('text-gray-400', !active);
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

/* ============================================================
   AUTO-ROTATING GALLERY
   Usage: add data-gallery="id" on .gallery-wrap
          add .gallery-dots div with id="<id>-dots" inside
============================================================ */
function initGallery(wrap) {
  const slides   = [...wrap.querySelectorAll('.gallery-slide')];
  const dotsWrap = wrap.querySelector('.gallery-dots');
  if (slides.length < 2) return;

  const INTERVAL = 4000; // ms between slides
  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsWrap.querySelectorAll('.gallery-dot')[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsWrap.querySelectorAll('.gallery-dot')[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, INTERVAL); }
  function stopTimer()  { clearInterval(timer); }

  // Pause on hover/focus
  wrap.addEventListener('mouseenter', stopTimer);
  wrap.addEventListener('mouseleave', startTimer);
  wrap.addEventListener('focusin',    stopTimer);
  wrap.addEventListener('focusout',   startTimer);

  startTimer();
}

document.querySelectorAll('.gallery-wrap').forEach(initGallery);

/* ============================================================
   AGE BAR ANIMATION
   Bars animate in when they scroll into view
============================================================ */
const ageSection = document.getElementById('strengths');
let ageAnimated  = false;

function animateAgeBars() {
  if (ageAnimated) return;
  ageAnimated = true;
  document.querySelectorAll('.age-row').forEach((row, i) => {
    const pct = parseFloat(row.dataset.pct);
    const bar = row.querySelector('.age-bar');
    if (!bar) return;
    // max pct is 34.7 → map to 100% of bar width
    const maxPct = 34.7;
    const width  = (pct / maxPct) * 100;
    setTimeout(() => {
      bar.style.width = width + '%';
    }, i * 80); // stagger
  });
}

const ageObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) animateAgeBars();
}, { threshold: 0.2 });
if (ageSection) ageObs.observe(ageSection);

/* ============================================================
   CONTACT FORM
============================================================ */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const msg = document.getElementById('form-message');

  btn.textContent = '送信中…';
  btn.disabled    = true;

  // ---- FormspreeやMailtoに切り替える場合はここを編集 ----
  setTimeout(() => {
    btn.textContent = '送信しました ✓';
    btn.classList.remove('hover:bg-gray-200');
    btn.classList.add('opacity-50', 'cursor-default');
    msg.textContent = 'お問い合わせありがとうございます。数日以内にご返信いたします。';
    msg.classList.remove('hidden');
    msg.classList.add('success');
  }, 1200);
}
