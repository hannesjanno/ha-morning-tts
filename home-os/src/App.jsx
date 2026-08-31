import React, { useMemo, useState } from 'react';

const floors = {
  1: {
    area: '69,5 m²',
    rooms: [
      { id:'living', name:'Elutuba', area:'36,5 m²', points:'0,1049.9 480.8,1049.9 480.8,892.73 480.8,700 480.8,536.22 480.8,325.28 480.8,269.1 290.25,269.1 224.14,269.1 0,269.1', label:[240,655] },
      { id:'kitchen', name:'Köök', area:'7,4 m²', points:'224.14,269.1 290.25,269.1 290.25,0 0,0 0,269.1 224.14,269.1', label:[145,131] },
      { id:'hall', name:'Esik', area:'4,7 m²', points:'480.8,269.1 480.8,157.47 480.8,0 290.25,0 290.25,269.1 480.8,269.1', label:[385,131] },
      { id:'utility', name:'Abiruum', area:'4,7 m²', points:'790.31,325.28 790.31,157.47 480.8,157.47 480.8,269.1 480.8,325.28 599.74,325.28 790.31,325.28', label:[636,237] },
      { id:'wc', name:'WC', area:'2,2 m²', points:'599.74,325.28 480.8,325.28 480.8,536.22 599.74,536.22 599.74,530.64 599.74,325.28', label:[540,427] },
      { id:'sauna', name:'Saun', area:'3,5 m²', points:'599.74,530.64 790.31,530.64 790.31,325.28 599.74,325.28 599.74,530.64', label:[695,424] },
      { id:'wash', name:'Pesuruum', area:'10,5 m²', points:'480.8,536.22 480.8,700 480.8,892.73 790.31,892.73 790.31,666.19 790.31,530.64 599.74,530.64 599.74,536.22 480.8,536.22', label:[636,710] },
    ],
    openPassages: [
      { x1:0, y1:269.1, x2:480.8, y2:269.1 },
    ],
    walls: [
      { x1:170, y1:269.1, x2:290.25, y2:269.1 },
    ],
    windows: [
      { x1:64, y1:0, x2:184, y2:0 },
      { x1:350, y1:0, x2:424, y2:0 },
      { x1:790.31, y1:205, x2:790.31, y2:273 },
      { x1:790.31, y1:378, x2:790.31, y2:444 },
      { x1:188, y1:1049.9, x2:400, y2:1049.9 },
    ],
    doors: [
      { x:480.8, y:42, length:86, orientation:'v', swing:'right', hinge:'end' },
      { x:480.8, y:188, length:72, orientation:'v', swing:'left', hinge:'start' },
      { x:480.8, y:390, length:72, orientation:'v', swing:'left', hinge:'start' },
      { x:480.8, y:598, length:98, orientation:'v', swing:'right', hinge:'end' },
      { x:640, y:530.64, length:72, orientation:'h', swing:'down', hinge:'end' },
      { x:45, y:1049.9, length:105, orientation:'h', swing:'up', hinge:'start' },
      { x:480.8, y:930, length:95, orientation:'v', swing:'left', hinge:'start' },
      { x:620, y:892.73, length:95, orientation:'h', swing:'up', hinge:'end' },
    ],
    stairs: { type:'u', x:5, y:405, w:285.25, h:245, label:'Trepp ↑' },
    terrace: {
      points:'0,1070 480.8,1070 480.8,892.73 900,892.73 900,1162 0,1162',
      segments:[
        { x:0, y:1070, w:900, h:92, slats:'v' },
        { x:480.8, y:892.73, w:419.2, h:177.27, slats:'h' },
      ],
      label:[450,1121], text:'TERRASS',
    },
    canopy: {
      x1:480.8, x2:790.31, yTop:0, yBottom:157.47,
      label:[635,78], text:'VARJUALUNE',
    },
    parking: {
      xLeft:-80,
      xRight:980,
      yTop:-300,
      yBottom:0,
      label:[450,-205],
      text:'PARKLA',
      vehicleGate:{ x1:150, x2:870, y:-300, direction:'right' },
      pedestrianGate:{ x1:-55, x2:95, y:-300, hinge:'start', swing:'down' },
      tesla:{ x:315, y:-255, w:330, h:150, label:'TESLA' },
      wallbox:{ x:452, y:0, label:'WALLBOX' },
      paving:{ x:900, y1:0, y2:892.73, label:'SILLUTUSKIVI' },
      wardrobe:{ x:290.25, y:92, w:52, h:177, label:'GARDEROOB' },
    },
  },
  2: {
    area: '68,9 m²',
    rooms: [
      { id:'room1', name:'Tuba 1', area:'17,3 m²', points:'431.72,659.18 431.72,892.94 481.4,892.94 790.31,892.94 790.31,386.14 431.72,386.14 431.72,659.18', label:[611,635] },
      { id:'bath', name:'Vannituba', area:'7,6 m²', points:'431.72,386.14 790.31,386.14 790.31,157.69 431.72,157.69 431.72,283.08 431.72,386.14', label:[611,267] },
      { id:'room3', name:'Tuba 3', area:'14,5 m²', points:'431.72,157.69 465.67,157.69 465.67,0 0,0 0,381.56 256.23,381.56 256.23,283.08 431.72,283.08 431.72,157.69', label:[216,137] },
      { id:'room2', name:'Tuba 2', area:'16,8 m²', points:'246.48,659.18 0,659.18 0,1050.69 481.4,1050.69 481.4,892.94 431.72,892.94 431.72,659.18 246.48,659.18', label:[216,850] },
      { id:'landing', name:'Trepihall', area:'11,4 m²', points:'431.72,659.18 431.72,386.14 431.72,283.08 256.23,283.08 256.23,381.56 0,381.56 0,659.18 431.72,659.18', label:[216,420] },
    ],
    openPassages: [], walls: [],
    windows: [
      { x1:78, y1:0, x2:190, y2:0 },
      { x1:205, y1:0, x2:317, y2:0 },
      { x1:790.31, y1:455, x2:790.31, y2:565 },
      { x1:790.31, y1:578, x2:790.31, y2:688 },
      { x1:145, y1:1050.69, x2:245, y2:1050.69 },
      { x1:255, y1:1050.69, x2:355, y2:1050.69 },
    ],
    doors: [
      { x:345, y:283.08, length:78, orientation:'h', swing:'up' },
      { x:431.72, y:292, length:74, orientation:'v', swing:'left' },
      { x:431.72, y:548, length:78, orientation:'v', swing:'right' },
      { x:346, y:659.18, length:78, orientation:'h', swing:'down' },
    ],
    stairs: { type:'straight', x:82, y:472, w:290, h:108, label:'Trepp ↑' },
  },
};

