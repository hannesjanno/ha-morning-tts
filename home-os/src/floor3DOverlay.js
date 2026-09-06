import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SCALE = 0.01;
const WALL_H = 2.45;
const WALL_T = 0.10;

const roomPolygons = [
  { id:'living', points:[[0,1049.9],[480.8,1049.9],[480.8,892.73],[480.8,700],[480.8,536.22],[480.8,325.28],[480.8,269.1],[290.25,269.1],[224.14,269.1],[0,269.1]], color:0x41372d },
  { id:'kitchen', points:[[224.14,269.1],[290.25,269.1],[290.25,0],[0,0],[0,269.1]], color:0x4b4034 },
  { id:'hall', points:[[480.8,269.1],[480.8,157.47],[480.8,0],[290.25,0],[290.25,269.1]], color:0x453b31 },
  { id:'utility', points:[[790.31,325.28],[790.31,157.47],[480.8,157.47],[480.8,269.1],[480.8,325.28],[599.74,325.28]], color:0x33383d },
  { id:'wc', points:[[599.74,325.28],[480.8,325.28],[480.8,536.22],[599.74,536.22]], color:0x3d4246 },
  { id:'sauna', points:[[599.74,530.64],[790.31,530.64],[790.31,325.28],[599.74,325.28]], color:0x4b3827 },
  { id:'wash', points:[[480.8,536.22],[480.8,892.73],[790.31,892.73],[790.31,530.64],[599.74,530.64],[599.74,536.22]], color:0x353b40 },
];

function px(v){ return v * SCALE; }
function mat(color, roughness=.8, metalness=.05){ return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }

