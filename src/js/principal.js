const navegacao = document.getElementById('navegacao');
const menuBotao = document.getElementById('menuBotao');
const menuLinks = document.getElementById('menuLinks');

const aceitaCursorAnimado = window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (aceitaCursorAnimado) {
  const brilho = document.createElement('div');
  brilho.className = 'cursor-brilho';
  document.documentElement.appendChild(brilho);

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

// Interações globais: tema, navegação rápida, progresso e detalhes de projetos.
const temaBotao = document.getElementById('temaBotao');
const modalProjeto = document.getElementById('modalProjeto');
const avisoCopiado = document.getElementById('avisoCopiado');
const progressoPagina = document.getElementById('progressoPagina');
const voltarTopo = document.getElementById('voltarTopo');

const mostrarAviso = mensagem => {
  avisoCopiado.textContent = mensagem;
  avisoCopiado.classList.add('visivel');
  window.clearTimeout(mostrarAviso.timer);
  mostrarAviso.timer = window.setTimeout(() => avisoCopiado.classList.remove('visivel'), 2200);
};

const aplicarTema = tema => {
  const claro = tema === 'claro';
  document.documentElement.classList.toggle('tema-claro', claro);
  temaBotao.textContent = claro ? '☾ Tema' : '☼ Tema';
  temaBotao.setAttribute('aria-label', claro ? 'Ativar tema escuro' : 'Ativar tema claro');
  temaBotao.setAttribute('aria-pressed', String(claro));
  localStorage.setItem('portfolio-tema', tema);
};

aplicarTema(localStorage.getItem('portfolio-tema') || 'escuro');
temaBotao.addEventListener('click', () => {
  aplicarTema(document.documentElement.classList.contains('tema-claro') ? 'escuro' : 'claro');
  mostrarAviso('Tema atualizado');
});

const fecharModal = () => {
  modalProjeto.hidden = true;
  document.body.classList.remove('modal-aberto');
};

const abrirModal = card => {
  const imagem = card.querySelector('.projeto-card__imagem img');
  const titulo = card.querySelector('.projeto-card__titulo');
  const descricao = card.querySelector('.projeto-card__descricao');
  const tecnologias = card.querySelectorAll('.projeto-card__tecnologias span');
  const acoes = card.querySelector('.projeto-card__links');
  document.getElementById('modalProjetoImagem').src = imagem?.src || '';
  document.getElementById('modalProjetoImagem').alt = imagem?.alt || '';
  document.getElementById('modalProjetoTitulo').textContent = titulo?.textContent || 'Projeto';
  document.getElementById('modalProjetoDescricao').textContent = descricao?.textContent.trim() || '';
  const listaTecnologias = document.getElementById('modalProjetoTecnologias');
  listaTecnologias.replaceChildren(...[...tecnologias].map(item => {
    const tag = document.createElement('span');
    tag.textContent = item.textContent;
    return tag;
  }));
  const listaAcoes = document.getElementById('modalProjetoAcoes');
  listaAcoes.replaceChildren(...(acoes ? [...acoes.querySelectorAll('a')].map(link => link.cloneNode(true)) : []));
  modalProjeto.hidden = false;
  document.body.classList.add('modal-aberto');
  document.querySelector('.modal-projeto__fechar').focus();
};

projetoCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', evento => {
    if (evento.target.closest('a, button')) return;
    abrirModal(card);
  });
  card.addEventListener('keydown', evento => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      abrirModal(card);
    }
  });
});

modalProjeto.querySelectorAll('[data-fechar-modal]').forEach(item => item.addEventListener('click', fecharModal));

const atualizarScroll = () => {
  const limite = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = limite > 0 ? (window.scrollY / limite) * 100 : 0;
  progressoPagina.style.width = `${progresso}%`;
  voltarTopo.classList.toggle('visivel', window.scrollY > window.innerHeight * .65);
};

window.addEventListener('scroll', atualizarScroll, { passive: true });
atualizarScroll();
voltarTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') fecharModal();
});

const secoes = [...document.querySelectorAll('main section[id], section[id]')];
const linksNavegacao = [...document.querySelectorAll('.navegacao__links a[href^="#"]')];
const marcarSecaoAtiva = entrada => {
  if (!entrada.isIntersecting) return;
  linksNavegacao.forEach(link => link.classList.toggle('navegacao__link--ativo', link.getAttribute('href') === `#${entrada.target.id}`));
};
if ('IntersectionObserver' in window) {
  const observadorSecoes = new IntersectionObserver(entradas => entradas.forEach(marcarSecaoAtiva), { rootMargin: '-35% 0px -55% 0px' });
  secoes.forEach(secao => observadorSecoes.observe(secao));
}
