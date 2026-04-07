---
'@primer/react': minor
---

Overlay: Graduate `primer_react_overlay_max_height_clamp_to_viewport` feature flag

The max-height of overlays is now clamped to the viewport height by default using `min(size, 100dvh)`. This prevents overlays from extending beyond the viewport on smaller screens.
