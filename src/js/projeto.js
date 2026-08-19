const projetos = {
  ferroviaria: { codigo: 'PROJECT / 001', nome: 'Ferroviária LLGR', tipo: 'OPERATIONS SYSTEM', resumo: 'Uma central operacional para transformar rotas, sensores e manutenção em decisões claras.', descricao: 'Sistema web criado para digitalizar a gestão ferroviária. Operadores acompanham trens, rotas, estações, sensores, manutenções e itinerários em um mesmo fluxo.', stack: ['PHP', 'MySQL', 'Docker'], capacidades: ['Gestão de trens e rotas', 'Sensores e manutenções', 'Itinerários operacionais'], direcao: 'Interface de comando: densa onde precisa ser precisa, simples onde precisa ser rápida.', execucao: 'Suba os serviços com Docker e acesse o painel local.', comando: 'docker compose up', guia: 'setup-ferroviaria.html', github: 'https://github.com/lucaspwalter/ferroviaria-llgr', tema: 'rail', visual: 'rail', status: 'CONCLUÍDO' },
  turnover: { codigo: 'PROJECT / 002', nome: 'Turnover Dashboard', tipo: 'PEOPLE ANALYTICS', resumo: 'Risco de turnover convertido em sinais acionáveis para equipes de pessoas.', descricao: 'Dashboard que calcula um score auditável com seis fatores, organiza funcionários por risco e revela padrões por departamento.', stack: ['Python', 'FastAPI', 'React', 'PostgreSQL'], capacidades: ['Score com 6 fatores', 'Ranking por risco', 'Insights por departamento'], direcao: 'Dados não devem assustar: devem orientar a próxima decisão.', execucao: 'Prepare o ambiente Python, suba a API e inicie a interface.', comando: 'docker compose up', guia: 'setup-turnover.html', github: 'https://github.com/lucaspwalter/turnover-dashboard', tema: 'signal', visual: 'turnover', status: 'CONCLUÍDO' },
  pricewatch: { codigo: 'PROJECT / 003', nome: 'PriceWatch', tipo: 'AUTOMATION ENGINE', resumo: 'Um radar de preços que trabalha em silêncio e avisa na hora certa.', descricao: 'Monitor de preços com job agendado, preço-alvo e notificação automática via WhatsApp quando a oportunidade aparece.', stack: ['Java', 'Spring Boot', 'Next.js', 'PostgreSQL'], capacidades: ['Monitoramento periódico', 'Alertas via WhatsApp', 'Preço-alvo por produto'], direcao: 'A interface mostra a oportunidade; a automação cuida do resto.', execucao: 'Suba banco, API e frontend conforme o guia do projeto.', comando: 'docker compose up -d', guia: 'setup-pricewatch.html', github: 'https://github.com/lucaspwalter/pricewatch', tema: 'amber', visual: 'pricewatch', status: 'CONCLUÍDO' },
  barbershop: { codigo: 'PROJECT / 004', nome: 'Barbershop Scheduler', tipo: 'BOOKING PLATFORM', resumo: 'Agendamento sem conflito para barbearias que não podem perder tempo.', descricao: 'Plataforma com agenda, fila de espera, notificações e relatórios para transformar operação manual em experiência previsível.', stack: ['TypeScript', 'Fastify', 'Next.js', 'PostgreSQL'], capacidades: ['Conflito de horários', 'Fila de espera', 'Relatórios de desempenho'], direcao: 'Ritmo visual rápido, com informação importante sempre a um toque.', execucao: 'Instale dependências e inicie API e aplicação web.', comando: 'npm install && npm run dev', guia: 'setup-barbershop.html', github: 'https://github.com/lucaspwalter/barbershop-scheduler', tema: 'coral', visual: 'barbershop', status: 'CONCLUÍDO' },
  scraper: { codigo: 'PROJECT / 005', nome: 'Job Scraper', tipo: 'INTELLIGENCE PIPELINE', resumo: 'Uma estação pessoal para encontrar, classificar e acompanhar oportunidades.', descricao: 'Pipeline com FastAPI, React e workflows que pesquisa vagas, filtra tecnologia e administrativo e organiza o próximo passo da candidatura.', stack: ['Python', 'FastAPI', 'React', 'SQLite'], capacidades: ['Busca e classificação', 'Filtros por escopo', 'Acompanhamento de vagas'], direcao: 'Interface de terminal para um fluxo que precisa ser pessoal e rastreável.', execucao: 'Suba a API e a interface pelo roteiro do projeto.', comando: 'docker compose up', guia: 'setup-job-scraper.html', github: 'https://github.com/lucaspwalter/job-scraper', tema: 'terminal', visual: 'scraper', status: 'CONCLUÍDO' },
  support: { codigo: 'PROJECT / 006', nome: 'Support System', tipo: 'REALTIME SERVICE', resumo: 'Atendimento ao vivo com fila, contexto e histórico no mesmo lugar.', descricao: 'Sistema de suporte com sessões em tempo real via WebSocket STOMP, fila de espera, painel de atendentes e histórico persistido.', stack: ['Java', 'Spring Boot', 'WebSocket', 'Next.js'], capacidades: ['Chat em tempo real', 'Fila de atendimento', 'Histórico persistido'], direcao: 'A conversa é o centro; o sistema desaparece enquanto mantém o contexto.', execucao: 'Inicie banco, backend e frontend conforme o guia.', comando: 'docker compose up', guia: 'setup-support-system.html', github: 'https://github.com/lucaspwalter/support-system', tema: 'cyan', visual: 'support', status: 'CONCLUÍDO' },
  jarvis: { codigo: 'PROJECT / 007', nome: 'JARVIS', tipo: 'LOCAL INTELLIGENCE', resumo: 'Uma camada de inteligência local para ouvir, interpretar e agir com controle.', descricao: 'Assistente de voz local para Linux com wake word, Whisper, interpretação opcional via Ollama, síntese Piper e execução controlada de comandos registrados.', stack: ['Python', 'Whisper', 'Ollama', 'Piper'], capacidades: ['Wake word local', 'Transcrição em português', 'Comandos registrados'], direcao: 'Interface de sala de comando: escura, precisa e viva, como um sistema que está sempre escutando.', execucao: 'Instale dependências de áudio, configure os modelos locais e inicie o assistente.', comando: '.venv/bin/python jarvis.py', guia: 'setup-jarvis.html', github: 'https://github.com/lucaspwalter/jarvis', tema: 'jarvis', visual: 'jarvis', status: 'EM DESENVOLVIMENTO' },
  brasilium: { codigo: 'PROJECT / 008', nome: 'Brasilium Browser', tipo: 'HELIUM LOW-RAM MOD', resumo: 'Uma modificação do Helium focada em diminuir consumo de RAM no Linux.', descricao: 'Fork do empacotamento Linux do Helium com política de menos renderizadores e build otimizada para reduzir memória sem remover recursos essenciais.', stack: ['C++', 'Helium', 'Chromium', 'Linux'], capacidades: ['Processo por site', 'Limite de 4 renderizadores', 'Build PGO e ThinLTO'], direcao: 'Mesmo Helium, menor consumo de RAM: otimização funcional em vez de criar outro navegador.', execucao: 'Baixe o AppImage, conceda permissão e execute.', comando: 'chmod +x Brasilium.AppImage && ./Brasilium.AppImage', guia: '#', github: 'https://github.com/lucaspwalter/helium-performance', tema: 'brasil', visual: 'brasilium', status: 'EM DESENVOLVIMENTO' }
};

