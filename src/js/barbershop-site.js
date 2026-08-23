const layoutOverride = document.createElement('link');
layoutOverride.rel = 'stylesheet';
layoutOverride.href = 'src/css/barbershop-override.css?v=20260823b';
document.head.append(layoutOverride);
const chair = document.querySelector('.chair');
chair.addEventListener('pointermove', (event) => { const box = chair.getBoundingClientRect(); chair.style.transform = `perspective(900px) rotateX(${((event.clientY-box.top)/box.height-.5)*-5}deg) rotateY(${((event.clientX-box.left)/box.width-.5)*5}deg)`; });
chair.addEventListener('pointerleave', () => { chair.style.transform = ''; });
document.querySelectorAll('.barber').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.barber').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); }));
const booking = document.getElementById('booking');
const schedules = {
  qua: [{time:'09:30',name:'João · Fade',state:'booked',x:'8%',w:'18%'},{time:'10:45',name:'Horário livre',state:'available',x:'31%',w:'17%'},{time:'12:00',name:'Rafael · Corte + barba',state:'booked',x:'54%',w:'20%'},{time:'13:30',name:'Fila de espera',state:'wait',x:'80%',w:'15%'}],
  qui: [{time:'09:00',name:'Lucas · Navalha',state:'booked',x:'2%',w:'17%'},{time:'10:15',name:'Horário livre',state:'available',x:'25%',w:'17%'},{time:'11:45',name:'Ana · Corte clássico',state:'booked',x:'51%',w:'19%'},{time:'14:00',name:'Horário livre',state:'available',x:'84%',w:'14%'}],
  sex: [{time:'09:45',name:'Horário livre',state:'available',x:'13%',w:'16%'},{time:'11:00',name:'Davi · Barba',state:'booked',x:'37%',w:'18%'},{time:'13:15',name:'Fila de espera',state:'wait',x:'63%',w:'15%'},{time:'15:00',name:'Horário livre',state:'available',x:'84%',w:'14%'}]
};
const slots = document.getElementById('slots');
const renderSlots = (day) => { slots.replaceChildren(); schedules[day].forEach((item) => { const slot = document.createElement('button'); slot.className = `slot ${item.state}`; slot.style.setProperty('--x', item.x); slot.style.setProperty('--w', item.w); slot.innerHTML = `<b>${item.time}</b><span>${item.name}</span>`; slot.addEventListener('click', () => { document.querySelectorAll('.slot').forEach((node) => node.classList.remove('selected')); slot.classList.add('selected'); booking.textContent = slot.classList.contains('available') ? `${item.time} está livre. Clique novamente para confirmar sua reserva.` : 'Este horário já está ocupado; você pode entrar na fila de espera.'; }); slots.append(slot); }); };
renderSlots('qua');
document.querySelectorAll('.day-tabs button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.day-tabs button').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); renderSlots(button.dataset.day); booking.textContent = 'Selecione um horário deste dia para reservar sua cadeira.'; }));
