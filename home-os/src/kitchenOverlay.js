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

  // L-kujuline köögimööbel: aknaalune rida ja parema seina rida.
  group.appendChild(svgEl('rect', { x: 0, y: 0, width: 224, height: 58, rx: 3, ...common }));
  group.appendChild(svgEl('rect', { x: 224, y: 0, width: 58, height: 218, rx: 3, ...common }));

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

  // Pliidiplaat parempoolsel tööpinnal.
  const hob = svgEl('g', { 'aria-label': 'Pliidiplaat' });
  hob.appendChild(svgEl('rect', {
    x: 234, y: 76, width: 38, height: 55, rx: 2,
    fill: 'none', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  [[244,90],[261,90],[244,115],[261,115]].forEach(([cx,cy]) => {
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
