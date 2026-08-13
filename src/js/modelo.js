const id = new URLSearchParams(location.search).get('tipo');
const modelo = MODELOS.find(item => item.id === id) || MODELOS[0];
const categoria = CATEGORIAS[modelo.categoria];
const total = MODELOS.filter(item => item.categoria === modelo.categoria).length;

document.title = `${modelo.nome} XXX — Demonstração`;
document.body.className = `tema-${modelo.estilo} familia-${modelo.posicao % 6}`;
document.documentElement.style.setProperty('--cor', modelo.cor);
document.documentElement.style.setProperty('--fundo', modelo.fundo);
document.documentElement.style.setProperty('--colunas', total);
document.documentElement.style.setProperty('--indice', modelo.posicao);
document.documentElement.style.setProperty('--posicao', `${modelo.posicao / (total - 1) * 100}%`);
document.querySelector('.sobretitulo').textContent = `${categoria.nome} • ${modelo.nome}`;
document.querySelector('h1').textContent = modelo.titulo;
document.querySelector('.hero-descricao').textContent = modelo.descricao;
document.querySelectorAll('.marca-simbolo').forEach(el => el.textContent = modelo.simbolo);
document.querySelectorAll('.marca-texto').forEach(el => el.textContent = `${modelo.nome} XXX`);
const imagem = document.querySelector('.hero-imagem img');
imagem.src = `../public/assets/images/samples/categories/${categoria.imagem}`;
imagem.alt = `${modelo.nome} em ambiente demonstrativo`;
document.querySelector('.numero').textContent = String(modelo.posicao + 1).padStart(2, '0');
document.querySelector('.sobre-marca').textContent = modelo.simbolo;

document.querySelector('.servicos-grade').innerHTML = modelo.servicos.map((servico, indice) => `
  <article><span>0${indice + 1}</span><h3>${servico}</h3><p>Atendimento estruturado para oferecer clareza, praticidade e uma boa experiência.</p><a href="#contato">Saiba mais</a></article>
`).join('');

const menu = document.querySelector('.menu');
const nav = document.querySelector('.site-header nav');
menu.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  menu.setAttribute('aria-expanded', String(aberto));
  menu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('aberto');
  menu.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { nav.classList.remove('aberto'); menu.setAttribute('aria-expanded', 'false'); }
});
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.querySelector('output').textContent = 'Demonstração: formulário pronto para integração.';
});
