# Changelog

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
