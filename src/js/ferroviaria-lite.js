const scene = document.getElementById('railScene');
const stage = document.getElementById('trainStage');
const throttle = document.getElementById('throttle');
const speedReadout = document.getElementById('speedReadout');
const throttleLabel = document.getElementById('throttleLabel');
const signalStatus = document.getElementById('signalStatus');
const speeds = [42, 86, 132];
const labels = ['MANOBRA', 'CRUZEIRO', 'EXPRESSO'];
let level = 1;

stage.addEventListener('pointermove', (event) => {
  const bounds = stage.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  stage.style.setProperty('--train-x', `${x * 18}px`);
  stage.style.setProperty('--train-y', `${y * 10}px`);
  stage.style.setProperty('--train-rx', `${-y * 3.5}deg`);
  stage.style.setProperty('--train-ry', `${x * 5}deg`);
});

stage.addEventListener('pointerleave', () => {
  ['--train-x', '--train-y', '--train-rx', '--train-ry'].forEach((property) => stage.style.removeProperty(property));
});

throttle.addEventListener('click', () => {
  level = (level + 1) % speeds.length;
  throttleLabel.textContent = labels[level];
  speedReadout.textContent = `${String(speeds[level]).padStart(3, '0')} KM/H`;
  scene.dataset.motion = level === 0 ? 'slow' : level === 2 ? 'fast' : 'cruise';
  const amount = (level + 1) * 33;
  throttle.querySelector('i').style.background = `linear-gradient(90deg,var(--yellow) ${amount}%,rgba(255,255,255,.15) ${amount}%)`;
});

const signalLabels = { green: 'VIA LIVRE', yellow: 'ATENÇÃO', red: 'PARADA OBRIGATÓRIA' };
document.querySelectorAll('.signal').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.signal').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  scene.dataset.signal = button.dataset.signal;
  signalStatus.textContent = signalLabels[button.dataset.signal];
}));

document.getElementById('horn').addEventListener('click', () => {
  scene.classList.remove('is-honking');
  void scene.offsetWidth;
  scene.classList.add('is-honking');
  setTimeout(() => scene.classList.remove('is-honking'), 520);
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.13, audio.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.48);
  gain.connect(audio.destination);
  [146, 184].forEach((frequency) => {
    const oscillator = audio.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.5);
  });
  setTimeout(() => audio.close(), 650);
});

document.querySelectorAll('.station').forEach((station, index) => station.addEventListener('click', () => {
  document.querySelectorAll('.station').forEach((item) => item.classList.remove('is-active'));
  station.classList.add('is-active');
  document.getElementById('stationName').textContent = station.dataset.station;
  document.getElementById('stationEta').textContent = `ETA 0${index + 2}:${String(18 + index * 11).padStart(2, '0')}`;
}));
