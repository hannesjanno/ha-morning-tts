import * as THREE from 'three';

const SCALE = 0.01;
const px = (v) => v * SCALE;

const OLD_STAIR_COLORS = new Set([0xa97950, 0xf5f4ef, 0xaaa197]);
const NEW_WOOD = 0xb07d4f;
const NEW_WHITE = 0xf6f4ef;
const NEW_RUNNER = 0xb6ada3;

const material = (color, roughness=.82, metalness=.02) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function addBox(group,x,y,w,d,h,color,z=0){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(px(w),h,px(d)),material(color,.88,0));
  mesh.position.set(px(x+w/2),z+h/2,px(y+d/2));
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
  if(len < .001) return null;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,14),material(color,.66,0));
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function addBeam(group,x1,y1,h1,x2,y2,h2,width,depth,color){
  const a = new THREE.Vector3(px(x1),h1,px(y1));
  const b = new THREE.Vector3(px(x2),h2,px(y2));
  const dir = new THREE.Vector3().subVectors(b,a);
  const len = dir.length();
  if(len < .001) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len,width,depth),material(color,.9,0));
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),dir.clone().normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addFlatShape(group,points,height,color,thickness=.052){
  const shape = new THREE.Shape();
  points.forEach(([x,y],i)=>i ? shape.lineTo(px(x),px(y)) : shape.moveTo(px(x),px(y)));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape,{ depth:thickness, bevelEnabled:false });
  geo.rotateX(Math.PI/2);
  const mesh = new THREE.Mesh(geo,material(color,.88,0));
  mesh.position.y = height;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function halfMoonPoints(cx,cy,w,d,flip=false){
  const pts=[];
  for(let i=0;i<=24;i++){
    const a=Math.PI*i/24;
    const yy=(flip ? -1 : 1)*Math.sin(a)*d;
    pts.push([cx+Math.cos(a)*w/2,cy+yy]);
  }
  return pts;
}

function addHalfMoonRunner(group,cx,cy,w,d,height,flip=false){
  addFlatShape(group,halfMoonPoints(cx,cy,w,d,flip),height,NEW_RUNNER,.016);
}

function ellipseSectorPoints(cx,cy,outerRx,outerRy,innerRx,innerRy,a0,a1,segments=10){
  const pts=[];
  for(let i=0;i<=segments;i++){
    const a=a0+(a1-a0)*(i/segments);
    pts.push([cx+Math.cos(a)*outerRx,cy+Math.sin(a)*outerRy]);
  }
  for(let i=segments;i>=0;i--){
    const a=a0+(a1-a0)*(i/segments);
    pts.push([cx+Math.cos(a)*innerRx,cy+Math.sin(a)*innerRy]);
  }
  return pts;
}

