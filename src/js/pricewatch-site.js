const radar = document.querySelector('.radar');
radar.addEventListener('pointermove', (event) => { const box = radar.getBoundingClientRect(); radar.style.transform = `perspective(800px) rotateX(${((event.clientY-box.top)/box.height-.5)*-8}deg) rotateY(${((event.clientX-box.left)/box.width-.5)*8}deg)`; });
radar.addEventListener('pointerleave', () => { radar.style.transform = ''; });
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); document.querySelectorAll('.product').forEach((card) => { card.hidden = button.dataset.filter !== 'all' && card.dataset.filter !== card.dataset.state; }); }));
const toast = document.getElementById('priceToast');
document.querySelectorAll('.product-action').forEach((button) => button.addEventListener('click', () => { toast.textContent = `${button.dataset.target}: histórico de 30 dias carregado. Última leitura há 4 min.`; toast.classList.add('is-visible'); setTimeout(() => toast.classList.remove('is-visible'), 3200); }));
