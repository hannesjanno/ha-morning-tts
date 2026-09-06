import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { installFurnitureOverlay } from './furnitureOverlay.js';
import { installVacuumOverlay } from './vacuumOverlay.js';
import { installMarekiRoomOverlay } from './marekiRoomOverlay.js';
import { installBedroomOverlay } from './bedroomOverlay.js';
import { installFloorGeometryFixOverlay } from './floorGeometryFixOverlay.js';
import { installKitchenOverlay } from './kitchenOverlay.js';
import { installLivingRoomOverlay } from './livingRoomOverlay.js';
import { installFirstFloorWcOverlay } from './wcOverlay.js';
import { installFirstFloorSaunaOverlay } from './saunaOverlay.js';
import { installFirstFloorWashroomOverlay } from './washroomOverlay.js';
import { installFirstFloorUtilityRoomOverlay } from './utilityRoomOverlay.js';
import { installFloor3DOverlay } from './floor3DOverlay.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

installFurnitureOverlay();
installVacuumOverlay();
installMarekiRoomOverlay();
installBedroomOverlay();
installFloorGeometryFixOverlay();
installKitchenOverlay();
installLivingRoomOverlay();
installFirstFloorWcOverlay();
installFirstFloorSaunaOverlay();
installFirstFloorWashroomOverlay();
installFirstFloorUtilityRoomOverlay();

// Wait until React has committed the Home OS panel to the DOM before adding
// the 2D/3D controls. Then stop the broad observer so it cannot loop with the
// other imperative overlays; the created button handlers remain active.
requestAnimationFrame(() => {
  const stopFloor3DOverlayWatch = installFloor3DOverlay();
  queueMicrotask(() => stopFloor3DOverlayWatch?.());
});
