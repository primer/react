---
'@primer/react': patch
---

Fix PageLayout pane resize lag during fast window resizes. During an active window-resize gesture the pane now updates CSS variables and ARIA attributes via a single `requestAnimationFrame` per frame (DOM only, no React state). A single `startTransition` commit is deferred until the gesture ends, eliminating the "slowly catching up" churn caused by stacking a React render request every ~16 ms.