function addBox(group, x, y, w, d, h, color, z=0, opts={}) {
  const geo = new THREE.BoxGeometry(px(w), h, px(d));
  const mesh = new THREE.Mesh(geo, mat(color, opts.roughness ?? .8, opts.metalness ?? .04));
  mesh.position.set(px(x+w/2), z+h/2, px(y+d/2));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(group, x, y, radius, h, color, z=0, segments=32){
  const geo = new THREE.CylinderGeometry(px(radius), px(radius), h, segments);
  const mesh = new THREE.Mesh(geo, mat(color));
  mesh.position.set(px(x), z+h/2, px(y));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addFloorShape(group, points, color){
  const shape = new THREE.Shape();
  points.forEach(([x,y],i)=>{ if(i===0) shape.moveTo(px(x), px(y)); else shape.lineTo(px(x), px(y)); });
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI/2);
  const mesh = new THREE.Mesh(geo, mat(color, .95, 0));
  mesh.position.y = 0.01;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function addWall(group, x1, y1, x2, y2, h=WALL_H, color=0x8b9198){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  if(len < .01) return;
  const geo=new THREE.BoxGeometry(len,h,WALL_T);
  const mesh=new THREE.Mesh(geo,mat(color,.92,0));
  mesh.position.set(px((x1+x2)/2),h/2,px((y1+y2)/2));
  mesh.rotation.y=-Math.atan2(dz,dx);
  mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh);
}

function addWindow(group,x1,y1,x2,y2){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  const geo=new THREE.BoxGeometry(len,1.05,.035);
  const material=new THREE.MeshPhysicalMaterial({color:0x9fc6d7,transparent:true,opacity:.42,roughness:.15,metalness:0,transmission:.35});
  const mesh=new THREE.Mesh(geo,material);
  mesh.position.set(px((x1+x2)/2),1.35,px((y1+y2)/2));
  mesh.rotation.y=-Math.atan2(dz,dx);
  group.add(mesh);
}

function createHouse3D(scene){
  const g=new THREE.Group();
  scene.add(g);
  roomPolygons.forEach(r=>addFloorShape(g,r.points,r.color));

  // exterior walls, split around openings so the 3D follows the 2D plan
  addWall(g,0,0,64,0); addWall(g,184,0,350,0); addWall(g,424,0,480.8,0);
  addWall(g,0,0,0,1049.9); addWall(g,0,1049.9,90,1049.9); addWall(g,195,1049.9,480.8,1049.9);
  addWall(g,480.8,0,480.8,42); addWall(g,480.8,128,480.8,157.47);
  addWall(g,480.8,157.47,790.31,157.47);
  addWall(g,790.31,157.47,790.31,205); addWall(g,790.31,273,790.31,378); addWall(g,790.31,444,790.31,892.73);
  addWall(g,480.8,892.73,620,892.73); addWall(g,715,892.73,790.31,892.73);
  addWall(g,480.8,892.73,480.8,930); addWall(g,480.8,1025,480.8,1049.9);

  // interior walls / door gaps
  addWall(g,290.25,0,290.25,188); // kitchen-hall, passage below
  addWall(g,170,269.1,290.25,269.1);
  addWall(g,480.8,157.47,480.8,188); addWall(g,480.8,260,480.8,390); addWall(g,480.8,462,480.8,598); addWall(g,480.8,696,480.8,892.73);
  addWall(g,599.74,325.28,599.74,530.64);
  addWall(g,599.74,530.64,640,530.64); addWall(g,712,530.64,790.31,530.64);

  // windows from 2D plan
  [[64,0,184,0],[350,0,424,0],[790.31,205,790.31,273],[790.31,378,790.31,444],[188,1049.9,400,1049.9]].forEach(w=>addWindow(g,...w));

  // terrace
  addBox(g,0,1070,480.8,92,.07,0x7c5d40,0);
  addBox(g,480.8,892.73,499.2,177.27,.07,0x7c5d40,0);
  addBox(g,480.8,1162,499.2,98,.07,0x7c5d40,0);

  // stairs
  const stairMat=0x6e5945;
  for(let i=0;i<8;i++){
    const w=31; const h=.09+i*.055;
    addBox(g,10+i*31,414,w,92,h,stairMat,0);
    addBox(g,10+(7-i)*31,550,w,92,.09+i*.055,stairMat,0);
  }

  // fireplace
  addBox(g,375.8,705,105,120,1.25,0x2b2e31,0);
  addBox(g,389,724,78,46,.42,0x151719,.22,{metalness:.3});

  // kitchen L and tall cabinets
  addBox(g,0,0,224,58,.9,0x9ba792,0);
  addBox(g,224,0,58,188,.9,0x9ba792,0);
  addBox(g,224,188,58,81,2.15,0x899583,0);
  addBox(g,224,269.1,58,26,1.65,0x899583,0);
  // sink + hob + table/chairs
  addBox(g,82,10,66,38,.05,0xb8c1c5,.91);
  addBox(g,234,133,38,55,.04,0x202326,.91,{metalness:.45});
  addBox(g,22,145,150,62,.82,0x8b6a48,0);
  [[38,228],[94,228],[150,228]].forEach(([x,y])=>addCylinder(g,x,y,18,.46,0x25282c,0));
  // wine rack
  addBox(g,8,6,38,46,1.55,0x594638,.92);

  // entry bench
  addBox(g,300,8,112,32,.48,0x72593f,0);

  // living sofa
  addBox(g,4,660,286,62,.72,0xc1b7a8,0);
  addBox(g,4,660,58,190,.72,0xc1b7a8,0);
  // dining table against right side + 3 chairs
  addCylinder(g,432,875,44,.72,0x76573c,0);
  [[372,875],[400,932],[456,935]].forEach(([x,y])=>addCylinder(g,x,y,18,.48,0x3f5145,0));
  // TV & cabinet
  addBox(g,8,990,88,28,.48,0x49392e,0);
  addBox(g,6,1027,92,10,.72,0x111315,.82,{metalness:.25});
  // robot + dock
  addBox(g,4,348,20,48,.42,0x30343a,0);
  addCylinder(g,45,374,19,.12,0x24272b,0);

  // WC room fixtures
  addBox(g,497,338,86,46,.78,0x817565,0);
  addCylinder(g,540,360,18,.10,0xd2d6d8,.79);
  addBox(g,493,508,94,24,.95,0xb8bcc0,0);
  addBox(g,519,470,42,38,.48,0xd3d6d8,0);

  // sauna bench + heater
  addBox(g,724,338,54,178,.64,0x8b6845,0);
  addBox(g,614,338,48,48,.76,0x35383b,0);
  [[626,350],[642,350],[634,365],[650,365]].forEach(([x,y])=>addCylinder(g,x,y,5,.10,0x777b7f,.76));

  // washroom: shower, divider, dog bath, washing machine
  addBox(g,690,548,88,72,.05,0x7e969e,0);
  addWall(g,685,630,785,630,1.85,0xa8adb2);
  addBox(g,690,640,88,86,.72,0x848d91,0);
  addBox(g,705,817,72,68,.86,0xc8cbcd,0);
  addCylinder(g,741,851,22,.04,0x454b50,.87);

  // utility room equipment
  addBox(g,734,168,44,88,1.8,0x4a4e52,0);
  addBox(g,734,267,44,49,1.35,0xb4b8ba,0);
  addBox(g,565,236,154,69,.52,0xa4a8aa,1.72);

  return g;
}

function buildViewer(host){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x171b20);
  scene.fog=new THREE.Fog(0x171b20,15,30);

  const camera=new THREE.PerspectiveCamera(42,1,.1,100);
  camera.position.set(10.5,13.5,14.5);

  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  host.appendChild(renderer.domElement);

  const hemi=new THREE.HemisphereLight(0xdce6ee,0x25292d,2.0); scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffffff,3.2); sun.position.set(-8,15,-6); sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-12; sun.shadow.camera.right=12; sun.shadow.camera.top=12; sun.shadow.camera.bottom=-12; scene.add(sun);

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(26,26),mat(0x20252b,.98,0));
  ground.rotation.x=-Math.PI/2; ground.position.y=-.025; ground.receiveShadow=true; scene.add(ground);

  createHouse3D(scene);

  const controls=new OrbitControls(camera,renderer.domElement);
  controls.target.set(4.1,0.45,5.15);
  controls.enableDamping=true;
  controls.dampingFactor=.07;
  controls.minDistance=7; controls.maxDistance=28;
  controls.maxPolarAngle=Math.PI/2.08;
  controls.update();

  const resize=()=>{
    const w=Math.max(300,host.clientWidth); const h=Math.max(420,Math.min(720,w*.72));
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  };
  const ro=new ResizeObserver(resize); ro.observe(host); resize();
  let raf=0,disposed=false;
  const loop=()=>{ if(disposed)return; controls.update(); renderer.render(scene,camera); raf=requestAnimationFrame(loop); };
  loop();

  return ()=>{ disposed=true; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); host.replaceChildren(); };
}

