const navegacao = document.getElementById('navegacao');
const menuBotao = document.getElementById('menuBotao');
const menuLinks = document.getElementById('menuLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navegacao.classList.add('rolada');
  } else {
    navegacao.classList.remove('rolada');
  }
});

menuBotao.addEventListener('click', () => {
  menuBotao.classList.toggle('aberto');
  menuLinks.classList.toggle('aberto');
});

menuLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBotao.classList.remove('aberto');
    menuLinks.classList.remove('aberto');
  });
});

const elementosRevela = document.querySelectorAll('.revela');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

elementosRevela.forEach(el => observador.observe(el));
