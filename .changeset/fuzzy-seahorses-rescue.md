---
"@primer/components": patch
---

Call `useOnOutsideClick` handlers in reverse order that they are registered, and allow propagation to stop if default is prevented or an non-outside click is detected.
