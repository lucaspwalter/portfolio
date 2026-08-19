import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const holder = document.getElementById('railScene');
const canvas = document.getElementById('trainCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7896a1);
scene.fog = new THREE.FogExp2(0x7896a1, 0.018);

const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 180);
camera.position.set(8.2, 3.8, 12.5);
camera.lookAt(0, 1.55, -2.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
const environmentGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.2, 0.4, 0.88));

const mat = (color, metalness = 0.2, roughness = 0.65) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const yellow = mat(0xd99a18, 0.72, 0.3);
const yellowDark = mat(0x80530b, 0.68, 0.38);
const navy = mat(0x142934, 0.74, 0.27);
const black = mat(0x080c0f, 0.72, 0.32);
const steel = mat(0x68757a, 0.9, 0.2);
const rust = mat(0x35261d, 0.55, 0.62);
const glass = new THREE.MeshPhysicalMaterial({ color: 0x91c6d5, roughness: 0.08, metalness: 0.1, transmission: 0.22, transparent: true, opacity: 0.78 });

function mesh(geometry, material, parent, position, rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  parent.add(item);
  return item;
}

const train = new THREE.Group();
train.position.set(0, 0, -3);
scene.add(train);

// Locomotiva diesel detalhada, apontada para o horizonte.
const locomotive = new THREE.Group();
train.add(locomotive);
mesh(new THREE.BoxGeometry(3.15, 0.42, 8.7), black, locomotive, [0, 0.82, 0]);
mesh(new THREE.BoxGeometry(2.8, 1.55, 5.3), yellow, locomotive, [0, 1.72, 0.9]);
mesh(new THREE.BoxGeometry(2.92, 0.18, 5.45), yellowDark, locomotive, [0, 2.52, 0.9]);
mesh(new THREE.BoxGeometry(2.88, 2.35, 2.3), navy, locomotive, [0, 2.03, -2.85]);
mesh(new THREE.BoxGeometry(3.02, 0.18, 2.55), black, locomotive, [0, 3.25, -2.85]);

const hoodFront = mesh(new THREE.BoxGeometry(2.74, 1.28, 1.25), yellow, locomotive, [0, 1.59, 4.05]);
hoodFront.geometry.translate(0, 0.1, 0);
mesh(new THREE.BoxGeometry(2.2, 0.7, 0.06), black, locomotive, [0, 2.42, 3.69], [-0.12, 0, 0]);
mesh(new THREE.BoxGeometry(1.08, 0.68, 0.06), glass, locomotive, [-0.67, 2.42, -4.02], [0.08, 0, 0]);
mesh(new THREE.BoxGeometry(1.08, 0.68, 0.06), glass, locomotive, [0.67, 2.42, -4.02], [0.08, 0, 0]);

for (const side of [-1, 1]) {
  mesh(new THREE.BoxGeometry(0.06, 0.72, 1.35), glass, locomotive, [side * 1.46, 2.43, -2.78]);
  mesh(new THREE.BoxGeometry(0.08, 0.08, 8.1), steel, locomotive, [side * 1.62, 1.18, 0.18]);
  for (const z of [-3.7, 3.9]) mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8), steel, locomotive, [side * 1.62, 1.6, z]);
}

for (const z of [-2.6, 2.6]) {
  const bogie = mesh(new THREE.BoxGeometry(2.72, 0.42, 2.05), black, locomotive, [0, 0.57, z]);
  bogie.userData.bogie = true;
  for (const x of [-1.47, 1.47]) for (const dz of [-0.63, 0.63]) {
    const wheel = mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.28, 24), black, locomotive, [x, 0.5, z + dz], [0, 0, Math.PI / 2]);
    wheel.userData.wheel = true;
  }
}

for (let z = -0.9; z <= 2.8; z += 0.72) {
  mesh(new THREE.BoxGeometry(2.34, 0.08, 0.08), black, locomotive, [0, 2.54, z]);
}
mesh(new THREE.CylinderGeometry(0.18, 0.23, 1.05, 12), black, locomotive, [0.65, 3.05, 1.8]);
mesh(new THREE.BoxGeometry(0.35, 0.18, 0.55), steel, locomotive, [0.65, 3.6, 1.8]);

