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

// Camada de movimento: partículas, cursor e elementos magnéticos.
const universo = document.getElementById('universo');
const orbe = document.querySelector('.topo__orbe');
const podeAnimar = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ponteiroPreciso = window.matchMedia('(pointer: fine)').matches;

if (universo && podeAnimar) {
  const contexto = universo.getContext('2d');
  let pontos = [];
  let largura = 0;
  let altura = 0;
  let alvoX = 0;
  let alvoY = 0;

  const ajustarUniverso = () => {
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    largura = universo.clientWidth;
    altura = universo.clientHeight;
    universo.width = largura * escala;
    universo.height = altura * escala;
    contexto.setTransform(escala, 0, 0, escala, 0, 0);
    const quantidade = Math.min(96, Math.max(28, Math.floor(largura / 17)));
    pontos = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.7 + .4
    }));
  };

  const desenharUniverso = () => {
    contexto.clearRect(0, 0, largura, altura);
    pontos.forEach(ponto => {
      ponto.x += ponto.vx;
      ponto.y += ponto.vy;
      if (ponto.x < -10 || ponto.x > largura + 10) ponto.vx *= -1;
      if (ponto.y < -10 || ponto.y > altura + 10) ponto.vy *= -1;
      const distancia = Math.hypot(ponto.x - alvoX, ponto.y - alvoY);
      const brilho = distancia < 180 ? .8 : .3;
      contexto.beginPath();
      contexto.arc(ponto.x, ponto.y, ponto.r, 0, Math.PI * 2);
      contexto.fillStyle = `rgba(167, 139, 250, ${brilho})`;
      contexto.fill();
    });
    for (let i = 0; i < pontos.length; i += 1) {
      for (let j = i + 1; j < pontos.length; j += 1) {
        const distancia = Math.hypot(pontos[i].x - pontos[j].x, pontos[i].y - pontos[j].y);
        if (distancia > 105) continue;
        contexto.beginPath();
        contexto.moveTo(pontos[i].x, pontos[i].y);
        contexto.lineTo(pontos[j].x, pontos[j].y);
        contexto.strokeStyle = `rgba(124, 106, 247, ${.13 * (1 - distancia / 105)})`;
        contexto.stroke();
      }
    }
    requestAnimationFrame(desenharUniverso);
  };

  ajustarUniverso();
  window.addEventListener('resize', ajustarUniverso);
  desenharUniverso();

  document.querySelector('.topo').addEventListener('pointermove', evento => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    alvoX = evento.clientX - caixa.left;
    alvoY = evento.clientY - caixa.top;
    orbe?.style.setProperty('--orbe-x', `${(alvoX - caixa.width / 2) * .08}px`);
    orbe?.style.setProperty('--orbe-y', `${(alvoY - caixa.height / 2) * .08}px`);
    document.documentElement.style.setProperty('--hero-y', `${(alvoY - caixa.height / 2) * -.012}px`);
  });
}

if (ponteiroPreciso && podeAnimar) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-orbe';
  document.body.append(cursor);
  document.body.classList.add('cursor-imersivo');
  document.documentElement.classList.add('cursor-imersivo');
  let cursorX = -100;
  let cursorY = -100;
  let alvoCursorX = -100;
  let alvoCursorY = -100;
  const moverCursor = () => {
    cursorX += (alvoCursorX - cursorX) * .22;
    cursorY += (alvoCursorY - cursorY) * .22;
    cursor.style.transform = `translate3d(${cursorX - 11}px, ${cursorY - 11}px, 0)`;
    requestAnimationFrame(moverCursor);
  };
  document.addEventListener('pointermove', evento => {
    alvoCursorX = evento.clientX;
    alvoCursorY = evento.clientY;
    cursor.classList.add('visivel');
  }, { passive: true });
  document.addEventListener('pointerdown', () => cursor.classList.add('clique'));
  document.addEventListener('pointerup', () => cursor.classList.remove('clique'));
  document.addEventListener('pointerover', evento => cursor.classList.toggle('grande', Boolean(evento.target.closest('a, button, .projeto-card'))));
  moverCursor();
}

