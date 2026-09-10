# Alarm Room - Minimalist Wake-Up Challenge (PWA)

A modern, flat alarm clock Progressive Web App (PWA) where turning off the alarm requires solving a challenge.

---

## Features

1. **Progressive Web App (PWA)**:
   - Installable on desktop (Chrome, Edge) and mobile devices (Android, iOS).
   - Standalone window display with no browser address bar.
   - Offline caching via Service Worker (`sw.js`).
   - Standard Web App Manifest (`manifest.json`) and app icons (SVG, 192x192, 512x512).

2. **Focused Minimalist Clock**:
   - Displays each user's **current local time** (rendered from client browser locale/timezone) with weekday and date.
   - Clean, distraction-free interface centered on the screen.
   - No header, no footer, no unnecessary icons or test buttons.

3. **Alarm Audio Tracks**:
   - Multiple basic built-in tracks:
     - **Digital Beep** (`tracks/digital-beep.wav`)
     - **Emergency Siren** (`tracks/emergency-siren.wav`)
     - **Nuclear Klaxon** (`tracks/nuclear-klaxon.wav`)
     - **Cyber Alert** (`tracks/cyber-alert.wav`)
     - **Gentle Chime** (`tracks/gentle-chime.wav`)
     - **Original Track** (`alarm-track.mp3`)
   - Direct in-browser audio preview (Play / Stop).

4. **Wake-Up Challenge System (Hidden Console)**:
   - The terminal console is hidden by default during normal operation.
   - When the alarm triggers, the **Challenge Screen** activates as a focused overlay.
   - To silence the alarm, the user must solve the challenge:
     1. Type `clue` to obtain the Base64 encoded key payload.
     2. Type `decode <payload>` to extract the plaintext key.
     3. Type `unlock <key>` to disarm and silence the alarm.
   - Once solved, the challenge overlay dismisses automatically.
   - Structured modularly to support additional challenge types in the future.

5. **Anti-Close Tab Shield**:
   - When the alarm is active, the browser tab triggers `beforeunload` warning protection to prevent accidental or half-asleep tab closure.

---

## How to Run & Install as PWA

1. Start the server:
   ```bash
   node server.js
   ```
2. Open **`http://localhost:3000`** in your browser.
3. To install as a desktop app:
   - In Chrome or Edge, click the **Install** icon in the URL bar (or Menu &rarr; "Install Alarm Room").
   - On mobile, tap "Add to Home Screen".