const slug = new URLSearchParams(location.search).get('projeto') || 'jarvis';
if (slug === 'brasilium') location.replace('projeto-brasilium.html');
if (slug === 'jarvis') location.replace('projeto-jarvis.html');
const projeto = projetos[slug] || projetos.jarvis;
const setText = (id, value) => { document.getElementById(id).textContent = value; };
const visuais = {
  jarvis: '<canvas class="jarvis-canvas" aria-label="Núcleo tridimensional interativo do JARVIS"></canvas><div class="jarvis-interface" aria-hidden="true"><div class="jarvis-reticle"><i></i><i></i><i></i><span>CORE<br><b>ONLINE</b></span></div><div class="jarvis-scan"></div><div class="jarvis-telemetry jarvis-telemetry--left"><span>VOICE MATRIX</span><b id="jarvisVoice">STANDBY</b><small>LOCAL CHANNEL 07</small></div><div class="jarvis-telemetry jarvis-telemetry--right"><span>NEURAL LOAD</span><b id="jarvisLoad">42.8%</b><small>OLLAMA / WHISPER</small></div><div class="jarvis-command">DRAG TO ROTATE <i>/</i> SCROLL TO CHARGE <i>/</i> CLICK CORE</div></div>',
  rail: '<div class="rail-map"><i class="train">▰</i><i class="station s1">01</i><i class="station s2">02</i><i class="station s3">03</i><span class="rail-line r1"></span><span class="rail-line r2"></span></div><div class="rail-label">LINE 01 / SERVICE ACTIVE</div>',
  turnover: '<div class="bars"><i style="--h:82%"></i><i style="--h:54%"></i><i style="--h:68%"></i><i style="--h:38%"></i><i style="--h:25%"></i><i style="--h:47%"></i></div><div class="chart-axis">RISK SCORE <b>LOW</b><b>HIGH</b></div>',
  pricewatch: '<div class="ticker"><span>RTX / TARGET R$ 2.499</span><b>-12.8%</b></div><div class="ticker-line"><i></i></div><div class="price-alert">ALERT TRIGGERED <strong>WHATSAPP READY</strong></div>',
  barbershop: '<div class="agenda"><span>09:00 <b>Lucas / corte</b></span><span>10:30 <b>Marcos / barba</b></span><span>11:00 <b>Fila de espera</b></span><span>13:30 <b>João / combo</b></span></div><div class="scissors">✂</div>',
  scraper: '<div class="terminal-lines"><span>&gt; searching joinville</span><span>&gt; technology / administrative</span><span class="ok">&gt; 42 matches classified</span><span>&gt; ranking opportunities_</span></div><div class="terminal-pulse"></div>',
  support: '<div class="chat"><span class="chat-in">Olá, preciso de ajuda.</span><span class="chat-out">Estou verificando seu atendimento.</span><span class="chat-in">Obrigado!</span></div><div class="live-dot">● LIVE / WEBSOCKET</div>',
  brasilium: '<canvas class="brasilium-canvas" aria-label="Navegador tridimensional interativo Brasilium"></canvas><div class="brasilium-overlay" aria-hidden="true"><header><span class="brasilium-brand"><i></i> BRASILIUM</span><span id="brasiliumMode">FOCUS MODE</span></header><div class="brasilium-address"><span>◇</span><b id="brasiliumUrl">brasilium://new-world</b><i>SECURE</i></div><div class="brasilium-copy"><small>PERSONAL BROWSER / 008</small><strong>EXPLORE<br>WITHOUT<br>THE NOISE.</strong></div><div class="brasilium-tabs"><span class="is-selected">01 / FOCUS</span><span>02 / MEMORY</span><span>03 / SPEED</span></div><div class="brasilium-hint">MOVE TO STEER · CLICK TO SWITCH SPACE</div></div>'
};
document.title = `${projeto.nome} — Projeto`;
document.body.dataset.tema = projeto.tema;
const visual = document.getElementById('projetoVisual');
visual.className = `visual visual--${projeto.visual || slug}`;
visual.innerHTML = visuais[projeto.visual || slug] || '';
setText('projetoCodigo', projeto.codigo); setText('projetoNome', projeto.nome); setText('projetoTipo', projeto.tipo);
setText('projetoResumo', projeto.resumo); setText('projetoDescricao', projeto.descricao); setText('projetoDirecao', projeto.direcao);
setText('projetoExecucao', projeto.execucao); setText('projetoComando', projeto.comando); setText('consoleStatus', projeto.status);
setText('metricStack', projeto.stack[0]); setText('metricStatus', projeto.status); setText('consolePrompt', `> boot --${slug}`);
document.getElementById('navGithub').href = projeto.github;
document.getElementById('navGuia').href = projeto.guia;
document.getElementById('projetoStack').replaceChildren(...projeto.stack.map(item => Object.assign(document.createElement('span'), { textContent: item })));
document.getElementById('projetoCapacidades').replaceChildren(...projeto.capacidades.map(item => Object.assign(document.createElement('li'), { textContent: item })));