function WindowMark({ item }) {
  const dx = item.x2 - item.x1;
  const dy = item.y2 - item.y1;
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * 5;
  const ny = (dx / length) * 5;
  return (
    <g className="window-mark" aria-label="Aken">
      <line x1={item.x1 + nx} y1={item.y1 + ny} x2={item.x2 + nx} y2={item.y2 + ny} />
      <line x1={item.x1 - nx} y1={item.y1 - ny} x2={item.x2 - nx} y2={item.y2 - ny} />
    </g>
  );
}

function DoorMark({ item }) {
  const { x, y, length, orientation, swing, hinge = 'end' } = item;
  if (orientation === 'v') {
    const dir = swing === 'left' ? -1 : 1;
    const hingeY = hinge === 'start' ? y : y + length;
    const oppositeY = hinge === 'start' ? y + length : y;
    const sweep = hinge === 'start' ? (dir < 0 ? 1 : 0) : (dir < 0 ? 0 : 1);
    return (
      <g className="door-mark" aria-label="Uks">
        <line className="door-gap" x1={x} y1={y} x2={x} y2={y + length} />
        <line className="door-leaf" x1={x} y1={hingeY} x2={x + dir * length} y2={hingeY} />
        <path className="door-arc" d={`M ${x} ${oppositeY} A ${length} ${length} 0 0 ${sweep} ${x + dir * length} ${hingeY}`} />
      </g>
    );
  }
  const dir = swing === 'up' ? -1 : 1;
  const hingeX = hinge === 'start' ? x : x + length;
  const oppositeX = hinge === 'start' ? x + length : x;
  const sweep = hinge === 'start' ? (dir > 0 ? 1 : 0) : (dir > 0 ? 0 : 1);
  return (
    <g className="door-mark" aria-label="Uks">
      <line className="door-gap" x1={x} y1={y} x2={x + length} y2={y} />
      <line className="door-leaf" x1={hingeX} y1={y} x2={hingeX} y2={y + dir * length} />
      <path className="door-arc" d={`M ${oppositeX} ${y} A ${length} ${length} 0 0 ${sweep} ${hingeX} ${y + dir * length}`} />
    </g>
  );
}

