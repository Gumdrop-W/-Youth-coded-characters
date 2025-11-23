// Image compare slider
document.querySelectorAll('.compare').forEach((cmp)=>{
  const right = cmp.querySelector('.img-right');
  const slider = cmp.querySelector('.slider');
  const update = (val)=>{
    const p = Math.min(100, Math.max(0, val));
    right.style.clipPath = `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
  };
  update(slider.value);
  slider.addEventListener('input', (e)=> update(e.target.value));
});

// Feedback: store to localStorage, export JSON
const form = document.querySelector('.feedback');
if (form){
  form.addEventListener('submit', ()=>{
    const comment = form.querySelector('textarea').value.trim();
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const now = new Date().toISOString();
    const rec = {now, name, email, comment};
    const key = 'yc_feedback';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(rec);
    localStorage.setItem(key, JSON.stringify(arr));
    form.querySelector('textarea').value = '';
    alert('Saved locally in your browser ✅');
  });
}

const exportBtn = document.getElementById('exportJson');
if (exportBtn){
  exportBtn.addEventListener('click', ()=>{
    const key = 'yc_feedback';
    const data = localStorage.getItem(key) || '[]';
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'feedback.json';
    document.body.appendChild(a);
    a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
}
