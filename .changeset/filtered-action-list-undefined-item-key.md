---
'@primer/react': patch
---

FilteredActionList: Guard against `undefined` items in the virtualizer's `getItemKey` callback to prevent a crash when `@tanstack/react-virtual` invokes it with an index whose item was just removed (e.g. when filtering shrinks the items list).