function StraightStairs({ item }) {
  const stepCount = 7;
  const inset = 12;
  const usable = item.w - inset * 2;
  return (
    <g className="stairs-mark" aria-label="Trepp">
      <rect x={item.x} y={item.y} width={item.w} height={item.h} rx="4" />
      {Array.from({ length: stepCount }).map((_, index) => {
        const x = item.x + inset + (usable / (stepCount + 1)) * (index + 1);
        return <line key={index} x1={x} y1={item.y + 10} x2={x} y2={item.y + item.h - 10} />;
      })}
      <path d={`M ${item.x + 20} ${item.y + item.h / 2} H ${item.x + item.w - 28} M ${item.x + item.w - 42} ${item.y + item.h / 2 - 12} L ${item.x + item.w - 28} ${item.y + item.h / 2} L ${item.x + item.w - 42} ${item.y + item.h / 2 + 12}`} />
      <text x={item.x + item.w / 2} y={item.y - 12} textAnchor="middle">{item.label}</text>
    </g>
  );
}

function UStairs({ item }) {
  const { x, y, w, h } = item;
  const gap = 22;
  const flightH = (h - gap) / 2;
  const left = x + 12;
  const right = x + w - 12;
  const upperY = y + flightH / 2;
  const lowerY = y + flightH + gap + flightH / 2;
  const stepCount = 8;
  return (
    <g className="stairs-mark u-stairs" aria-label="U-kujuline trepp">
      <rect x={x} y={y} width={w} height={h} rx="5" />
      <line x1={x} y1={y + flightH + gap / 2} x2={x + w} y2={y + flightH + gap / 2} />
      {Array.from({ length: stepCount }).map((_, index) => {
        const sx = left + ((right - left) / (stepCount + 1)) * (index + 1);
        return <React.Fragment key={index}>
          <line x1={sx} y1={y + 8} x2={sx} y2={y + flightH - 8} />
          <line x1={sx} y1={y + flightH + gap + 8} x2={sx} y2={y + h - 8} />
        </React.Fragment>;
      })}
      <path d={`M ${right - 12} ${lowerY} H ${left + 14} Q ${left - 4} ${lowerY} ${left - 4} ${lowerY - 18} V ${upperY + 18} Q ${left - 4} ${upperY} ${left + 14} ${upperY} H ${right - 12}`} />
      <path d={`M ${right - 30} ${upperY - 12} L ${right - 12} ${upperY} L ${right - 30} ${upperY + 12}`} />
      <text x={x + w / 2} y={y - 12} textAnchor="middle">{item.label}</text>
    </g>
  );
}

function StairsMark({ item }) {
  if (!item) return null;
  return item.type === 'u' ? <UStairs item={item} /> : <StraightStairs item={item} />;
}

