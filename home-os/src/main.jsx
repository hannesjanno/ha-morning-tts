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
import { installFloor3DViewer } from './floor3DViewer.js';

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

// React may not have committed the floor panel on the first animation frame.
// Retry briefly and install the 3D controls exactly once when the panel exists.
let floor3DInstallAttempts = 0;
const install3DWhenReady = () => {
  if (document.querySelector('.floor-panel .floor-plan')) {
    installFloor3DViewer();
    return;
  }

  floor3DInstallAttempts += 1;
  if (floor3DInstallAttempts < 40) {
    setTimeout(install3DWhenReady, 50);
  }
};

install3DWhenReady();
