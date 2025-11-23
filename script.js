(function(){
  // ——初始化对比滑块（用遮罩容器控制右图宽度）——
  document.querySelectorAll('.compare').forEach(block=>{
    const rightImg = block.querySelector('.img-right');
    if (rightImg) {
      // 创建遮罩容器并把右图塞进去
      const wrap = document.createElement('div');
      wrap.className = 'reveal';
      rightImg.parentNode.insertBefore(wrap, rightImg);
      wrap.appendChild(rightImg);
    }

    const slider = block.querySelector('.slider');
    const reveal = block.querySelector('.reveal');
    const set = v => { if (reveal) reveal.style.width = v + '%'; };

    if (slider) {
      set(slider.value || 50);
      slider.addEventListener('input', e => set(e.target.value));
    }
  });

  // ——反馈表单（保持不变/按你现有的即可）——
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

  // ——日志：任何图片加载失败都打印出来，方便你定位文件名/后缀问题——
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=>console.error('[IMG FAIL]', img.currentSrc || img.src));
  });
})();
