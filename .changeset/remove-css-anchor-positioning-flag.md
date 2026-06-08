---
'@primer/react': minor
---

AnchoredOverlay: Remove the `primer_react_css_anchor_positioning` feature flag. CSS anchor positioning is now enabled by default when the browser supports it natively (and no `portalContainerName` is provided), so consumers no longer need to opt in via the feature flag.
