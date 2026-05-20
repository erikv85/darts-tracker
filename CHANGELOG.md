# Changelog

## 2026-05-20

- Target ranking list now shows average throws per game (e.g. "23 throws / 3.3").

## 2026-05-15

- Average development line chart on history page (cumulative avg throws/target across games).
- Finished game detail view — click a game in the list to inspect attempts per target (read-only).
- Stacked bar chart segments per game with dynamic color generation.
- Custom tooltip on bar chart showing total per target.
- Remove rank number from target ranking list.

## 2026-05-14

- Export button for finished games (JSON download).
- Aggregate bar chart on history page (Recharts).
- Outer bull (`OB`) and inner bull (`IB`) support — input, canonicalization, auto-advance, chart bars.
- Remove redundant stats (Fatigue/Pressure, Board Control, Overall Precision).
- Show average throws per target in finished game preview.
- Document next implementation steps.

## 2026-05-12

- Autosave on every state change.
- Finished games preserved immutably in localStorage, newest-first.
- Active/finished game storage split with legacy migration.
- Extended input formats: `Tn`, `Dn`, `Mn`, `nT`, `nD`, `nM` (case-insensitive, canonicalized to uppercase).
- Renamed game to "Friendly round the clock" with rules: 1-20 in order, D/T count as singles, fallen arrows count.
- All-games start menu.

## 2026-02-01

- Improved stats section.

## 2026-01-27

- Initial single-game app with target-by-target tracking (1-10).
- File-download save.
- Basic stats (first-throw, short-term, fatigue, board control, precision, strengths/weaknesses).
