---
'@primer/react': patch
---

Fixed an issue where no change event was fired when an autocomplete input matched a suggestion. This caused the input to have a wrong value on blur in that exact case.
