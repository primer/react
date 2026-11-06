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
- Replace `renderAnchor` with `AnchoredOverlay.Trigger`. Use `render` to compose a trigger with an existing element; do not use a polymorphic `as` compatibility layer.
- Replace `renderAnchor={null}` with `anchorRef` by passing the element or ref to `Content`'s `anchor`, controlling `open`, and passing `finalFocus` so focus returns to it on close.
- Replace `onOpen`/`onClose` gestures with `onOpenChange`, whose details report the reason (`trigger-press`, `outside-press`, `escape-key`, or `close-press`).
- Content is non-modal by default. To trap focus, pass `modal` (or `modal="trap-focus"`) and render `AnchoredOverlay.Close`; Base UI only traps focus when the popup offers a way out.
- Replace `focusZoneSettings` by composing `ActionList` or `ActionBar`, which own arrow-key navigation.
- Replace named portal roots with `portal={false}`, which renders the overlay in place, for example inside a scrolling container.
- `preventOverflow`, `pinPosition`, `displayInViewport`, `onPositionChange`, `inside-*` placements, and the CSS-anchor fallback options are unsupported; Base UI's collision handling replaces them.
- Use `className`, not `sx` or styled-system props.
