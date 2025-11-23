// 初始化所有对比块：根据滑块数值调整右图遮罩宽度
(function(){
  function initComparisons(){
    document.querySelectorAll('.compare').forEach(block=>{
      const slider = block.querySelector('.slider');
      const reveal = block.querySelector('.reveal');
      const set = v => { if (reveal) reveal.style.width = Math.max(0, Math.min(100, v)) + '%'; };
      if (slider) {
        set(slider.value || 50);
        slider.addEventListener('input', e => set(e.target.value));
        slider.addEventListener('change', e => set(e.target.value));
      }
    });

    // 记录加载失败的图片，便于排查路径问题
    document.querySelectorAll('.compare img').forEach(img=>{
      img.addEventListener('error', ()=>{
        const b = img.closest('.compare');
        if (b) b.classList.add('compare--error');
        console.error('[IMG FAIL]', img.currentSrc || img.src);
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initComparisons);
})();
