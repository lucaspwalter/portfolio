import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function iniciarBrasilium3D(container) {
  const canvas = container.querySelector('.brasilium-canvas');
  if (!canvas || !window.WebGLRenderingContext) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdcefe7);
  scene.fog = new THREE.Fog(0xdcefe7, 8, 24);
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 50);
  camera.position.set(0, .2, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .55, .65, .72));

  const green = new THREE.MeshPhysicalMaterial({ color: 0x0ca66f, emissive: 0x00613f, emissiveIntensity: .42, metalness: .15, roughness: .16, transmission: .12, transparent: true, opacity: .94 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xeafff5, metalness: .02, roughness: .08, transmission: .68, thickness: 1.2, transparent: true, opacity: .78 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x143b2e, metalness: .42, roughness: .25 });
  const world = new THREE.Group(); scene.add(world);

  const portal = new THREE.Mesh(new THREE.TorusGeometry(2.15, .1, 20, 140), green);
  portal.rotation.x = Math.PI / 2.35; portal.position.set(1.4, .15, -.2); world.add(portal);
  const inner = new THREE.Mesh(new THREE.TorusKnotGeometry(.82, .18, 180, 20, 2, 3), dark);
  inner.position.copy(portal.position); inner.rotation.x = .7; world.add(inner);

  const panels = [];
  const panelData = [
    { x: 2.75, y: 1.5, z: .2, scale: [1.7,.92], tone: 0x79e0bb },
    { x: 3.25, y: -.9, z: -.45, scale: [1.4,.78], tone: 0xb4f0d8 },
    { x: .25, y: -1.75, z: -.7, scale: [1.5,.72], tone: 0x55c99f }
  ];
  panelData.forEach((data, index) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(data.scale[0], data.scale[1], .08, 8, 4, 1), index === 0 ? green : glass.clone());
    panel.material.color.setHex(data.tone); panel.position.set(data.x, data.y, data.z); panel.rotation.set(-.12 + index * .08, -.28, -.06 + index * .08);
    panel.userData.index = index; world.add(panel); panels.push(panel);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), new THREE.LineBasicMaterial({ color: 0x217a5c, transparent: true, opacity: .46 })); panel.add(edge);
  });

  const lanes = [];
  for (let index = 0; index < 18; index += 1) {
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.6, 3.8, .04)), new THREE.LineBasicMaterial({ color: index % 4 ? 0x62b697 : 0x0b9b67, transparent: true, opacity: .08 + index * .006 }));
    frame.position.set(1.6, 0, -index * .72 - 1.5); frame.scale.setScalar(1 + index * .035); world.add(frame); lanes.push(frame);
  }

  const particlesGeometry = new THREE.BufferGeometry();
  const count = innerWidth < 700 ? 420 : 900;
  const points = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    points[index * 3] = -3 + Math.random() * 9; points[index * 3 + 1] = -4 + Math.random() * 8; points[index * 3 + 2] = -18 + Math.random() * 21;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0x16885f, size: .025, transparent: true, opacity: .5 })); scene.add(particles);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x2d7058, 3.2));
  const light = new THREE.DirectionalLight(0xffffff, 4.8); light.position.set(-3, 5, 7); scene.add(light);

  const pointer = new THREE.Vector2();
  const target = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let mode = 0;
  const labels = ['FOCUS MODE', 'MEMORY GUARD', 'VELOCITY MODE'];
  const urls = ['brasilium://new-world', 'brasilium://memory-guard', 'brasilium://velocity'];
  container.addEventListener('pointermove', event => {
    const rect = container.getBoundingClientRect();
    target.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1));
  });
  container.addEventListener('click', () => {
    mode = (mode + 1) % 3;
    document.getElementById('brasiliumMode').textContent = labels[mode];
    document.getElementById('brasiliumUrl').textContent = urls[mode];
    container.querySelectorAll('.brasilium-tabs span').forEach((tab, index) => tab.classList.toggle('is-selected', index === mode));
    panels.forEach((panel, index) => { panel.position.z = index === mode ? 1 : -.4 - index * .25; });
  });

  const resize = () => {
    const width = container.clientWidth; const height = container.clientHeight;
    renderer.setSize(width, height, false); composer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container); resize();
  const clock = new THREE.Clock();
  const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setAnimationLoop(() => {
    const time = clock.getElapsedTime(); pointer.lerp(target, .045);
    camera.position.x += (pointer.x * .65 - camera.position.x) * .025;
    camera.position.y += (pointer.y * .38 + .2 - camera.position.y) * .025;
    camera.lookAt(1.1 + pointer.x * .18, pointer.y * .12, 0);
    if (motionOK) { portal.rotation.z = time * .16; inner.rotation.y = time * .22; inner.rotation.z = -time * .13; particles.position.z = (time * .16) % .9; }
    panels.forEach((panel, index) => { panel.rotation.y = -.28 + pointer.x * (.08 + index * .018); panel.position.y += (Math.sin(time * .7 + index) * .045 + panelData[index].y - panel.position.y) * .04; });
    raycaster.setFromCamera(pointer, camera);
    panels.forEach(panel => panel.scale.lerp(new THREE.Vector3(1, 1, 1).multiplyScalar(raycaster.intersectObject(panel).length ? 1.055 : 1), .08));
    composer.render();
  });
}
