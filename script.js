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

(function () {
  function initComparisons() {
    document.querySelectorAll('.compare').forEach(block => {
      const slider = block.querySelector('.slider');

      // 如果右图还没被包进 .reveal（手动写了就会跳过）
      const rightImg = block.querySelector('.img-right');
      if (rightImg && !rightImg.parentElement.classList.contains('reveal')) {
        const wrap = document.createElement('div');
        wrap.className = 'reveal';
        rightImg.parentNode.insertBefore(wrap, rightImg);
        wrap.appendChild(rightImg);
      }

      const reveal = block.querySelector('.reveal');
      const setWidth = (v) => reveal && (reveal.style.width = Math.max(0, Math.min(100, v)) + '%');

      if (slider && reveal) {
        setWidth(slider.value || 50);
        slider.addEventListener('input', e => setWidth(e.target.value));
        slider.addEventListener('change', e => setWidth(e.target.value));
        // 兼容移动端
        slider.addEventListener('touchstart', e => e.stopPropagation(), {passive:true});
      }

      // 调试：如有图片没加载，会打标（可删）
      block.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => block.classList.add('compare--error'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initComparisons);
  window.addEventListener('load', initComparisons);
})();

(function(){
  function tryLoad(img, srcList){
    return new Promise(resolve=>{
      const list = Array.isArray(srcList) ? srcList : String(srcList).split(',');
      let idx = 0;
      function next(){
        if(idx >= list.length){ img.dataset.fail = '1'; resolve(false); return; }
        const url = list[idx++].trim();
        img.onload = ()=>resolve(true);
        img.onerror = next;
        img.src = url + (url.includes('?') ? '' : `?v=${Date.now()}`); // 破缓存
      }
      next();
    });
  }

  function initOne(block){
    // 清空旧内容（防止之前结构残留）
    block.innerHTML = '';

    // 读取 data-*
    const leftSrcs  = block.dataset.left  || '';
    const rightSrcs = block.dataset.right || '';
    const leftLab   = block.dataset.leftLabel  || 'Left';
    const rightLab  = block.dataset.rightLabel || 'Right';

    // 创建 DOM
    const base = document.createElement('img');   base.className = 'base';
    const reveal = document.createElement('div'); reveal.className = 'reveal';
    const topImg = document.createElement('img'); topImg.className = 'top';
    reveal.appendChild(topImg);

    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 50;
    slider.className = 'slider';

    const labels = document.createElement('div'); labels.className = 'labels';
    labels.innerHTML = `<span class="label left">${leftLab}</span><span class="label right">${rightLab}</span>`;

    block.append(base, reveal, slider, labels);

    // 按顺序加载：左=Midjourney，右=Wenxin
    Promise.all([ tryLoad(base, leftSrcs), tryLoad(topImg, rightSrcs) ]).then(([okL, okR])=>{
      if(!okL || !okR) block.classList.add('compare--error');
    });

    // 初始 50%
    setReveal(slider.value);

    // 支持整块拖动（鼠标/触摸）
    function setReveal(v){
      reveal.style.width = Math.max(0, Math.min(100, +v)) + '%';
    }
    function pctFromEvent(e){
      const r = block.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return (x / r.width) * 100;
    }
    const onDrag = (e)=>{ setReveal(pctFromEvent(e)); };
    slider.addEventListener('input', e=> setReveal(e.target.value));
    block.addEventListener('pointerdown', e=>{
      block.setPointerCapture(e.pointerId);
      setReveal(pctFromEvent(e));
    });
    block.addEventListener('pointermove', e=>{
      if(e.buttons) setReveal(pctFromEvent(e));
    });
    // 兼容触摸
    block.addEventListener('touchstart', onDrag, {passive:true});
    block.addEventListener('touchmove',  onDrag, {passive:true});
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.compare').forEach(initOne);
  });
})();

// 简单可靠：滑块值 = 右图遮罩宽度（%）
// 额外支持点击/拖拽整个容器来滑动
(function(){
  function setWidth(el, v){
    const reveal = el.querySelector('.reveal');
    if(reveal) reveal.style.width = Math.max(0, Math.min(100, +v)) + '%';
  }
  function pctFromEvent(el, e){
    const r = el.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return (x / r.width) * 100;
  }
  document.querySelectorAll('.compare').forEach(el=>{
    const slider = el.querySelector('.slider');
    if(!slider) return;
    // 初始
    setWidth(el, slider.value || 50);

    // 改变滑块
    slider.addEventListener('input', e=> setWidth(el, e.target.value));

    // 容器拖动：鼠标 & 触摸
    const drag = (e)=> setWidth(el, pctFromEvent(el, e));
    el.addEventListener('pointerdown', e=>{
      el.setPointerCapture(e.pointerId);
      drag(e);
    });
    el.addEventListener('pointermove', e=>{ if(e.buttons) drag(e); });
    el.addEventListener('touchstart', drag, {passive:true});
    el.addEventListener('touchmove',  drag, {passive:true});
  });
})();
