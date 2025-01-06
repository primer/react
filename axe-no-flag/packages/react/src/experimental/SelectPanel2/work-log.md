# Work log

## Clear action items

1. Move ClearIcon to primer octicons

## Open accessibility questions

1. Should pressing ArrowDown on SearchInput jump to first list item? Or only with Tab
1. Should the text for Submit/Save button be customisable based on the page context? So that it says something like "Assign users" or "Add labels" instead of just "Save" or "Submit". Or is optional because the context is already established?

## Answered accessibility questions

1. [Not implemented yet] What's the keyboard navigation story?: Answer: https://github.com/github/primer/issues/2579
1. [Not implemented yet] Does the SelectPanel renders a html `<dialog>` or not? (SelectPanel v1 did not use a `<dialog>`) Answer: https://github.com/github/primer/issues/2579
1. [Not implemented yet] Is the heading element dependent on context or would it always be h1 aka do we hardcode it or allow product developers to change it based on context? Answer: https://github.com/github/primer/issues/2578
1. [Implemented] is the divider purely aesthetic or should we create two sections with role=group? https://github.com/github/primer/issues/2580#issuecomment-1689259264

## Design questions

1. How strongly does Maxime feel about adding count of changes in the submit button? (he had it in his prototype)
1. Should we highlight matching text for filter results, especially because we search across title and description (example: https://github.com/primer/react/assets/1863771/d8d2d6e1-4075-4096-bc8a-db46e9b69351)
1. Should clearSelection always be optional, or only missing/optional when selectionVariant=single

## API decisions still to make

1. If heading element is not customisable (update: it is not), we can fold that into header as it only needs title
1. If heading element is not customisable (update: it is not), we can unfurl "SelectPanel.Header" into 2 elements
1. Search should work on item name and description (does on production). Can we bake that in or do we need to delegate search.
1. Where should overlay props go? `<SelectPanel overlayProps={{}}>` or `<SelectPanel.Overlay>` (width, height, position wrt anchor, returnFocusRef)
1. where should the callback for `cancel` be? it can called from multiple events like x button in header, cancel button in footer, clicking outside, keypressing escape. top level concern?
1. where should the callback for `submit` be? the button lives in the footer but would feel strange not close to cancel and clear selection
1. where should the callback for `clear selection` be? the button lives in the header but would feel strange not close to cancel and submit
1. where do you say `selectionVariant="single"` on the ActionList or on SelectPanel? what all does it change? should we not use ActionMenu for that anymore?
1. when you do not add a `<SelectPanel.Footer>`, should we add it for you? 😈 = it's present by default, you can only choose to modify the secondary action
1. Can we automate empty message? We do need some information from the context, so maybe not entirely. Can we add a default that can be customised.
1. Checkbox in secondary action, should secondary action be an open slot?

## Implementation notes

1. Is there a way to absorb divider logic, right now it's the application's responsibility
1. Add controlled state for `open` (use cases: 1. fetch data when opened, 2. nested menus
1. keep panel open till it's saved: https://github.com/github/primer/issues/2403)
1. We probably (need to check) should not even render Overlay contents until it's opened
1. SelectPanel.Overlay API
1. I think it's nice that there is a `<SelectPanel.Footer>` because you can wrap it in suspense along with the search results
1. Need to make Save and Cancel optional (selectionVariant="instant"?)

### Stories

1. [Next for Sid] Improve divider logic in stories (we don't need 2 branches, instead a ConditionalDivider component or a showDividerAtIndex variable) (we don't even need it anymore, + also leave a comment in the code to the issue where we decided not to do it)
1. Add SelectPanel.EmptyMessage to all stories
1. The flicker in story with useTransition is unfortunate, is there already a way to add a minimum time to avoid this (debounce)? and is it possible/ergonomic to bake that in the component or should it be delegated to the application
