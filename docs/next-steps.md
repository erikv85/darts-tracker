# Next Steps

## 1. Add More Games
Add additional game modes alongside Friendly round the clock.

### Candidate games
- 301
- 501

### Likely implementation shape
- Keep the current `All Games` menu as the main entry point.
- Give each game its own screen/component.
- Introduce a shared game model only where it actually helps:
  - game id
  - display name
  - rules text
  - persisted storage key
- Keep round-the-clock logic separate from 301/501 scoring logic.

### Notes for 301/501
- Need score entry flow instead of target-by-target row flow.
- Need bust handling rules decision.
- Need single/double/triple/bull scoring support.
- Probably need turn grouping (3 darts per visit).

## 2. Add Outer Bull and Inner Bull
Bull support is needed for current and future games.

### Questions to settle
- Naming:
  - `OB` / `IB`
  - `SB` / `DB`
  - `25` / `50`
- For round-the-clock:
  - Bulls are just supported as recorded hits.
  - They are not part of the sequence.
  - For round-the-clock they should behave like misses / non-progress results.
- For 301/501:
  - outer bull scores 25
  - inner bull scores 50

### Likely implementation work
- Expand allowed input parsing.
- Expand canonical rendering rules.
- Expand hit/miss classification logic.
- Update stats code to understand bull segments.

## 3. Add Distance / Board Area Calculations
Use the 20 board sections plus hit/miss data to identify player success and problem areas.

### Goal
Build a directional/positional model from attempts so we can surface patterns like:
- strong wedge groups
- weak wedge groups
- misses tending left/right of target
- margin clustering near neighboring numbers

### Inputs we already have
- intended target number
- actual recorded result
- miss markers

### What needs to be modeled
- The board is 20 equal angular sectors.
- Each target has:
  - intended sector
  - left neighbor
  - right neighbor
- For recorded outcomes, classify:
  - exact hit
  - neighboring-sector miss
  - opposite-side / far miss
  - margin miss
  - complete miss

### Useful derived metrics
- per-target success rate
- clockwise drift frequency
- counterclockwise drift frequency
- margin miss frequency
- sector adjacency heatmap
- grouped weakness by board region

### Likely implementation approach
1. Create a board mapping utility:
   - target -> index in dartboard order
   - left/right neighbors
2. Create an attempt classification utility:
   - exact hit
   - double/triple hit on intended number
   - bull result
   - margin result
   - miss result
   - neighboring number result
3. Add aggregate stats:
   - directional error counts
   - per-sector weakness summary
   - heatmap-ready data structure
4. Add UI:
   - start simple with textual summaries
   - later consider a board visualization

## 4. Make Web App a PWA
Add installable/offline-friendly web app support.

### Goal
Allow the app to be installed on mobile/desktop and support basic offline use.

### Likely implementation work
- Add a web app manifest.
- Add app icons.
- Add a service worker.
- Cache the app shell and static assets.
- Add installable metadata:
  - app name
  - short name
  - theme color
  - background color
  - display mode
- Replace the default Vite favicon/app icon setup.

### Likely implementation approach
1. Add PWA support via `vite-plugin-pwa`.
2. Configure the manifest:
   - name
   - short_name
   - icons
   - theme_color
   - background_color
   - display: `standalone`
3. Use a temporary generated icon for the first pass.
4. Add service worker registration and a basic caching strategy.
5. Verify production build and preview behavior.
6. Verify installability and offline reload behavior.

### PWA Notes
- Browser storage already preserves active and finished games locally.
- PWA support should complement that local-first behavior.
- Offline use should not interfere with active-game restore or finished-game history.

## Suggested Order
1. Add bull support first.
2. Add shared attempt classification utilities.
3. Add 301/501.
4. Add directional distance/problem-area analysis.
5. Add PWA support.
6. Add board visualization if useful.

## Open Questions
- What exact bull notation should be used?
- What bust rules should 301/501 use?
- Should 301/501 require double-out?
- How should margin misses be represented in spatial analysis?
