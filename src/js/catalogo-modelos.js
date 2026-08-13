const grade = document.querySelector('.grade');
const filtros = document.querySelector('.filtros');
const busca = document.querySelector('#buscaModelos');
const resultado = document.querySelector('.resultado');
const select = document.querySelector('#layoutSelect');
let filtroAtivo = 'todos';

const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function criarFiltros() {
  filtros.innerHTML = `<button class="ativo" data-categoria="todos" aria-pressed="true">Todos <span>${MODELOS.length}</span></button>` +
    Object.entries(CATEGORIAS).map(([id, item]) => `<button data-categoria="${id}" aria-pressed="false">${item.nome} <span>${MODELOS.filter(modelo => modelo.categoria === id).length}</span></button>`).join('');
}

function renderizar() {
  const termo = normalizar(busca.value.trim());
  const itens = MODELOS.filter(modelo => (filtroAtivo === 'todos' || modelo.categoria === filtroAtivo) && normalizar(`${modelo.nome} ${CATEGORIAS[modelo.categoria].nome}`).includes(termo));
  grade.innerHTML = itens.map((modelo, indice) => {
    const cat = CATEGORIAS[modelo.categoria];
    return `<article class="cartao" style="--card-cor:${modelo.cor};--card-fundo:${modelo.fundo}">
      <a class="cartao__visual" href="demos/modelo.html?tipo=${modelo.id}" aria-label="Abrir modelo ${modelo.nome}"><img src="public/assets/images/samples/models/${modelo.id}.webp" alt="Prévia de ${modelo.nome}" loading="${indice < 3 ? 'eager' : 'lazy'}" width="1536" height="1024"></a>
      <div class="cartao__conteudo"><span class="cartao__tipo">${cat.nome}</span><h3>${modelo.nome} XXX</h3><p>${modelo.descricao}</p><a href="demos/modelo.html?tipo=${modelo.id}">Explorar modelo <span>↗</span></a></div>
    </article>`;
  }).join('');
  resultado.textContent = `${itens.length} ${itens.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}`;
}

filtros.addEventListener('click', event => {
  const botao = event.target.closest('button');
  if (!botao) return;
  filtroAtivo = botao.dataset.categoria;
  filtros.querySelectorAll('button').forEach(item => { const ativo = item === botao; item.classList.toggle('ativo', ativo); item.setAttribute('aria-pressed', String(ativo)); });
  renderizar();
});
busca.addEventListener('input', renderizar);
select.insertAdjacentHTML('beforeend', MODELOS.map(modelo => `<option>${modelo.nome}</option>`).join(''));
criarFiltros();
renderizar();
