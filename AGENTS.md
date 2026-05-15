# darts-tracker

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server on **port 5174** |
| `npm run build` | **tsc -b && vite build** (typecheck then bundle) |
| `npm run lint` | ESLint on all files |
| `npm run test` | Vitest |
| `npm run preview` | Vite preview of production build |

## Architecture

- **No router** - screen switching is state-based (`useState<Screen>` in `App.tsx`)
- **No backend** - all persistence uses `localStorage` (two keys per game: active + finished)
- **Inline styles** throughout - no CSS-in-JS library, no CSS modules
- **Recharts** is the charting library, already installed for bar charts
- Single-page React 19 app with TypeScript, Vite 7

## Project structure

- `src/App.tsx` - top-level menu, holds screen state
- `src/components/` - game screens and UI buttons (each button is its own component)
- `src/utils/` - input parsing/validation (`attemptUtils.ts`), constants, stats helpers
- `docs/next-steps.md` - planned features (bull support done, PWA and game modes pending)

## Storage model

Each game type has two localStorage keys:
- `<game-id>-active` - one ongoing game, autosaved on every state change
- `<game-id>-finished` - array of immutable finished games, newest-first

## Changelog

`CHANGELOG.md` is kept up to date with every change - no need to ask.

## Style

Use regular dashes (`-`, 0x2d), never em dashes (`-`).

## Input format

| Input         | Canonical form | Meaning                             |
|---------------|----------------|-------------------------------------|
| `1`-`20`      | same           | Numeric hit                         |
| `Tn`, `nT`    | `Tn`           | Triple                              |
| `Dn`, `nD`    | `Dn`           | Double                              |
| `Mn`, `nM`    | `Mn`           | Margin (miss)                       |
| `X`           | `X`            | Miss                                |
| `O`           | `OB`           | Outer bull (miss in round the clock) |
| `B`           | `IB`           | Inner bull (miss in round the clock) |

All letters are case-insensitive on input, canonicalized to uppercase.
