const score = document.getElementById('overallScore');
const chartTotal = document.getElementById('chartTotal');
const chart = document.getElementById('riskChart');
const people = [...document.querySelectorAll('.person')];
const detail = document.getElementById('personDetail');
const rangeBars = {
  '30': [[78,48,25],[52,68,31],[66,42,54],[34,60,72],[23,35,84]],
  '90': [[64,56,34],[61,74,42],[58,48,62],[43,66,58],[31,44,78]],
  '365': [[48,39,31],[44,55,38],[51,36,47],[29,49,61],[20,31,70]]
};
const paintBars = (range) => {
  chart.replaceChildren();
  rangeBars[range].flatMap((group) => group).forEach((value, index) => {
    const bar = document.createElement('i');
    bar.className = ['bar-high', 'bar-medium', 'bar-low'][index % 3];
    bar.style.setProperty('--bar', `${value}%`);
    chart.append(bar);
  });
  ['Engenharia', 'Produto', 'Operações', 'Logística', 'Comercial'].forEach((name) => {
    const label = document.createElement('span');
    label.className = 'dept-label';
    label.textContent = name;
    chart.append(label);
  });
};
paintBars('30');

document.querySelectorAll('[data-range]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-range]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const range = button.dataset.range;
  paintBars(range);
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
