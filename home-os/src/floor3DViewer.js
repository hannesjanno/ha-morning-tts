import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const SCALE = 0.01;
const WALL_H = 2.45;
const WALL_T = 0.1;
const WALL_COLOR = 0xd8d3ca;

const roomPolygons = [
  { points:[[0,1049.9],[480.8,1049.9],[480.8,892.73],[480.8,700],[480.8,536.22],[480.8,325.28],[480.8,269.1],[290.25,269.1],[224.14,269.1],[0,269.1]], color:0x41372d, floor:'living-oak' },
  { points:[[224.14,269.1],[290.25,269.1],[290.25,0],[0,0],[0,269.1]], color:0x4b4034, floor:'oak-tile' },
  { points:[[480.8,269.1],[480.8,157.47],[480.8,0],[290.25,0],[290.25,269.1]], color:0x453b31, floor:'oak-tile' },
  { points:[[790.31,325.28],[790.31,157.47],[480.8,157.47],[480.8,269.1],[480.8,325.28],[599.74,325.28]], color:0x33383d },
  { points:[[599.74,325.28],[480.8,325.28],[480.8,536.22],[599.74,536.22]], color:0x3d4246 },
  { points:[[599.74,530.64],[790.31,530.64],[790.31,325.28],[599.74,325.28]], color:0x4b3827 },
  { points:[[480.8,536.22],[480.8,892.73],[790.31,892.73],[790.31,530.64],[599.74,530.64],[599.74,536.22]], color:0x353b40 },
];

const px = (v) => v * SCALE;
const material = (color, roughness=.82, metalness=.03) => new THREE.MeshStandardMaterial({color, roughness, metalness});

