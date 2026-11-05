# Alignment

## From: `@primer/react`

Legacy AnchoredOverlay renders its anchor through `renderAnchor`, or positions against an external `anchorRef`. Its overlay has Primer placement names, `width`/`height`, a responsive `variant`, `focusTrapSettings`/`focusZoneSettings`, `onOpen`/`onClose` gestures, CSS-anchor fallbacks, and named portal-root configuration.

## To: `@primer/react-tailwind`

The stable `Root`, `Trigger`, `Content`, `Popup`, `Positioner`, `Portal`, `Arrow`, `Backdrop`, `Close`, `Title`, and `Description` composition delegates anchoring, collision-aware positioning, focus, and dismissal to Base UI Popover. It supports controlled `open`, uncontrolled `defaultOpen`, and `onOpenChange`. `side` is `top`, `right`, `bottom`, `left`, `inline-start`, or `inline-end`, and `align` is `start`, `center`, or `end`. DOM props and refs belong to their matching public part.

`Content` shares the overlay size props (`width`, `height`, `maxHeight`, `maxWidth`) with ActionMenu. `variant={{narrow: 'fullscreen'}}` covers narrow viewports and shows a close button, configured with `displayCloseButton` and `closeButtonProps`.

## Migration notes

- Replace legacy `outside-*` placement names with `side` and `align`, and `anchorOffset`/`alignmentOffset` with `sideOffset`/`alignOffset`.
- Replace `renderAnchor` with `AnchoredOverlay.Trigger`. Use `render` to compose a trigger with an existing element; do not use a polymorphic `as` compatibility layer.
- Replace `renderAnchor={null}` with `anchorRef` by passing the element or ref to `Content`'s `anchor`, controlling `open`, and passing `finalFocus` so focus returns to it on close.
- Replace `onOpen`/`onClose` gestures with `onOpenChange`, whose details report the reason (`trigger-press`, `outside-press`, `escape-key`, or `close-press`).
- Content is non-modal by default. To trap focus, pass `modal` (or `modal="trap-focus"`) and render `AnchoredOverlay.Close`; Base UI only traps focus when the popup offers a way out.
- Replace `focusZoneSettings` by composing `ActionList` or `ActionBar`, which own arrow-key navigation.
- Replace named portal roots with `portal={false}`, which renders the overlay in place, for example inside a scrolling container.
- `preventOverflow`, `pinPosition`, `displayInViewport`, `onPositionChange`, `inside-*` placements, and the CSS-anchor fallback options are unsupported; Base UI's collision handling replaces them.
- Use `className`, not `sx` or styled-system props.
