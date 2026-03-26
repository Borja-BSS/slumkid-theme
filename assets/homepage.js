
/* Feed scroll */
const feed = document.getElementById('footFeed');
// feed: swipe only on mobile, no arrows


/* ── NAV scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HERO ── */
const DURATION = 5500;
const hSlides = document.querySelectorAll('.hero-slide');
const hDots   = document.querySelectorAll('.hero-dot');
const hTrack  = document.getElementById('heroTrack');
const hProg   = document.getElementById('heroProgress');
let hCur=0, hTimer, hStart, hRaf;

function hGo(n) {
  hSlides[hCur].classList.remove('active'); hDots[hCur].classList.remove('active');
  hCur = ((n % hSlides.length) + hSlides.length) % hSlides.length;
  hSlides[hCur].classList.add('active'); hDots[hCur].classList.add('active');
  hTrack.style.transform = `translateX(-${hCur * 33.333}%)`;
}
function hProgress() {
  cancelAnimationFrame(hRaf); hProg.style.transition = 'none'; hProg.style.width = '0%';
  hStart = performance.now();
  (function tick(now) {
    const p = Math.min((now - hStart) / DURATION * 100, 100);
    hProg.style.width = p + '%';
    if (p < 100) hRaf = requestAnimationFrame(tick);
  })(hStart);
}
function hAuto() { clearInterval(hTimer); hProgress(); hTimer = setInterval(() => { hGo(hCur+1); hProgress(); }, DURATION); }

document.getElementById('hPrev').onclick = () => { clearInterval(hTimer); hGo(hCur-1); hAuto(); };
document.getElementById('hNext').onclick = () => { clearInterval(hTimer); hGo(hCur+1); hAuto(); };
hDots.forEach(d => d.addEventListener('click', () => { clearInterval(hTimer); hGo(+d.dataset.i); hAuto(); }));
let htx=0;
document.querySelector('.hero').addEventListener('touchstart', e => htx = e.touches[0].clientX, {passive:true});
document.querySelector('.hero').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - htx;
  if (Math.abs(dx) > 50) { clearInterval(hTimer); hGo(dx < 0 ? hCur+1 : hCur-1); hAuto(); }
});
hAuto();

/* ── CAROUSEL INFINI ── */
(function() {
  const scene   = document.getElementById('carouselScene');
  const inner   = document.getElementById('carouselInner');
  const origCards = Array.from(document.querySelectorAll('.p-card'));
  const ptotal  = origCards.length;
  const pDots   = document.getElementById('cDots');

  // Cloner avant + après pour effet infini (3 clones de chaque côté)
  const CLONE = 3;
  for (let i = 0; i < CLONE; i++) {
    origCards.forEach(c => {
      const cl = c.cloneNode(true);
      cl.setAttribute('data-clone','1');
      inner.appendChild(cl);
    });
  }
  for (let i = 0; i < CLONE; i++) {
    [...origCards].reverse().forEach(c => {
      const cl = c.cloneNode(true);
      cl.setAttribute('data-clone','1');
      inner.prepend(cl);
    });
  }

  const allCards = Array.from(inner.querySelectorAll('.p-card'));
  const total    = allCards.length;
  // Index réel de départ = après les clones de gauche
  let pActive = CLONE * ptotal;

  // Dots (sur les originaux seulement)
  origCards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'c-dot' + (i===0?' active':'');
    d.addEventListener('click', () => pGo(CLONE * ptotal + i));
    pDots.appendChild(d);
  });

  function updateDots() {
    const origIdx = ((pActive - CLONE * ptotal) % ptotal + ptotal) % ptotal;
    document.querySelectorAll('.c-dot').forEach((d,i) => d.classList.toggle('active', i===origIdx));
  }

  function applyClasses() {
    const L  = (pActive - 1 + total) % total;
    const R  = (pActive + 1) % total;
    const FL = (pActive - 2 + total) % total;
    const FR = (pActive + 2) % total;
    allCards.forEach((c, i) => {
      c.className = 'p-card';
      // Preserve data-ci
      if (origCards[i]) c.setAttribute('data-ci', origCards[i].getAttribute('data-ci'));
      if      (i === pActive) c.classList.add('pos-center');
      else if (i === L)       c.classList.add('pos-left');
      else if (i === R)       c.classList.add('pos-right');
      else if (i === FL)      c.classList.add('pos-far-left');
      else if (i === FR)      c.classList.add('pos-far-right');
      else                    c.classList.add('pos-hidden');
    });
  }

  function slide(animated) {
    inner.style.transition = animated ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none';
    const offset = pActive * 33.333 - 33.333;
    inner.style.transform = `translateX(-${offset}%)`;
  }

  function pGo(idx, animated = true) {
    pActive = idx;
    applyClasses();
    slide(animated);
    updateDots();

    // Saut silencieux si on dépasse les bornes
    inner.addEventListener('transitionend', function onEnd() {
      inner.removeEventListener('transitionend', onEnd);
      if (pActive < CLONE * ptotal) {
        pActive += ptotal;
        slide(false);
        applyClasses();
      } else if (pActive >= (CLONE + 1) * ptotal) {
        pActive -= ptotal;
        slide(false);
        applyClasses();
      }
    });
  }

  document.getElementById('cPrev').onclick = () => pGo(pActive - 1);
  document.getElementById('cNext').onclick = () => pGo(pActive + 1);

  let ctx = 0;
  scene.addEventListener('touchstart', e => ctx = e.touches[0].clientX, {passive:true});
  scene.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - ctx;
    if (Math.abs(dx) > 45) pGo(dx < 0 ? pActive + 1 : pActive - 1);
  });

  // Auto-rotate toutes les 3.5s
  let autoTimer = setInterval(() => pGo(pActive + 1), 3500);
  scene.addEventListener('touchstart', () => clearInterval(autoTimer), {passive:true});

  // Init sans animation
  pGo(pActive, false);
})();



/* ── TYPEWRITER SLOGANS ── */
(function(){
  const slogans = [
    'BUILT FROM THE SLUM',
    'WEAR WHAT YOU ARE',
    'BE PART OF IT',
    'NEW DROP — SEASON 26',
    'SLUM LIFE',
    'STREET NEVER SLEEPS',
  ];
  const el = document.getElementById('sloganText');
  let si = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE = 2200;
  function tick(){
    const word = slogans[si];
    if(!deleting){
      ci++;
      el.innerHTML = word.slice(0,ci) + '<span class="slogan-cursor"></span>';
      if(ci === word.length){ deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      ci--;
      el.innerHTML = word.slice(0,ci) + '<span class="slogan-cursor"></span>';
      if(ci === 0){ deleting = false; si = (si+1) % slogans.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 600);
})();