let oakFloorMaterial = null;
function getOakFloorMaterial(){
  if(oakFloorMaterial) return oakFloorMaterial;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  const plankH = 128;
  const plankColors = ['#c9c0b4','#beb5a9','#d0c8bd','#c4bbb0','#cbc2b7','#b9b0a5'];
  const jointSets = [[320,760],[170,585,930],[420,835],[245,690],[120,530,875],[360,810]];
  const knotSets = [
    [[165,45,10,4],[705,82,6,3]],[[440,74,8,3],[820,42,5,2]],
    [[280,39,7,3],[900,80,9,4]],[[605,52,9,4]],
    [[215,85,7,3],[775,36,5,2]],[[490,70,10,4],[910,46,6,3]],
  ];
  for(let row=0; row<6; row++){
    const y = row * plankH;
    ctx.fillStyle = plankColors[row];
    ctx.fillRect(0,y,1024,plankH);
    ctx.strokeStyle = 'rgba(82,76,70,.16)';
    ctx.lineWidth = .9;
    ctx.beginPath(); ctx.moveTo(0,y+1); ctx.lineTo(1024,y+1); ctx.stroke();
    for(let g=0; g<24; g++){
      const gy = y + 5 + g*4.9 + (row%3)*1.2;
      const bend = (((g+row)%7)-3) * 1.25;
      ctx.strokeStyle = g%5 === 0 ? 'rgba(86,80,74,.12)' : 'rgba(96,89,82,.065)';
      ctx.lineWidth = g%5 === 0 ? .85 : .55;
      ctx.beginPath();
      ctx.moveTo(0,gy);
      ctx.bezierCurveTo(250,gy+bend,480,gy-bend*.8,720,gy+bend*.45);
      ctx.bezierCurveTo(840,gy-bend*.5,940,gy+bend*.25,1024,gy);
      ctx.stroke();
      if(g%8 === 3){
        ctx.strokeStyle = 'rgba(235,231,224,.07)';
        ctx.lineWidth = .55;
        ctx.beginPath(); ctx.moveTo(20,gy+1.8);
        ctx.bezierCurveTo(310,gy-.7,610,gy+2.6,1000,gy+.7); ctx.stroke();
      }
    }
    jointSets[row].forEach(x=>{
      ctx.strokeStyle = 'rgba(74,68,62,.14)'; ctx.lineWidth = .9;
      ctx.beginPath(); ctx.moveTo(x,y+2); ctx.lineTo(x,y+plankH-2); ctx.stroke();
    });
    knotSets[row].forEach(([x,ky,rx,ry])=>{
      const cy = y + ky;
      ctx.fillStyle = 'rgba(60,55,50,.18)';
      ctx.beginPath(); ctx.ellipse(x,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(70,64,58,.22)'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.ellipse(x,cy,rx+3,ry+1.5,0,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle = 'rgba(76,69,62,.10)';
      ctx.beginPath(); ctx.moveTo(x-rx-24,cy-.5);
      ctx.bezierCurveTo(x-rx-8,cy-3,x+rx+12,cy+3.5,x+rx+30,cy+.8); ctx.stroke();
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
  oakFloorMaterial = new THREE.MeshStandardMaterial({color:0xf7f3ed,map:texture,roughness:.88,metalness:0,side:THREE.DoubleSide});
  return oakFloorMaterial;
}

function setLivingRoomOakUVs(geo){
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for(let i=0;i<pos.count;i++){
    uv[i*2] = pos.getY(i) / 2.2;
    uv[i*2+1] = pos.getX(i) / 1.08;
  }
  geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
}

let oakTileMaterial = null;
function getOakTileMaterial(){
  if(oakTileMaterial) return oakTileMaterial;
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const tileW = 128;
  // Nearly uniform warm beige base; the photographed tiles vary subtly rather than forming stripes.
  const tileColors = ['#c9bdad','#cabfae','#c8bdad','#c9beae','#c8bcac','#cabfae'];
  const offsets = [0,180,70,310,145,245];

  for(let col=0; col<6; col++){
    const x = col * tileW;
    ctx.fillStyle = tileColors[col];
    ctx.fillRect(x,0,tileW,1024);
    for(let g=0; g<22; g++){
      const gx = x + 8 + g*5.1 + (col%2)*1.4;
      ctx.strokeStyle = g%5 === 0 ? 'rgba(91,78,65,.16)' : 'rgba(101,87,73,.085)';
      ctx.lineWidth = g%5 === 0 ? .75 : .45;
      ctx.beginPath();
      ctx.moveTo(gx,0);
      ctx.bezierCurveTo(gx+2,260,gx-2,520,gx+1,1024);
      ctx.stroke();
    }
    for(let y=offsets[col]; y<1024; y+=420){
      ctx.strokeStyle = 'rgba(88,76,64,.24)';
      ctx.lineWidth = 1.05;
      ctx.beginPath(); ctx.moveTo(x+1,y); ctx.lineTo(x+tileW-1,y); ctx.stroke();
    }
    [[.31,.22],[.72,.62]].forEach(([fx,fy],idx)=>{
      if((col+idx)%2) return;
      const kx=x+tileW*fx, ky=1024*fy+col*19;
      ctx.strokeStyle='rgba(80,68,57,.14)';
      ctx.lineWidth=.75;
      ctx.beginPath(); ctx.ellipse(kx,ky,7,18,.05,0,Math.PI*2); ctx.stroke();
    });
  }
  ctx.strokeStyle = 'rgba(91,79,67,.24)';
  ctx.lineWidth = 1.05;
  for(let x=0;x<=768;x+=tileW){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1024);ctx.stroke();}

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
  oakTileMaterial = new THREE.MeshStandardMaterial({color:0xf3ede4,map:texture,roughness:.86,metalness:0,side:THREE.DoubleSide});
  return oakTileMaterial;
}

function setOakTileUVs(geo){
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for(let i=0;i<pos.count;i++){
    uv[i*2] = pos.getX(i) / 1.18;
    uv[i*2+1] = pos.getY(i) / 2.35;
  }
  geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
}

let livingRoomRugMaterial = null;
function getLivingRoomRugMaterial(){
  if(livingRoomRugMaterial) return livingRoomRugMaterial;
  const canvas = document.createElement('canvas');
  canvas.width = 768; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#dfd8cc'; ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<2600;i++){
    const x = (i*73 + (i%11)*19) % canvas.width;
    const y = (i*151 + (i%7)*23) % canvas.height;
    const light = i%3 === 0;
    ctx.strokeStyle = light ? 'rgba(248,244,236,.15)' : 'rgba(111,102,91,.08)';
    ctx.lineWidth = .7 + (i%4)*.18;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x + ((i%5)-2)*1.8, y + 3 + (i%4)); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(28,27,25,.88)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for(let x=-520;x<1250;x+=170){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+520,512);ctx.stroke();}
  for(let x=-250;x<1300;x+=170){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-520,512);ctx.stroke();}
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
  livingRoomRugMaterial = new THREE.MeshStandardMaterial({color:0xf3eee5,map:texture,roughness:.99,metalness:0});
  return livingRoomRugMaterial;
}

