const score = document.getElementById('overallScore');
const chartTotal = document.getElementById('chartTotal');
const chart = document.getElementById('riskChart');
const people = [...document.querySelectorAll('.person')];
const detail = document.getElementById('personDetail');

document.querySelectorAll('[data-range]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-range]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const range = button.dataset.range;
  score.textContent = range === '365' ? '61' : range === '90' ? '65' : '68';
  chartTotal.textContent = range === '365' ? '9 ALTO RISCO' : range === '90' ? '10 ALTO RISCO' : '12 ALTO RISCO';
  chart.classList.remove('chart--pulse');
  void chart.offsetWidth;
  chart.classList.add('chart--pulse');
}));

document.querySelectorAll('[data-dept]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-dept]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  people.forEach((person) => { person.hidden = button.dataset.dept !== 'todos' && person.dataset.dept !== button.dataset.dept; });
}));

people.forEach((person) => person.addEventListener('click', () => {
  people.forEach((item) => item.classList.remove('is-selected'));
  person.classList.add('is-selected');
  detail.textContent = `${person.querySelector('strong').firstChild.textContent.trim()}: seis sinais combinados. Score ${person.querySelector('i').textContent}/100. Abra o dashboard para investigar o contexto.`;
}));
