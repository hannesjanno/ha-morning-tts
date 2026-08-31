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
    stairs: { x:380, y:700, w:90, h:120, label:'Trepp' },
  },
  2: {
    area: '68,9 m²',
    rooms: [
      { id:'room1', name:'Tuba 1', area:'17,3 m²', points:'431.72,659.18 431.72,892.94 481.4,892.94 790.31,892.94 790.31,386.14 431.72,386.14 431.72,659.18', label:[611,635] },
      { id:'bath', name:'Vannituba', area:'7,6 m²', points:'431.72,386.14 790.31,386.14 790.31,157.69 431.72,157.69 431.72,283.08 431.72,386.14', label:[611,267] },
      { id:'stair', name:'Trepp', area:'1,3 m²', points:'0,595.89 0,659.18 246.48,659.18 246.48,595.89 0,595.89', label:[123,623] },
      { id:'room3', name:'Tuba 3', area:'14,5 m²', points:'431.72,157.69 465.67,157.69 465.67,0 0,0 0,381.56 256.23,381.56 256.23,283.08 431.72,283.08 431.72,157.69', label:[216,137] },
      { id:'room2', name:'Tuba 2', area:'16,8 m²', points:'246.48,659.18 0,659.18 0,1050.69 481.4,1050.69 481.4,892.94 431.72,892.94 431.72,659.18 246.48,659.18', label:[216,850] },
      { id:'landing', name:'Trepihall', area:'11,4 m²', points:'431.72,659.18 431.72,386.14 431.72,283.08 256.23,283.08 256.23,381.56 0,381.56 0,595.89 246.48,595.89 246.48,659.18 431.72,659.18', label:[216,484] },
    ],
  },
};

function FloorSvg({ floor, selected, onSelect }) {
  const data = floors[floor];
  return (
    <div className="scan-wrap">
      <svg className="scan-plan" viewBox="-18 -18 826 1087" role="img" aria-label={`${floor}. korruse Polycam skänni järgi plaan`}>
        <g className="room-layer">
          {data.rooms.map((room) => (
            <g key={room.id} className={`svg-room ${selected === room.id ? 'selected' : ''}`} onClick={() => onSelect(room.id)} role="button" tabIndex="0" onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(room.id)}>
              <polygon points={room.points} />
              <text x={room.label[0]} y={room.label[1]} textAnchor="middle" className="room-title">{room.name}</text>
              <text x={room.label[0]} y={room.label[1] + 23} textAnchor="middle" className="room-area">{room.area}</text>
            </g>
          ))}
        </g>
        {floor === 1 && <g className="stairs-mark"><rect x="382" y="704" width="84" height="116" rx="4"/><path d="M392 806h64M392 790h64M392 774h64M392 758h64M392 742h64M392 726h64"/><text x="424" y="695" textAnchor="middle">Trepp ↑</text></g>}
      </svg>
      <div className="scan-meta"><span>Polycam · {floor}. korrus</span><strong>{data.area}</strong></div>
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
        {room ? <><span>VALITUD RUUM</span><strong>{room.name}</strong><small>{room.area} · siia lisame hiljem Home Assistanti olekud ja juhtimise</small></> : <><span>INTERAKTIIVNE PLAAN</span><strong>Puuduta ruumi</strong><small>Ruumide kuju ja proportsioonid pärinevad Polycami skännist.</small></>}
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
