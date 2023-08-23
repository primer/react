# Work log

### Clear action items

1. Move ClearIcon to primer octicons

### Open accessibility questions

No open questions

### Answered accessibility questions

1. [Not implemented yet] What's the keyboard navigation story?: Answer: https://github.com/github/primer/issues/2579
1. [Not implemented yet] Does the SelectPanel renders a html `<dialog>` or not? (SelectPanel v1 did not use a `<dialog>`) Answer: https://github.com/github/primer/issues/2579
1. [Not implemented yet] Is the heading element dependent on context or would it always be h1 aka do we hardcode it or allow product developers to change it based on context? Answer: https://github.com/github/primer/issues/2578
1. [Implemented] is the divider purely aesthetic or should we create two sections with role=group? https://github.com/github/primer/issues/2580#issuecomment-1689259264

### Design questions

1. Should we highlight matching text for filter results, especially because we search across title and description (example: https://github.com/primer/react/assets/1863771/d8d2d6e1-4075-4096-bc8a-db46e9b69351)

### API decisions still to make

1. If heading element is not customisable (update: it is not), we can fold that into header as it only needs title
1. If heading element is not customisable (update: it is not), we can unfurl "SelectPanel.Header" into 2 elements
1. Search should work on item name and description (does on production). Can we bake that in or do we need to delegate search.
1. (yes, users!) Do we need to support async search?
1. Where should overlay props go? `<SelectPanel overlayProps={{}}>` or `<SelectPanel.Overlay>` (width, height, position wrt anchor, returnFocusRef)
1. where should the callback for `cancel` be? it can called from multiple events like x button in header, cancel button in footer, clicking outside, keypressing escape. top level concern?
1. where should the callback for `submit` be? the button lives in the footer but would feel strange not close to cancel and clear selection
1. where should the callback for `clear selection` be? the button lives in the header but would feel strange not close to cancel and submit
1. where do you say `selectionVariant="single"` on the ActionList or on SelectPanel? what all does it change? should we not use ActionMenu for that anymore?
1. Is SelectPanel.Footer optional or no

### Implementation notes

1. Add controlled state for `open` (use cases: 1. fetch data when opened, 2. nested menus, 3. keep panel open till it's saved: https://github.com/github/primer/issues/2403)
2. We probably (need to check) should not even render Overlay contents until it's opened
3. Implement empty states like "no results" https://github.com/github/primer/issues/2362
4. SelectPanel.Overlay
5. The flicker in async story is unfortunate, is there already a way to avoid this? and is it possible/ergonomic to bake that in the component?
