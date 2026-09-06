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
