---
'@primer/react': patch
---

Breadcrumbs: `overflow="menu"` and `"menu-with-root"` render far less on mount, resize and navigation, keep crumbs mounted when the collapse point moves, and no longer show an empty overflow menu. Server-rendered markup now applies the four-crumb limit, the narrow-viewport rule, and clips crumbs that don't fit instead of painting outside the nav. The overflow menu trigger is now a `<button>` instead of a `<details>`/`<summary>` pair.
