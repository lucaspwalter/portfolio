const botaoMenu = document.querySelector('.menu');
const navegacaoDemo = document.querySelector('nav');

if (botaoMenu && navegacaoDemo) {
  botaoMenu.addEventListener('click', () => {
    const aberto = navegacaoDemo.classList.toggle('aberto');
    botaoMenu.classList.toggle('aberto', aberto);
    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  navegacaoDemo.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navegacaoDemo.classList.remove('aberto');
    botaoMenu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
  }));
}