function addLivingRoomRug(g){
  const rug = new THREE.Mesh(new RoundedBoxGeometry(px(286),.032,px(290),5,.035),getLivingRoomRugMaterial());
  rug.position.set(px(143),.028,px(845));
  rug.receiveShadow = true;
  g.add(rug);
}

function addPhotoDiningTable(g){
  const x = 400;
  const y = 870;
  const whiteTop = new THREE.MeshPhysicalMaterial({color:0xf4f2ed,roughness:.17,metalness:0,clearcoat:.4,clearcoatRoughness:.14});
  const whiteBase = material(0xeeeae3,.38,0);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.31,.31,.055,48),whiteBase);
  foot.position.set(px(x),.045,px(y)); foot.castShadow = true; foot.receiveShadow = true; g.add(foot);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.15,.29,.63,48),whiteBase);
  pedestal.position.set(px(x),.388,px(y)); pedestal.castShadow = true; pedestal.receiveShadow = true; g.add(pedestal);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.052,64),whiteTop);
  top.position.set(px(x),.72,px(y)); top.castShadow = true; top.receiveShadow = true; g.add(top);
}

function addBox(group,x,y,w,d,h,color,z=0,matOverride=null){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(px(w),h,px(d)),matOverride || material(color));
  mesh.position.set(px(x+w/2),z+h/2,px(y+d/2));
  mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
}
function addRoundedBox(group,x,y,w,d,h,color,z=0,radius=.05,rotation={},matOverride=null){
  const maxRadius = Math.max(.006, Math.min(px(w), h, px(d)) * .48);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(px(w),h,px(d),5,Math.min(radius,maxRadius)),matOverride || material(color,.94,0));
  mesh.position.set(px(x+w/2),z+h/2,px(y+d/2));
  mesh.rotation.set(rotation.x || 0,rotation.y || 0,rotation.z || 0);
  mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
}
function addCylinder(group,x,y,r,h,color,z=0){
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(px(r),px(r),h,32),material(color));
  mesh.position.set(px(x),z+h/2,px(y)); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
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
  mesh.castShadow = true; group.add(mesh);
}

function addPhotoDiningChair(g,x,y,rotation=0){
  const chair = new THREE.Group();
  chair.position.set(px(x),0,px(y));
  chair.rotation.y = rotation;
  g.add(chair);
  const upholstery = material(0xb8aea3,.97,0);
  addRoundedBox(chair,-22,-20,44,40,.14,0xb8aea3,.43,.045,{},upholstery);
  addRoundedBox(chair,-23,15,46,9,.48,0xb8aea3,.51,.055,{x:-.10},upholstery);
  addRod(chair,-17,-14,.03,-17,-14,.43,.018,0x242629);
  addRod(chair,17,-14,.03,17,-14,.43,.018,0x242629);
  addRod(chair,-17,14,.03,-17,14,.43,.018,0x242629);
  addRod(chair,17,14,.03,17,14,.43,.018,0x242629);
}

function addFloor(group,points,color,floorType=null){
  const shape = new THREE.Shape();
  points.forEach(([x,y],i)=> i ? shape.lineTo(px(x),px(y)) : shape.moveTo(px(x),px(y)));
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape);
  if(floorType === 'living-oak') setLivingRoomOakUVs(geo);
  if(floorType === 'oak-tile') setOakTileUVs(geo);
  geo.rotateX(Math.PI/2);
  const index = geo.getIndex();
  if(index){
    for(let i=0;i<index.count;i+=3){const b=index.getX(i+1),c=index.getX(i+2);index.setX(i+1,c);index.setX(i+2,b);}
    index.needsUpdate = true;
  }
  geo.computeVertexNormals();
  let floorMaterial = material(color,.9,0);
  if(floorType === 'living-oak') floorMaterial = getOakFloorMaterial();
  if(floorType === 'oak-tile') floorMaterial = getOakTileMaterial();
  const mesh = new THREE.Mesh(geo,floorMaterial);
  mesh.position.y = .012; mesh.receiveShadow = true; group.add(mesh);
}
function addWall(group,x1,y1,x2,y2,h=WALL_H,color=WALL_COLOR){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  if(len < .01) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len,h,WALL_T),material(color,.92,0));
  mesh.position.set(px((x1+x2)/2),h/2,px((y1+y2)/2));
  mesh.rotation.y = -Math.atan2(dz,dx);
  mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
}
function addWindow(group,x1,y1,x2,y2){
  const dx=px(x2-x1), dz=px(y2-y1), len=Math.hypot(dx,dz);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len,1.05,.035),new THREE.MeshPhysicalMaterial({color:0x9fc6d7,transparent:true,opacity:.48,roughness:.12,transmission:.25}));
  mesh.position.set(px((x1+x2)/2),1.35,px((y1+y2)/2));
  mesh.rotation.y = -Math.atan2(dz,dx); group.add(mesh);
}

