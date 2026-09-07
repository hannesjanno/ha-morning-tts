import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SCALE = 0.01;
const WALL_H = 2.45;
const WALL_T = 0.1;

const roomPolygons = [
  { points:[[0,1049.9],[480.8,1049.9],[480.8,892.73],[480.8,700],[480.8,536.22],[480.8,325.28],[480.8,269.1],[290.25,269.1],[224.14,269.1],[0,269.1]], color:0x41372d },
  { points:[[224.14,269.1],[290.25,269.1],[290.25,0],[0,0],[0,269.1]], color:0x4b4034 },
  { points:[[480.8,269.1],[480.8,157.47],[480.8,0],[290.25,0],[290.25,269.1]], color:0x453b31 },
  { points:[[790.31,325.28],[790.31,157.47],[480.8,157.47],[480.8,269.1],[480.8,325.28],[599.74,325.28]], color:0x33383d },
  { points:[[599.74,325.28],[480.8,325.28],[480.8,536.22],[599.74,536.22]], color:0x3d4246 },
  { points:[[599.74,530.64],[790.31,530.64],[790.31,325.28],[599.74,325.28]], color:0x4b3827 },
  { points:[[480.8,536.22],[480.8,892.73],[790.31,892.73],[790.31,530.64],[599.74,530.64],[599.74,536.22]], color:0x353b40 },
];

const px = (v) => v * SCALE;
const material = (color, roughness=.82, metalness=.03) => new THREE.MeshStandardMaterial({color, roughness, metalness});

function addBox(group,x,y,w,d,h,color,z=0,matOverride=null){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(px(w),h,px(d)),matOverride || material(color));
  mesh.position.set(px(x+w/2),z+h/2,px(y+d/2));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(group,x,y,r,h,color,z=0){
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(px(r),px(r),h,32),material(color));
  mesh.position.set(px(x),z+h/2,px(y));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addRod(group,x1,y1,h1,x2,y2,h2,r,color){
  const a = new THREE.Vector3(px(x1),h1,px(y1));
  const b = new THREE.Vector3(px(x2),h2,px(y2));
  const dir = new THREE.Vector3().subVectors(b,a);
  const len = dir.length();
  if(len < .001) return;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,12),material(color,.7,0));
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
  mesh.castShadow = true;
  group.add(mesh);
}

function addFloor(group,points,color){
  const shape = new THREE.Shape();
  points.forEach(([x,y],i)=> i ? shape.lineTo(px(x),px(y)) : shape.moveTo(px(x),px(y)));
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI/2);
  const mesh = new THREE.Mesh(geo,material(color,.96,0));
  mesh.position.y = 0.01;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function addWall(group,x1,y1,x2,y2,h=WALL_H,color=0x8d949b){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  if(len < 0.01) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len,h,WALL_T),material(color,.94,0));
  mesh.position.set(px((x1+x2)/2),h/2,px((y1+y2)/2));
  mesh.rotation.y = -Math.atan2(dz,dx);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function addWindow(group,x1,y1,x2,y2){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(len,1.05,.035),
    new THREE.MeshPhysicalMaterial({color:0x9fc6d7,transparent:true,opacity:.48,roughness:.12,transmission:.25})
  );
  mesh.position.set(px((x1+x2)/2),1.35,px((y1+y2)/2));
  mesh.rotation.y = -Math.atan2(dz,dx);
  group.add(mesh);
}

function addDetailedStairs(g){
  const wood = 0x9b6b3f;
  const white = 0xf0eee8;
  const runner = 0xc8bba9;
  const treadW = 30;
  const flightDepth = 92;

  // Lower flight: open oak treads rising toward the turn.
  for(let i=0;i<8;i++){
    const x = 8 + i*treadW;
    const h = .16 + i*.13;
    addBox(g,x,414,treadW-2,flightDepth,.055,wood,h);
    addBox(g,x+3,430,treadW-8,60,.025,runner,h+.056);
  }

  // Turning platform and upper return flight.
  addBox(g,246,414,38,228,.07,wood,1.12);
  for(let i=0;i<8;i++){
    const x = 246 - i*treadW;
    const h = 1.22 + i*.16;
    addBox(g,x,550,treadW-2,92,.055,wood,h);
    addBox(g,x+3,566,treadW-8,60,.025,runner,h+.056);
  }

  // White stringers beneath both runs.
  addRod(g,8,414,.05,246,414,1.05,.055,white);
  addRod(g,8,506,.05,246,506,1.05,.055,white);
  addRod(g,246,550,1.08,8,550,2.35,.055,white);
  addRod(g,246,642,1.08,8,642,2.35,.055,white);

  // Newel posts, balusters and oak handrails on exposed edges.
  const lowerRailY = 506;
  for(let i=0;i<=8;i++){
    const x = 8 + i*treadW;
    const base = .16 + Math.min(i,7)*.13;
    addBox(g,x,lowerRailY,5,5,.88,white,base);
  }
  addRod(g,10,lowerRailY,1.02,248,lowerRailY,2.02,.035,wood);

  const upperRailY = 642;
  for(let i=0;i<=8;i++){
    const x = 246 - i*treadW;
    const base = 1.22 + Math.min(i,7)*.16;
    addBox(g,x,upperRailY,5,5,.88,white,base);
  }
  addRod(g,248,upperRailY,2.08,10,upperRailY,3.32,.035,wood);

  addBox(g,4,lowerRailY-2,8,8,1.02,white,0);
  addBox(g,244,lowerRailY-2,8,8,1.95,white,.08);
  addBox(g,244,upperRailY-2,8,8,1.25,white,1.05);
}

