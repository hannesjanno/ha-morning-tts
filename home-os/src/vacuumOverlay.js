const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addVacuum(svg) {
  if (svg.querySelector('[data-guest-room-vacuum]')) return;

  const group = svgEl('g', {
    'data-guest-room-vacuum': 'true',
    'pointer-events': 'none',
    'aria-label': 'Robottolmuimeja ja dokk',
  });

  group.appendChild(svgEl('rect', {
    x: 392, y: 96, width: 58, height: 34, rx: 4,
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.52)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));

  group.appendChild(svgEl('circle', {
    cx: 421, cy: 151, r: 22,
    fill: 'rgba(255,255,255,.025)',
    stroke: 'rgba(226,234,242,.52)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));

  group.appendChild(svgEl('circle', {
    cx: 421, cy: 151, r: 5,
    fill: 'none',
    stroke: 'rgba(226,234,242,.32)',
    'stroke-width': 1.5,
    'vector-effect': 'non-scaling-stroke',
  }));

  svg.appendChild(group);
}

function syncVacuumOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="2. korruse parandatud 2D plaan"]');
  if (svg) addVacuum(svg);
}

export function installVacuumOverlay() {
  syncVacuumOverlay();
  const observer = new MutationObserver(syncVacuumOverlay);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true, attributes: true });
  return () => observer.disconnect();
}
