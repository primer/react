---
'@primer/react': patch
---

- Corrects the math to calculate the width of AvatarStack containers.
- Prevents `.pc-AvatarStackBody` from being removed from document flow by `position: absolute`. This isn't strictly necessary now that we're correctly setting the width of the stack, but it's an extra level of safety for preserving the correct layout.

<!-- Changed components: AvatarStack -->