function addDetailedKitchen(g){
  const mint = 0x7fa991;
  const mintDark = 0x658b78;
  const white = 0xf2f0ea;
  const wood = 0x9a704c;
  const darkWood = 0x6f432b;
  const black = 0x17191b;

  // Base cabinets keep the exact 2D L footprint.
  addBox(g,0,0,224,58,.86,mint);
  addBox(g,224,0,58,188,.86,mint);

  // Light natural-wood worktops.
  addBox(g,0,0,224,58,.055,wood,.86);
  addBox(g,224,0,58,188,.055,wood,.86);

  // Panel lines on the mint doors/drawers.
  [8,58,108,158].forEach(x=>addBox(g,x,56,42,2,.62,mintDark,.12));
  [12,58,104,150].forEach(y=>addBox(g,224,y,2,34,.62,mintDark,.12));

  // Tall right-hand cabinet tower with black oven.
  addBox(g,224,188,58,81,2.2,mint);
  addBox(g,233,199,40,36,.58,black,.92);
  addBox(g,236,204,34,28,.02,0x262a2d,1.03);
  addBox(g,224,269.1,58,26,1.68,mint);

  // Upper cabinets visible in the reference photo.
  addBox(g,212,10,12,72,1.02,white,1.26);
  addBox(g,224,20,58,58,.95,white,1.25);
  addBox(g,224,82,58,66,.95,mint,1.25);

  // Black inset sink and faucet under the window.
  addBox(g,82,10,66,38,.035,black,.92);
  addBox(g,90,16,50,25,.02,0x24282b,.935);
  addRod(g,145,30,.95,145,30,1.22,.018,0x303336);
  addRod(g,145,30,1.22,132,30,1.22,.018,0x303336);

  // Hob on the right-hand worktop.
  addBox(g,234,133,38,55,.035,black,.92);
  [[244,146],[261,146],[244,173],[261,173]].forEach(([x,y])=>addCylinder(g,x,y,7,.015,0x313539,.955));

  // Wall wine rack from the real kitchen.
  addBox(g,8,6,38,46,1.55,white,.92);
  for(let i=0;i<4;i++) addRod(g,10,10+i*11,1.02,44,44-i*11,1.42,.018,0x8d8d88);

  // High dining table: dark natural timber top, black steel legs.
  addBox(g,22,145,150,62,.09,darkWood,.84);
  [[28,151],[158,151],[28,195],[158,195]].forEach(([x,y])=>addBox(g,x,y,5,5,.82,black,.02));

  // Three black chairs with light wooden legs.
  [[38,228],[94,228],[150,228]].forEach(([x,y])=>{
    addBox(g,x-17,y-17,34,34,.08,black,.46);
    addBox(g,x-17,y+13,34,5,.44,black,.48);
    [[x-13,y-13],[x+13,y-13],[x-13,y+13],[x+13,y+13]].forEach(([lx,ly])=>addRod(g,lx,ly,.05,lx,ly,.46,.014,0x8c6541));
  });
}

function addDetailedSofa(g){
  const fabric = 0xd8d4cd;
  const cushion = 0xe5e2dc;
  const seam = 0xc4beb5;

  // Low L-shaped base matching the established 2D footprint.
  addBox(g,5,670,285,58,.28,fabric,.05);
  addBox(g,5,670,58,190,.28,fabric,.05);

  // Three separate seat cushions on the long section.
  [[64,674,68,50],[134,674,68,50],[204,674,68,50]].forEach(([x,y,w,d])=>{
    addBox(g,x,y,w,d,.16,cushion,.31);
    addBox(g,x+2,y+d-2,w-4,2,.02,seam,.47);
  });

  // Chaise/left section cushions.
  [[9,730,50,58],[9,790,50,58]].forEach(([x,y,w,d])=>addBox(g,x,y,w,d,.16,cushion,.31));

  // Back cushions along the rear edge of the long section.
  [[65,666,65,14],[134,666,65,14],[203,666,65,14]].forEach(([x,y,w,d])=>addBox(g,x,y,w,d,.52,cushion,.45));

  // Back cushions on the return section.
  [[1,724,14,58],[1,784,14,58]].forEach(([x,y,w,d])=>addBox(g,x,y,w,d,.52,cushion,.45));

  // Broad rounded-looking arms approximated with low blocks.
  addBox(g,274,668,18,62,.58,fabric,.10);
  addBox(g,3,846,62,18,.58,fabric,.10);
}

