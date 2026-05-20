/**
 * EDSIM.ORG — Simulation Core
 * Tab navigation logic shared by all sims.
 */

function initTabs(containerId) {
  const container = document.getElementById(containerId) || document;
  const tabs    = container.querySelectorAll('.tab-btn');
  const panels  = container.querySelectorAll('.tab-panel');
  const prevBtn = container.querySelector('#btn-prev');
  const nextBtn = container.querySelector('#btn-next');

  let current = 0;

  function goTo(index) {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tabs[index].classList.add('active');
    panels[index].classList.add('active');
    current = index;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === tabs.length - 1;
    window.scrollTo(0, 0);
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (current < tabs.length - 1) goTo(current + 1); });

  goTo(0);
}
