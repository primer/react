---
'@primer/react': patch
---

Avatar: prevent images from shrinking by setting `min-width` alongside `width`, fixing incorrect sizing when used in Button's `leadingVisual` slot. Also keeps AvatarStack children uniformly sized with this change.
