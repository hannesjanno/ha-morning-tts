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

  // Kaheinimesevoodi: peats vastu magamistoa ülemist seina.
  const bed = rect(group, 155, 730, 205, 255, 'VOODI', 'bed', 8);
  bed.appendChild(svgEl('line', {
    x1: 155, y1: 730, x2: 360, y2: 730,
    stroke: 'rgba(226,234,242,.72)', 'stroke-width': 5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 170, y: 744, width: 78, height: 46, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 267, y: 744, width: 78, height: 46, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));

  // Väike öökapp voodi ja vasaku aknaseina vahel.
  rect(group, 92, 730, 52, 58, 'ÖÖKAPP', 'nightstand', 3);

  // Fotodel nähtav suur lükandustega garderoob paremal seinal.
  rect(group, 421, 730, 58, 245, 'GARDEROOB', 'wardrobe', 2);

  // TV ja selle all olev kummut uksepoolsel seinal.
  rect(group, 365, 675, 105, 42, 'TV', 'tv', 2);
  rect(group, 340, 620, 130, 48, 'KUMMUT', 'cabinet', 2);

  // Akna juures tugitool ja väike ümmargune laud.
  const chair = svgEl('g', { 'data-furniture-type': 'armchair', 'aria-label': 'Tugitool' });
  chair.appendChild(svgEl('rect', {
    x: 18, y: 820, width: 82, height: 92, rx: 18,
    fill: 'rgba(255,255,255,.035)', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(chair);

  const table = svgEl('g', { 'data-furniture-type': 'side-table', 'aria-label': 'Väike laud' });
  table.appendChild(svgEl('circle', {
    cx: 112, cy: 842, r: 24,
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
