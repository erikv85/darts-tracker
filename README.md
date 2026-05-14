# Darts Tracker

A browser-based dart practice tracker. No backend, no database — everything is saved in your browser's local storage.

## Game

**Friendly round the clock** — hit targets 1 through 20 in order. Doubles and triples count as singles. Outer bull (`OB`) and inner bull (`IB`) are recorded as misses. Keep going until you finish the sequence or manually finish the game.

## Features

- Autosave — every input is saved to local storage immediately. Reload without losing progress.
- Finished game history — completed games are preserved and viewable.
- Aggregate chart — a bar chart showing total throws per target across all finished games.
- Export — download finished games as JSON.

## Run

```sh
npm run dev       # dev server at http://localhost:5174
npm run build     # typecheck + production build
npm run test      # run tests
npm run lint      # lint all files
npm run preview   # preview production build
```

## Tech

React 19, TypeScript, Vite 7, Recharts, Vitest. Inline styles (no CSS framework).

Storage: `localStorage` — two keys per game (one active, one finished list).