function activeFloor(){
  const active=document.querySelector('.floor-switch button.active');
  return active?.textContent?.trim().startsWith('1') ? 1 : 2;
}

export function installFloor3DOverlay(){
  const root=document.getElementById('root');
  if(!root) return ()=>{};
  let cleanupViewer=null;

  const sync=()=>{
    const panel=document.querySelector('.floor-panel');
    const head=panel?.querySelector('.panel-head');
    const floorPlan=panel?.querySelector('.floor-plan');
    if(!panel||!head||!floorPlan) return;

    let toggle=head.querySelector('[data-view-toggle]');
    if(!toggle){
      toggle=document.createElement('div');
      toggle.dataset.viewToggle='true';
      toggle.style.cssText='display:flex;gap:6px;margin-left:auto;align-items:center;';
      const b2=document.createElement('button'); b2.type='button'; b2.textContent='2D'; b2.dataset.mode='2d';
      const b3=document.createElement('button'); b3.type='button'; b3.textContent='3D'; b3.dataset.mode='3d';
      [b2,b3].forEach(b=>{b.style.cssText='border:1px solid rgba(226,234,242,.18);background:#1c232b;color:#cbd4dc;border-radius:9px;padding:8px 11px;font:600 12px/1 system-ui;cursor:pointer;';});
      b2.style.background='#313b46';
      toggle.append(b2,b3);
      head.appendChild(toggle);

      const setMode=(mode)=>{
        const floor=activeFloor();
        if(mode==='3d'&&floor!==1) return;
        const view=panel.querySelector('[data-floor-3d]');
        const show3d=mode==='3d';
        floorPlan.style.display=show3d?'none':'';
        if(view) view.style.display=show3d?'block':'none';
        b2.style.background=show3d?'#1c232b':'#313b46';
        b3.style.background=show3d?'#313b46':'#1c232b';
        if(show3d&&view&&!cleanupViewer) cleanupViewer=buildViewer(view);
      };
      b2.addEventListener('click',()=>setMode('2d'));
      b3.addEventListener('click',()=>setMode('3d'));
    }

    let view=panel.querySelector('[data-floor-3d]');
    if(!view){
      view=document.createElement('div');
      view.dataset.floor3d='true';
      view.style.cssText='display:none;position:relative;overflow:hidden;border-radius:14px;background:#171b20;min-height:420px;';
      const hint=document.createElement('div');
      hint.textContent='Lohista: pööra · rullik/pinch: zoom';
      hint.style.cssText='position:absolute;left:14px;bottom:12px;z-index:2;background:rgba(18,22,27,.78);border:1px solid rgba(226,234,242,.15);border-radius:9px;padding:7px 10px;color:#9ba8b4;font:500 11px/1.2 system-ui;pointer-events:none;';
      view.appendChild(hint);
      floorPlan.insertAdjacentElement('afterend',view);
    }

    const b3=toggle.querySelector('[data-mode="3d"]');
    const floor=activeFloor();
    b3.disabled=floor!==1;
    b3.title=floor===1?'Ava 1. korruse interaktiivne 3D-plaan':'2. korruse 3D lisame järgmise etapina';
    b3.style.opacity=floor===1?'1':'.45';
    b3.style.cursor=floor===1?'pointer':'not-allowed';
    if(floor!==1&&view.style.display!=='none'){
      view.style.display='none'; floorPlan.style.display='';
      toggle.querySelector('[data-mode="2d"]').style.background='#313b46';
      b3.style.background='#1c232b';
    }
  };

  sync();
  const observer=new MutationObserver(sync); observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  return ()=>{ observer.disconnect(); cleanupViewer?.(); };
}
