---
'@primer/react': patch
---

Token: Update component type to be PolymorphicForwardRefComponent.

this avoids types being swallowed by forwardRef (which isn't polymorphic)
