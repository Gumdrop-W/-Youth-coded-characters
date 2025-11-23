// script.js  (版本号记得在 HTML 里改成 ?v=16 以强制刷新缓存)
(function(){
  function initComparisons(root = document){
    root.querySelectorAll('.compare').forEach(c => {
      const right = c.querySelector('.img-right');
      if (right && !right.parentElement.classList.contains('reveal')) {
        // 创建遮罩并把右图塞进去
        const wrap = document.createElement('div');
        wrap.className = 'reveal';
        right.replaceWith(wrap);
        wrap.appendChild(right);
      }
      const slider = c.querySelector('.slider');
      const reveal = c.querySelector('.reveal');

      // 安全兜底：如果没有找到任何元素，跳过
      if (!slider || !reveal) return;

      // 初始位置
      const set = v => (reveal.style.width = Math.max(0, Math.min(100, +v || 50)) + '%');
      set(slider.value || 50);

      // 监听拖动
      slider.addEventListener('input', e => set(e.target.value));
      slider.addEventListener('change', e => set(e.target.value));

      // 确保滑块在顶层并可交互
      slider.style.pointerEvents = 'auto';
      slider.style.zIndex = 20;
    });

    // 调试：任何图片加载失败时给容器打标
    root.querySelectorAll('.compare img').forEach(img=>{
      img.addEventListener('error', ()=>{
        const b = img.closest('.compare');
        if (b) b.classList.add('compare--error');
        console.error('[IMG FAIL]', img.currentSrc || img.src);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => initComparisons());
  window.addEventListener('load', () => initComparisons());
})();
