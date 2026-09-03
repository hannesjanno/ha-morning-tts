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
      'text-anchor': 'middle',
      fill: '#718092',
      'font-size': 9,
      'letter-spacing': 1,
    });
    t.textContent = label;
    g.appendChild(t);
  }
  group.appendChild(g);
  return g;
}

function addMarekiRoomFurniture(svg) {
  if (svg.querySelector('[data-mareki-room-furniture]')) return;

  // Hoia Mareki toa mööbel visuaalselt ainult Mareki toa sees.
  // Alumises osas algab toa vasak piir x=481.4, seega ei joonistu vasak kapp magamistoa peale.
  const defs = svg.querySelector('defs') || svg.insertBefore(svgEl('defs'), svg.firstChild);
  const clipId = 'mareki-room-furniture-clip';
  if (!svg.querySelector(`#${clipId}`)) {
    const clipPath = svgEl('clipPath', { id: clipId });
    clipPath.appendChild(svgEl('polygon', {
      points: '431.72,386.14 790.31,386.14 790.31,892.94 481.4,892.94 481.4,659.18 431.72,659.18',
    }));
    defs.appendChild(clipPath);
  }

  const group = svgEl('g', {
    'data-mareki-room-furniture': 'true',
    'pointer-events': 'none',
    'clip-path': `url(#${clipId})`,
  });

  // Voodi: peats vastu Mareki toa alumist seina.
  const bed = rect(group, 555, 650, 150, 240, 'VOODI', 'bed', 7);
  bed.appendChild(svgEl('rect', {
    x: 568, y: 833, width: 54, height: 42, rx: 9,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 638, y: 833, width: 54, height: 42, rx: 9,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('line', {
    x1: 555, y1: 890, x2: 705, y2: 890,
    stroke: 'rgba(226,234,242,.72)',
    'stroke-width': 5,
    'vector-effect': 'non-scaling-stroke',
  }));

  // Vasak kapp, siis öökapp, siis voodi.
  rect(group, 445, 665, 58, 225, 'KAPP', 'wardrobe', 2);
  rect(group, 510, 830, 38, 60, 'ÖÖKAPP', 'nightstand', 3);

  // Kõrge kapp voodi paremal pool.
  rect(group, 712, 665, 58, 225, 'KAPP', 'wardrobe', 2);

  // Seinapeegel ülemisel seinal, kohe laua kõrval.
  const mirror = svgEl('g', { 'data-furniture-type': 'mirror', 'aria-label': 'Seinapeegel' });
  mirror.appendChild(svgEl('rect', {
    x: 533, y: 390, width: 32, height: 105, rx: 2,
    fill: 'rgba(255,255,255,.025)',
    stroke: 'rgba(226,234,242,.52)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  mirror.appendChild(svgEl('line', {
    x1: 537, y1: 489, x2: 561, y2: 396,
    stroke: 'rgba(226,234,242,.28)',
    'stroke-width': 1.5,
    'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(mirror);

  // Kirjutuslaud vastu ülemist seina, veel lähemal parempoolsele aknale.
  rect(group, 565, 390, 195, 62, 'LAUD', 'desk', 3);

  // Kontoritool laua ees, toa poole.
  const chair = svgEl('g', { 'data-furniture-type': 'chair', 'aria-label': 'Kontoritool' });
  chair.appendChild(svgEl('circle', {
    cx: 665, cy: 490, r: 27,
    fill: 'rgba(255,255,255,.025)',
    stroke: 'rgba(226,234,242,.44)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(chair);

  svg.appendChild(group);
}

function syncMarekiRoomOverlay() {
  const svg = document.querySelector('svg.scan-plan[aria-label="2. korruse parandatud 2D plaan"]');
  if (svg) addMarekiRoomFurniture(svg);
}

export function installMarekiRoomOverlay() {
  syncMarekiRoomOverlay();
  const observer = new MutationObserver(syncMarekiRoomOverlay);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true, attributes: true });
  return () => observer.disconnect();
}
