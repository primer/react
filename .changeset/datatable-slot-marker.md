---
'@primer/styled-react': patch
'@primer/react': patch
---

ActionMenu, Table: Fix component mutation issue where `Object.assign` was modifying original `@primer/react` components. Now uses wrapper components to avoid side effects.
