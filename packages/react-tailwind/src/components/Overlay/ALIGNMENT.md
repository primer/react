# Alignment

## From: `@primer/react`

Legacy `Overlay` is a positioned floating surface used by older dialogs and menus. It combines placement, portal/layering, width and height constraints, escape and outside-click dismissal, focus behavior, animation, and overlay visual styling. Its public props and CSS-module implementation therefore carry substantially more behavior than a simple surface, along with shared styled-system customization.

## To: `@primer/react-tailwind`

Tailwind `Overlay` is intentionally a reduced, presentational floating surface. It renders the supplied content with Tailwind classes and Primer tokens, but does not own the legacy positioning, portal, focus, escape, outside-click, sizing, or animation behavior. Consumers should compose the appropriate modern behavioral primitive—such as Dialog or Popover—when those semantics are required. Overlay itself is not Base UI-backed.

## Migration notes

- Do not treat Tailwind `Overlay` as a drop-in modal/menu controller.
- Migrate behavioral usage to `Dialog`, or to `Popover`/`AnchoredOverlay` for an anchored surface. Their `Root` exposes controlled `open` and `onOpenChange(open, details)`; distinguish Escape and outside dismissal using `details.reason`. These callbacks and native events are not the legacy `onEscape` and `onClickOutside` contracts.
- A `Popover.Popup` can render `Overlay` as its surface while the Popover owns dismissal. Nested portaled `ActionMenu`, `Popover`, and `Dialog` children remain within that owner for the documented interactions; a separate legacy document-level listener does not inherit that behavior.
- `ignoreClickRefs` has no direct equivalent. A controlled owner can inspect close-request details before changing `open`, but must account for trigger presses, focus-out, portals, and nested overlays rather than assuming identical ignored-click behavior.
- Use popup `initialFocus` and `finalFocus` rather than `initialFocusRef` and `returnFocusRef`; `false` opts out. A final-focus ref or callback targeting a non-tabbable container with tabbable descendants may focus a descendant instead, so verify any exact-container requirement.
- For an explicit portal destination, compose `Portal container={...}` with `Positioner` and `Popup`; `Content` does not accept a named portal container. `Positioner` accepts an anchor, side, alignment, offsets, and collision props, but legacy `inside-*` placements do not map directly.
- Remove legacy behavioral, positioning, animation, and layering props rather than spreading them onto the presentational div. Remove `sx` and styled-system props.
