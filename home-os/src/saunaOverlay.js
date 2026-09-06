const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addFirstFloorSaunaFixtures(svg) {
  if (svg.querySelector('[data-first-floor-sauna]')) return;

  const group = svgEl('g', {
    'data-first-floor-sauna': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // Lava sauna parema seina ääres.
  group.appendChild(svgEl('rect', {
    x: 724, y: 338, width: 54, height: 178, rx: 3,
    ...common,
  }));

  // Lava liistud.
  [350, 376, 402, 428, 454, 480, 506].forEach((y) => {
    group.appendChild(svgEl('line', {
      x1: 731, y1: y, x2: 771, y2: y,
      stroke: 'rgba(226,234,242,.22)', 'stroke-width': 1,
      'vector-effect': 'non-scaling-stroke',
    }));
  });

  // Keris sauna vasakus ülemises nurgas.
  group.appendChild(svgEl('rect', {
    x: 614, y: 338, width: 48, height: 48, rx: 4,
    ...common,
  }));

  // Kerisekivid.
  [[626,350],[642,350],[634,365],[650,365]].forEach(([cx, cy]) => {
    group.appendChild(svgEl('circle', {
      cx, cy, r: 5,
      fill: 'none', stroke: 'rgba(226,234,242,.38)',
      'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke',
    }));
  });

  svg.appendChild(group);
}

function syncFirstFloorSaunaOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addFirstFloorSaunaFixtures(svg);
}

export function installFirstFloorSaunaOverlay() {
  syncFirstFloorSaunaOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncFirstFloorSaunaOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
