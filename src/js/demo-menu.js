const botaoMenu = document.querySelector('.menu');
const navegacaoDemo = document.querySelector('nav');

if (botaoMenu && navegacaoDemo) {
  botaoMenu.addEventListener('click', () => {
    const aberto = navegacaoDemo.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', aberto);
  });

  navegacaoDemo.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navegacaoDemo.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }));
}
