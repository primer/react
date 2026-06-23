---
'@primer/react': patch
---

ConfirmationDialog: `useConfirm`/`confirm` now removes its host element from `document.body` after the dialog is closed, and uses a fresh host element per call, so the empty container no longer lingers or leaks into other components and tests
