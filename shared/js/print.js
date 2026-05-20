/**
 * EDSIM.ORG — Print / Save as PDF
 * Opens a section-select modal before printing.
 */

function initPrint(sections) {
  // sections: [{ id: 'tab-1', label: 'Directions' }, ...]
  const btn = document.getElementById('btn-save-pdf');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">
        <div style="background:white;padding:32px;border-radius:12px;max-width:420px;width:90%;">
          <h2 style="margin-bottom:16px;font-size:1.2rem;">Choose sections to include</h2>
          ${sections.map(s => `
            <label style="display:flex;align-items:center;gap:10px;margin-bottom:12px;cursor:pointer;">
              <input type="checkbox" value="${s.id}" checked style="width:18px;height:18px;" />
              ${s.label}
            </label>`).join('')}
          <div style="display:flex;gap:12px;margin-top:24px;">
            <button id="print-confirm" style="flex:1;padding:12px;background:#1a6b4a;color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;">Save PDF</button>
            <button id="print-cancel" style="flex:1;padding:12px;background:#eee;border:none;border-radius:6px;cursor:pointer;font-size:1rem;">Cancel</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelector('#print-cancel').onclick = () => modal.remove();
    modal.querySelector('#print-confirm').onclick = () => {
      const checked = new Set([...modal.querySelectorAll('input:checked')].map(i => i.value));
      sections.forEach(s => {
        const panel = document.getElementById(s.id);
        if (panel) panel.style.display = checked.has(s.id) ? '' : 'none';
      });
      modal.remove();
      window.print();
      sections.forEach(s => {
        const panel = document.getElementById(s.id);
        if (panel) panel.style.display = '';
      });
    };
  });
}
