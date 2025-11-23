// ===== Minimal compare slider =====
function initCompare(block){
  const left  = block.querySelector('.img-left');
  let   right = block.querySelector('.img-right');

  if (!left || !right) return;

  // 把右图包进 .reveal 遮罩
  if (!right.parentElement.classList.contains('reveal')) {
    const wrap = document.createElement('div');
    wrap.className = 'reveal';
    right.replaceWith(wrap);
    wrap.appendChild(right);
  }

  const reveal = block.querySelector('.reveal');
  const slider = block.querySelector('.slider');
  const set = v => { if (reveal) reveal.style.width = Math.max(0, Math.min(100, +v)) + '%'; };

  // 初始
  set(slider ? slider.value : 50);

  if (slider) {
    slider.addEventListener('input', e => set(e.target.value), {passive:true});
    slider.addEventListener('change', e => set(e.target.value), {passive:true});
    // 点击轨道直达位置
    slider.addEventListener('pointerdown', e => {
      const r = slider.getBoundingClientRect();
      const v = ((e.clientX - r.left) / r.width) * 100;
      slider.value = v; set(v);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.compare').forEach(initCompare);

  // ===== Feedback: local save + export =====
  const form = document.getElementById('feedbackForm');
  if (form) {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const list = JSON.parse(localStorage.getItem('feedback') || '[]');
      list.push({ ...data, ts: new Date().toISOString() });
      localStorage.setItem('feedback', JSON.stringify(list));
      alert('Saved locally!');
      form.reset();
    });
  }

  const exportBtn = document.getElementById('exportJson');
  if (exportBtn) {
    exportBtn.addEventListener('click', ()=>{
      const text = localStorage.getItem('feedback') || '[]';
      const blob = new Blob([text], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'feedback.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
});
