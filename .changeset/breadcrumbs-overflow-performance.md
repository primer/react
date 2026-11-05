---
'@primer/react': patch
---

Breadcrumbs: `overflow="menu"` and `"menu-with-root"` re-render far less on mount, resize and navigation, keep crumbs mounted when the collapse point moves, and apply the four-crumb limit in server-rendered markup.