function buildPhotoStairs(){
  const g = new THREE.Group();
  g.name = 'photoReferenceStairs';

  const upperY = 414;
  const lowerY = 550;
  const turnX = 72;
  const treadW = 25;
  const rise = .12;
  const lowerCount = 8;
  const upperCount = 7;

  // Open lower flight: from living room at the right, rising toward the left-hand turn.
  for(let i=0;i<lowerCount;i++){
    const x=turnX+i*treadW;
    const z=.14+(lowerCount-1-i)*rise;
    addBox(g,x,lowerY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,lowerY+48,treadW-8,27,z+.054,true);
  }

  // Five continuous winder treads.  The ellipse reproduces the photographed
  // gradual 180-degree turn without a landing and keeps the whole turn inside the wall line.
  const cx=72, cy=528;
  const outerRx=64, outerRy=114;
  const innerRx=14, innerRy=22;
  const winderCount=5;
  for(let i=0;i<winderCount;i++){
    const a0=Math.PI/2 + i*Math.PI/winderCount;
    const a1=Math.PI/2 + (i+1)*Math.PI/winderCount;
    const z=1.10+i*rise;
    addFlatShape(g,ellipseSectorPoints(cx,cy,outerRx,outerRy,innerRx,innerRy,a0,a1,12),z,NEW_WOOD,.052);
    addFlatShape(g,ellipseSectorPoints(cx,cy,48,88,25,40,a0+.045,a1-.045,10),z+.054,NEW_RUNNER,.016);
  }

  // Upper flight leaves the turn and continues to the second floor.
  for(let i=0;i<upperCount;i++){
    const x=turnX+i*treadW;
    const z=1.70+i*rise;
    addBox(g,x,upperY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,upperY+44,treadW-8,27,z+.054,false);
  }

  // Flat white stringers, closer to the real construction than the previous round rods.
  addBeam(g,258,lowerY,.08,turnX,lowerY,1.01,.12,.10,NEW_WHITE);
  addBeam(g,258,lowerY+92,.08,turnX,lowerY+92,1.01,.12,.10,NEW_WHITE);
  addBeam(g,turnX,upperY,1.66,246,upperY,2.47,.12,.10,NEW_WHITE);
  addBeam(g,turnX,upperY+92,1.66,246,upperY+92,2.47,.12,.10,NEW_WHITE);

  // Lower-flight guards on both exposed edges.
  [lowerY,lowerY+92].forEach((railY,sideIndex)=>{
    for(let i=0;i<=lowerCount;i++){
      const x=turnX+i*treadW;
      const base=.14+(lowerCount-1-Math.min(i,lowerCount-1))*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,258,railY,.92,turnX,railY,1.83,.032,NEW_WOOD);
  });

  // Upper-flight guards.  The inner line creates the photographed tall divider between flights.
  [upperY,upperY+92].forEach(railY=>{
    for(let i=0;i<=upperCount;i++){
      const x=turnX+i*treadW;
      const base=1.70+Math.min(i,upperCount-1)*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,turnX,railY,2.53,246,railY,3.31,.032,NEW_WOOD);
  });

  // Outer railing follows the fan turn continuously.
  const turnRail=[];
  for(let i=0;i<=8;i++){
    const a=Math.PI/2+i*Math.PI/8;
    const x=cx+Math.cos(a)*outerRx;
    const y=cy+Math.sin(a)*outerRy;
    const top=1.86+i*(.70/8);
    const base=1.02+i*(.62/8);
    addBox(g,x-2.4,y-2.4,4.8,4.8,.82,NEW_WHITE,base);
    turnRail.push([x,y,top]);
  }
  for(let i=0;i<turnRail.length-1;i++) addRod(g,...turnRail[i],...turnRail[i+1],.032,NEW_WOOD);

  // Tight inner turn guard around the opening between the two flights.
  const innerRail=[];
  for(let i=0;i<=5;i++){
    const a=Math.PI/2+i*Math.PI/5;
    const x=cx+Math.cos(a)*22;
    const y=cy+Math.sin(a)*32;
    const top=1.84+i*(.66/5);
    const base=1.06+i*(.58/5);
    addBox(g,x-2.2,y-2.2,4.4,4.4,.78,NEW_WHITE,base);
    innerRail.push([x,y,top]);
  }
  for(let i=0;i<innerRail.length-1;i++) addRod(g,...innerRail[i],...innerRail[i+1],.03,NEW_WOOD);

  // Pronounced square newel posts visible in the reference photos.
  addBox(g,252,lowerY+88,8,8,1.02,NEW_WHITE,.02);
  addBox(g,68,lowerY+88,8,8,1.02,NEW_WHITE,.90);
  addBox(g,68,upperY-4,8,8,1.02,NEW_WHITE,1.58);
  addBox(g,242,upperY-4,8,8,1.06,NEW_WHITE,2.34);

  return g;
}

function isOldStairMesh(obj){
  if(!obj?.isMesh) return false;
  const mats=Array.isArray(obj.material)?obj.material:[obj.material];
  const colorMatch=mats.some(m=>m?.color && OLD_STAIR_COLORS.has(m.color.getHex()));
  if(!colorMatch) return false;
  const p=obj.position;
  return p.x>-0.55 && p.x<2.75 && p.z>3.9 && p.z<6.7 && p.y<3.6;
}

function replaceStairsInHouse(house){
  if(!house?.isGroup || house.userData.photoStairsInstalled) return;
  const doomed=[];
  house.traverse(obj=>{ if(isOldStairMesh(obj)) doomed.push(obj); });
  if(doomed.length<12) return;
  doomed.forEach(obj=>{
    obj.parent?.remove(obj);
    obj.geometry?.dispose?.();
    if(Array.isArray(obj.material)) obj.material.forEach(m=>m?.dispose?.());
    else obj.material?.dispose?.();
  });
  house.add(buildPhotoStairs());
  house.userData.photoStairsInstalled=true;
}

export function installStairs3DOverride(){
  if(THREE.Scene.prototype.__homeOsPhotoStairsPatched) return;
  const originalAdd=THREE.Scene.prototype.add;
  THREE.Scene.prototype.add=function(...objects){
    const result=originalAdd.apply(this,objects);
    for(const obj of objects){
      if(obj?.isGroup){
        queueMicrotask(()=>replaceStairsInHouse(obj));
      }
    }
    return result;
  };
  Object.defineProperty(THREE.Scene.prototype,'__homeOsPhotoStairsPatched',{value:true,configurable:true});
}
