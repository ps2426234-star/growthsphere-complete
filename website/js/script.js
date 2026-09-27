document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- scroll reveal for sections ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- portfolio filter ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.p-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat.includes(f);
      c.style.display = show ? '' : 'none';
    });
  });
});

/* ---------- contact form ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input, select, textarea');
  const vals = Array.from(inputs)
    .map(i => `${i.previousElementSibling ? i.previousElementSibling.textContent : ''}: ${i.value}`)
    .join('%0D%0A');
  window.location.href = `mailto:armishrehan9@gmail.com?subject=New%20Project%20Inquiry&body=${vals}`;
  return false;
}

/* ---------- growth chart animation ---------- */
// Plays once the chart panel scrolls into view: the line draws upward
// (up / down / up / up pattern trending up), data points pop in as it
// passes them, the end point glows, and the metric numbers count up.
const chartPanel = document.getElementById('chartPanel');
const growthPath = document.getElementById('growthPath');
const growthFill = document.getElementById('growthFill');
const chartEndDot = document.getElementById('chartEndDot');
const chartNodes = document.querySelectorAll('.chart-node');
const counters = document.querySelectorAll('.counter');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function resetChart() {
  growthPath.classList.remove('animate');
  growthFill.classList.remove('animate');
  chartEndDot.classList.remove('animate');
  chartNodes.forEach(node => node.classList.remove('animate'));
  counters.forEach(c => (c.textContent = '0'));
  // force reflow so the dash-offset animation can restart from the beginning
  void growthPath.offsetWidth;
}

function playChartAnimation() {
  growthPath.classList.add('animate');
  growthFill.classList.add('animate');
  chartNodes.forEach(node => {
    setTimeout(() => node.classList.add('animate'), parseInt(node.dataset.delay, 10));
  });
  setTimeout(() => chartEndDot.classList.add('animate'), 2750);
  counters.forEach(c => setTimeout(() => animateCounter(c), 300));
}

// auto-play once, the first time the chart scrolls into view
if (chartPanel) {
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playChartAnimation();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  chartObserver.observe(chartPanel);
}

/* ---------- personalized "type your brand, watch it grow" ---------- */
const brandInput = document.getElementById('brandNameInput');
const growBtn = document.getElementById('growBtn');
const chartTitle = document.getElementById('chartTitle');

function runBrandGrowth() {
  const name = (brandInput.value || '').trim();
  chartTitle.textContent = name ? `${name}'s Growth Overview` : 'Client Growth Overview';

  growBtn.disabled = true;
  growBtn.textContent = 'Growing…';

  resetChart();
  // tiny delay so the reset is visible before it redraws
  requestAnimationFrame(() => {
    setTimeout(() => {
      playChartAnimation();
      setTimeout(() => {
        growBtn.disabled = false;
        growBtn.textContent = 'Show My Growth →';
      }, 3000);
    }, 80);
  });
}

if (growBtn) {
  growBtn.addEventListener('click', runBrandGrowth);
  brandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runBrandGrowth();
    }
  });
}
