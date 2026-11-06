# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

Forwards unrecognized props to Base UI's [`Menu.Root`](https://base-ui.com/react/components/menu#root), so it also accepts that part's props.

## ActionMenu.Root

Forwards unrecognized props to Base UI's [`Menu.Root`](https://base-ui.com/react/components/menu#root), so it also accepts that part's props.

## ActionMenu.Trigger

Forwards unrecognized props to Base UI's [`Menu.Trigger`](https://base-ui.com/react/components/menu#trigger), so it also accepts that part's props.

## ActionMenu.Button

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## ActionMenu.Content

Forwards unrecognized props to Base UI's [`Menu.Popup`](https://base-ui.com/react/components/menu#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `preventFocusOnClose`: `boolean` — Default `false`. If true, focus will not be returned to the trigger or `finalFocus` target when the menu closes.
- `showDividers`: `boolean` — Default `false`. Draws a divider between consecutive items.
- `side`: `FloatingSide` — Side of the trigger the menu opens on. Menus open below their trigger, and submenus beside it.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the menu is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## ActionMenu.Overlay

Forwards unrecognized props to Base UI's [`Menu.Popup`](https://base-ui.com/react/components/menu#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `preventFocusOnClose`: `boolean` — Default `false`. If true, focus will not be returned to the trigger or `finalFocus` target when the menu closes.
- `showDividers`: `boolean` — Default `false`. Draws a divider between consecutive items.
- `side`: `FloatingSide` — Side of the trigger the menu opens on. Menus open below their trigger, and submenus beside it.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the menu is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## ActionMenu.Item

Forwards unrecognized props to Base UI's [`Menu.Item`](https://base-ui.com/react/components/menu#item), so it also accepts that part's props.

- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `selected`: `boolean` — Marks the item as the current choice.
- `variant`: `ActionMenuItemVariant` — Default `'default'`. Use `danger` for a destructive action.

## ActionMenu.LinkItem

Forwards unrecognized props to Base UI's [`Menu.LinkItem`](https://base-ui.com/react/components/menu#linkitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether activating the link closes the menu, as activating any other menu item does.
- `inactiveText`: `React.ReactNode` — Marks the link temporarily unavailable and explains why. The link renders as an inactive item until it is available.
- `variant`: `ActionMenuItemVariant` — Default `'default'`. Use `danger` for a destructive navigation.

## ActionMenu.CheckboxItem

Forwards unrecognized props to Base UI's [`Menu.CheckboxItem`](https://base-ui.com/react/components/menu#checkboxitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether toggling the item closes the menu, as activating any other menu item does. Set `false` to keep the menu open while several items are toggled.

## ActionMenu.RadioGroup

Forwards unrecognized props to Base UI's [`Menu.RadioGroup`](https://base-ui.com/react/components/menu#radiogroup), so it also accepts that part's props.

## ActionMenu.RadioItem

Forwards unrecognized props to Base UI's [`Menu.RadioItem`](https://base-ui.com/react/components/menu#radioitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether choosing the item closes the menu, as activating any other menu item does.

## ActionMenu.Group

Forwards unrecognized props to Base UI's [`Menu.Group`](https://base-ui.com/react/components/menu#group), so it also accepts that part's props.

## ActionMenu.GroupLabel

Forwards unrecognized props to Base UI's [`Menu.GroupLabel`](https://base-ui.com/react/components/menu#grouplabel), so it also accepts that part's props.

## ActionMenu.Divider

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.Submenu

Forwards unrecognized props to Base UI's [`Menu.SubmenuRoot`](https://base-ui.com/react/components/menu#submenuroot), so it also accepts that part's props.

## ActionMenu.SubmenuTrigger

Forwards unrecognized props to Base UI's [`Menu.SubmenuTrigger`](https://base-ui.com/react/components/menu#submenutrigger), so it also accepts that part's props.

## ActionMenu.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## Differences from `@primer/react`

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
