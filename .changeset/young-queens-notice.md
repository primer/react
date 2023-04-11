---
"@primer/react": patch
---

`CheckboxGroup` and `RadioGroup` are now SSR-compatible. 

Warning: In this new implementation, `CheckboxGroup.Caption`, `CheckboxGroup.Label,` and `CheckboxGroup.Validation` must be direct children of `CheckboxGroup`. The same applies to `RadioGroup`.
