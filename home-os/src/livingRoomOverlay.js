const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addLivingRoomFurniture(svg) {
  if (svg.querySelector('[data-living-room-furniture]')) return;

  const group = svgEl('g', {
    'data-living-room-furniture': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // L-kujuline diivan trepi all vasakus elutoa osas.
  group.appendChild(svgEl('rect', {
    x: 4, y: 660, width: 286, height: 62, rx: 8,
    ...common,
  }));
  group.appendChild(svgEl('rect', {
    x: 4, y: 660, width: 58, height: 190, rx: 8,
    ...common,
  }));

  // Ümmargune söögilaud kamina lähedal.
  group.appendChild(svgEl('circle', {
    cx: 388, cy: 820, r: 48,
    fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
  }));

  // Kolm tooli laua ümber.
  [[332,820],[356,758],[446,782]].forEach(([cx, cy]) => {
    group.appendChild(svgEl('circle', {
      cx, cy, r: 18,
      fill: 'rgba(255,255,255,.025)', stroke: 'rgba(226,234,242,.42)',
      'stroke-width': 1.7, 'vector-effect': 'non-scaling-stroke',
    }));
  });

  // Seinale kinnitatud TV alumises vasakus servas.
  group.appendChild(svgEl('rect', {
    x: 6, y: 1027, width: 92, height: 10, rx: 2,
    fill: 'rgba(255,255,255,.045)', stroke: 'rgba(226,234,242,.6)',
    'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke',
  }));

  // Kummut TV all / ees ruumi pool.
  group.appendChild(svgEl('rect', {
    x: 8, y: 990, width: 88, height: 28, rx: 3,
    ...common,
  }));

  svg.appendChild(group);
}

function syncLivingRoomOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addLivingRoomFurniture(svg);
}

export function installLivingRoomOverlay() {
  syncLivingRoomOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncLivingRoomOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
