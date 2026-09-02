const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
  return el;
}

function addRect(group, { x, y, w, h, rx = 4, label, type }) {
  const item = svgEl('g', {
    'data-furniture-type': type,
    'aria-label': label,
  });

  item.appendChild(svgEl('rect', {
    x, y, width: w, height: h, rx,
    fill: 'rgba(255,255,255,.035)',
    stroke: 'rgba(226,234,242,.48)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));

  if (label) {
    const text = svgEl('text', {
      x: x + w / 2,
      y: y + h / 2 + 4,
      'text-anchor': 'middle',
      fill: '#718092',
      'font-size': 10,
      'letter-spacing': 1.2,
    });
    text.textContent = label;
    item.appendChild(text);
  }

  group.appendChild(item);
  return item;
}

function adjustGuestRoomWindows(svg) {
  if (svg.dataset.guestRoomWindowsAdjusted === 'true') return;

  const windowMarks = svg.querySelectorAll('.window-mark');
  if (windowMarks.length < 2) return;

  const positions = [
    { x1: 170, x2: 245 },
    { x1: 252, x2: 330 },
  ];

  positions.forEach((pos, index) => {
    const lines = windowMarks[index].querySelectorAll('line');
    lines.forEach(line => {
      line.setAttribute('x1', pos.x1);
      line.setAttribute('x2', pos.x2);
    });
  });

  svg.dataset.guestRoomWindowsAdjusted = 'true';
}

function addGuestRoomFurniture(svg) {
  adjustGuestRoomWindows(svg);
  if (svg.querySelector('[data-guest-room-furniture]')) return;

  const group = svgEl('g', {
    'data-guest-room-furniture': 'true',
    'pointer-events': 'none',
  });

  const bed = addRect(group, {
    x: 80, y: 145, w: 150, h: 235, rx: 7,
    label: 'VOODI', type: 'bed',
  });
  bed.appendChild(svgEl('rect', {
    x: 92, y: 315, width: 54, height: 42, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 164, y: 315, width: 54, height: 42, rx: 10,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('line', {
    x1: 80, y1: 380, x2: 230, y2: 380,
    stroke: 'rgba(226,234,242,.72)',
    'stroke-width': 5,
    'vector-effect': 'non-scaling-stroke',
  }));

  addRect(group, {
    x: 0, y: 329.56, w: 58, h: 52, rx: 3,
    label: 'ÖÖKAPP', type: 'nightstand',
  });

  addRect(group, {
    x: 8, y: 18, w: 155, h: 58, rx: 3,
    label: 'LAUD', type: 'desk',
  });

  const chair = svgEl('g', {
    'data-furniture-type': 'chair',
    'aria-label': 'Kontoritool',
  });
  chair.appendChild(svgEl('circle', {
    cx: 86, cy: 108, r: 28,
    fill: 'rgba(255,255,255,.025)',
    stroke: 'rgba(226,234,242,.44)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  chair.appendChild(svgEl('line', {
    x1: 86, y1: 80, x2: 86, y2: 72,
    stroke: 'rgba(226,234,242,.38)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(chair);

  const mirror = svgEl('g', {
    'data-furniture-type': 'mirror',
    'aria-label': 'Peegel',
  });
  mirror.appendChild(svgEl('rect', {
    x: 330, y: 18, width: 30, height: 120, rx: 3,
    fill: 'rgba(255,255,255,.02)',
    stroke: 'rgba(226,234,242,.55)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  mirror.appendChild(svgEl('line', {
    x1: 334, y1: 132, x2: 356, y2: 24,
    stroke: 'rgba(226,234,242,.18)',
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(mirror);

  svg.appendChild(group);
}

function syncFurnitureOverlay() {
  const secondFloorSvg = document.querySelector('svg.scan-plan[aria-label="2. korruse parandatud 2D plaan"]');
  if (secondFloorSvg) addGuestRoomFurniture(secondFloorSvg);
}

export function installFurnitureOverlay() {
  syncFurnitureOverlay();
  const observer = new MutationObserver(syncFurnitureOverlay);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true, attributes: true });
  return () => observer.disconnect();
}
