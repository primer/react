---
"@primer/react": minor
---

Refactors `UnderlineNav` overflow handling to use CSS-based overflow detection instead of JavaScript width measurements, eliminating layout shift (CLS) issues and improving performance. The overflow menu is now implemented with `ActionMenu`, and item registration uses a descendant registry instead of the `React.Children` API. Consumer-facing changes: items can now be wrapped in fragments or wrapper components; the current item may appear in the overflow menu when the viewport is narrow; and the overflow menu button is right-aligned.
