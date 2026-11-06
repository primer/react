# Alignment

## From: `@primer/react`

Legacy `ConfirmationDialog` is a single configuration component composed around the older `Dialog` implementation. It takes `onClose` gesture callbacks, `title`, children, `cancelButtonContent`, `confirmButtonContent`, `confirmButtonType`, loading flags, `overrideButtonFocus`, `width`, and `height`. Focus handling, dismissal, layering, and responsive positioning are supplied by the legacy dialog and overlay stack, with styled-system and CSS-module presentation.

## To: `@primer/react-tailwind`

Tailwind `ConfirmationDialog` provides a configuration component and `ConfirmationDialog.Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Content`, `Title`, `Description`, and `Close` parts. Base UI provides alert-dialog behavior.

Its config uses controlled state, `title`, `description`, `dangerous`, `onCancel`, `onConfirm`, an optional `trigger`, and loading or disabled button props. The composition owns focus management, dismissal, portal and layer behavior, and confirmation layout. Tailwind utilities and Primer semantic tokens provide presentation.

## Migration notes

- Migrate `onClose` gesture handling to `onCancel`/`onConfirm` and controlled Root state.
- Migrate custom dialog markup to the exported compound parts where needed.
- `width` and `height` keep upstream's dialog size scale; do not depend on legacy overlay class names.
- The footer buttons move focus between each other with the left and right arrows and Tab, as upstream's dialog footer does. Tabbing into the footer from outside lands on the nearest button.
- Remove `sx` and styled-system props.
- `ConfirmationDialog.Trigger` sets `aria-expanded` while the dialog is open (Base UI semantics), so a `Button` trigger shows its active background behind the backdrop. Upstream opens confirmations from a plain button, so visual comparisons differ only in that blended trigger fill.
