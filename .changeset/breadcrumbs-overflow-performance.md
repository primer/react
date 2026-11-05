---
'@primer/react': patch
---

Breadcrumbs: `overflow="menu"` and `"menu-with-root"` render far less on mount, resize and navigation, keep crumbs mounted when the collapse point moves, apply the four-crumb limit in server-rendered markup, and no longer show an empty overflow menu. The overflow menu trigger is now a `<button>` instead of a `<details>`/`<summary>` pair.
