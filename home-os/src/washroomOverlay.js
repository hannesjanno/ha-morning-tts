const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addFirstFloorWashroomFixtures(svg) {
  if (svg.querySelector('[data-first-floor-washroom]')) return;

  const group = svgEl('g', {
    'data-first-floor-washroom': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // Dušš pesuruumi paremas ülanurgas.
  group.appendChild(svgEl('rect', {
    x: 690, y: 548, width: 88, height: 72, rx: 4,
    ...common,
  }));
  group.appendChild(svgEl('circle', {
    cx: 748, cy: 564, r: 7,
    fill: 'none', stroke: 'rgba(226,234,242,.4)',
    'stroke-width': 1.3, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(svgEl('line', {
    x1: 748, y1: 571, x2: 732, y2: 592,
    stroke: 'rgba(226,234,242,.35)', 'stroke-width': 1.3,
    'vector-effect': 'non-scaling-stroke',
  }));

  // Vahesein duši ja koeravanni vahel.
  group.appendChild(svgEl('line', {
    x1: 685, y1: 630, x2: 785, y2: 630,
    stroke: 'rgba(226,234,242,.72)', 'stroke-width': 4,
    'vector-effect': 'non-scaling-stroke',
  }));

  // Koera vann vaheseina all parema seina ääres.
  group.appendChild(svgEl('rect', {
    x: 690, y: 640, width: 88, height: 86, rx: 6,
    ...common,
  }));
  group.appendChild(svgEl('ellipse', {
    cx: 734, cy: 683, rx: 28, ry: 20,
    fill: 'none', stroke: 'rgba(226,234,242,.4)',
    'stroke-width': 1.4, 'vector-effect': 'non-scaling-stroke',
  }));

  // Pesumasin pesuruumi paremas alanurgas.
  group.appendChild(svgEl('rect', {
    x: 705, y: 817, width: 72, height: 68, rx: 4,
    ...common,
  }));
  group.appendChild(svgEl('circle', {
    cx: 741, cy: 851, r: 22,
    fill: 'none', stroke: 'rgba(226,234,242,.43)',
    'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(svgEl('circle', {
    cx: 741, cy: 851, r: 13,
    fill: 'none', stroke: 'rgba(226,234,242,.25)',
    'stroke-width': 1.1, 'vector-effect': 'non-scaling-stroke',
  }));

  svg.appendChild(group);
}

function syncFirstFloorWashroomOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addFirstFloorWashroomFixtures(svg);
}

export function installFirstFloorWashroomOverlay() {
  syncFirstFloorWashroomOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncFirstFloorWashroomOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
