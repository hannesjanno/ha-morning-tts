const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addFirstFloorWcFixtures(svg) {
  if (svg.querySelector('[data-first-floor-wc]')) return;

  const group = svgEl('g', {
    'data-first-floor-wc': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // Valamukapp WC ülemise seina ääres.
  group.appendChild(svgEl('rect', {
    x: 497, y: 338, width: 86, height: 46, rx: 4,
    ...common,
  }));

  // Valamu valamukapi sees.
  group.appendChild(svgEl('ellipse', {
    cx: 540, cy: 360, rx: 27, ry: 13,
    fill: 'none', stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(svgEl('circle', {
    cx: 540, cy: 360, r: 2.5,
    fill: 'none', stroke: 'rgba(226,234,242,.35)',
    'stroke-width': 1, 'vector-effect': 'non-scaling-stroke',
  }));

  // Seinale paigaldatud loputuskast alumise seina ääres.
  group.appendChild(svgEl('rect', {
    x: 493, y: 508, width: 94, height: 24, rx: 2,
    ...common,
  }));

  // Seina-WC pott, mis ulatub loputuskastist ruumi poole.
  group.appendChild(svgEl('rect', {
    x: 519, y: 470, width: 42, height: 38, rx: 7,
    fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(svgEl('ellipse', {
    cx: 540, cy: 489, rx: 12, ry: 9,
    fill: 'none', stroke: 'rgba(226,234,242,.4)',
    'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke',
  }));

  svg.appendChild(group);
}

function syncFirstFloorWcOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addFirstFloorWcFixtures(svg);
}

export function installFirstFloorWcOverlay() {
  syncFirstFloorWcOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncFirstFloorWcOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