if (window.gsap) {
  gsap.from('.hero-copy > *, .hero-console', { opacity: 0, y: 28, duration: .9, stagger: .08, ease: 'power3.out' });
  gsap.to('.hero-grid', { backgroundPosition: '48px 48px', duration: 10, repeat: -1, ease: 'none' });
  gsap.from('.visual > *', { opacity: 0, y: 16, duration: .7, stagger: .08, delay: .25, ease: 'power2.out' });
  if (projeto.visual === 'jarvis') gsap.to('.hud-core i', { rotation: 360, duration: 8, repeat: -1, ease: 'none' });
  if (projeto.visual === 'rail') gsap.to('.train', { x: 420, duration: 5, repeat: -1, ease: 'none' });
  if (projeto.visual === 'scraper') gsap.to('.terminal-pulse', { opacity: .25, duration: .8, repeat: -1, yoyo: true });
}

visual.addEventListener('pointermove', evento => {
  const caixa = visual.getBoundingClientRect();
  const x = (evento.clientX - caixa.left) / caixa.width - .5;
  const y = (evento.clientY - caixa.top) / caixa.height - .5;
  visual.style.transform = `perspective(1100px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
});
visual.addEventListener('pointerleave', () => { visual.style.removeProperty('transform'); });
visual.addEventListener('click', () => visual.classList.toggle('is-active'));
const atualizarNarrativa = () => {
  const area = visual.getBoundingClientRect();
  const progresso = Math.max(0, Math.min(1, (window.innerHeight - area.top) / (window.innerHeight + area.height)));
  visual.style.setProperty('--scroll-progress', progresso.toFixed(3));
};
window.addEventListener('scroll', atualizarNarrativa, { passive: true });
atualizarNarrativa();
