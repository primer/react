---
'@primer/react': patch
---

PageLayout.Sidebar: Hide the resize control when width constraints leave no available resize range.
If the control disappears during a resize, the final width is saved and the sidebar remains interactive.