function TerraceMark({ item }) {
  if (!item) return null;
  return (
    <g className="terrace-mark" aria-label="Terrass">
      <polygon points={item.points} fill="rgba(255,255,255,.025)" stroke="rgba(226,234,242,.38)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      {(item.segments || []).map((segment, segmentIndex) => {
        const count = segment.slats === 'h' ? 7 : 18;
        return Array.from({ length: count }).map((_, index) => {
          if (segment.slats === 'h') {
            const sy = segment.y + (segment.h / count) * index;
            return <line key={`${segmentIndex}-${index}`} x1={segment.x + 8} y1={sy} x2={segment.x + segment.w - 8} y2={sy} stroke="rgba(226,234,242,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
          }
          const sx = segment.x + (segment.w / count) * index;
          return <line key={`${segmentIndex}-${index}`} x1={sx} y1={segment.y + 8} x2={sx} y2={segment.y + segment.h - 8} stroke="rgba(226,234,242,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
        });
      })}
      <text x={item.label[0]} y={item.label[1]} textAnchor="middle" fill="#718092" fontSize="18" letterSpacing="5">{item.text}</text>
    </g>
  );
}

function CanopyMark({ item }) {
  if (!item) return null;
  return (
    <g className="canopy-mark" aria-label="Varjualune">
      <line x1={item.x1} y1={item.yTop} x2={item.x2} y2={item.yTop} stroke="rgba(226,234,242,.42)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      <line x1={item.x2} y1={item.yTop} x2={item.x2} y2={item.yBottom} stroke="rgba(226,234,242,.42)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      <line x1={item.x1} y1={item.yBottom} x2={item.x2} y2={item.yBottom} stroke="rgba(226,234,242,.42)" strokeWidth="2" strokeDasharray="9 7" vectorEffect="non-scaling-stroke" />
      <text x={item.label[0]} y={item.label[1]} textAnchor="middle" fill="#718092" fontSize="15" letterSpacing="3">{item.text}</text>
    </g>
  );
}

