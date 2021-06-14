---
"@primer/components": patch
---

Restore "fix: Don’t focus first 'Item' of 'DropdownMenu' and 'SelectMenu' on open" by deferring the removal of a temporary `tabIndex` until focus moves within the container.
