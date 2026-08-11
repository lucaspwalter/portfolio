const formulario = document.getElementById('formSolicitacao');

formulario?.addEventListener('submit', event => {
  event.preventDefault();

  const dados = new FormData(formulario);
  const assunto = `Solicitação de layout — ${dados.get('segmento')}`;
  const mensagem = [
    `Nome: ${dados.get('nome')}`,
    `E-mail: ${dados.get('email')}`,
    `Segmento: ${dados.get('segmento')}`,
    `Layout de referência: ${dados.get('layout')}`,
    '',
    'Detalhes:',
    dados.get('detalhes')
  ].join('\n');

  const destino = new URL('https://mail.google.com/mail/');
  destino.search = new URLSearchParams({
    view: 'cm',
    to: 'lukas.lukas.walter@gmail.com',
    su: assunto,
    body: mensagem
  });

  window.open(destino, '_blank', 'noopener,noreferrer');
});
