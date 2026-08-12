const navegacao = document.getElementById('navegacao');
const menuBotao = document.getElementById('menuBotao');
const menuLinks = document.getElementById('menuLinks');

const aceitaCursorAnimado = window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (aceitaCursorAnimado) {
  const brilho = document.createElement('div');
  brilho.className = 'cursor-brilho';
  document.body.appendChild(brilho);

  let alvoX = window.innerWidth / 2;
  let alvoY = window.innerHeight / 2;
  let atualX = alvoX;
  let atualY = alvoY;

  window.addEventListener('pointermove', evento => {
    alvoX = evento.clientX;
    alvoY = evento.clientY;
    brilho.classList.add('cursor-brilho--visivel');
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    brilho.classList.remove('cursor-brilho--visivel');
  });

  const acompanharCursor = () => {
    atualX += (alvoX - atualX) * 0.14;
    atualY += (alvoY - atualY) * 0.14;
    brilho.style.transform = `translate3d(${atualX}px, ${atualY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(acompanharCursor);
  };

  acompanharCursor();
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navegacao.classList.add('rolada');
  } else {
    navegacao.classList.remove('rolada');
  }
});

menuBotao.addEventListener('click', () => {
  const estaAberto = menuLinks.classList.toggle('aberto');
  menuBotao.classList.toggle('aberto');
  document.body.style.overflow = estaAberto ? 'hidden' : '';
});

menuLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBotao.classList.remove('aberto');
    menuLinks.classList.remove('aberto');
    document.body.style.overflow = '';
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

if (aceitaCursorAnimado) {
  document.querySelectorAll('.projeto-card__imagem').forEach(imagem => {
    imagem.addEventListener('pointermove', evento => {
      const area = imagem.getBoundingClientRect();
      const x = (evento.clientX - area.left) / area.width;
      const y = (evento.clientY - area.top) / area.height;
      imagem.style.setProperty('--foto-x', `${x * 100}%`);
      imagem.style.setProperty('--foto-y', `${y * 100}%`);
      imagem.style.setProperty('--foto-rx', `${(0.5 - y) * 7}deg`);
      imagem.style.setProperty('--foto-ry', `${(x - 0.5) * 7}deg`);
    });

    imagem.addEventListener('pointerleave', () => {
      imagem.style.removeProperty('--foto-rx');
      imagem.style.removeProperty('--foto-ry');
    });
  });
}

const filtroBotoes = document.querySelectorAll('.filtro-btn');
const projetoCards = document.querySelectorAll('.projeto-card');

filtroBotoes.forEach(botao => {
  botao.addEventListener('click', () => {
    const filtro = botao.dataset.filtro;

    filtroBotoes.forEach(item => item.classList.remove('filtro-btn--ativo'));
    botao.classList.add('filtro-btn--ativo');

    projetoCards.forEach(card => {
      const linguagens = card.dataset.linguagens || '';
      const deveMostrar = filtro === 'todos' || linguagens.split(' ').includes(filtro);

      if (deveMostrar) {
        card.style.display = 'grid';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
        });
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});
