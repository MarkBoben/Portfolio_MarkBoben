/* ---------- Mobile / compact menu toggle ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuToggle = document.getElementById('menu-toggle');
const menuLabel = document.getElementById('menu-label');
const overlayNav = document.getElementById('overlay-nav');
const menuBackdrop = document.getElementById('menu-backdrop');

function closeMenu() {
  menuToggle.classList.remove('open');
  overlayNav.classList.remove('open');
  menuBackdrop.classList.remove('open');
  menuLabel.textContent = 'MENU';
}
function toggleMenu() {
  const isOpen = overlayNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuBackdrop.classList.toggle('open', isOpen);
  menuLabel.textContent = isOpen ? 'CLOSE' : 'MENU';
}
menuToggle.addEventListener('click', toggleMenu);
menuBackdrop.addEventListener('click', closeMenu);
document.querySelectorAll('.overlay-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

/* ---------- Scroll-linked reveal (fluid, bidirectional) ---------- */
const revealEls = Array.from(document.querySelectorAll('.reveal'));

// group siblings for a cascading stagger effect (cards, cert grid, timeline)
['.focus-grid', '.cert-showcase', '.timeline'].forEach((sel) => {
  const group = document.querySelector(sel);
  if (!group) return;
  Array.from(group.children).forEach((child, i) => {
    if (child.classList.contains('reveal')) child.dataset.stagger = i;
  });
});

function updateReveals() {
  if (prefersReducedMotion) {
    revealEls.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none'; });
    return;
  }
  const vh = window.innerHeight;
  revealEls.forEach((el) => {
    const lag = (parseInt(el.dataset.stagger) || 0) * 55;
    const start = vh * 0.94 + lag;
    const end = vh * 0.5 + lag;
    const rect = el.getBoundingClientRect();
    let progress = (start - rect.top) / (start - end);
    progress = Math.min(1, Math.max(0, progress));

    el.style.opacity = progress;
    el.style.transform = `translateY(${(1 - progress) * 20}px) scale(${0.984 + progress * 0.016})`;
    el.style.filter = `blur(${(1 - progress) * 5}px)`;
  });
}

/* ---------- Cipher grid (scoped to hero) ---------- */
const heroSection = document.querySelector('.hero');
const cipherCanvas = document.getElementById('cipher-canvas');
const cipherCtx = cipherCanvas.getContext('2d');
const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const cellSize = 22;
let cipherGrid = [];
let heroW, heroH;
let mouseX = -9999, mouseY = -9999;

function resizeCipher() {
  const rect = heroSection.getBoundingClientRect();
  heroW = cipherCanvas.width = heroSection.offsetWidth;
  heroH = cipherCanvas.height = heroSection.offsetHeight;
  const cols = Math.ceil(heroW / cellSize);
  const rows = Math.ceil(heroH / cellSize);
  cipherGrid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(glyphs[Math.floor(Math.random() * glyphs.length)]);
    cipherGrid.push(row);
  }
}
resizeCipher();
window.addEventListener('resize', resizeCipher);

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let cipherFrame = 0;
function drawCipher() {
  const heroRect = heroSection.getBoundingClientRect();
  const localMouseX = mouseX - heroRect.left;
  const localMouseY = mouseY - heroRect.top;

  cipherCtx.clearRect(0, 0, heroW, heroH);
  cipherCtx.textBaseline = 'top';

  for (let r = 0; r < cipherGrid.length; r++) {
    for (let c = 0; c < cipherGrid[r].length; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const dx = x - localMouseX;
      const dy = y - localMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 150;

      if (cipherFrame % 6 === 0 && Math.random() < 0.015) {
        cipherGrid[r][c] = glyphs[Math.floor(Math.random() * glyphs.length)];
      }

      if (dist < radius) {
        const t = 1 - dist / radius;
        cipherCtx.fillStyle = `rgba(199,162,51,${0.28 + t * 0.55})`;
        cipherCtx.font = `${14 + t * 4}px JetBrains Mono, monospace`;
      } else {
        cipherCtx.fillStyle = 'rgba(74,108,140,0.12)';
        cipherCtx.font = '14px JetBrains Mono, monospace';
      }
      cipherCtx.fillText(cipherGrid[r][c], x, y);
    }
  }
  cipherFrame++;
  requestAnimationFrame(drawCipher);
}
drawCipher();

