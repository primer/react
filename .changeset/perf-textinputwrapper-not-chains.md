---
'@primer/react': patch
---

TextInput / TextInputWithTokens / Select / Autocomplete: Replace chained `:not([data-leading-visual])`, `:not([data-trailing-visual])`, and `:not([data-trailing-action])` attribute negations in `TextInputWrapper` styles with positive `data-no-leading-visual`, `data-no-trailing-visual`, and `data-no-trailing-action` markers emitted by the wrapper components. Eliminates the 2- and 3-deep `:not()` chains that previously evaluated against every input on every state change. No visual or behavioral changes.
