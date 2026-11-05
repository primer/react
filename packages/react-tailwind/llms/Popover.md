# Popover

`Popover` pairs a trigger with positioned, dismissible content.

Import: `import {Popover} from '@primer/react-tailwind/Popover'`

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## Popover.Root

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## Popover.Trigger

Forwards unrecognized props to Base UI's [`Popover.Trigger`](https://base-ui.com/react/components/popover#trigger), so it also accepts that part's props.

## Popover.Button

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
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
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Popover.Popup

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

## Popover.Content

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `height`: `PopoverHeight` — Default `'fit-content'`. Height of the content, on the overlay height token scale.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `8`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `width`: `PopoverWidth` — Default `'small'`. Width of the content, on the overlay width token scale.

## Popover.Positioner

Forwards unrecognized props to Base UI's [`Popover.Positioner`](https://base-ui.com/react/components/popover#positioner), so it also accepts that part's props.

## Popover.Portal

Forwards unrecognized props to Base UI's [`Popover.Portal`](https://base-ui.com/react/components/popover#portal), so it also accepts that part's props.

## Popover.Arrow

Forwards unrecognized props to Base UI's [`Popover.Arrow`](https://base-ui.com/react/components/popover#arrow), so it also accepts that part's props.

## Popover.Backdrop

Forwards unrecognized props to Base UI's [`Popover.Backdrop`](https://base-ui.com/react/components/popover#backdrop), so it also accepts that part's props.

## Popover.Title

Forwards unrecognized props to Base UI's [`Popover.Title`](https://base-ui.com/react/components/popover#title), so it also accepts that part's props.

## Popover.Description

Forwards unrecognized props to Base UI's [`Popover.Description`](https://base-ui.com/react/components/popover#description), so it also accepts that part's props.

## Popover.Close

Forwards unrecognized props to Base UI's [`Popover.Close`](https://base-ui.com/react/components/popover#close), so it also accepts that part's props.

## Popover.Viewport

Forwards unrecognized props to Base UI's [`Popover.Viewport`](https://base-ui.com/react/components/popover#viewport), so it also accepts that part's props.

## Differences from `@primer/react`

- Recompose legacy anchor/content markup with the compound parts.
