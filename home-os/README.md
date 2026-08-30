# Home OS

A standalone wall-panel frontend for Home Assistant, designed primarily for an iPad mounted on the wall.

## Architecture

- Home Assistant remains the backend and automation engine.
- Home OS is a standalone React frontend.
- Real-time state will come from Home Assistant WebSocket API.
- Commands will call Home Assistant services.
- No extra home server is required for the frontend; production builds are static files and can later be served locally.

## UX direction

The wall panel should feel like a purpose-built smart-home system rather than a collection of Lovelace cards.

Main screen concept:

- Overall home health/status at a glance
- Weather and time
- Tesla status
- Live energy summary
- Security / doors / gate
- Two-floor interactive home view
- Contextual scenes
- Future AI assistant layer

## Two-floor concept

Only one floor is shown in detail at a time. A compact 1st/2nd-floor switch changes the active view. This is intentionally clearer on an iPad than stacking both floors simultaneously. Later, the room blocks will be replaced by a proper floor-plan visualization based on the real house layout.

## Running locally

```bash
cd home-os
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Home Assistant connection

`src/haClient.js` contains the initial WebSocket connection module. Do **not** commit a Home Assistant long-lived access token to this repository. Runtime configuration and authentication will be added before connecting the real system.

## Next steps

1. Replace mock status data with the user's actual Home Assistant entities.
2. Define exact iPad screen resolution/orientation and kiosk behavior.
3. Build the real 1st and 2nd floor layouts.
4. Add room detail overlays and navigation.
5. Add Tesla, energy, security, climate, camera/event and scene views.
6. Package a production build for local hosting alongside Home Assistant.
