import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const holder = document.getElementById('railScene');
const canvas = document.getElementById('trainCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020711);
scene.fog = new THREE.FogExp2(0x06111b, 0.017);

const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 180);
camera.position.set(8.2, 3.8, 12.5);
camera.lookAt(0, 1.55, -2.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
const environmentGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.38;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.48, 0.55, 0.72));

const mat = (color, metalness = 0.2, roughness = 0.65) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const yellow = mat(0xd99a18, 0.72, 0.3);
const yellowDark = mat(0x80530b, 0.68, 0.38);
const navy = mat(0x142934, 0.74, 0.27);
const black = mat(0x080c0f, 0.72, 0.32);
const steel = mat(0x68757a, 0.9, 0.2);
const rust = mat(0x35261d, 0.55, 0.62);
const glass = new THREE.MeshPhysicalMaterial({ color: 0x91c6d5, roughness: 0.08, metalness: 0.1, transmission: 0.22, transparent: true, opacity: 0.78 });

function noiseTexture(colors, size = 128) {
  const source = document.createElement('canvas');
  source.width = size;
  source.height = size;
  const context = source.getContext('2d');
  const image = context.createImageData(size, size);
  for (let pixel = 0; pixel < size * size; pixel += 1) {
    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    const shade = 0.82 + Math.random() * 0.28;
    image.data[pixel * 4] = color.r * 255 * shade;
    image.data[pixel * 4 + 1] = color.g * 255 * shade;
    image.data[pixel * 4 + 2] = color.b * 255 * shade;
    image.data[pixel * 4 + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(source);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const grassTexture = noiseTexture([0x1c3828, 0x294b31, 0x35583a, 0x172d22]);
grassTexture.repeat.set(18, 34);
const ballastTexture = noiseTexture([0x5c5a53, 0x77736a, 0x464843, 0x918b7e]);
ballastTexture.repeat.set(4, 60);
const woodTexture = noiseTexture([0x2a2019, 0x453126, 0x604130, 0x1f1814]);
woodTexture.repeat.set(6, 1);

function leafTexture() {
  const surface = document.createElement('canvas');
  surface.width = surface.height = 192;
  const context = surface.getContext('2d');
  for (let leaf = 0; leaf < 95; leaf += 1) {
    const x = 18 + Math.random() * 156;
    const y = 18 + Math.random() * 156;
    const width = 5 + Math.random() * 11;
    const height = 10 + Math.random() * 19;
    context.save();
    context.translate(x, y);
    context.rotate(Math.random() * Math.PI);
    context.fillStyle = ['#214d2d', '#2d6838', '#397946', '#173a24'][leaf % 4];
    context.beginPath();
    context.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const foliageCards = new THREE.MeshStandardMaterial({ map: leafTexture(), transparent: true, alphaTest: 0.18, side: THREE.DoubleSide, roughness: 1 });

function mesh(geometry, material, parent, position, rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  parent.add(item);
  return item;
}

function blueTrainTexture(sourceTexture) {
  const image = sourceTexture.image;
  if (!image?.width || !image?.height) return sourceTexture;
  const surface = document.createElement('canvas');
  surface.width = image.width;
  surface.height = image.height;
  const context = surface.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, surface.width, surface.height);
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const red = pixels.data[offset];
    const green = pixels.data[offset + 1];
    const blue = pixels.data[offset + 2];
    if (green > red * 1.12 && green > blue * 1.08 && green > 45) {
      const light = Math.max(red, green, blue);
      pixels.data[offset] = light * 0.1;
      pixels.data[offset + 1] = light * 0.42;
      pixels.data[offset + 2] = Math.min(255, light * 1.18);
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
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
  const recoloredMaps = new Map();
  model.traverse((item) => {
    if (!item.isMesh) return;
    item.castShadow = true;
    item.receiveShadow = true;
    if (item.material) {
      item.material = item.material.clone();
      item.material.envMapIntensity = 0.9;
      if (item.material.map) {
        if (!recoloredMaps.has(item.material.map)) recoloredMaps.set(item.material.map, blueTrainTexture(item.material.map));
        item.material.map = recoloredMaps.get(item.material.map);
        item.material.needsUpdate = true;
      }
    }
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
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: 0x4f7849, roughness: 1 });
const ballastMaterial = new THREE.MeshStandardMaterial({ map: ballastTexture, color: 0xb0aaa0, roughness: 0.98 });
const sleeperMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, color: 0x8b6b53, roughness: 0.9 });
const ground = mesh(new THREE.PlaneGeometry(110, 220, 1, 1), grassMaterial, scene, [0, -0.08, -38], [-Math.PI / 2, 0, 0]);
ground.receiveShadow = true;
mesh(new THREE.BoxGeometry(5.9, 0.34, 180), ballastMaterial, scene, [0, -0.02, -38]);
for (const x of [-1.08, 1.08]) mesh(new THREE.BoxGeometry(0.13, 0.14, 180), steel, scene, [x, 0.12, -38]);

for (let z = -105; z < 48; z += 1.35) {
  const sleeper = mesh(new THREE.BoxGeometry(4.15, 0.14, 0.32), sleeperMaterial, scene, [0, 0.045, z]);
  for (const x of [-1.28, -0.88, 0.88, 1.28]) {
    mesh(new THREE.BoxGeometry(0.16, 0.09, 0.18), steel, sleeper, [x, 0.11, 0]);
  }
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

const treeColors = [mat(0x153c25, 0, 1), mat(0x20532f, 0, 0.98), mat(0x2b6638, 0, 0.96), mat(0x12321f, 0, 1)];
for (let z = -108; z < 44; z += 4.6) {
  for (const side of [-1, 1]) {
    const tree = new THREE.Group();
    const distance = 6.8 + Math.random() * 22;
    const height = 0.68 + Math.random() * 0.72;
    tree.position.set(side * distance, 0, z + Math.random() * 3);
    scene.add(tree);
    mesh(new THREE.CylinderGeometry(0.14 * height, 0.32 * height, 4.5 * height, 10), rust, tree, [0, 2.25 * height, 0]);
    for (const branch of [-1, 1]) {
      mesh(new THREE.CylinderGeometry(0.06 * height, 0.11 * height, 2.5 * height, 7), rust, tree, [branch * 0.72 * height, 4.1 * height, 0], [0, 0, branch * 0.72]);
    }
    const crown = [[0, 5.8, 0, 2.35], [-1.25, 5.2, 0.25, 1.65], [1.2, 5.35, -0.25, 1.75], [-0.55, 7.05, -0.35, 1.75], [0.85, 6.8, 0.5, 1.55], [0, 8.1, 0, 1.25]];
    crown.forEach(([x, y, crownZ, radius], index) => {
      const leaves = mesh(new THREE.IcosahedronGeometry(radius * height, 2), treeColors[(index + Math.floor(Math.random() * treeColors.length)) % treeColors.length], tree, [x * height, y * height, crownZ * height]);
      leaves.scale.set(1 + Math.random() * 0.2, 0.82 + Math.random() * 0.28, 0.9 + Math.random() * 0.18);
    });
    for (const rotation of [0, Math.PI / 3, -Math.PI / 3]) {
      mesh(new THREE.PlaneGeometry(5.6 * height, 5.2 * height), foliageCards, tree, [0, 6.25 * height, 0], [0, rotation, 0]);
    }
    tree.rotation.y = Math.random() * Math.PI;
    tree.userData.loop = 153;
    moving.push(tree);
  }
}

const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x5f8d4b, side: THREE.DoubleSide, roughness: 1 });
for (let z = -105; z < 46; z += 2.8) {
  for (const side of [-1, 1]) {
    const patch = new THREE.Group();
    patch.position.set(side * (3.35 + Math.random() * 11), 0, z);
    scene.add(patch);
    for (let blade = 0; blade < 20; blade += 1) {
      const height = 0.22 + Math.random() * 0.52;
      mesh(new THREE.PlaneGeometry(0.07, height), bladeMaterial, patch, [(Math.random() - 0.5) * 2.8, height / 2, (Math.random() - 0.5) * 2.5], [0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.22]);
    }
    if (Math.random() > 0.35) {
      mesh(new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.7, 1), treeColors[Math.floor(Math.random() * treeColors.length)], patch, [(Math.random() - 0.5) * 2.4, 0.35, 0]);
    }
    patch.userData.loop = 153;
    moving.push(patch);
  }
}

for (let z = -92; z < 42; z += 19) {
  const lampPost = new THREE.Group();
  lampPost.position.set(z % 38 ? 5.3 : -5.3, 0, z);
  scene.add(lampPost);
  mesh(new THREE.CylinderGeometry(0.07, 0.12, 5.8, 10), black, lampPost, [0, 2.9, 0]);
  mesh(new THREE.BoxGeometry(1.25, 0.08, 0.08), black, lampPost, [lampPost.position.x > 0 ? -0.55 : 0.55, 5.65, 0]);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffdf8a, emissive: 0xffa928, emissiveIntensity: 9 }));
  bulb.position.set(lampPost.position.x > 0 ? -1.12 : 1.12, 5.54, 0);
  lampPost.add(bulb);
  const light = new THREE.PointLight(0xffb52f, 34, 19, 1.7);
  light.position.copy(bulb.position);
  light.castShadow = true;
  lampPost.add(light);
  lampPost.userData.loop = 153;
  moving.push(lampPost);
}

const starsGeometry = new THREE.BufferGeometry();
const stars = [];
for (let index = 0; index < 700; index += 1) stars.push((Math.random() - 0.5) * 160, 18 + Math.random() * 55, -110 + Math.random() * 170);
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xaccde8, size: 0.08, transparent: true, opacity: 0.75 })));

scene.add(new THREE.HemisphereLight(0x264b78, 0x07110b, 0.72));
scene.add(new THREE.AmbientLight(0x18304b, 0.24));
const moon = new THREE.DirectionalLight(0x7ba7da, 1.45);
moon.position.set(-8, 15, 8);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.left = -24;
moon.shadow.camera.right = 24;
moon.shadow.camera.top = 24;
moon.shadow.camera.bottom = -24;
moon.shadow.bias = -0.00035;
scene.add(moon);
const warm = new THREE.DirectionalLight(0xffb534, 1.35);
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
