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

  const group = svgEl('g', {
    'data-mareki-room-furniture': 'true',
    'pointer-events': 'none',
  });

  // Voodi toa alumises osas, peats vastu vasakpoolset siseseina.
  const bed = rect(group, 470, 665, 185, 210, 'VOODI', 'bed', 7);
  bed.appendChild(svgEl('rect', {
    x: 485, y: 680, width: 68, height: 40, rx: 9,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));
  bed.appendChild(svgEl('rect', {
    x: 570, y: 680, width: 68, height: 40, rx: 9,
    fill: 'none', stroke: 'rgba(226,234,242,.34)',
    'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke',
  }));

  // Kaks kõrget kappi voodi mõlemal küljel.
  rect(group, 438, 650, 28, 225, 'KAPP', 'wardrobe', 2);
  rect(group, 662, 650, 42, 225, 'KAPP', 'wardrobe', 2);

  // Öökapp voodi paremal küljel.
  rect(group, 708, 770, 48, 52, 'ÖÖKAPP', 'nightstand', 3);

  // Kirjutuslaud akende seina ääres.
  rect(group, 690, 430, 88, 165, 'LAUD', 'desk', 3);

  // Kontoritool laua ees.
  const chair = svgEl('g', { 'data-furniture-type': 'chair', 'aria-label': 'Kontoritool' });
  chair.appendChild(svgEl('circle', {
    cx: 655, cy: 515, r: 27,
    fill: 'rgba(255,255,255,.025)',
    stroke: 'rgba(226,234,242,.44)',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
  }));
  group.appendChild(chair);

  // Väike taburet/alus akna kõrval.
  rect(group, 704, 610, 44, 38, 'ALUS', 'stool', 3);

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
