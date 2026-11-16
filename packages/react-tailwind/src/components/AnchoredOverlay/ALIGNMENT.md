# Alignment

## From: `@primer/react`

Legacy AnchoredOverlay renders its anchor through `renderAnchor`, or positions against an external `anchorRef`. Its overlay has Primer placement names, `width`/`height`, a responsive `variant`, `focusTrapSettings`/`focusZoneSettings`, `onOpen`/`onClose` gestures, CSS-anchor fallbacks, and named portal-root configuration.

## To: `@primer/react-tailwind`

The stable `Root`, `Trigger`, `Content`, `Popup`, `Positioner`, `Portal`, `Arrow`, `Backdrop`, `Close`, `Title`, and `Description` composition delegates anchoring, collision-aware positioning, focus, and dismissal to Base UI Popover. It supports controlled `open`, uncontrolled `defaultOpen`, and `onOpenChange`. `side` is `top`, `right`, `bottom`, `left`, `inline-start`, or `inline-end`, and `align` is `start`, `center`, or `end`. DOM props and refs belong to their matching public part.

`Content` shares the overlay size props (`width`, `height`, `maxHeight`, `maxWidth`) with ActionMenu. `variant={{narrow: 'fullscreen'}}` covers narrow viewports and shows a close button, configured with `displayCloseButton` and `closeButtonProps`.

## Migration notes

- Replace legacy `outside-*` placement names with `side` and `align`, and `anchorOffset`/`alignmentOffset` with `sideOffset`/`alignOffset`.
- Replace `renderAnchor` with `AnchoredOverlay.Trigger`. Use `render` to compose a trigger with an existing element; do not use a polymorphic `as` compatibility layer.
- **Informational overlays:** the trigger declares `aria-haspopup="dialog"` by default rather than a menu. Name the dialog with `aria-label` or `AnchoredOverlay.Title`. The default non-modal mode does not trap focus: in a simple keyboard-opened overlay, focus moves to its link, or to the popup if there are no focusable children; Tab moves to the next control and dismisses it, and Escape normally returns focus to the trigger. Local automated Chromium tests with Base UI 1.6 and 1.8 have intermittently left focus on the document body after Escape when the popup was reopened immediately after focus-out dismissal; this remains unresolved and is not an assistive-technology result. Custom initial focus, portal placement, content, and modality can change the sequence. Choose the appropriate focus behavior and verify the host and assistive technologies rather than assuming legacy parity.
- Replace `renderAnchor={null}` with `anchorRef` by passing the element or ref to `Content`'s `anchor`, controlling `open`, and passing `finalFocus` so focus returns to it on close.
- Replace `onOpen`/`onClose` gestures with `onOpenChange`, whose details report the reason (`trigger-press`, `outside-press`, `escape-key`, or `close-press`).
- **Legacy focus-trap migration:** legacy `AnchoredOverlay` enables its focus trap by default while open and positioned, unless `focusTrapSettings` overrides it. The canary is non-modal by default. `modal="trap-focus"` with an `AnchoredOverlay.Close` inside `Content` is one way to retain keyboard focus containment without locking document scroll or disabling outside pointer interactions; it is not equivalent to full `modal={true}`. Some host policies discourage trapping focus in non-modal UI, so check the intended interaction with an accessibility specialist. Base UI requires a close part to enable trapping in full-modal mode, and recommends one in `trap-focus` mode so touch-screen-reader users can leave. Keep a keyboard-operable dismissal path and verify initial focus, Tab/Shift+Tab containment, Escape or Close, and return focus. Controlled overlays must actually close in `onOpenChange`. The github-ui `DemoNotification` migration reports passing Tab containment, Escape dismissal, and anchor focus restoration; that is scoped host evidence, not a cross-browser or assistive-technology parity claim.
- **Outside dismissal:** with `modal="trap-focus"`, Base UI 1.6 and 1.8 can request dismissal on mouse-down or touch movement before a gesture finishes. A canceled gesture can discard an uncontrolled draft. When an overlay is intended to remain open on every outside press, `onOpenChange` can synchronously cancel the `outside-press` request; controlled state must also remain open. This opts out of normal outside-press dismissal rather than distinguishing completed from canceled gestures. Retain an explicit close action and review pointer and focus behavior with an accessibility specialist.
- Replace `focusZoneSettings` by composing `ActionList` or `ActionBar`, which own arrow-key navigation.
- Replace named portal roots with `portal={false}`, which renders the overlay in place, for example inside a scrolling container.
- `preventOverflow`, `pinPosition`, `displayInViewport`, `onPositionChange`, `inside-*` placements, and the CSS-anchor fallback options are unsupported; Base UI's collision handling replaces them.
- Use `className`, not `sx` or styled-system props.
