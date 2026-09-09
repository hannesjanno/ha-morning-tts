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

function annularSectorPoints(cx,cy,outerRx,outerRy,innerRx,innerRy,a0,a1,segments=16){
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
  const straightStartX = 86;
  const treadW = 24;
  const rise = .115;
  const lowerCount = 7;
  const upperCount = 7;

  // Lower open flight, as seen from the living room.
  for(let i=0;i<lowerCount;i++){
    const x=straightStartX+i*treadW;
    const z=.14+(lowerCount-1-i)*rise;
    addBox(g,x,lowerY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,lowerY+48,treadW-8,27,z+.054,true);
  }

  // Approved reference: the middle is not a gap between two straight runs.
  // It is a broad, continuous 180-degree fan of winder treads that visibly carries
  // the staircase to the right and upward before it becomes straight again.
  const cx=86;
  const cy=528;
  const outerRx=83;
  const outerRy=122;
  const innerRx=18;
  const innerRy=31;
  const winderCount=7;
  const startAngle=Math.PI/2;
  const sweep=Math.PI;

  for(let i=0;i<winderCount;i++){
    const a0=startAngle+i*sweep/winderCount;
    const a1=startAngle+(i+1)*sweep/winderCount;
    const z=.94+i*rise;
    addFlatShape(g,annularSectorPoints(cx,cy,outerRx,outerRy,innerRx,innerRy,a0,a1),z,NEW_WOOD,.052);

    // Carpet follows each wedge, leaving visible oak at both the inner and outer edge.
    addFlatShape(
      g,
      annularSectorPoints(cx,cy,63,93,30,47,a0+.035,a1-.035,14),
      z+.054,
      NEW_RUNNER,
      .016,
    );
  }

  // Upper flight continues naturally from the last winder toward the second floor.
  for(let i=0;i<upperCount;i++){
    const x=straightStartX+i*treadW;
    const z=1.78+i*rise;
    addBox(g,x,upperY,treadW-2,92,.052,NEW_WOOD,z);
    addHalfMoonRunner(g,x+(treadW-2)/2,upperY+44,treadW-8,27,z+.054,false);
  }

  // White open-stringer structure on the straight runs.
  addBeam(g,258,lowerY,.08,straightStartX,lowerY,.86,.12,.10,NEW_WHITE);
  addBeam(g,258,lowerY+92,.08,straightStartX,lowerY+92,.86,.12,.10,NEW_WHITE);
  addBeam(g,straightStartX,upperY,1.75,246,upperY,2.48,.12,.10,NEW_WHITE);
  addBeam(g,straightStartX,upperY+92,1.75,246,upperY+92,2.48,.12,.10,NEW_WHITE);

  // Lower-flight balusters and oak handrails.
  [lowerY,lowerY+92].forEach(railY=>{
    for(let i=0;i<=lowerCount;i++){
      const x=straightStartX+i*treadW;
      const base=.14+(lowerCount-1-Math.min(i,lowerCount-1))*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,258,railY,.92,straightStartX,railY,1.70,.032,NEW_WOOD);
  });

  // Upper-flight balusters and handrails.
  [upperY,upperY+92].forEach(railY=>{
    for(let i=0;i<=upperCount;i++){
      const x=straightStartX+i*treadW;
      const base=1.78+Math.min(i,upperCount-1)*rise;
      addBox(g,x-2.2,railY-2.2,4.4,4.4,.82,NEW_WHITE,base+.02);
    }
    addRod(g,straightStartX,railY,2.57,246,railY,3.30,.032,NEW_WOOD);
  });

  // Outer railing follows the full fan with dense white balusters.
  const outerRail=[];
  for(let i=0;i<=14;i++){
    const a=startAngle+i*sweep/14;
    const x=cx+Math.cos(a)*outerRx;
    const y=cy+Math.sin(a)*outerRy;
    const base=.91+i*(.90/14);
    const top=base+.83;
    addBox(g,x-2.4,y-2.4,4.8,4.8,.82,NEW_WHITE,base);
    outerRail.push([x,y,top]);
  }
  for(let i=0;i<outerRail.length-1;i++) addRod(g,...outerRail[i],...outerRail[i+1],.032,NEW_WOOD);

  // Inner divider follows the opening and makes the turn read as a complete staircase,
  // matching the approved top-view reference instead of leaving the centre unfinished.
  const innerRail=[];
  for(let i=0;i<=10;i++){
    const a=startAngle+i*sweep/10;
    const x=cx+Math.cos(a)*innerRx;
    const y=cy+Math.sin(a)*innerRy;
    const base=.96+i*(.82/10);
    const top=base+.80;
    addBox(g,x-2.2,y-2.2,4.4,4.4,.80,NEW_WHITE,base);
    innerRail.push([x,y,top]);
  }
  for(let i=0;i<innerRail.length-1;i++) addRod(g,...innerRail[i],...innerRail[i+1],.03,NEW_WOOD);

  // Newel posts anchor both ends and both sides of the turn.
  addBox(g,252,lowerY+88,8,8,1.02,NEW_WHITE,.02);
  addBox(g,straightStartX-4,lowerY+88,8,8,1.02,NEW_WHITE,.82);
  addBox(g,straightStartX-4,upperY-4,8,8,1.04,NEW_WHITE,1.68);
  addBox(g,242,upperY-4,8,8,1.06,NEW_WHITE,2.34);

  return g;
}

function isOldStairMesh(obj){
  if(!obj?.isMesh) return false;
  const mats=Array.isArray(obj.material)?obj.material:[obj.material];
  if(!mats.some(m=>m?.color && OLD_STAIR_COLORS.has(m.color.getHex()))) return false;
  const box=new THREE.Box3().setFromObject(obj);
  const stairZone=new THREE.Box3(
    new THREE.Vector3(-.60,-.05,3.90),
    new THREE.Vector3(2.80,3.60,6.70),
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
