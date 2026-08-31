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
      { x1:62, y1:1049.9, x2:168, y2:1049.9 },
      { x1:188, y1:1049.9, x2:410, y2:1049.9 },
      { x1:650, y1:892.73, x2:735, y2:892.73 },
    ],
    doors: [
      { x:480.8, y:42, length:86, orientation:'v', swing:'left' },
      { x:480.8, y:188, length:72, orientation:'v', swing:'right' },
      { x:480.8, y:390, length:72, orientation:'v', swing:'left' },
      { x:480.8, y:598, length:98, orientation:'v', swing:'left' },
      { x:640, y:530.64, length:72, orientation:'h', swing:'down' },
      { x:480.8, y:940, length:86, orientation:'v', swing:'left' },
    ],
    stairs: {
      type:'u',
      x:175,
      y:405,
      w:285,
      h:245,
      label:'Trepp ↑',
    },
    terrace: { x:0, y:1070, w:790.31, h:92, label:'TERRASS' },
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
    openPassages: [],
    walls: [],
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
  const { x, y, length, orientation, swing } = item;
  if (orientation === 'v') {
    const dir = swing === 'left' ? -1 : 1;
    return (
      <g className="door-mark" aria-label="Uks">
        <line className="door-gap" x1={x} y1={y} x2={x} y2={y + length} />
        <line className="door-leaf" x1={x} y1={y + length} x2={x + dir * length} y2={y + length} />
        <path className="door-arc" d={`M ${x} ${y} A ${length} ${length} 0 0 ${dir < 0 ? 0 : 1} ${x + dir * length} ${y + length}`} />
      </g>
    );
  }
  const dir = swing === 'up' ? -1 : 1;
  return (
    <g className="door-mark" aria-label="Uks">
      <line className="door-gap" x1={x} y1={y} x2={x + length} y2={y} />
      <line className="door-leaf" x1={x} y1={y} x2={x} y2={y + dir * length} />
      <path className="door-arc" d={`M ${x + length} ${y} A ${length} ${length} 0 0 ${dir > 0 ? 1 : 0} ${x} ${y + dir * length}`} />
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
  const slatCount = 18;
  return (
    <g className="terrace-mark" aria-label="Terrass">
      <rect x={item.x} y={item.y} width={item.w} height={item.h} rx="4" fill="rgba(255,255,255,.025)" stroke="rgba(226,234,242,.38)" strokeWidth="2" strokeDasharray="8 7" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: slatCount }).map((_, index) => {
        const sx = item.x + (item.w / slatCount) * index;
        return <line key={index} x1={sx} y1={item.y + 8} x2={sx} y2={item.y + item.h - 8} stroke="rgba(226,234,242,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
      })}
      <text x={item.x + item.w / 2} y={item.y + item.h / 2 + 6} textAnchor="middle" fill="#718092" fontSize="18" letterSpacing="5">{item.label}</text>
    </g>
  );
}

function FloorSvg({ floor, selected, onSelect }) {
  const data = floors[floor];
  const maskId = `wall-mask-${floor}`;
  const viewBox = floor === 1 ? '-90 -90 970 1345' : '-90 -90 970 1230';
  return (
    <div className="scan-wrap">
      <svg className="scan-plan" viewBox={viewBox} role="img" aria-label={`${floor}. korruse parandatud 2D plaan`}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1000" height="1400">
            <rect x="-100" y="-100" width="1000" height="1400" fill="white" />
            {(data.openPassages || []).map((item, index) => (
              <line key={`open-${index}`} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} stroke="black" strokeWidth="12" strokeLinecap="butt" />
            ))}
          </mask>
        </defs>

        <TerraceMark item={data.terrace} />

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
        {room ? <><span>VALITUD RUUM</span><strong>{room.name}</strong><small>{room.area} · siia lisame hiljem Home Assistanti olekud ja juhtimise</small></> : <><span>INTERAKTIIVNE PLAAN</span><strong>Puuduta ruumi</strong><small>2D plaani seinad, uksed, aknad, trepp ja terrass on täpsustatud Polycami, projekti, fotode ja sinu märkuste järgi.</small></>}
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