for (const x of [-0.73, 0.73]) {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0xfff0ba, emissive: 0xffd05a, emissiveIntensity: 7 }));
  lamp.rotation.x = Math.PI / 2;
  lamp.position.set(x, 1.82, 4.69);
  locomotive.add(lamp);
  const light = new THREE.SpotLight(0xffe29a, 95, 48, 0.28, 0.65, 1.2);
  light.position.set(x, 1.82, 4.78);
  light.target.position.set(x, 0.2, 42);
  locomotive.add(light, light.target);
}

function carriage(offset, color) {
  const car = new THREE.Group();
  car.position.z = offset;
  train.add(car);
  mesh(new THREE.BoxGeometry(3.05, 0.38, 8.5), black, car, [0, 0.82, 0]);
  mesh(new THREE.BoxGeometry(2.88, 2.35, 8.05), color, car, [0, 2.05, 0]);
  mesh(new THREE.BoxGeometry(3, 0.16, 8.25), black, car, [0, 3.28, 0]);
  for (const side of [-1, 1]) for (let z = -2.85; z <= 2.85; z += 1.42) {
    mesh(new THREE.BoxGeometry(0.06, 0.73, 0.94), glass, car, [side * 1.47, 2.27, z]);
  }
  for (const z of [-2.45, 2.45]) for (const x of [-1.46, 1.46]) for (const dz of [-0.55, 0.55]) {
    const wheel = mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.25, 20), black, car, [x, 0.5, z + dz], [0, 0, Math.PI / 2]);
    wheel.userData.wheel = true;
  }
  mesh(new THREE.BoxGeometry(0.22, 0.2, 0.78), steel, car, [0, 0.8, -4.48]);
}
carriage(-9.2, navy);
carriage(-18.4, yellowDark);

let displayedTrain = train;
// Modelo CC0: https://opengameart.org/content/locomotive-1
new GLTFLoader().load('public/assets/models/locomotive-cc0.glb', ({ scene: model }) => {
  model.traverse((item) => {
    if (!item.isMesh) return;
    item.castShadow = true;
    item.receiveShadow = true;
    if (item.material) item.material.envMapIntensity = 1.35;
  });
  let box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const scale = 16 / Math.max(size.x, size.z);
  model.scale.setScalar(scale);
  if (size.x > size.z) model.rotation.y = Math.PI / 2;
  model.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.y -= box.min.y;
  model.position.z -= center.z;
  const wrapper = new THREE.Group();
  wrapper.position.set(0, 0, 0.5);
  wrapper.add(model);
  scene.add(wrapper);
  const rim = new THREE.PointLight(0xffc15a, 28, 18, 1.7);
  rim.position.set(-2.7, 3.6, -1.5);
  wrapper.add(rim);
  train.visible = false;
  displayedTrain = wrapper;
});

// Via e paisagem deslizam em direção à câmera: avanço fica inequívoco.
const moving = [];
const ground = mesh(new THREE.PlaneGeometry(110, 220), mat(0x263b32, 0, 1), scene, [0, -0.03, -38], [-Math.PI / 2, 0, 0]);
ground.receiveShadow = true;
mesh(new THREE.PlaneGeometry(5.8, 180), mat(0x5a5b50, 0, 0.96), scene, [0, 0.015, -38], [-Math.PI / 2, 0, 0]);
for (const x of [-1.08, 1.08]) mesh(new THREE.BoxGeometry(0.13, 0.14, 180), steel, scene, [x, 0.12, -38]);

for (let z = -105; z < 48; z += 1.35) {
  const sleeper = mesh(new THREE.BoxGeometry(4.15, 0.12, 0.3), rust, scene, [0, 0.04, z]);
  sleeper.userData.loop = 153;
  moving.push(sleeper);
}

for (let z = -95; z < 40; z += 10) {
  for (const x of [-9, 9]) {
    const pole = new THREE.Group();
    pole.position.set(x, 0, z);
    scene.add(pole);
    mesh(new THREE.CylinderGeometry(0.08, 0.13, 7.2, 8), steel, pole, [0, 3.6, 0]);
    mesh(new THREE.BoxGeometry(2.2, 0.09, 0.09), steel, pole, [x > 0 ? -1 : 1, 6.7, 0]);
    pole.userData.loop = 140;
    moving.push(pole);
  }
  const rock = mesh(new THREE.DodecahedronGeometry(1.4 + Math.random() * 1.5, 1), mat(0x45504b, 0, 1), scene, [(Math.random() > 0.5 ? 1 : -1) * (9 + Math.random() * 13), 0.5, z - 4]);
  rock.scale.y = 0.5;
  rock.userData.loop = 140;
  moving.push(rock);
}

