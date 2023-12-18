---
'@primer/react': patch
---

TextInput, Textarea: Does not pass `aria-required` attribute to input or textarea if it is undefined. This fixes some tests that were breaking in dotcom.

<!-- Changed components: TextInput, Textarea -->
