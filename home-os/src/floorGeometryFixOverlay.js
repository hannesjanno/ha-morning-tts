function syncSecondFloorRoomBoundary() {
  const svg = document.querySelector('svg.scan-plan[aria-label="2. korruse parandatud 2D plaan"]');
  if (!svg) return;

  const roomGroups = [...svg.querySelectorAll('.room-layer .svg-room')];
  const wallPolygons = [...svg.querySelectorAll('.wall-layer polygon')];

  const marekIndex = roomGroups.findIndex((group) => group.querySelector('.room-title')?.textContent === 'Mareki tuba');
  const bedroomIndex = roomGroups.findIndex((group) => group.querySelector('.room-title')?.textContent === 'Magamistuba');

  const marekPoints = '431.72,386.14 790.31,386.14 790.31,892.94 481.4,892.94 481.4,659.18 431.72,659.18';
  const bedroomPoints = '246.48,659.18 0,659.18 0,1050.69 481.4,1050.69 481.4,659.18';

  const setPointsIfNeeded = (polygon, points) => {
    if (polygon && polygon.getAttribute('points') !== points) {
      polygon.setAttribute('points', points);
    }
  };

  if (marekIndex >= 0) {
    setPointsIfNeeded(roomGroups[marekIndex].querySelector('polygon'), marekPoints);
    setPointsIfNeeded(wallPolygons[marekIndex], marekPoints);
  }

  if (bedroomIndex >= 0) {
    setPointsIfNeeded(roomGroups[bedroomIndex].querySelector('polygon'), bedroomPoints);
    setPointsIfNeeded(wallPolygons[bedroomIndex], bedroomPoints);
  }
}

export function installFloorGeometryFixOverlay() {
  syncSecondFloorRoomBoundary();
  const root = document.getElementById('root');
  if (!root) return () => {};

  const observer = new MutationObserver(() => {
    syncSecondFloorRoomBoundary();
  });

  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