function buildHouse(scene){
  const g = new THREE.Group();
  scene.add(g);
  roomPolygons.forEach(r=>addFloor(g,r.points,r.color));

  // Exterior walls with openings.
  addWall(g,0,0,64,0); addWall(g,184,0,350,0); addWall(g,424,0,480.8,0);
  addWall(g,0,0,0,1049.9); addWall(g,0,1049.9,90,1049.9); addWall(g,195,1049.9,480.8,1049.9);
  addWall(g,480.8,0,480.8,42); addWall(g,480.8,128,480.8,157.47);
  addWall(g,480.8,157.47,790.31,157.47);
  addWall(g,790.31,157.47,790.31,205); addWall(g,790.31,273,790.31,378); addWall(g,790.31,444,790.31,892.73);
  addWall(g,480.8,892.73,620,892.73); addWall(g,715,892.73,790.31,892.73);
  addWall(g,480.8,892.73,480.8,930); addWall(g,480.8,1025,480.8,1049.9);

  // Interior walls and openings.
  addWall(g,290.25,0,290.25,188);
  addWall(g,170,269.1,290.25,269.1);
  addWall(g,480.8,157.47,480.8,188); addWall(g,480.8,260,480.8,390); addWall(g,480.8,462,480.8,598); addWall(g,480.8,696,480.8,892.73);
  addWall(g,599.74,325.28,599.74,530.64);
  addWall(g,599.74,530.64,640,530.64); addWall(g,712,530.64,790.31,530.64);

  [[64,0,184,0],[350,0,424,0],[790.31,205,790.31,273],[790.31,378,790.31,444],[188,1049.9,400,1049.9]].forEach(w=>addWindow(g,...w));

  // Terrace.
  addBox(g,0,1070,480.8,92,.07,0x76583d);
  addBox(g,480.8,892.73,499.2,177.27,.07,0x76583d);
  addBox(g,480.8,1162,499.2,98,.07,0x76583d);

  addDetailedStairs(g);

  // Fireplace.
  addBox(g,375.8,705,105,120,1.25,0x292d31);

  addDetailedKitchen(g);

  // Entry hall bench.
  addBox(g,300,8,112,32,.48,0x72593f);

  addDetailedSofa(g);

  // Living room dining table + three chairs, TV cabinet and vacuum stay in their 2D positions.
  addCylinder(g,430,870,43,.72,0x76573c);
  [[369,870],[404,934],[454,935]].forEach(([x,y])=>addCylinder(g,x,y,18,.48,0x3f5145));
  addBox(g,4,985,92,28,.48,0x49392e);
  addBox(g,6,1018,86,10,.72,0x111315,.82);
  addBox(g,4,348,20,48,.42,0x30343a);
  addCylinder(g,45,374,19,.12,0x24272b);

  // WC.
  addBox(g,497,338,86,46,.78,0x817565);
  addCylinder(g,540,360,18,.10,0xd2d6d8,.79);
  addBox(g,493,508,94,24,.95,0xb8bcc0);
  addBox(g,519,470,42,38,.48,0xd3d6d8);

  // Sauna.
  addBox(g,724,338,54,178,.64,0x8b6845);
  addBox(g,614,338,48,48,.76,0x35383b);

  // Washroom.
  addBox(g,690,548,88,72,.05,0x7e969e);
  addWall(g,685,630,785,630,1.85,0xa8adb2);
  addBox(g,690,640,88,86,.72,0x848d91);
  addBox(g,705,817,72,68,.86,0xc8cbcd);
  addCylinder(g,741,851,22,.04,0x454b50,.87);

  // Utility room.
  addBox(g,734,168,44,88,1.8,0x4a4e52);
  addBox(g,734,267,44,49,1.35,0xb4b8ba);
  addBox(g,565,236,154,69,.52,0xa4a8aa,1.72);
}

