(function(){
  // Compare sliders
  document.querySelectorAll('.compare').forEach(block=>{
    const slider = block.querySelector('.slider');
    const right  = block.querySelector('.img-right');
    const set = v => right && (right.style.clipPath =
      `polygon(${v}% 0, 100% 0, 100% 100%, ${v}% 100%)`);
    if (slider && right){
      set(slider.value || 50);
      slider.addEventListener('input', e => set(e.target.value));
    }
  });

  // Feedback: store locally & export
  const KEY = 'yc-feedback-v1';
  const form = document.querySelector('.feedback');
  const exportBtn = document.getElementById('exportJson');

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } };
  const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  if (form){
    form.addEventListener('submit', ()=>{
      const comment = form.querySelector('textarea').value.trim();
      const name    = form.querySelector('input[type="text"]').value.trim();
      const email   = form.querySelector('input[type="email"]').value.trim();
      if (!comment){ alert('Please write a short comment.'); return; }
      const arr = load();
      arr.push({ comment, name, email, ts:new Date().toISOString() });
      save(arr);
      form.reset();
      alert('Saved locally.');
    });
  }

  if (exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const data = load();
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const url  = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'feedback.json'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Debug: log failing images
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=>console.error('[IMG FAIL]', img.currentSrc || img.src));
  });
})();
