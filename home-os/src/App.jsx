import React, { useMemo, useState } from 'react';

const rooms = {
  1: [
    { name: 'Elutuba', temp: '22.4°', status: 'Valgus sees' },
    { name: 'Köök', temp: '22.1°', status: 'Kõik korras' },
    { name: 'Esik', temp: '21.7°', status: 'Uks lukus' },
    { name: 'Vannituba', temp: '23.0°', status: 'Niiskus 58%' },
  ],
  2: [
    { name: 'Magamistuba', temp: '21.6°', status: 'Kõik korras' },
    { name: 'Poja tuba', temp: '22.0°', status: 'Kõik korras' },
    { name: 'Trepp / hall', temp: '21.9°', status: 'Valgus väljas' },
  ],
};

function FloorPlan({ floor }) {
  return (
    <div className="floor-plan" aria-label={`Korrus ${floor}`}>
      <div className="floor-label">{floor}. korrus</div>
      <div className="room-grid">
        {rooms[floor].map((room) => (
          <button className="room" key={room.name}>
            <span className="room-name">{room.name}</span>
            <span className="room-temp">{room.temp}</span>
            <span className="room-status">{room.status}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [floor, setFloor] = useState(1);
  const now = useMemo(() => new Intl.DateTimeFormat('et-EE', {
    hour: '2-digit', minute: '2-digit', weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date()), []);

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">HOME OS</p>
          <h1>Kodu on korras</h1>
          <p className="muted">{now}</p>
        </div>
        <div className="weather">
          <strong>17°</strong>
          <span>Tallinn · vihmane</span>
        </div>
      </header>

      <section className="status-row">
        <article className="status-card"><span>Kodu</span><strong>Turvaline</strong><small>Uksed ja värav kontrollitud</small></article>
        <article className="status-card"><span>Tesla</span><strong>74%</strong><small>Model Y · kodus</small></article>
        <article className="status-card"><span>Energia</span><strong>1.8 kW</strong><small>Hetke tarbimine</small></article>
        <article className="status-card"><span>Elekter</span><strong>8.7 s/kWh</strong><small>Praegune hind</small></article>
      </section>

      <section className="content-grid">
        <article className="panel floor-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">MAJA</p>
              <h2>Ruumid</h2>
            </div>
            <div className="floor-switch">
              {[1, 2].map((number) => (
                <button className={floor === number ? 'active' : ''} key={number} onClick={() => setFloor(number)}>
                  {number}. korrus
                </button>
              ))}
            </div>
          </div>
          <FloorPlan floor={floor} />
        </article>

        <aside className="side-stack">
          <article className="panel quick-panel">
            <p className="eyebrow">STSEENID</p>
            <h2>Kiirtoimingud</h2>
            <div className="actions">
              <button>Õhtu</button>
              <button>Head ööd</button>
              <button>Kodust ära</button>
              <button>Koristus</button>
            </div>
          </article>

          <article className="panel assistant-panel">
            <p className="eyebrow">KODU ASSISTENT</p>
            <h2>Küsi kodult</h2>
            <p className="muted">Näiteks “Miks täna energiakulu suurem on?”</p>
            <div className="ask-box">Küsi midagi… <span>→</span></div>
          </article>
        </aside>
      </section>

      <nav className="dock" aria-label="Peamenüü">
        <button className="selected">Kodu</button>
        <button>Energia</button>
        <button>Autod</button>
        <button>Turvalisus</button>
        <button>Veel</button>
      </nav>
    </main>
  );
}