function addLivingRoomGlazing(g){
  const glass = new THREE.MeshPhysicalMaterial({color:0x151719,transparent:true,opacity:.58,roughness:.10,transmission:.16,metalness:.03});
  const frame = material(0xf4f3ef,.7,0);
  const y = 1049.9;
  const pane = new THREE.Mesh(new THREE.BoxGeometry(px(310),2.18,.028),glass);
  pane.position.set(px(245),1.19,px(y));
  g.add(pane);
  [90,194,297,400].forEach(x=>{
    const post = new THREE.Mesh(new THREE.BoxGeometry(px(4),2.28,.065),frame);
    post.position.set(px(x),1.19,px(y)); post.castShadow = true; g.add(post);
  });
  [0.08,2.30].forEach(z=>{
    const rail = new THREE.Mesh(new THREE.BoxGeometry(px(314),.055,.065),frame);
    rail.position.set(px(245),z,px(y)); rail.castShadow = true; g.add(rail);
  });
}

function addLivingRoomTv(g){
  const oak = 0x9a744f;
  const black = 0x17191b;
  addBox(g,41,997,70,27,.78,oak,.13);
  addBox(g,42,998,33,25,.36,0xa57c54,.16);
  addBox(g,77,998,33,25,.36,0x8f6847,.16);
  addBox(g,42,998,33,25,.36,0x97704e,.54);
  addBox(g,77,998,33,25,.36,0xa77c53,.54);
  addBox(g,39,995,74,2,.025,black,.11);
  addBox(g,39,1024,74,2,.025,black,.11);
  [[40,1000],[112,1000],[40,1023],[112,1023]].forEach(([x,y])=>addRod(g,x,y,.02,x,y,.13,.014,black));
  const tv = new THREE.Mesh(new RoundedBoxGeometry(px(145),.83,.055,4,.014),material(0x090b0d,.25,.04));
  tv.position.set(px(77),1.47,px(1037));
  tv.castShadow = true; g.add(tv);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(px(140),.78),new THREE.MeshStandardMaterial({color:0x11161b,roughness:.24,metalness:.08}));
  screen.position.set(px(77),1.47,px(1034));
  screen.rotation.x = 0;
  g.add(screen);
  addBox(g,72,1028,10,8,.18,black,.93);
}

