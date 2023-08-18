# Work log

### Clear action items

1. Move ClearIcon to primer octicons

### Accessibility questions

1. Is the heading element dependent on context or would it always be h1 aka do we hardcode it or allow product developers to change it based on context?
   1.1 Does that depend on if the SelectPanel renders a html `<dialog>` or not? (SelectPanel v1 did not use a `<dialog>`)
2. What's the keyboard navigation story?
   2.1 Is it tab between buttons and list, but arrow keys inside the list. tab inside the list should jump to the next button outside the list.
3. (assuming yes) is the divider purely aesthetic or should we create two sections with role=group?

### Design questions

1. Should we highlight matching text for filter results, especially because we search across title and description (example: https://github.com/primer/react/assets/1863771/d8d2d6e1-4075-4096-bc8a-db46e9b69351)

### API decisions still to make

1. If heading element is not customisable, we can fold that into header as it only needs title
1. If heading element is not customisable, we can unfurl "SelectPanel.Header" into 2 elements
1. Search should work on item name and description (does on production). Can we bake that in or do we need to delegate search.
1. (assuming yes) Do we need to support async search?
1. Where should overlay props go? `<SelectPanel overlayProps={{}}>` or `<SelectPanel.Overlay>` (width, height, position wrt anchor, returnFocusRef)
1. where should the callback for `cancel` be? it can called from multiple events like x button in header, cancel button in footer, clicking outside, keypressing escape. top level concern?
1. where should the callback for `submit` be? the button lives in the footer but would feel strange not close to cancel and clear selection
1. where should the callback for `clear selection` be? the button lives in the header but would feel strange not close to cancel and submit
1. where do you say `selectionVariant="single"` on the ActionList or on SelectPanel?
