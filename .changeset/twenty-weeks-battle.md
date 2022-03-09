---
'@primer/react': patch
---

Surfaced the following components and hooks from the root index:

- Portal
- AnchoredOverlay
- useFocusTrap
- useFocusZone (and types)
- sx (and types)
- ConfirmationDialogProps

These exports can now be imported from the root index, rather than from their nested subfolders.

E.g.

```diff
- import { ConfirmationDialogProps } from '@primer/react/lib-esm/Dialog/ConfirmationDialog';
+ import { ConfirmationDialogProps } from '@primer/react';
```
