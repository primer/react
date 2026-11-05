# AnchoredOverlay

`AnchoredOverlay` positions a dismissible overlay relative to a trigger.

Import: `import {AnchoredOverlay} from '@primer/react-tailwind/AnchoredOverlay'`

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## AnchoredOverlay.Root

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## AnchoredOverlay.Trigger

Forwards unrecognized props to Base UI's [`Popover.Trigger`](https://base-ui.com/react/components/popover#trigger), so it also accepts that part's props.

## AnchoredOverlay.Content

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `closeButtonProps`: `AnchoredOverlayCloseButtonProps` — Props for the close button that the fullscreen variant shows, such as a more specific `aria-label`.
- `displayCloseButton`: `boolean` — Default `true`. Whether the fullscreen variant shows a close button.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the content is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## AnchoredOverlay.Popup

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

## AnchoredOverlay.Positioner

Forwards unrecognized props to Base UI's [`Popover.Positioner`](https://base-ui.com/react/components/popover#positioner), so it also accepts that part's props.

## AnchoredOverlay.Portal

Forwards unrecognized props to Base UI's [`Popover.Portal`](https://base-ui.com/react/components/popover#portal), so it also accepts that part's props.

## AnchoredOverlay.Arrow

Forwards unrecognized props to Base UI's [`Popover.Arrow`](https://base-ui.com/react/components/popover#arrow), so it also accepts that part's props.

## AnchoredOverlay.Backdrop

Forwards unrecognized props to Base UI's [`Popover.Backdrop`](https://base-ui.com/react/components/popover#backdrop), so it also accepts that part's props.

## AnchoredOverlay.Close

Forwards unrecognized props to Base UI's [`Popover.Close`](https://base-ui.com/react/components/popover#close), so it also accepts that part's props.

## AnchoredOverlay.Title

Forwards unrecognized props to Base UI's [`Popover.Title`](https://base-ui.com/react/components/popover#title), so it also accepts that part's props.

## AnchoredOverlay.Description

Forwards unrecognized props to Base UI's [`Popover.Description`](https://base-ui.com/react/components/popover#description), so it also accepts that part's props.

## Differences from `@primer/react`

- Replace legacy `outside-*` placement names with `side` and `align`, and `anchorOffset`/`alignmentOffset` with `sideOffset`/`alignOffset`.
