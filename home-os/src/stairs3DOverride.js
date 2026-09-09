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

function insetPolygon(points,factor=.68){
  const c=points.reduce((acc,[x,y])=>[acc[0]+x/points.length,acc[1]+y/points.length],[0,0]);
  return points.map(([x,y])=>[c[0]+(x-c[0])*factor,c[1]+(y-c[1])*factor]);
}

function buildPhotoStairs(){
  const g = new THREE.Group();
  g.name = 'photoReferenceStairs';

  // Final photo references show a long, straight lower run. The turn starts only
  // near the top and then progressively carries the stair to the right and upward.
  const upperY = 414;
  const lowerY = 550;
  const straightStartX = 62;
  const treadW = 24;
  const rise = .118;
  const lowerCount = 8;
  const upperCount = 7;

  // Long lower open flight.
  for(let i=0;i<lowerCount;i++){
    const x=straightStartX+i*treadW;
    const z=.13+(lowerCount-1-i)*rise;
    addBox(g,x,lowerY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,lowerY+48,treadW-8,27,z+.054,true);
  }

  // Real winder sequence from the photos. It is deliberately asymmetric: the
  // first two treads still read almost straight from below, and only the next
  // treads make the strong right-hand turn into the upper run.
  const winders = [
    [[62,642],[30,642],[22,610],[62,566]],
    [[62,566],[22,610],[10,580],[18,548],[62,544]],
    [[62,544],[18,548],[8,520],[18,490],[62,516]],
    [[62,516],[18,490],[30,456],[62,478]],
    [[62,478],[30,456],[48,428],[86,438],[86,478]],
    [[86,478],[48,428],[78,414],[112,414],[112,478]],
  ];

  const winderStart=.13+lowerCount*rise;
  winders.forEach((poly,i)=>{
    const z=winderStart+i*rise;
    addFlatShape(g,poly,z,NEW_WOOD,.052);
    // The carpet follows the wood tread but leaves a clearly visible oak border.
    addFlatShape(g,insetPolygon(poly,i<2?.66:.62),z+.054,NEW_RUNNER,.016);
  });

  // Upper flight starts immediately after the last winder and rises back over the
  // lower flight, matching the side/front photos.
  for(let i=0;i<upperCount;i++){
    const x=110+i*treadW;
    const z=winderStart+winders.length*rise+i*rise;
    addBox(g,x,upperY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,upperY+44,treadW-8,27,z+.054,false);
  }

  // White open-stringer construction. The lower run remains visually straight
  // until the winder section; the upper stringers start only after the turn.
  addBeam(g,258,lowerY,.08,straightStartX,lowerY,.96,.12,.10,NEW_WHITE);
  addBeam(g,258,lowerY+92,.08,straightStartX,lowerY+92,.96,.12,.10,NEW_WHITE);
  addBeam(g,110,upperY,1.89,266,upperY,2.65,.12,.10,NEW_WHITE);
  addBeam(g,110,upperY+92,1.89,266,upperY+92,2.65,.12,.10,NEW_WHITE);

  // Lower-flight guard only on the outside edge; the centre side stays open.
  [lowerY+92].forEach(railY=>{
    for(let i=0;i<=lowerCount;i++){
      const x=straightStartX+i*treadW;
      const base=.13+(lowerCount-1-Math.min(i,lowerCount-1))*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,258,railY,.92,straightStartX,railY,1.80,.032,NEW_WOOD);
  });

  // Upper-flight guard only on the outside edge; the centre side stays open.
  [upperY].forEach(railY=>{
    for(let i=0;i<=upperCount;i++){
      const x=110+i*treadW;
      const base=winderStart+winders.length*rise+Math.min(i,upperCount-1)*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,110,railY,2.73,268,railY,3.48,.032,NEW_WOOD);
  });

  // The turn is against the wall. Do not add an outer arc or an inner divider here.
  // The centre of the U-shaped stair remains completely free of handrails and balusters.

  // Prominent square posts from the photos.
  addBox(g,252,lowerY+88,8,8,1.02,NEW_WHITE,.02);
  addBox(g,straightStartX-4,lowerY+88,8,8,1.02,NEW_WHITE,.90);
  addBox(g,106,upperY-4,8,8,1.04,NEW_WHITE,1.82);
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
