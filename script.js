<script>
(function(){
  function pctFromEvent(e, el){
    const r = el.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const clamped = Math.max(0, Math.min(r.width, x));
    return Math.round((clamped / r.width) * 100);
  }

  function init(){
    document.querySelectorAll('.compare').forEach(c=>{
      // 1) 右图塞进遮罩 .reveal（只做一次）
      let right = c.querySelector('.img-right');
      if (right && !right.parentElement.classList.contains('reveal')) {
        const wrap = document.createElement('div');
        wrap.className = 'reveal';
        right.replaceWith(wrap);
        wrap.appendChild(right);
      }
      const reveal = c.querySelector('.reveal');
      const slider = c.querySelector('.slider');
      if (!reveal) return;

      // 2) 初始 50%，或用 slider 当前值
      const set = v => {
        v = Math.max(0, Math.min(100, +v || 50));
        reveal.style.width = v + '%';
        if (slider) slider.value = v;
      };
      set(slider && slider.value ? slider.value : 50);

      // 3) 给容器本身加拖拽（鼠标+触摸），不用依赖 range
      let drag = false;
      const start = e => { drag = true; set(pctFromEvent(e, c)); e.preventDefault(); };
      const move  = e => { if (!drag) return; set(pctFromEvent(e, c)); e.preventDefault(); };
      const end   = () => { drag = false; };

      c.addEventListener('mousedown', start);
      c.addEventListener('touchstart', start, {passive:false});
      window.addEventListener('mousemove', move, {passive:false});
      window.addEventListener('touchmove', move, {passive:false});
      window.addEventListener('mouseup', end);
      window.addEventListener('touchend', end);

      // 4) 仍然兼容原来的 slider（如果你想拖那条细线也可以）
      if (slider){
        slider.addEventListener('input', e => set(e.target.value));
        slider.style.pointerEvents = 'auto';
        slider.style.zIndex = 20;
      }

      // 5) 调试：有图没加载时在右上角提示
      c.querySelectorAll('img').forEach(img=>{
        img.addEventListener('error', ()=>{
          c.classList.add('compare--error'); // 右上角会显示 "image missing"
          console.error('[IMG FAIL]', img.currentSrc || img.src);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
})();
</script>