function createViewer(host){
  const width = Math.max(320, host.clientWidth || 900);
  const height = 560;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171b20);

  const camera = new THREE.PerspectiveCamera(42,width/height,.1,100);
  camera.position.set(10.5,13.5,14.5);

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(width,height,false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = `${height}px`;
  host.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe6edf3,0x25292d,2.2));
  const sun = new THREE.DirectionalLight(0xffffff,3.0);
  sun.position.set(-8,15,-6);
  sun.castShadow = true;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(26,26),material(0x20252b,.98,0));
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -.025;
  ground.receiveShadow = true;
  scene.add(ground);

  buildHouse(scene);

  const controls = new OrbitControls(camera,renderer.domElement);
  controls.target.set(4.1,.45,5.15);
  controls.enableDamping = true;
  controls.dampingFactor = .07;
  controls.minDistance = 7;
  controls.maxDistance = 28;
  controls.update();

  let raf = 0;
  let disposed = false;
  const loop = () => {
    if(disposed) return;
    controls.update();
    renderer.render(scene,camera);
    raf = requestAnimationFrame(loop);
  };
  loop();

  const resize = () => {
    const w = Math.max(320,host.clientWidth || width);
    camera.aspect = w/height;
    camera.updateProjectionMatrix();
    renderer.setSize(w,height,false);
  };
  window.addEventListener('resize',resize);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize',resize);
    controls.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function activeFloor(){
  const active = document.querySelector('.floor-switch button.active');
  return active?.textContent?.trim().startsWith('1') ? 1 : 2;
}

export function installFloor3DViewer(){
  const panel = document.querySelector('.floor-panel');
  const head = panel?.querySelector('.panel-head');
  const floorPlan = panel?.querySelector('.floor-plan');
  if(!panel || !head || !floorPlan) return () => {};

  panel.querySelector('[data-view-toggle]')?.remove();
  panel.querySelector('[data-floor-3d]')?.remove();

  const toggle = document.createElement('div');
  toggle.dataset.viewToggle = 'true';
  toggle.style.cssText = 'display:flex;gap:6px;margin-left:auto;align-items:center;';

  const b2 = document.createElement('button');
  b2.type = 'button';
  b2.textContent = '2D';
  b2.style.cssText = 'border:1px solid rgba(226,234,242,.18);background:#313b46;color:#cbd4dc;border-radius:9px;padding:8px 11px;font:600 12px/1 system-ui;cursor:pointer;';

  const b3 = document.createElement('button');
  b3.type = 'button';
  b3.textContent = '3D';
  b3.style.cssText = 'border:1px solid rgba(226,234,242,.18);background:#1c232b;color:#cbd4dc;border-radius:9px;padding:8px 11px;font:600 12px/1 system-ui;cursor:pointer;';

  toggle.append(b2,b3);
  head.appendChild(toggle);

  const view = document.createElement('div');
  view.dataset.floor3d = 'true';
  view.style.cssText = 'display:none;position:relative;width:100%;height:560px;overflow:hidden;border-radius:14px;background:#171b20;';
  floorPlan.insertAdjacentElement('afterend',view);

  let destroyViewer = null;

  const show2D = () => {
    view.style.display = 'none';
    floorPlan.style.display = '';
    b2.style.background = '#313b46';
    b3.style.background = '#1c232b';
  };

  const show3D = () => {
    if(activeFloor() !== 1) return;
    floorPlan.style.display = 'none';
    view.style.display = 'block';
    b2.style.background = '#1c232b';
    b3.style.background = '#313b46';

    if(destroyViewer) return;

    const status = document.createElement('div');
    status.textContent = '3D laadimine…';
    status.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;color:#9ba8b4;font:500 14px system-ui;';
    view.appendChild(status);

    requestAnimationFrame(() => {
      try {
        destroyViewer = createViewer(view);
        status.remove();

        const hint = document.createElement('div');
        hint.textContent = 'Lohista: pööra · rullik/pinch: zoom';
        hint.style.cssText = 'position:absolute;left:14px;bottom:12px;z-index:2;background:rgba(18,22,27,.78);border:1px solid rgba(226,234,242,.15);border-radius:9px;padding:7px 10px;color:#9ba8b4;font:500 11px/1.2 system-ui;pointer-events:none;';
        view.appendChild(hint);
      } catch (err) {
        console.error('Home OS 3D viewer failed',err);
        status.textContent = `3D viga: ${err?.message || err}`;
        status.style.color = '#e3a6a6';
      }
    });
  };

  b2.addEventListener('click',show2D);
  b3.addEventListener('click',show3D);

  const floorButtons = [...document.querySelectorAll('.floor-switch button')];
  const onFloorClick = () => requestAnimationFrame(() => {
    const floor = activeFloor();
    b3.disabled = floor !== 1;
    b3.style.opacity = floor === 1 ? '1' : '.45';
    b3.style.cursor = floor === 1 ? 'pointer' : 'not-allowed';
    if(floor !== 1) show2D();
  });
  floorButtons.forEach(btn=>btn.addEventListener('click',onFloorClick));
  onFloorClick();

  return () => {
    destroyViewer?.();
    b2.removeEventListener('click',show2D);
    b3.removeEventListener('click',show3D);
    floorButtons.forEach(btn=>btn.removeEventListener('click',onFloorClick));
    toggle.remove();
    view.remove();
  };
}
