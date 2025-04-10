---
'@primer/react': patch
---

Improves how we detect context for inactive item messaging by checking the `role` on `ActionList` instead of relying on parent components, making the logic more robust and consistent. It also fixes incorrect behavior in `NavList` and `SelectPanel`, and improves accessibility by correcting `aria` relationships on tooltip buttons.
