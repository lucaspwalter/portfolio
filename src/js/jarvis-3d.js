import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function iniciarJarvis3D(container) {
  const canvas = container.querySelector('.jarvis-canvas');
  if (!canvas || !window.WebGLRenderingContext) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050204, 0.075);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 8.8);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.4 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.75, 0.55, 0.08);
  composer.addPass(bloom);

  const red = new THREE.MeshStandardMaterial({ color: 0xff281e, emissive: 0xa40703, emissiveIntensity: 3.2, metalness: .72, roughness: .2 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xffcf62, emissive: 0x8a4300, emissiveIntensity: 2.4, metalness: .85, roughness: .14 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x170607, metalness: .9, roughness: .22, wireframe: true, transparent: true, opacity: .62 });
  const core = new THREE.Group();
  scene.add(core);

  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 5), red);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 2), dark);
  core.add(orb, shell);
  const rings = [];
  [[2.05,.035,red],[2.45,.022,gold],[2.85,.018,red]].forEach(([radius,tube,material], index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 160), material);
    ring.rotation.set(index * .75, index * .55, index * .9);
    core.add(ring); rings.push(ring);
  });
  for (let index = 0; index < 10; index += 1) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(1.78 + index * .065, .012, 8, 42, Math.PI * (.18 + Math.random() * .38)), index % 3 ? red : gold);
    arc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    core.add(arc); rings.push(arc);
  }

  const count = innerWidth < 700 ? 850 : 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = 3.4 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index * 3 + 2] = radius * Math.cos(phi);
    const bright = Math.random() > .82;
    colors[index * 3] = 1; colors[index * 3 + 1] = bright ? .72 : .08; colors[index * 3 + 2] = bright ? .24 : .04;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ size: .034, vertexColors: true, transparent: true, opacity: .78, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  scene.add(new THREE.AmbientLight(0x3b0908, 1.6));
  const key = new THREE.PointLight(0xff271c, 75, 20); key.position.set(2.5, 2, 4); scene.add(key);
  const rim = new THREE.PointLight(0xffce63, 42, 16); rim.position.set(-3, -2, 2); scene.add(rim);

  const pointer = new THREE.Vector2();
  const target = new THREE.Vector2();
  let dragging = false;
  let charged = false;
  let scrollCharge = 0;
  container.addEventListener('pointerdown', event => { dragging = true; container.setPointerCapture?.(event.pointerId); });
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointermove', event => {
    const rect = container.getBoundingClientRect();
    target.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1));
    if (dragging) { core.rotation.y += event.movementX * .008; core.rotation.x += event.movementY * .006; }
  });
  container.addEventListener('click', () => {
    charged = !charged;
    bloom.strength = charged ? 3.4 : 1.75;
    document.getElementById('jarvisVoice').textContent = charged ? 'LISTENING' : 'STANDBY';
  });

  const resize = () => {
    const width = container.clientWidth; const height = container.clientHeight;
    renderer.setSize(width, height, false); composer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container); resize();

  const clock = new THREE.Clock();
  const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setAnimationLoop(() => {
    const time = clock.getElapsedTime();
    pointer.lerp(target, .055);
    if (motionOK && !dragging) { core.rotation.y += charged ? .009 : .003; core.rotation.x = Math.sin(time * .42) * .13 + pointer.y * .18; }
    core.position.x += (pointer.x * .42 - core.position.x) * .035;
    core.position.y += (pointer.y * .28 - core.position.y) * .035;
    const rect = container.getBoundingClientRect();
    scrollCharge += ((innerHeight - rect.top) / (innerHeight + rect.height) - scrollCharge) * .04;
    core.position.z = (scrollCharge - .5) * 1.2;
    orb.scale.setScalar(1 + Math.sin(time * (charged ? 5 : 2.2)) * (charged ? .11 : .035));
    shell.rotation.y -= .006; shell.rotation.z += .003;
    rings.forEach((ring, index) => { ring.rotation.z += (index % 2 ? -1 : 1) * (.0025 + index * .00025); });
    dust.rotation.y = time * .012; dust.rotation.x = Math.sin(time * .08) * .08;
    const load = 42 + Math.sin(time * 1.7) * 9 + (charged ? 31 : 0);
    const loadElement = document.getElementById('jarvisLoad'); if (loadElement) loadElement.textContent = `${load.toFixed(1)}%`;
    composer.render();
  });
}
