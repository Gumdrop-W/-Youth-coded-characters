document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.compare').forEach(c => {
    const slider = c.querySelector('.slider');
    const reveal = c.querySelector('.reveal');
    if (!slider || !reveal) return;
    const set = v => reveal.style.width = Math.max(0, Math.min(100, v)) + '%';
    set(slider.value || 50);
    slider.addEventListener('input', e => set(e.target.value));
    slider.addEventListener('change', e => set(e.target.value));
  });
});
