const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addLabel(group, x, y, text, size = 8) {
  const label = svgEl('text', {
    x, y, 'text-anchor': 'middle', fill: '#718092',
    'font-size': size, 'letter-spacing': 0.8,
  });
  label.textContent = text;
  group.appendChild(label);
}

function addKitchenFurniture(svg) {
  if (svg.querySelector('[data-kitchen-furniture]')) return;

  const group = svgEl('g', {
    'data-kitchen-furniture': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // L-kujuline köögimööbel: aknaalune rida ja parema seina rida kuni kõrge kapini.
  group.appendChild(svgEl('rect', { x: 0, y: 0, width: 224, height: 58, rx: 3, ...common }));
  group.appendChild(svgEl('rect', { x: 224, y: 0, width: 58, height: 188, rx: 3, ...common }));

  // Veiniriiul ülemises vasakus nurgas seinal, aknast vasakul.
  const wineRack = svgEl('g', { 'aria-label': 'Veiniriiul' });
  wineRack.appendChild(svgEl('rect', {
    x: 8, y: 6, width: 38, height: 46, rx: 2,
    fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke',
  }));
  [[18,17],[36,17],[18,29],[36,29],[18,41],[36,41]].forEach(([cx,cy]) => {
    wineRack.appendChild(svgEl('circle', {
      cx, cy, r: 4.5, fill: 'none', stroke: 'rgba(226,234,242,.4)',
      'stroke-width': 1.1, 'vector-effect': 'non-scaling-stroke',
    }));
  });
  group.appendChild(wineRack);

  // Valamu akna all.
  group.appendChild(svgEl('rect', {
    x: 82, y: 10, width: 66, height: 38, rx: 8,
    fill: 'none', stroke: 'rgba(226,234,242,.55)',
    'stroke-width': 1.7, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(svgEl('circle', {
    cx: 115, cy: 29, r: 3,
    fill: 'none', stroke: 'rgba(226,234,242,.45)',
    'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke',
  }));

  // Pliidiplaat parempoolsel tööpinnal, vahetult kõrge kapi kõrval.
  const hob = svgEl('g', { 'aria-label': 'Pliidiplaat' });
  hob.appendChild(svgEl('rect', {
    x: 234, y: 133, width: 38, height: 55, rx: 2,
    fill: 'none', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  [[244,147],[261,147],[244,172],[261,172]].forEach(([cx,cy]) => {
    hob.appendChild(svgEl('circle', {
      cx, cy, r: 6, fill: 'none', stroke: 'rgba(226,234,242,.35)',
      'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke',
    }));
  });
  group.appendChild(hob);

  // Kõrge kapiplokk köögi paremas alumises nurgas koos ahju/mikrolaineahju tsooniga.
  group.appendChild(svgEl('rect', { x: 224, y: 188, width: 58, height: 81, rx: 2, ...common }));
  group.appendChild(svgEl('rect', {
    x: 233, y: 201, width: 40, height: 31, rx: 2,
    fill: 'none', stroke: 'rgba(226,234,242,.52)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  addLabel(group, 253, 252, 'KÕRGE KAPP', 6.5);

  // Pikk kapp vahetult kõrge kapi all, kasutaja märgitud asukohas.
  group.appendChild(svgEl('rect', {
    x: 224, y: 269.1, width: 58, height: 52, rx: 2,
    ...common,
  }));
  addLabel(group, 253, 300, 'KAPP', 6.5);

  // Alumine sein jääb kõrge kapi juures alles. Kapi järel on vahekäik kööki.
  group.appendChild(svgEl('line', {
    x1: 170, y1: 269.1, x2: 224.14, y2: 269.1,
    stroke: '#151a20', 'stroke-width': 8,
    'stroke-linecap': 'butt', 'vector-effect': 'non-scaling-stroke',
  }));

  // Kõrge baar-/söögilaud avatud poolel.
  group.appendChild(svgEl('rect', {
    x: 22, y: 145, width: 150, height: 62, rx: 4,
    fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
  }));
  addLabel(group, 97, 180, 'LAUD', 8);

  // Kolm tooli laua ümber.
  [[38,228],[94,228],[150,228]].forEach(([cx,cy]) => {
    group.appendChild(svgEl('circle', {
      cx, cy, r: 18,
      fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.42)',
      'stroke-width': 1.7, 'vector-effect': 'non-scaling-stroke',
    }));
  });

  // Robottolmuimeja ja dokk vasaku seina ääres, vahetult enne treppi.
  const vacuum = svgEl('g', { 'aria-label': 'Robottolmuimeja ja dokk' });
  vacuum.appendChild(svgEl('rect', {
    x: 4, y: 348, width: 20, height: 48, rx: 3,
    fill: 'rgba(255,255,255,.045)', stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 1.7, 'vector-effect': 'non-scaling-stroke',
  }));
  vacuum.appendChild(svgEl('circle', {
    cx: 45, cy: 374, r: 19,
    fill: 'rgba(255,255,255,.03)', stroke: 'rgba(226,234,242,.55)',
    'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke',
  }));
  vacuum.appendChild(svgEl('circle', {
    cx: 45, cy: 374, r: 4,
    fill: 'none', stroke: 'rgba(226,234,242,.35)',
    'stroke-width': 1.1, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(vacuum);

  svg.appendChild(group);
}

function syncKitchenOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addKitchenFurniture(svg);
}

export function installKitchenOverlay() {
  syncKitchenOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncKitchenOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
