import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const cursor = document.querySelector('.ponteiro');
window.addEventListener('pointermove', event => {
  cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`;
  cursor.classList.toggle('is-link', Boolean(event.target.closest('a,button')));
});

const menuButton = document.querySelector('.barra__menu');
const menu = document.getElementById('menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open)); menu.classList.toggle('is-open', !open); menu.setAttribute('aria-hidden', String(open));
});
menu.addEventListener('click', event => { if (event.target.closest('a')) menuButton.click(); });
document.getElementById('entrarEspaco').addEventListener('click', () => document.getElementById('orbita').scrollIntoView({ behavior: 'smooth', block: 'center' }));
document.querySelectorAll('.trilha').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.trilha').forEach(other => other.classList.remove('is-open')); item.classList.add('is-open');
}));

const canvas = document.getElementById('brasiliumScene');
const holder = document.getElementById('orbita');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101816); scene.fog = new THREE.FogExp2(0x101816, .055);
const camera = new THREE.PerspectiveCamera(48, 1, .1, 60); camera.position.set(0,0,8.5);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 800 ? 1.3 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene,camera)); composer.addPass(new UnrealBloomPass(new THREE.Vector2(1,1),1.25,.65,.18));

const structure = new THREE.Group(); scene.add(structure);
const acid = new THREE.MeshStandardMaterial({ color: 0xb8ff36, emissive: 0x4d8500, emissiveIntensity: 1.8, metalness: .55, roughness: .22 });
const glass = new THREE.MeshPhysicalMaterial({ color: 0x91e4c5, transmission: .35, transparent: true, opacity: .68, metalness: .25, roughness: .15 });
const dark = new THREE.MeshStandardMaterial({ color: 0x193c31, emissive: 0x06261d, emissiveIntensity: .8, metalness: .65, roughness: .28 });
const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.31,220,28,2,5),acid); structure.add(knot);
const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.25,2),new THREE.MeshBasicMaterial({color:0x4bd6a2,wireframe:true,transparent:true,opacity:.22})); structure.add(shell);
const windows=[];
for(let index=0;index<7;index+=1){const panel=new THREE.Mesh(new THREE.BoxGeometry(1.6,.92,.07),index%2?glass:dark);const angle=index/7*Math.PI*2;panel.position.set(Math.cos(angle)*3.2,Math.sin(angle)*2.2,(index%3-1)*.7);panel.rotation.set(-angle*.16,angle+.2,angle*.12);structure.add(panel);windows.push(panel);}
const pointData=new Float32Array(1800*3);for(let i=0;i<1800;i+=1){pointData[i*3]=(Math.random()-.5)*18;pointData[i*3+1]=(Math.random()-.5)*14;pointData[i*3+2]=(Math.random()-.5)*22;}
const pointsGeometry=new THREE.BufferGeometry();pointsGeometry.setAttribute('position',new THREE.BufferAttribute(pointData,3));const points=new THREE.Points(pointsGeometry,new THREE.PointsMaterial({color:0x83d8ba,size:.025,transparent:true,opacity:.62}));scene.add(points);
scene.add(new THREE.HemisphereLight(0xdffff5,0x062019,2.2));const lamp=new THREE.PointLight(0xb8ff36,70,18);lamp.position.set(3,3,5);scene.add(lamp);

const pointer=new THREE.Vector2();const target=new THREE.Vector2();let dragging=false;let mode=0;const modes=['PRIVATE SPACE','MEMORY FIELD','VELOCITY CORE'];
holder.addEventListener('pointermove',event=>{const rect=holder.getBoundingClientRect();target.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));if(dragging){structure.rotation.y+=event.movementX*.008;structure.rotation.x+=event.movementY*.006;}});
holder.addEventListener('pointerdown',event=>{dragging=true;holder.setPointerCapture?.(event.pointerId);});holder.addEventListener('pointerup',()=>dragging=false);
holder.addEventListener('click',()=>{mode=(mode+1)%modes.length;document.getElementById('modoAtual').textContent=modes[mode];windows.forEach((panel,index)=>panel.material.emissiveIntensity=index%3===mode?2:.8);});
const resize=()=>{const width=holder.clientWidth,height=holder.clientHeight;renderer.setSize(width,height,false);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(holder);resize();
const clock=new THREE.Clock();const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
renderer.setAnimationLoop(()=>{const time=clock.getElapsedTime();pointer.lerp(target,.05);camera.position.x+=(pointer.x*.7-camera.position.x)*.035;camera.position.y+=(pointer.y*.45-camera.position.y)*.035;camera.lookAt(0,0,0);if(motion&&!dragging){structure.rotation.y+=.0035;knot.rotation.x=time*.11;knot.rotation.z=time*.08;shell.rotation.y=-time*.075;points.rotation.y=time*.009;}windows.forEach((panel,index)=>panel.position.z+=((Math.sin(time*.7+index)*.18+(index%3-1)*.7)-panel.position.z)*.035);composer.render();});