document.querySelectorAll('[data-magnet]').forEach(elemento => {
  elemento.addEventListener('pointermove', evento => {
    const caixa = elemento.getBoundingClientRect();
    const forca = Number(elemento.dataset.magnet || .2);
    elemento.style.transform = `translate(${(evento.clientX - (caixa.left + caixa.width / 2)) * forca}px, ${(evento.clientY - (caixa.top + caixa.height / 2)) * forca}px)`;
  });
  elemento.addEventListener('pointerleave', () => { elemento.style.removeProperty('transform'); });
});

document.querySelectorAll('.projeto-card').forEach(card => {
  card.addEventListener('pointermove', evento => {
    const caixa = card.getBoundingClientRect();
    const x = (evento.clientX - caixa.left) / caixa.width;
    const y = (evento.clientY - caixa.top) / caixa.height;
    card.style.setProperty('--spot-x', `${x * 100}%`);
    card.style.setProperty('--spot-y', `${y * 100}%`);
    if (ponteiroPreciso && podeAnimar) card.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 2.2}deg) rotateY(${(x - 0.5) * 2.2}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.removeProperty('transform'); });
});

const bootScreen = document.getElementById('bootScreen');
const bootBarra = document.getElementById('bootBarra');
const bootStatus = document.getElementById('bootStatus');
const bootTerminal = document.getElementById('bootTerminal');
const bootUnlock = document.getElementById('bootUnlock');
const bootSkip = document.getElementById('bootSkip');

const sairDoBoot = () => {
  sessionStorage.setItem('portfolio-booted', '1');
  document.body.classList.remove('bootando');
  bootScreen.classList.add('sair');
  window.setTimeout(() => bootScreen.remove(), 800);
};

const repetirBoot = new URLSearchParams(window.location.search).get('boot') === 'show';
if (!repetirBoot && sessionStorage.getItem('portfolio-booted') === '1') {
  bootScreen.remove();
} else {
  document.body.classList.add('bootando');
  let carregamento = 0;
  const mensagens = ['carregando interface...', 'sincronizando projetos...', 'preparando experiências...', 'sistema pronto. aguardando acesso.'];
  const progressoBoot = window.setInterval(() => {
    carregamento = Math.min(100, carregamento + 2);
    bootBarra.style.width = `${carregamento}%`;
    const indice = Math.min(mensagens.length - 1, Math.floor(carregamento / 26));
    bootStatus.textContent = carregamento < 100 ? mensagens[indice] : 'sistema pronto.';
    bootTerminal.textContent = carregamento < 100 ? `módulo ${String(indice + 1).padStart(2, '0')} / 04 · online` : 'acesso manual necessário · arraste o controle';
    if (carregamento === 100) {
      window.clearInterval(progressoBoot);
      bootUnlock.disabled = false;
    }
  }, 28);

  let arrastando = false;
  const moverDesbloqueio = evento => {
    if (!arrastando || bootUnlock.disabled) return;
    const caixa = bootUnlock.getBoundingClientRect();
    const limite = caixa.width - 70;
    const deslocamento = Math.max(0, Math.min(limite, evento.clientX - caixa.left - 34));
    bootUnlock.querySelector('.boot-unlock__controle').style.transform = `translateX(${deslocamento}px)`;
    bootUnlock.style.setProperty('--progresso', `${(deslocamento / limite) * 100}%`);
    bootUnlock.querySelector('span:last-child').style.opacity = String(Math.max(.15, 1 - deslocamento / limite * 1.4));
    if (deslocamento >= limite * .9) sairDoBoot();
  };
  bootUnlock.addEventListener('pointerdown', evento => {
    if (bootUnlock.disabled) return;
    arrastando = true;
    bootUnlock.classList.add('arrastando');
    bootUnlock.setPointerCapture(evento.pointerId);
  });
  bootUnlock.addEventListener('pointermove', moverDesbloqueio);
  const terminarArraste = () => { arrastando = false; bootUnlock.classList.remove('arrastando'); };
  bootUnlock.addEventListener('pointerup', terminarArraste);
  bootUnlock.addEventListener('pointercancel', terminarArraste);
  bootUnlock.addEventListener('keydown', evento => {
    if (!bootUnlock.disabled && (evento.key === 'Enter' || evento.key === ' ')) sairDoBoot();
  });
  bootSkip.addEventListener('click', sairDoBoot);
}