function ParkingMark({ item }) {
  if (!item) return null;
  const gate = item.vehicleGate;
  const walk = item.pedestrianGate;
  const tesla = item.tesla;
  const wallbox = item.wallbox;
  const paving = item.paving;
  const wardrobe = item.wardrobe;
  return (
    <g className="parking-mark" aria-label="Parkla">
      <path d={`M ${item.xLeft} ${item.yBottom} V ${item.yTop} H ${item.xRight} V ${item.yBottom}`} fill="none" stroke="rgba(226,234,242,.38)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      <line x1={item.xLeft} y1={item.yBottom} x2={0} y2={item.yBottom} stroke="rgba(226,234,242,.38)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      <line x1={790.31} y1={item.yBottom} x2={item.xRight} y2={item.yBottom} stroke="rgba(226,234,242,.38)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      <text x={item.label[0]} y={item.label[1]} textAnchor="middle" fill="#718092" fontSize="18" letterSpacing="5">{item.text}</text>

      <g aria-label="Auto lükandvärav">
        <line x1={gate.x1} y1={gate.y} x2={gate.x2} y2={gate.y} stroke="#9b6b42" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={`M ${gate.x2 - 42} ${gate.y - 18} L ${gate.x2} ${gate.y} L ${gate.x2 - 42} ${gate.y + 18}`} fill="none" stroke="#9b6b42" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <text x={(gate.x1 + gate.x2) / 2} y={gate.y - 18} textAnchor="middle" fill="#8b735f" fontSize="13" letterSpacing="2">LÜKANDVÄRAV →</text>
      </g>

      <g aria-label="Jalgvärav">
        <line x1={walk.x1} y1={walk.y} x2={walk.x2} y2={walk.y} stroke="rgba(226,234,242,.78)" strokeWidth="6" vectorEffect="non-scaling-stroke" />
        <line x1={walk.x1} y1={walk.y} x2={walk.x1} y2={walk.y + (walk.x2 - walk.x1)} stroke="rgba(226,234,242,.7)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={`M ${walk.x2} ${walk.y} A ${walk.x2 - walk.x1} ${walk.x2 - walk.x1} 0 0 1 ${walk.x1} ${walk.y + (walk.x2 - walk.x1)}`} fill="none" stroke="rgba(226,234,242,.55)" strokeWidth="2" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
        <text x={(walk.x1 + walk.x2) / 2} y={walk.y + 82} textAnchor="middle" fill="#718092" fontSize="12" letterSpacing="2">JALGVÄRAV</text>
      </g>

      <g aria-label="Tesla parkimiskoht">
        <rect x={tesla.x} y={tesla.y} width={tesla.w} height={tesla.h} rx="18" fill="rgba(255,255,255,.018)" stroke="rgba(226,234,242,.24)" strokeWidth="2" strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
        <text x={tesla.x + tesla.w / 2} y={tesla.y + tesla.h / 2 + 6} textAnchor="middle" fill="#718092" fontSize="18" letterSpacing="4">{tesla.label}</text>
      </g>

      <g aria-label="Wallbox laadija">
        <rect x={wallbox.x - 14} y={wallbox.y - 18} width="28" height="36" rx="5" fill="#202832" stroke="rgba(226,234,242,.75)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d={`M ${wallbox.x + 4} ${wallbox.y - 8} L ${wallbox.x - 3} ${wallbox.y + 1} H ${wallbox.x + 3} L ${wallbox.x - 4} ${wallbox.y + 11}`} fill="none" stroke="rgba(226,234,242,.9)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <text x={wallbox.x} y={wallbox.y - 29} textAnchor="middle" fill="#718092" fontSize="11" letterSpacing="1.5">{wallbox.label}</text>
      </g>

      <g aria-label="Sillutuskivi serv">
        <line x1={paving.x} y1={paving.y1} x2={paving.x} y2={paving.y2} stroke="rgba(226,234,242,.48)" strokeWidth="3" strokeDasharray="8 7" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        <text x={paving.x + 18} y={(paving.y1 + paving.y2) / 2} transform={`rotate(90 ${paving.x + 18} ${(paving.y1 + paving.y2) / 2})`} textAnchor="middle" fill="#718092" fontSize="11" letterSpacing="2">{paving.label}</text>
      </g>

      <g aria-label="Garderoobikapp">
        <rect x={wardrobe.x} y={wardrobe.y} width={wardrobe.w} height={wardrobe.h} rx="3" fill="rgba(255,255,255,.035)" stroke="rgba(226,234,242,.55)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line x1={wardrobe.x + wardrobe.w / 2} y1={wardrobe.y + 8} x2={wardrobe.x + wardrobe.w / 2} y2={wardrobe.y + wardrobe.h - 8} stroke="rgba(226,234,242,.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <text x={wardrobe.x + wardrobe.w / 2} y={wardrobe.y + wardrobe.h / 2} transform={`rotate(-90 ${wardrobe.x + wardrobe.w / 2} ${wardrobe.y + wardrobe.h / 2})`} textAnchor="middle" fill="#718092" fontSize="10" letterSpacing="1.3">{wardrobe.label}</text>
      </g>
    </g>
  );
}

function FloorSvg({ floor, selected, onSelect }) {
  const data = floors[floor];
  const maskId = `wall-mask-${floor}`;
  const viewBox = floor === 1 ? '-130 -360 1160 1660' : '-90 -90 970 1230';
  return (
    <div className="scan-wrap">
      <svg className="scan-plan" viewBox={viewBox} role="img" aria-label={`${floor}. korruse parandatud 2D plaan`}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-150" y="-380" width="1200" height="1700">
            <rect x="-150" y="-380" width="1200" height="1700" fill="white" />
            {(data.openPassages || []).map((item, index) => (
              <line key={`open-${index}`} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} stroke="black" strokeWidth="12" strokeLinecap="butt" />
            ))}
          </mask>
        </defs>

        <ParkingMark item={data.parking} />
        <TerraceMark item={data.terrace} />
        <CanopyMark item={data.canopy} />

        <g className="room-layer">
          {data.rooms.map((room) => (
            <g key={room.id} className={`svg-room ${selected === room.id ? 'selected' : ''}`} onClick={() => onSelect(room.id)} role="button" tabIndex="0" onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(room.id)}>
              <polygon points={room.points} />
              <text x={room.label[0]} y={room.label[1]} textAnchor="middle" className="room-title">{room.name}</text>
              <text x={room.label[0]} y={room.label[1] + 23} textAnchor="middle" className="room-area">{room.area}</text>
            </g>
          ))}
        </g>

        <g className="wall-layer" mask={`url(#${maskId})`} aria-hidden="true">
          {data.rooms.map((room) => <polygon key={`wall-${room.id}`} points={room.points} />)}
        </g>

        <g aria-hidden="true">
          {(data.walls || []).map((wall, index) => (
            <line key={`manual-wall-${index}`} x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2} stroke="rgba(226,234,242,.72)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g className="opening-layer">
          {data.windows.map((item, index) => <WindowMark key={`window-${index}`} item={item} />)}
          {data.doors.map((item, index) => <DoorMark key={`door-${index}`} item={item} />)}
        </g>
        <StairsMark item={data.stairs} />
      </svg>
      <div className="scan-meta"><span>Parandatud 2D plaan · {floor}. korrus</span><strong>{data.area}</strong></div>
    </div>
  );
}

function FloorPlan({ floor }) {
  const [selected, setSelected] = useState(null);
  const room = floors[floor].rooms.find((item) => item.id === selected);
  return (
    <div className="floor-plan">
      <FloorSvg floor={floor} selected={selected} onSelect={(id) => setSelected(id === selected ? null : id)} />
      <div className="room-detail">
        {room ? <><span>VALITUD RUUM</span><strong>{room.name}</strong><small>{room.area} · siia lisame hiljem Home Assistanti olekud ja juhtimise</small></> : <><span>INTERAKTIIVNE PLAAN</span><strong>Puuduta ruumi</strong><small>2D plaan sisaldab nüüd ka parkla, väravad, Wallboxi, terrassi ja varjualust.</small></>}
      </div>
    </div>
  );
}

export default function App() {
  const [floor, setFloor] = useState(1);
  const now = useMemo(() => new Intl.DateTimeFormat('et-EE', { hour:'2-digit', minute:'2-digit', weekday:'long', day:'numeric', month:'long' }).format(new Date()), []);
  return (
    <main className="shell">
      <header className="topbar"><div><p className="eyebrow">HOME OS</p><h1>Kodu on korras</h1><p className="muted">{now}</p></div><div className="weather"><strong>17°</strong><span>Tallinn · vihmane</span></div></header>
      <section className="status-row"><article className="status-card"><span>Kodu</span><strong>Turvaline</strong><small>Uksed ja värav kontrollitud</small></article><article className="status-card"><span>Tesla</span><strong>74%</strong><small>Model Y · kodus</small></article><article className="status-card"><span>Energia</span><strong>1.8 kW</strong><small>Hetke tarbimine</small></article><article className="status-card"><span>Elekter</span><strong>8.7 s/kWh</strong><small>Praegune hind</small></article></section>
      <section className="content-grid">
        <article className="panel floor-panel"><div className="panel-head"><div><p className="eyebrow">POLYCAM SCAN · 138,4 M²</p><h2>Koduplaan</h2></div><div className="floor-switch">{[1,2].map((number) => <button className={floor === number ? 'active' : ''} key={number} onClick={() => setFloor(number)}>{number}. korrus</button>)}</div></div><FloorPlan floor={floor}/></article>
        <aside className="side-stack"><article className="panel quick-panel"><p className="eyebrow">STSEENID</p><h2>Kiirtoimingud</h2><div className="actions"><button>Õhtu</button><button>Head ööd</button><button>Kodust ära</button><button>Koristus</button></div></article><article className="panel assistant-panel"><p className="eyebrow">KODU ASSISTENT</p><h2>Küsi kodult</h2><p className="muted">Näiteks “Miks täna energiakulu suurem on?”</p><div className="ask-box">Küsi midagi… <span>→</span></div></article></aside>
      </section>
      <nav className="dock" aria-label="Peamenüü"><button className="selected">Kodu</button><button>Energia</button><button>Autod</button><button>Turvalisus</button><button>Veel</button></nav>
    </main>
  );
}
