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

function addSideBoard(group,x1,y1,h1,x2,y2,h2,height,thickness,color){
  const a = new THREE.Vector3(px(x1),h1,px(y1));
  const b = new THREE.Vector3(px(x2),h2,px(y2));
  const dir = new THREE.Vector3().subVectors(b,a);
  const len = dir.length();
  if(len < .001) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len,height,thickness),material(color,.9,0));
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.position.y += height/2;
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

function roundedRunnerPoints(cx,cy,w,d,r=6){
  const pts=[];
  const steps=6;
  const corners=[
    [cx+w/2-r,cy+d/2-r,0,Math.PI/2],
    [cx-w/2+r,cy+d/2-r,Math.PI/2,Math.PI],
    [cx-w/2+r,cy-d/2+r,Math.PI,Math.PI*1.5],
    [cx+w/2-r,cy-d/2+r,Math.PI*1.5,Math.PI*2],
  ];
  corners.forEach(([x,y,a1,a2])=>{
    for(let i=0;i<=steps;i++){
      const a=a1+(a2-a1)*i/steps;
      pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);
    }
  });
  return pts;
}

function addRoundedRunner(group,cx,cy,w,d,height){
  addFlatShape(group,roundedRunnerPoints(cx,cy,w,d),height,NEW_RUNNER,.016);
}

function buildPhotoStairs(){
  const g = new THREE.Group();
  g.name = 'photoReferenceStairs';

  // Final photo references show two straight, parallel flights connected by a
  // compact wall-side winder turn. Keep the turn clear of the exterior wall mesh.
  const upperY = 414;
  const lowerY = 550;
  const straightStartX = 62;
  const upperStartX = 112;
  const treadW = 24;
  const rise = .118;
  const lowerCount = 8;
  const upperCount = 7;

  // Long lower open flight.
  for(let i=0;i<lowerCount;i++){
    const x=straightStartX+i*treadW;
    const z=.13+(lowerCount-1-i)*rise;
    addBox(g,x,lowerY,treadW-2,92,.052,NEW_WOOD,z);
    addRoundedRunner(g,x+(treadW-2)/2,lowerY+46,treadW-6,68,z+.054);
  }

  // Four fan-shaped winders make the physical 180-degree turn against the wall.
  // Adjacent polygons share edges so the stair reads as one continuous structure.
  const winders = [
    [[62,642],[18,642],[18,590],[62,550]],
    [[62,550],[18,590],[18,536],[62,528]],
    [[62,528],[18,536],[18,466],[82,506]],
    [[82,506],[18,466],[18,414],[112,414],[112,506]],
  ];

  const winderStart=.13+lowerCount*rise;
  const winderRunners = [
    [[57,632],[25,622],[25,594],[57,564]],
    [[57,546],[25,568],[25,537],[58,532]],
    [[58,522],[26,526],[28,481],[75,508]],
    [[85,496],[29,464],[29,428],[103,429],[103,489]],
  ];
  winders.forEach((poly,i)=>{
    const z=winderStart+i*rise;
    addFlatShape(g,poly,z,NEW_WOOD,.052);
    addFlatShape(g,winderRunners[i],z+.054,NEW_RUNNER,.016);
  });

  // Upper flight starts immediately after the last winder and rises back over the
  // lower flight, matching the side/front photos.
  for(let i=0;i<upperCount;i++){
    const x=upperStartX+i*treadW;
    const z=winderStart+winders.length*rise+i*rise;
    addBox(g,x,upperY,treadW-2,92,.052,NEW_WOOD,z);
    addRoundedRunner(g,x+(treadW-2)/2,upperY+46,treadW-6,68,z+.054);
  }

  // White open-stringer construction. The lower run remains visually straight
  // until the winder section; the upper stringers start only after the turn.
  addSideBoard(g,258,lowerY,.02,straightStartX,lowerY,.90,.30,.09,NEW_WHITE);
  addSideBoard(g,258,lowerY+92,.02,straightStartX,lowerY+92,.90,.30,.09,NEW_WHITE);
  addSideBoard(g,upperStartX,upperY,1.48,268,upperY,2.18,.30,.09,NEW_WHITE);
  addSideBoard(g,upperStartX,upperY+92,1.48,268,upperY+92,2.18,.30,.09,NEW_WHITE);

  // Video reference: the last upper tread meets a small flat upstairs threshold.
  addBox(g,268,upperY,40,92,.052,NEW_WOOD,2.38);
  addFlatShape(g,[[272,upperY+16],[304,upperY+16],[304,upperY+76],[272,upperY+76]],2.434,NEW_RUNNER,.016);

  // Video reference: the lower flight has guards on both sides, with the inner
  // side forming the straight divider between the two parallel runs.
  [lowerY, lowerY+92].forEach(railY=>{
    for(let i=0;i<=lowerCount;i++){
      const x=straightStartX+i*treadW;
      const base=.13+(lowerCount-1-Math.min(i,lowerCount-1))*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,258,railY,.92,straightStartX,railY,1.80,.035,NEW_WOOD);
  });

  // The upper flight also carries a straight centre divider plus the wall-side
  // balustrade seen in the video. The turn itself remains a compact winder, not
  // a broad circular rail.
  [upperY, upperY+92].forEach(railY=>{
    for(let i=0;i<=upperCount;i++){
      const x=upperStartX+i*treadW;
      const base=winderStart+winders.length*rise+Math.min(i,upperCount-1)*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,upperStartX,railY,2.38,268,railY,3.08,.035,NEW_WOOD);
  });

  // Square newel posts anchor the straight rails around the winder, as in the
  // video. Keep them straight and block-like; no curved centre rail is added.
  addBox(g,58,lowerY-4,8,8,1.08,NEW_WHITE,.86);
  addBox(g,108,upperY+88,8,8,1.18,NEW_WHITE,1.34);

  // Prominent square posts from the photos.
  addBox(g,252,lowerY+88,8,8,1.02,NEW_WHITE,.02);
  addBox(g,straightStartX-4,lowerY+88,8,8,1.02,NEW_WHITE,.90);
  addBox(g,108,upperY-4,8,8,1.04,NEW_WHITE,1.50);
  addBox(g,262,upperY-4,8,8,1.06,NEW_WHITE,2.56);

  return g;
}

function isOldStairMesh(obj){
  if(!obj?.isMesh) return false;
  const mats=Array.isArray(obj.material)?obj.material:[obj.material];
  if(!mats.some(m=>m?.color && OLD_STAIR_COLORS.has(m.color.getHex()))) return false;
  const box=new THREE.Box3().setFromObject(obj);
  const stairZone=new THREE.Box3(
    new THREE.Vector3(-.60,-.05,3.90),
    new THREE.Vector3(2.90,3.80,6.75),
  );
  return box.intersectsBox(stairZone);
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
      if(obj?.isGroup) queueMicrotask(()=>replaceStairsInHouse(obj));
    }
    return result;
  };
  Object.defineProperty(THREE.Scene.prototype,'__homeOsPhotoStairsPatched',{value:true,configurable:true});
}
