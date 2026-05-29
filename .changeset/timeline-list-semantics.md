---
'@primer/react': minor
---

Timeline: Render as `<ol>` with `<li>` items for list semantics

Timeline now renders as an ordered list (`<ol>`) instead of a `<div>`, and Timeline.Item renders as `<li>` instead of `<div>`. This gives screen reader users list navigation — they can hear the total number of events and their position in the sequence ("item 3 of 12").

Timeline.Break renders as `<li role="presentation">` so it does not contribute to the list item count.

An explicit `role="list"` is applied to the `<ol>` to restore list semantics in Safari/VoiceOver, which strips them when `list-style: none` is applied.

**Migration:** If you pass a `ref` to `Timeline`, the ref type changes from `HTMLDivElement` to `HTMLOListElement`. If you pass a `ref` to `Timeline.Item` or `Timeline.Break`, the ref type changes from `HTMLDivElement` to `HTMLLIElement`. All other props continue to work unchanged.
