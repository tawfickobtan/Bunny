---
name: brutalist-devtool-ui
description: Design and build clean, brutalist developer-tool interfaces in the style of Linear and Vercel. Use alongside frontend-design when the request is a dashboard, CLI-adjacent web UI, admin panel, or any dev-facing tool — not marketing sites or consumer apps.
---

This skill locks in a specific aesthetic direction so the agent doesn't default to generic SaaS design. Apply this ON TOP of frontend-design's rigor (typography pairing, motion discipline, spatial composition) — this file constrains WHICH choices are valid, not how to think about design.

## Reference Point
Target the exact register of Linear and Vercel's dashboard: dense, fast, confident, zero decoration. If a choice wouldn't look at home in either product, don't make it.

## Locked Tokens
- **Type**: One monospace family for data, labels, code, metadata (e.g. JetBrains Mono, Geist Mono, Berkeley Mono). One clean sans for headers/prose (e.g. Geist, Inter is acceptable here — this is the one context where it's fine). Never more than these two families.
- **Color**: Near-black / near-white base (not pure #000/#FFF — use off-black like #0A0A0A). ONE accent color used sparingly for state/action only, not decoration.
- **Shape**: Sharp or minimal-radius corners (0-4px). 1px borders, hairline dividers. No shadows beyond a barely-there 1px separation shadow if absolutely needed.
- **Density**: Dense, information-forward layouts. Brutalist means undecorated, NOT empty — pack real data, use tight line-height, small type sizes (13-14px base is normal for dev tools).
- **Hierarchy**: Built with weight, size, and spacing — never color, never icons-as-decoration.

## Banned
Gradients, glassmorphism/blur, rounded pill buttons, drop shadows, emoji as icons, decorative illustrations, purple-on-white, any "friendly SaaS" softness.

## Structure
Strict grid. Visible borders between regions (sidebar/main/panel) rather than whitespace gaps. Tables and lists are default components, not cards. Functional whitespace only — space exists to separate meaning, not to feel "airy."

## When this conflicts with frontend-design
frontend-design pushes toward BOLD, maximalist, unexpected choices by default. Override that instinct here — restraint IS the bold choice for this aesthetic. Keep frontend-design's guidance on motion discipline (one orchestrated load, no scattered micro-interactions) and typography pairing logic, but resolve every "which direction" choice toward minimal/dense, never toward maximalist/decorative.