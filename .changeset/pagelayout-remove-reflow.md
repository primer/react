---
"@primer/react": patch
---

**PageLayout**: Eliminate forced reflow (~614ms) on mount by replacing `getComputedStyle` call with a pure JS viewport width check for the `--pane-max-width-diff` CSS variable.
