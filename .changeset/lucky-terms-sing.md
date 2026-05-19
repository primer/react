---
'@primer/react': minor
---

Card: Add `data-component` attributes to `Card` and its subcomponents (`Icon`, `Image`, `Heading`, `Description`, `Metadata`, `Menu`). Add an `as` prop (`'div' | 'section'`) so standalone Cards can render as a labelled region landmark; `as="section"` requires `aria-label` or `aria-labelledby`. `Card` now requires `children`. Also improves docs and stories.
