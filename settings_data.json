
/* Galerie */
document.querySelectorAll('.thumb').forEach(th => {
  th.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    th.classList.add('active');
    document.getElementById('mainImg').src = th.dataset.src;
  });
});

/* Tabs */
const prices = {
  jacket: ['129.90 CHF', 'Storm Jacket'],
  jogger: ['84.90 CHF',  'Storm Jogger'],
  set:    ['199.90 CHF', 'Set Complet']
};
function switchTab(el, key) {
  document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('priceMain').textContent = prices[key][0];
  document.getElementById('priceLabel').textContent = prices[key][1];
}

/* Taille */
function pick(btn) {
  if (btn.classList.contains('sold')) return;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sizeVal').textContent = btn.textContent;
}

/* Cart */
function cart() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
function cartAndRedirect(url) {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    window.location.href = url;
  }, 1200);
}



/* ════ SIZE QUIZ ════ */
const sizeOrder = ['XS','S','M','L','XL'];
let quizAnswers = [];
let finalSize = 'M';

function openSizeQuiz() {
  resetQuiz();
  document.getElementById('quizOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeQuizOutside(e) {
  if (e.target === document.getElementById('quizOverlay')) closeQuiz();
}

function answer(step, sizeHint, label) {
  // Highlight selected
  const opts = document.querySelectorAll('#step' + step + ' .quiz-opt');
  opts.forEach(o => o.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  quizAnswers[step - 1] = sizeHint;

  setTimeout(() => {
    if (step < 3) {
      goStep(step + 1);
    } else {
      computeResult();
      goStep('Result');
    }
  }, 300);
}

function goStep(n) {
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n).classList.add('active');
  // Progress
  ['ps1','ps2','ps3'].forEach((id, i) => {
    const el = document.getElementById(id);
    const stepN = typeof n === 'number' ? n : 4;
    el.className = 'quiz-progress-step' + (i + 1 < stepN ? ' done' : i + 1 === stepN ? ' active' : '');
  });
  if (n === 'Result') {
    document.getElementById('ps1').className = 'quiz-progress-step done';
    document.getElementById('ps2').className = 'quiz-progress-step done';
    document.getElementById('ps3').className = 'quiz-progress-step done';
  }
}

function computeResult() {
  // Score each size
  const scores = {XS:0, S:0, M:0, L:0, XL:0};
  // Q1 height, Q2 weight → direct size vote
  [quizAnswers[0], quizAnswers[1]].forEach(a => {
    if (sizeOrder.includes(a)) scores[a] += 2;
  });
  // Q3 fit preference
  const fit = quizAnswers[2];
  const baseIdx = sizeOrder.indexOf(Object.keys(scores).reduce((a,b) => scores[a]>=scores[b]?a:b));
  let resultIdx = baseIdx;
  if (fit === 'down') resultIdx = Math.max(0, baseIdx - 1);
  if (fit === 'up')   resultIdx = Math.min(4, baseIdx + 1);
  finalSize = sizeOrder[resultIdx];

  document.getElementById('resultSize').textContent = finalSize;

  const fitLabels = {
    down: 'un fit fitted, proche du corps',
    same: 'un fit regular',
    up:   'un fit oversized, comme porté sur la marque'
  };
  document.getElementById('resultDesc').textContent =
    `Basé sur tes réponses, la taille ${finalSize} est idéale pour ${fitLabels[fit] || 'ton morphotype'}.`;

  // Highlight correct row in table
  document.querySelectorAll('#sizeTableBody tr').forEach(tr => {
    tr.className = tr.cells[0].textContent.trim() === finalSize ? 'highlight' : '';
  });
}

function applySize() {
  document.querySelectorAll('.size-btn').forEach(b => {
    b.classList.remove('active');
    if (b.textContent.trim() === finalSize) b.classList.add('active');
  });
  document.getElementById('sizeVal').textContent = finalSize;
}

function resetQuiz() {
  quizAnswers = [];
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
  goStep(1);
}

