import React, { useMemo, useState } from 'react';

const floor2Rooms = [
  { name: 'Trepihall', area: '12,8 m²' },
  { name: 'Tuba 1', area: '17,8 m²' },
  { name: 'Tuba 2', area: '21,9 m²' },
  { name: 'Tuba 3', area: '13,4 m²' },
  { name: 'Vannituba', area: '5,0 m²' },
];

function Room({ className = '', name, area, note }) {
  return (
    <button className={`plan-room ${className}`}>
      <span className="plan-room-name">{name}</span>
      {area && <span className="plan-room-area">{area}</span>}
      {note && <span className="plan-room-note">{note}</span>}
    </button>
  );
}

function GroundFloor() {
  return (
    <div className="apartment-wrap">
      <div className="apartment-plan ground-floor" aria-label="Korter 1 esimese korruse plaan">
        <Room className="utility" name="Abiruum" area="4,4 m²" />
        <Room className="hall" name="Esik" area="4,4 m²" />
        <Room className="wc" name="WC" area="2,0 m²" />
        <Room className="wash" name="Pesuruum" area="10,4 m²" />
        <Room className="sauna" name="Saun" area="3,6 m²" />
        <Room className="living" name="Köök · Elutuba" area="45,3 m²" note="Terrassile" />
        <div className="stairs" aria-label="Trepp teisele korrusele">
          <span>↑</span><small>2. korrus</small>
        </div>
        <div className="terrace">TERRASS</div>
      </div>
      <p className="plan-caption">Korter 1 · arhitektuurijoonise AR-2 järgi</p>
    </div>
  );
}

function UpperFloor() {
  return (
    <div className="apartment-wrap">
      <div className="upper-placeholder">
        <div className="upper-head">
          <span>2. korrus</span>
          <small>Esialgne ruumijaotus</small>
        </div>
        <div className="upper-grid">
          {floor2Rooms.map((room) => <Room key={room.name} name={room.name} area={room.area} />)}
        </div>
        <p>Täpne AR-3 korruseplaan puudub. Ruumid ja pindalad pärinevad projekti Korter 1 tabelist; paigutuse viime hiljem vastavusse tegeliku koduga.</p>
      </div>
    </div>
  );
}

function FloorPlan({ floor }) {
  return <div className="floor-plan">{floor === 1 ? <GroundFloor /> : <UpperFloor />}</div>;
}

export default function App() {
  const [floor, setFloor] = useState(1);
  const now = useMemo(() => new Intl.DateTimeFormat('et-EE', {
    hour: '2-digit', minute: '2-digit', weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date()), []);

  return (
    <main className="shell">
      <header className="topbar">
        <div><p className="eyebrow">HOME OS</p><h1>Kodu on korras</h1><p className="muted">{now}</p></div>
        <div className="weather"><strong>17°</strong><span>Tallinn · vihmane</span></div>
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
            <div><p className="eyebrow">KORTER 1 · 141 M²</p><h2>Koduplaan</h2></div>
            <div className="floor-switch">
              {[1, 2].map((number) => <button className={floor === number ? 'active' : ''} key={number} onClick={() => setFloor(number)}>{number}. korrus</button>)}
            </div>
          </div>
          <FloorPlan floor={floor} />
        </article>

        <aside className="side-stack">
          <article className="panel quick-panel"><p className="eyebrow">STSEENID</p><h2>Kiirtoimingud</h2><div className="actions"><button>Õhtu</button><button>Head ööd</button><button>Kodust ära</button><button>Koristus</button></div></article>
          <article className="panel assistant-panel"><p className="eyebrow">KODU ASSISTENT</p><h2>Küsi kodult</h2><p className="muted">Näiteks “Miks täna energiakulu suurem on?”</p><div className="ask-box">Küsi midagi… <span>→</span></div></article>
        </aside>
      </section>

      <nav className="dock" aria-label="Peamenüü"><button className="selected">Kodu</button><button>Energia</button><button>Autod</button><button>Turvalisus</button><button>Veel</button></nav>
    </main>
  );
}
