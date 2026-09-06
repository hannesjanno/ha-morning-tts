const NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function addLabel(group, x, y, text, size = 8) {
  const label = svgEl('text', {
    x, y, 'text-anchor': 'middle', fill: '#718092',
    'font-size': size, 'letter-spacing': 0.7,
  });
  label.textContent = text;
  group.appendChild(label);
}

function addFirstFloorUtilityRoomEquipment(svg) {
  if (svg.querySelector('[data-first-floor-utility-room]')) return;

  const group = svgEl('g', {
    'data-first-floor-utility-room': 'true',
    'pointer-events': 'none',
  });

  const common = {
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.5)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  };

  // Tööriistariiul abiruumi paremas ülanurgas.
  group.appendChild(svgEl('rect', {
    x: 734, y: 168, width: 44, height: 88, rx: 3,
    ...common,
  }));
  [186, 204, 222, 240].forEach((y) => {
    group.appendChild(svgEl('line', {
      x1: 740, y1: y, x2: 772, y2: y,
      stroke: 'rgba(226,234,242,.28)', 'stroke-width': 1,
      'vector-effect': 'non-scaling-stroke',
    }));
  });
  addLabel(group, 756, 250, 'RIIUL', 6.2);

  // Daikin soojuspump tööriistariiuli all.
  group.appendChild(svgEl('rect', {
    x: 734, y: 267, width: 44, height: 49, rx: 3,
    ...common,
  }));
  group.appendChild(svgEl('circle', {
    cx: 756, cy: 291, r: 11,
    fill: 'none', stroke: 'rgba(226,234,242,.38)',
    'stroke-width': 1.3, 'vector-effect': 'non-scaling-stroke',
  }));
  addLabel(group, 756, 311, 'DAIKIN', 5.8);

  // Lakke paigaldatud Komfoventi sundventilatsiooni seade Daikinist vasakul.
  group.appendChild(svgEl('rect', {
    x: 565, y: 236, width: 154, height: 69, rx: 4,
    ...common,
  }));
  group.appendChild(svgEl('line', {
    x1: 575, y1: 270, x2: 709, y2: 270,
    stroke: 'rgba(226,234,242,.24)', 'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke',
  }));
  addLabel(group, 642, 277, 'KOMFOVENT', 7);

  svg.appendChild(group);
}

function syncFirstFloorUtilityRoomOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="1. korruse parandatud 2D plaan"]');
  if (svg) addFirstFloorUtilityRoomEquipment(svg);
}

export function installFirstFloorUtilityRoomOverlay() {
  syncFirstFloorUtilityRoomOverlay();
  const root = document.getElementById('root');
  if (!root) return () => {};
  const observer = new MutationObserver(syncFirstFloorUtilityRoomOverlay);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