/* ---------- Full-page twisting circuit trace ---------- */
const traceSvg = document.getElementById('trace-svg');
const nodeEls = document.querySelectorAll('[data-node]');

function buildTrace() {
  const docH = document.body.scrollHeight;
  const docW = window.innerWidth;
  traceSvg.setAttribute('viewBox', `0 0 ${docW} ${docH}`);
  traceSvg.setAttribute('width', docW);
  traceSvg.setAttribute('height', docH);

  const pts = [];
  nodeEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    pts.push({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY
    });
  });

  let d = `M ${pts[0].x} 0`;
  d += ` C ${pts[0].x + 100} ${pts[0].y * 0.4}, ${pts[0].x - 100} ${pts[0].y * 0.7}, ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const midY = (a.y + b.y) / 2;
    const swing = 220 * (i % 2 === 0 ? 1 : -1);
    d += ` C ${a.x + swing} ${a.y + (midY - a.y) * 0.3}, ${b.x - swing} ${b.y - (b.y - midY) * 0.3}, ${b.x} ${b.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` C ${last.x - 120} ${last.y + (docH - last.y) * 0.3}, ${last.x + 120} ${last.y + (docH - last.y) * 0.7}, ${last.x} ${docH}`;

  traceSvg.innerHTML = `
    <path class="path-static" id="static-path" d="${d}"></path>
    <path class="path-glow" id="glow-path" d="${d}" stroke-dasharray="170 8000"></path>
    ${pts.map((p, i) => `<circle class="node-ring" id="ring-${i}" cx="${p.x}" cy="${p.y}" r="${i === 0 ? 92 : 10}"></circle>`).join('')}
    <circle class="pulse-dot" id="pulse-dot" r="5"></circle>
  `;
  return document.getElementById('glow-path');
}

let glowPath = buildTrace();
let totalLen = glowPath.getTotalLength();
let pulsePos = 0;
let pulseDir = 1;
const pulseSpeed = 2.6;

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    glowPath = buildTrace();
    totalLen = glowPath.getTotalLength();
  }, 200);
});

function animateTrace() {
  pulsePos += pulseSpeed * pulseDir;
  if (pulsePos >= totalLen) { pulsePos = totalLen; pulseDir = -1; }
  if (pulsePos <= 0) { pulsePos = 0; pulseDir = 1; }
  glowPath.setAttribute('stroke-dashoffset', (totalLen - pulsePos).toString());

  const pt = glowPath.getPointAtLength(pulsePos);
  const dot = document.getElementById('pulse-dot');
  if (dot) { dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); }

  nodeEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY - 80;
    const bottom = rect.top + rect.height + window.scrollY + 80;
    const near = pulsePos > top && pulsePos < bottom;
    const ring = document.getElementById('ring-' + i);
    if (ring) ring.classList.toggle('lit', near);

    if (i === 0) {
      document.querySelector('.id-photo-wrap').classList.toggle('lit', near);
      document.querySelector('.id-ring').classList.toggle('lit', near);
    }
  });

  updateReveals();
  requestAnimationFrame(animateTrace);
}
requestAnimationFrame(animateTrace);

/* Rebuild trace once fonts/layout settle (positions can shift after font load) */
window.addEventListener('load', () => {
  glowPath = buildTrace();
  totalLen = glowPath.getTotalLength();
});

/* ---------- Contact form submission ---------- */
const CONTACT_ENDPOINT = 'https://portfolio-markboben.onrender.com/contact';

const contactForm = document.getElementById('contact-form');
const cfSubmit = document.getElementById('cf-submit');
const cfStatus = document.getElementById('cf-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      cfStatus.textContent = 'Please fill in all fields.';
      cfStatus.className = 'form-status error';
      return;
    }

    cfSubmit.disabled = true;
    cfSubmit.textContent = 'Sending...';
    cfStatus.textContent = '';
    cfStatus.className = 'form-status';

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!res.ok) throw new Error('Request failed');

      cfStatus.textContent = 'Message sent — thank you! I\'ll get back to you soon.';
      cfStatus.className = 'form-status success';
      contactForm.reset();
    } catch (err) {
      cfStatus.textContent = 'Something went wrong. Please try again or email me directly.';
      cfStatus.className = 'form-status error';
    } finally {
      cfSubmit.disabled = false;
      cfSubmit.textContent = 'Send Message';
    }
  });
}
