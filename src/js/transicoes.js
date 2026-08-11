document.addEventListener('click', event => {
  const link = event.target.closest('a');

  if (!link || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      link.target === '_blank' || link.hasAttribute('download')) return;

  const destino = new URL(link.href, window.location.href);
  const mesmaPagina = destino.pathname === window.location.pathname && destino.search === window.location.search;

  if (destino.origin !== window.location.origin || (mesmaPagina && destino.hash)) return;

  event.preventDefault();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.location.href = destino.href;
    return;
  }

  document.body.classList.add('pagina-saindo');
  window.setTimeout(() => { window.location.href = destino.href; }, 380);
});

window.addEventListener('pageshow', () => document.body.classList.remove('pagina-saindo'));
