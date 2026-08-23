const query = document.getElementById('query');
const log = document.getElementById('terminalLog');
const jobs = [...document.querySelectorAll('.job')];
document.getElementById('searchBtn').addEventListener('click', () => { log.innerHTML = `> buscando “${query.value}” em 4 fontes...<span>_</span>`; setTimeout(() => { log.innerHTML = '> 37 resultados normalizados em 1.8s<span>_</span>'; }, 900); });
document.getElementById('runScan').addEventListener('click', (event) => { event.currentTarget.textContent = '✓ busca executada'; log.innerHTML = '> crawler iniciado / fontes: 04 / status: concluído<span>_</span>'; });
document.querySelectorAll('.sort').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.sort').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); const key = button.dataset.sort === 'match' ? 'match' : 'recent'; jobs.sort((a,b) => Number(b.dataset[key]) - Number(a.dataset[key])).forEach((job) => document.getElementById('jobList').append(job)); }));
document.querySelectorAll('.save').forEach((button) => button.addEventListener('click', () => { button.classList.toggle('is-saved'); button.textContent = button.classList.contains('is-saved') ? '★' : '☆'; }));