function addDetailedStairs(g){
  const wood=0xb9824e,white=0xf0eee8,runner=0xb9ad99;
  const woodMaterial=material(wood,.78,0);
  const runnerMaterial=material(runner,.99,0);
  const turnX=42,turnY=528,innerR=11,outerR=108;
  const lowerY=550,upperY=414,treadD=92,treadW=28;

  const addHalfMoonMat=(x,y,w,d,z,rotation=0)=>{
    const shape=new THREE.Shape();
    shape.moveTo(-px(w/2),px(d*.42));
    shape.lineTo(px(w/2),px(d*.42));
    shape.quadraticCurveTo(px(w/2),-px(d*.30),0,-px(d*.58));
    shape.quadraticCurveTo(-px(w/2),-px(d*.30),-px(w/2),px(d*.42));
    const geo=new THREE.ShapeGeometry(shape);
    geo.rotateX(Math.PI/2);
    const mesh=new THREE.Mesh(geo,runnerMaterial);
    mesh.position.set(px(x),z,px(y));
    mesh.rotation.y=rotation;
    mesh.receiveShadow=true;
    g.add(mesh);
  };

  const sectorShape=(r0,r1,a0,a1)=>{
    const shape=new THREE.Shape();
    shape.absarc(0,0,px(r1),a0,a1,false);
    shape.lineTo(px(r0*Math.cos(a1)),px(r0*Math.sin(a1)));
    shape.absarc(0,0,px(r0),a1,a0,true);
    shape.closePath();
    return shape;
  };

  const addTurnStep=(a0,a1,z)=>{
    const geo=new THREE.ExtrudeGeometry(sectorShape(innerR,outerR,a0,a1),{depth:.06,bevelEnabled:false,curveSegments:18});
    geo.rotateX(Math.PI/2);
    const step=new THREE.Mesh(geo,woodMaterial);
    step.position.set(px(turnX),z+.06,px(turnY));
    step.castShadow=true; step.receiveShadow=true; g.add(step);

    const matGeo=new THREE.ShapeGeometry(sectorShape(innerR+8,outerR-17,a0+.025,a1-.025));
    matGeo.rotateX(Math.PI/2);
    const matMesh=new THREE.Mesh(matGeo,runnerMaterial);
    matMesh.position.set(px(turnX),z+.064,px(turnY));
    matMesh.receiveShadow=true; g.add(matMesh);
  };

  const lowerSteps=[];
  for(let i=0;i<6;i++){
    const x=92+i*treadW,z=1.04-i*.148;
    lowerSteps.push({x,z});
    addBox(g,x,lowerY,treadW-2,treadD,.06,wood,z,woodMaterial);
    addHalfMoonMat(x+(treadW-2)/2,lowerY+treadD/2,58,20,z+.064,Math.PI/2);
  }

  for(let i=0;i<5;i++){
    const a0=Math.PI/2-(i+1)*Math.PI/5;
    const a1=Math.PI/2-i*Math.PI/5;
    addTurnStep(a0,a1,1.15+i*.14);
  }

  const upperSteps=[];
  for(let i=0;i<6;i++){
    const x=92+i*treadW,z=1.87+i*.12;
    upperSteps.push({x,z});
    addBox(g,x,upperY,treadW-2,treadD,.06,wood,z,woodMaterial);
    addHalfMoonMat(x+(treadW-2)/2,upperY+treadD/2,58,20,z+.064,-Math.PI/2);
  }

  const addFlightRailing=(steps,y)=>{
    steps.forEach(({x,z},i)=>{
      if(i===steps.length-1||i%1===0){
        addBox(g,x+4,y-2,5,5,.84,white,z+.02);
      }
    });
    for(let i=0;i<steps.length-1;i++){
      const a=steps[i],b=steps[i+1];
      addRod(g,a.x+6,y,a.z+.86,b.x+6,y,b.z+.86,.032,wood);
    }
  };

  addFlightRailing(lowerSteps,lowerY);
  addFlightRailing(lowerSteps,lowerY+treadD);
  addFlightRailing(upperSteps,upperY);
  addFlightRailing(upperSteps,upperY+treadD);

  const curvePosts=[];
  for(let i=0;i<=6;i++){
    const a=Math.PI/2-i*Math.PI/6;
    const x=turnX+outerR*Math.cos(a),y=turnY+outerR*Math.sin(a);
    const base=1.13+i*(.72/6);
    curvePosts.push({x,y,h:base+.88});
    addBox(g,x-2.5,y-2.5,5,5,.86,white,base);
  }
  for(let i=0;i<curvePosts.length-1;i++){
    const a=curvePosts[i],b=curvePosts[i+1];
    addRod(g,a.x,a.y,a.h,b.x,b.y,b.h,.032,wood);
  }

  [[247,lowerY],[247,lowerY+treadD],[247,upperY],[247,upperY+treadD]].forEach(([x,y],idx)=>{
    const upper=idx>1;
    const z=upper?2.43:.28;
    addBox(g,x-4,y-4,8,8,.98,white,z);
  });
}
function addDetailedKitchen(g){
  const mint=0x7fa991,mintDark=0x658b78,white=0xf2f0ea,wood=0x9a704c,darkWood=0x6f432b,black=0x17191b;
  const mintPanelMaterial = new THREE.MeshStandardMaterial({color:mintDark,roughness:.82,metalness:.03,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const whitePanelMaterial = new THREE.MeshStandardMaterial({color:white,roughness:.90,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  addBox(g,0,0,224,58,.86,mint); addBox(g,224,0,58,188,.86,mint);
  addBox(g,0,0,224,58,.055,wood,.86); addBox(g,224,0,58,188,.055,wood,.86);
  [8,58,108,158].forEach(x=>addBox(g,x,58.2,42,.30,.62,mintDark,.12,mintPanelMaterial));
  [12,58,104,150].forEach(y=>addBox(g,223.5,y,.30,34,.62,mintDark,.12,mintPanelMaterial));

  addBox(g,224,188,58,81,2.2,mint);
  addBox(g,233,199,40,36,.58,black,.92);
  addBox(g,236,204,34,28,.02,0x262a2d,1.03);
  addBox(g,224,269.1,58,26,1.68,mint);

  addBox(g,212,10,12,72,1.02,white,1.26);
  addBox(g,224,20,58,58,.95,white,1.25);
  addBox(g,224,78,58,42,.95,white,1.25);
  addBox(g,224,120,58,68,.95,white,1.25);
  addBox(g,223.5,123,.30,29,.76,white,1.34,whitePanelMaterial);
  addBox(g,223.5,156,.30,29,.76,white,1.34,whitePanelMaterial);
  addBox(g,228,126,50,56,.025,0x303235,1.22);
  addBox(g,231,130,44,48,.012,0x17191b,1.218);

  addBox(g,82,10,66,38,.035,black,.92); addBox(g,90,16,50,25,.02,0x24282b,.935);
  addRod(g,145,30,.95,145,30,1.22,.018,0x303336); addRod(g,145,30,1.22,132,30,1.22,.018,0x303336);
  addBox(g,234,133,38,55,.035,black,.92); [[244,146],[261,146],[244,173],[261,173]].forEach(([x,y])=>addCylinder(g,x,y,7,.015,0x313539,.955));

  addBox(g,8,6,38,46,1.55,white,.92); for(let i=0;i<4;i++) addRod(g,10,10+i*11,1.02,44,44-i*11,1.42,.018,0x8d8d88);
  addBox(g,22,145,150,62,.09,darkWood,.84); [[28,151],[158,151],[28,195],[158,195]].forEach(([x,y])=>addBox(g,x,y,5,5,.82,black,.02));
  [[38,228],[94,228],[150,228]].forEach(([x,y])=>{
    addBox(g,x-17,y-17,34,34,.08,black,.46); addBox(g,x-17,y+13,34,5,.44,black,.48);
    [[x-13,y-13],[x+13,y-13],[x-13,y+13],[x+13,y+13]].forEach(([lx,ly])=>addRod(g,lx,ly,.05,lx,ly,.46,.014,0x8c6541));
  });
}

function addDetailedSofa(g){
  const baseColor=0xd0cbc4,fabricColor=0xe0ddd7,seatColor=0xe9e6e1,seamColor=0xbab4ac,darkPillow=0x26282c,floralPillow=0x3b3032;
  const sofaMaterial=material(fabricColor,.97,0),seatMaterial=material(seatColor,.98,0);
  addRoundedBox(g,4,660,286,62,.18,baseColor,.05,.06); addRoundedBox(g,4,660,58,190,.18,baseColor,.05,.06);
  addRoundedBox(g,14,676,70,49,.19,seatColor,.27,.055,{},seatMaterial); addRoundedBox(g,88,676,82,49,.19,seatColor,.27,.055,{},seatMaterial);
  addRoundedBox(g,174,676,84,49,.19,seatColor,.27,.055,{},seatMaterial); addRoundedBox(g,14,730,45,108,.19,seatColor,.27,.055,{},seatMaterial);
  addRoundedBox(g,14,657,70,19,.46,fabricColor,.39,.055,{x:-.11},sofaMaterial); addRoundedBox(g,88,657,82,19,.46,fabricColor,.39,.055,{x:-.11},sofaMaterial);
  addRoundedBox(g,174,657,84,19,.46,fabricColor,.39,.055,{x:-.11},sofaMaterial); addRoundedBox(g,0,676,19,55,.46,fabricColor,.39,.055,{z:.11},sofaMaterial);
  addRoundedBox(g,0,735,19,101,.46,fabricColor,.39,.055,{z:.11},sofaMaterial); addRoundedBox(g,263,663,27,70,.53,fabricColor,.09,.075,{},sofaMaterial);
  addRoundedBox(g,2,838,66,26,.53,fabricColor,.09,.075,{},sofaMaterial);
  [[14,70],[88,82],[174,84]].forEach(([x,w])=>addRoundedBox(g,x+3,722,w-6,2,.018,seamColor,.455,.006));
  addRoundedBox(g,25,682,31,10,.34,floralPillow,.47,.035,{x:-.08,y:.12,z:.10});
  addRoundedBox(g,49,683,25,9,.30,darkPillow,.46,.032,{x:-.06,y:-.08,z:-.08});
  addRoundedBox(g,128,700,8,17,.025,0x17191b,.47,.01,{y:.25});
}

function addDetailedFireplace(g){
  const white=0xf2f0eb,black=0x101214;
  const blackGlass = new THREE.MeshStandardMaterial({color:0x030405,roughness:.10,metalness:.16,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  addBox(g,386,705,84,74,2.42,white,0); addBox(g,388,779.05,80,.30,.53,0x030405,.42,blackGlass);
  addBox(g,385.70,718,.30,61,.53,0x030405,.42,blackGlass); addBox(g,470,718,.30,61,.53,0x030405,.42,blackGlass);
  addBox(g,395,779.05,66,.30,.07,black,1.78); addBox(g,396,779.05,64,.30,.07,black,.12);
}

function buildHouse(scene){
  const g = new THREE.Group(); scene.add(g);
  roomPolygons.forEach(r=>addFloor(g,r.points,r.color,r.floor));
  addWall(g,0,0,64,0); addWall(g,184,0,350,0); addWall(g,424,0,480.8,0);
  addWall(g,0,0,0,1049.9);
  addWall(g,0,1049.9,90,1049.9); addWall(g,400,1049.9,480.8,1049.9);
  addWall(g,480.8,0,480.8,42); addWall(g,480.8,128,480.8,157.47);
  addWall(g,480.8,157.47,790.31,157.47);
  addWall(g,790.31,157.47,790.31,205); addWall(g,790.31,273,790.31,378); addWall(g,790.31,444,790.31,892.73);
  addWall(g,480.8,892.73,620,892.73); addWall(g,715,892.73,790.31,892.73);
  addWall(g,480.8,892.73,480.8,930); addWall(g,480.8,1025,480.8,1049.9);
  addWall(g,290.25,0,290.25,188); addWall(g,170,269.1,290.25,269.1);
  addWall(g,480.8,157.47,480.8,188); addWall(g,480.8,260,480.8,390); addWall(g,480.8,462,480.8,598); addWall(g,480.8,696,480.8,892.73);
  addWall(g,599.74,325.28,599.74,530.64); addWall(g,599.74,530.64,640,530.64); addWall(g,712,530.64,790.31,530.64);
  [[64,0,184,0],[350,0,424,0],[790.31,205,790.31,273],[790.31,378,790.31,444]].forEach(w=>addWindow(g,...w));
  addLivingRoomGlazing(g);
  addDetailedStairs(g);
  const fireplace = new THREE.Group(); g.add(fireplace); addDetailedFireplace(fireplace);
  const fireplacePivot = new THREE.Vector3(px(428.5),0,px(765));
  fireplace.children.forEach(child=>{child.position.x-=fireplacePivot.x;child.position.z-=fireplacePivot.z;});
  fireplace.position.copy(fireplacePivot); fireplace.rotation.y = 3*Math.PI/2;
  addDetailedKitchen(g); addBox(g,300,8,112,32,.48,0x72593f); addDetailedSofa(g);
  addLivingRoomRug(g);
  addPhotoDiningTable(g);
  addPhotoDiningChair(g,400,790,0);
  addPhotoDiningChair(g,400,950,Math.PI);
  addPhotoDiningChair(g,330,870,-Math.PI/2);
  addPhotoDiningChair(g,465,870,Math.PI/2);
  addLivingRoomTv(g);
  addBox(g,4,348,20,48,.42,0x30343a); addCylinder(g,45,374,19,.12,0x24272b);
  addBox(g,497,338,86,46,.78,0x817565); addCylinder(g,540,360,18,.10,0xd2d6d8,.79);
  addBox(g,493,508,94,24,.95,0xb8bcc0); addBox(g,519,470,42,38,.48,0xd3d6d8);
  addBox(g,724,338,54,178,.64,0x8b6845); addBox(g,614,338,48,48,.76,0x35383b);
  addBox(g,690,548,88,72,.05,0x7e969e); addWall(g,685,630,785,630,1.85,WALL_COLOR);
  addBox(g,690,640,88,86,.72,0x848d91); addBox(g,705,817,72,68,.86,0xc8cbcd); addCylinder(g,741,851,22,.04,0x454b50,.87);
  addBox(g,734,168,44,88,1.8,0x4a4e52); addBox(g,734,267,44,49,1.35,0xb4b8ba); addBox(g,565,236,154,69,.52,0xa4a8aa,1.72);
}

function createViewer(host){
  const width=Math.max(320,host.clientWidth||900),height=560;
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x171b20);
  const camera=new THREE.PerspectiveCamera(42,width/height,.1,100); camera.position.set(10.5,13.5,14.5);
  const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(width,height,false); renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true; renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.domElement.style.display='block'; renderer.domElement.style.width='100%'; renderer.domElement.style.height=`${height}px`; host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xe6edf3,0x25292d,2.2));
  const sun=new THREE.DirectionalLight(0xffffff,3.0); sun.position.set(-8,15,-6); sun.castShadow=true; scene.add(sun);
  buildHouse(scene);
  const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(4.1,.45,5.15); controls.enableDamping=true; controls.dampingFactor=.07; controls.minDistance=7; controls.maxDistance=28; controls.update();
  let raf=0,disposed=false;
  const loop=()=>{if(disposed)return;controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(loop);}; loop();
  const resize=()=>{const w=Math.max(320,host.clientWidth||width);camera.aspect=w/height;camera.updateProjectionMatrix();renderer.setSize(w,height,false);};
  window.addEventListener('resize',resize);
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);controls.dispose();renderer.dispose();renderer.domElement.remove();};
}

function activeFloor(){
  const active=document.querySelector('.floor-switch button.active');
  return active?.textContent?.trim().startsWith('1')?1:2;
}

export function installFloor3DViewer(){
  const panel=document.querySelector('.floor-panel');
  const head=panel?.querySelector('.panel-head');
  const floorPlan=panel?.querySelector('.floor-plan');
  if(!panel||!head||!floorPlan)return()=>{};
  panel.querySelector('[data-view-toggle]')?.remove(); panel.querySelector('[data-floor-3d]')?.remove();
  const toggle=document.createElement('div'); toggle.dataset.viewToggle='true'; toggle.style.cssText='display:flex;gap:6px;margin-left:auto;align-items:center;';
  const b2=document.createElement('button'); b2.type='button'; b2.textContent='2D'; b2.style.cssText='border:1px solid rgba(226,234,242,.18);background:#313b46;color:#cbd4dc;border-radius:9px;padding:8px 11px;font:600 12px/1 system-ui;cursor:pointer;';
  const b3=document.createElement('button'); b3.type='button'; b3.textContent='3D'; b3.style.cssText='border:1px solid rgba(226,234,242,.18);background:#1c232b;color:#cbd4dc;border-radius:9px;padding:8px 11px;font:600 12px/1 system-ui;cursor:pointer;';
  toggle.append(b2,b3); head.appendChild(toggle);
  const view=document.createElement('div'); view.dataset.floor3d='true'; view.style.cssText='display:none;position:relative;width:100%;height:560px;overflow:hidden;border-radius:14px;background:#171b20;'; floorPlan.insertAdjacentElement('afterend',view);
  let destroyViewer=null;
  const show2D=()=>{view.style.display='none';floorPlan.style.display='';b2.style.background='#313b46';b3.style.background='#1c232b';};
  const show3D=()=>{
    if(activeFloor()!==1)return;
    floorPlan.style.display='none';view.style.display='block';b2.style.background='#1c232b';b3.style.background='#313b46';
    if(destroyViewer)return;
    const status=document.createElement('div'); status.textContent='3D laadimine…'; status.style.cssText='position:absolute;inset:0;display:grid;place-items:center;color:#9ba8b4;font:500 14px system-ui;'; view.appendChild(status);
    requestAnimationFrame(()=>{
      try{
        destroyViewer=createViewer(view); status.remove();
        const hint=document.createElement('div'); hint.textContent='Lohista: pööra · rullik/pinch: zoom'; hint.style.cssText='position:absolute;left:14px;bottom:12px;z-index:2;background:rgba(18,22,27,.78);border:1px solid rgba(226,234,242,.15);border-radius:9px;padding:7px 10px;color:#9ba8b4;font:500 11px/1.2 system-ui;pointer-events:none;'; view.appendChild(hint);
      }catch(err){console.error('Home OS 3D viewer failed',err);status.textContent=`3D viga: ${err?.message||err}`;status.style.color='#e3a6a6';}
    });
  };
  b2.addEventListener('click',show2D); b3.addEventListener('click',show3D);
  const floorButtons=[...document.querySelectorAll('.floor-switch button')];
  const onFloorClick=()=>requestAnimationFrame(()=>{const floor=activeFloor();b3.disabled=floor!==1;b3.style.opacity=floor===1?'1':'.45';b3.style.cursor=floor===1?'pointer':'not-allowed';if(floor!==1)show2D();});
  floorButtons.forEach(btn=>btn.addEventListener('click',onFloorClick)); onFloorClick();
  return()=>{destroyViewer?.();b2.removeEventListener('click',show2D);b3.removeEventListener('click',show3D);floorButtons.forEach(btn=>btn.removeEventListener('click',onFloorClick));toggle.remove();view.remove();};
}
