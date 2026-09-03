const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function rect(group, x, y, width, height, label, type, rx = 4) {
  const g = svgEl('g', { 'data-furniture-type': type, 'aria-label': label });
  g.appendChild(svgEl('rect', {
    x, y, width, height, rx,
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  if (label) {
    const t = svgEl('text', {
      x: x + width / 2,
      y: y + height / 2 + 4,
      'text-anchor': 'middle', fill: '#718092', 'font-size': 9, 'letter-spacing': 1,
    });
    t.textContent = label;
    g.appendChild(t);
  }
  group.appendChild(g);
  return g;
}

function addBedroomFurniture(svg) {
  if (svg.querySelector('[data-bedroom-furniture]')) return;
  const group = svgEl('g', { 'data-bedroom-furniture': 'true', 'pointer-events': 'none' });

  // Kaheinimesevoodi: peats vastu vasakut seina, toa keskel.
  const bed = rect(group, 5, 780, 255, 185, 'VOODI', 'bed', 8);
  bed.appendChild(svgEl('line', {
    x1: 5, y1: 780, x2: 5, y2: 965,
    stroke: 'rgba(226,234,242,.72)', 'stroke-width': 5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 18, y: 794, width: 48, height: 70, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 18, y: 880, width: 48, height: 70, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));

  // Öökapp vasakus alumises nurgas, enne voodit.
  rect(group, 5, 980, 58, 58, 'ÖÖKAPP', 'nightstand', 3);

  // Kummut ja TV parema seina ääres, veidi madalamal Mareki toa vasaku alumise nurga joone järgi.
  rect(group, 421, 770, 58, 125, 'KUMMUT', 'cabinet', 2);
  rect(group, 435, 788, 30, 88, 'TV', 'tv', 2);

  // Kompaktsem tugitool kummuti ja alumise seina vahel.
  const chair = svgEl('g', { 'data-furniture-type': 'armchair', 'aria-label': 'Tugitool' });
  chair.appendChild(svgEl('rect', {
    x: 405, y: 982, width: 68, height: 58, rx: 15,
    fill: 'rgba(255,255,255,.035)', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(chair);

  // Ümmargune laud tugitooli kõrval, ilma kattumiseta.
  const table = svgEl('g', { 'data-furniture-type': 'side-table', 'aria-label': 'Väike laud' });
  table.appendChild(svgEl('circle', {
    cx: 381, cy: 984, r: 20,
    fill: 'rgba(255,255,255,.035)', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(table);

  svg.appendChild(group);
}

function syncBedroomOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="2. korruse parandatud 2D plaan"]');
  if (svg) addBedroomFurniture(svg);
}

export function installBedroomOverlay() {
  syncBedroomOverlay();
  const observer = new MutationObserver(syncBedroomOverlay);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true, attributes: true });
  return () => observer.disconnect();
}
