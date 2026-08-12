const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
const captureSection=new URLSearchParams(location.search).get('capture');
if(captureSection){
  const target=captureSection==='inicio'?document.querySelector('.hero'):document.getElementById(captureSection);
  if(target){document.body.classList.add('capture-mode');target.classList.add('capture-target');target.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'))}
}
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',open);menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));

const dialog=document.querySelector('#area-dialog');
document.querySelectorAll('[data-area]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent=button.dataset.area;dialog.showModal()}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.querySelector('a').addEventListener('click',()=>dialog.close());

document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const status=event.currentTarget.querySelector('.form-status');status.textContent='Mensagem simulada enviada com sucesso.';event.currentTarget.reset();setTimeout(()=>status.textContent='',5000)});
document.querySelector('#year').textContent=new Date().getFullYear();
