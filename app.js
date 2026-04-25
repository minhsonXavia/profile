/* ============================================================
   PARTICLES / SNOW EFFECT
   ============================================================ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function rand(min, max) { return Math.random() * (max - min) + min; }

function createParticle() {
  return {
    x: rand(0, W),
    y: rand(-20, H),
    r: rand(1, 3.5),
    speedY: rand(0.3, 1.2),
    speedX: rand(-0.3, 0.3),
    opacity: rand(0.2, 0.7),
    color: Math.random() > 0.5 ? '#a8edea' : Math.random() > 0.5 ? '#fed6e3' : '#b48ef5',
    pulse: rand(0, Math.PI * 2),
    pulseSpeed: rand(0.005, 0.02),
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.pulse += p.pulseSpeed;
    const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
    // Soft glow
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.round(alpha * 0.15 * 255).toString(16).padStart(2, '0');
    ctx.fill();

    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y > H + 10) { Object.assign(p, createParticle(), { y: -10, x: rand(0, W) }); }
    if (p.x < -10 || p.x > W + 10) { p.x = rand(0, W); }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================================================
   MUSIC PLAYER – Real Audio
   ============================================================ */
const audio = new Audio('https://dkupload.site/uploads/files-1777044444427-593214909.mp3');
audio.loop = true;

const playBtn       = document.getElementById('playBtn');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressBar   = document.getElementById('progressBar');
const timeCur       = document.getElementById('timeCur');
const musicDisc     = document.getElementById('musicDisc');

document.querySelector('.music-title').textContent  = 'hay cho con chiu kho thay em';
document.querySelector('.music-artist').textContent = '🎵';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const ss = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${ss}`;
}

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  timeCur.textContent = fmt(audio.currentTime);
  document.querySelector('.time-total').textContent = fmt(audio.duration);
});

function startPlay() {
  audio.play().catch(() => {});
  playBtn.textContent = '⏸';
  musicDisc.classList.add('spinning');
}

function pausePlay() {
  audio.pause();
  playBtn.textContent = '▶';
  musicDisc.classList.remove('spinning');
}

playBtn.addEventListener('click', () => audio.paused ? startPlay() : pausePlay());

prevBtn.addEventListener('click', () => {
  audio.currentTime = 0;
});

nextBtn.addEventListener('click', () => {
  audio.currentTime = 0;
  startPlay();
});

progressBar.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

/* ============================================================
   HOVER GLOW on main card – subtle parallax on mousemove
   ============================================================ */
const card = document.getElementById('mainCard');
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  card.style.transform = `rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg)`;
});
document.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateY(0deg) rotateX(0deg)';
});
card.style.transition = 'transform 0.3s ease';

/* ============================================================
   Subtle entrance stagger for tags
   ============================================================ */
document.querySelectorAll('.tag').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 800 + i * 120);
});

document.querySelectorAll('.social-btn').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'scale(0.7)';
  el.style.transition = 'opacity 0.4s, transform 0.4s';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  }, 1100 + i * 100);
});