for (let z = -100; z < 35; z += 14) {
  const tree = new THREE.Group();
  tree.position.set((Math.random() > 0.5 ? 1 : -1) * (12 + Math.random() * 15), 0, z);
  scene.add(tree);
  mesh(new THREE.CylinderGeometry(0.18, 0.25, 3.2, 7), rust, tree, [0, 1.6, 0]);
  mesh(new THREE.ConeGeometry(2.1, 5.2, 8), mat(0x16382d, 0, 0.9), tree, [0, 5, 0]);
  tree.userData.loop = 145;
  moving.push(tree);
}

scene.add(new THREE.HemisphereLight(0xd8f2ff, 0x263a28, 2.2));
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const moon = new THREE.DirectionalLight(0xc4deea, 2.5);
moon.position.set(-8, 15, 8);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.left = -24;
moon.shadow.camera.right = 24;
moon.shadow.camera.top = 24;
moon.shadow.camera.bottom = -24;
moon.shadow.bias = -0.00035;
scene.add(moon);
const warm = new THREE.DirectionalLight(0xffc45f, 1.9);
warm.position.set(10, 7, -7);
scene.add(warm);

let level = 1;
let dragging = false;
let orbitYaw = 0.58;
let orbitPitch = 0.17;
let orbitRadius = 15.5;
const speeds = [42, 86, 132];
const labels = ['MANOBRA', 'CRUZEIRO', 'EXPRESSO'];
document.getElementById('throttle').addEventListener('click', () => {
  level = (level + 1) % 3;
  document.getElementById('throttleLabel').textContent = labels[level];
  document.getElementById('speedReadout').textContent = `${String(speeds[level]).padStart(3, '0')} KM/H`;
  const amount = (level + 1) * 33;
  document.querySelector('.rail-scene__throttle i').style.background = `linear-gradient(90deg,var(--yellow) ${amount}%,rgba(255,255,255,.15) ${amount}%)`;
});

holder.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  dragging = true;
  holder.setPointerCapture?.(event.pointerId);
});
holder.addEventListener('pointerup', () => { dragging = false; });
holder.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  orbitYaw -= event.movementX * 0.009;
  orbitPitch = THREE.MathUtils.clamp(orbitPitch - event.movementY * 0.006, -0.08, 0.62);
});
holder.addEventListener('wheel', (event) => {
  orbitRadius = THREE.MathUtils.clamp(orbitRadius + event.deltaY * 0.008, 10.5, 23);
}, { passive: true });

document.querySelectorAll('.station').forEach((station, index) => station.addEventListener('click', () => {
  document.querySelectorAll('.station').forEach((item) => item.classList.remove('is-active'));
  station.classList.add('is-active');
  document.getElementById('stationName').textContent = station.dataset.station;
  document.getElementById('stationEta').textContent = `ETA 0${index + 2}:${String(18 + index * 11).padStart(2, '0')}`;
}));

const resize = () => {
  const width = holder.clientWidth;
  const height = holder.clientHeight;
  renderer.setSize(width, height, false);
  composer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
new ResizeObserver(resize).observe(holder);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.04);
  const velocity = speeds[level] / 86;
  const travel = delta * 13 * velocity;
  moving.forEach((item) => {
    item.position.z += travel;
    if (item.position.z > 48) item.position.z -= item.userData.loop;
  });
  displayedTrain.traverse((item) => {
    if (item.userData.wheel) item.rotation.x -= travel * 1.9;
  });
  displayedTrain.position.y = Math.sin(performance.now() * 0.009 * velocity) * 0.018;
  const focusZ = displayedTrain.position.z - 1.4;
  camera.position.set(
    Math.sin(orbitYaw) * orbitRadius,
    2.15 + Math.sin(orbitPitch) * orbitRadius,
    focusZ + Math.cos(orbitYaw) * orbitRadius,
  );
  camera.lookAt(0, 1.55, focusZ);
  composer.render();
});
