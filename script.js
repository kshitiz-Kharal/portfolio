'use strict';

/* ═══════════════════════════════════════
   PARTICLES CANVAS
═══════════════════════════════════════ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

let pts = [];
const N         = 90;
const LINK_DIST = 145;
const COLORS    = ['223,41,53', '255,107,107'];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init() {
  pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.38,
      vy:    (Math.random() - 0.5) * 0.38,
      r:     Math.random() * 1.8 + 0.8,
      color: COLORS[Math.random() > 0.4 ? 0 : 1],
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < N; i++) {
    const p = pts[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -8)                p.x = canvas.width  + 8;
    if (p.x > canvas.width  + 8) p.x = -8;
    if (p.y < -8)                p.y = canvas.height + 8;
    if (p.y > canvas.height + 8) p.y = -8;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},0.55)`;
    ctx.fill();

    for (let j = i + 1; j < N; j++) {
      const q  = pts[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < LINK_DIST) {
        const alpha = (1 - d / LINK_DIST) * 0.28;
        const rgb   = Math.random() > 0.5 ? p.color : q.color;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

resize();
init();
draw();
window.addEventListener('resize', () => { resize(); init(); });

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const total     = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = total > 0 ? (scrolled / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════ */
const ROLES = [
  'Network Engineer',
  'Cloud Engineer',
  'Azure Administrator',
  'Terraform Developer',
  'Infrastructure Automator',
];
let rIdx   = 0;
let cIdx   = 0;
let del    = false;
const roleEl = document.getElementById('roleText');

function type() {
  const word = ROLES[rIdx];
  roleEl.textContent = del
    ? word.slice(0, --cIdx)
    : word.slice(0, ++cIdx);

  if (!del && cIdx === word.length) {
    del = true;
    setTimeout(type, 1900);
    return;
  }
  if (del && cIdx === 0) {
    del = false;
    rIdx = (rIdx + 1) % ROLES.length;
    setTimeout(type, 420);
    return;
  }
  setTimeout(type, del ? 42 : 78);
}
type();

/* ═══════════════════════════════════════
   NAVBAR SCROLL BEHAVIOR
═══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ═══════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════ */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
let   navOpen  = false;

toggle.addEventListener('click', () => {
  navOpen = !navOpen;
  navLinks.classList.toggle('open', navOpen);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navOpen = false;
    navLinks.classList.remove('open');
  });
});

/* ═══════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT
═══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  links.forEach(a => {
    const active = a.getAttribute('href') === `#${current}`;
    a.style.color = active ? 'var(--primary)' : '';
  });
}, { passive: true });

/* ═══════════════════════════════════════
   NUMBER COUNTER ANIMATION
═══════════════════════════════════════ */
function animateCount(el, from, to, duration, suffix) {
  const start = performance.now();
  function update(now) {
    const p      = Math.min((now - start) / duration, 1);
    const eased  = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════
   SCROLL-TRIGGERED FADE-IN + COUNTERS
═══════════════════════════════════════ */
const countersDone = new WeakSet();

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);

        const counter = entry.target.querySelector('[data-target]');
        if (counter && !countersDone.has(counter)) {
          countersDone.add(counter);
          const target = parseFloat(counter.dataset.target);
          const suffix = counter.dataset.suffix || '';
          animateCount(counter, 0, target, 1200, suffix);
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
