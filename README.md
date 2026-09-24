# The Last Sound

The Last Sound is a gentle browser-based listening puzzle for children. Players listen to short, original Web Audio tones, then rebuild each melody by choosing sound tiles in the right order.

Each tile provides separate **Listen** and **Select** controls: Listen previews a sound, while Select adds that tile to the next answer slot. Progress is saved locally in the browser, and levels unlock in order.

## Levels

1. The Dewlit Garden
2. Lantern Alley
3. Cloud Library
4. Moonwell
5. The Last Sound
6. Crystal Cavern
7. Starling Grove
8. Aurora Summit

The final completion screen appears after Aurora Summit.

## Run locally

Prerequisites: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in a browser.

## Checks

```bash
npm run lint
npm run build
```

## Project structure

- `src/App.jsx` — game levels, progression, and audio interactions
- `src/App.css` — base visual styling
- `src/tile-audio.css` — Listen and Select tile controls
- `src/level-selector.css` — responsive level selector styling

## Notes

Sounds are generated in the browser with the Web Audio API; no audio files or external services are required.
