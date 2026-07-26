# Alignment

## From: `@primer/react`

Legacy `ConfirmationDialog` is a single configuration component composed around the older `Dialog` implementation. It takes `onClose` gesture callbacks, `title`, children, `cancelButtonContent`, `confirmButtonContent`, `confirmButtonType`, loading flags, `overrideButtonFocus`, `width`, and `height`. Focus handling, dismissal, layering, and responsive positioning are supplied by the legacy dialog and overlay stack, with styled-system and CSS-module presentation.

## To: `@primer/react-tailwind`

Tailwind `ConfirmationDialog` provides a configuration component plus `ConfirmationDialog.Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Content`, `Title`, `Description`, and `Close` parts, backed by Base UI's alert-dialog behavior. Its config uses controlled state, `title`, `description`, `dangerous`, `onCancel`, `onConfirm`, optional `trigger`, and loading/disabled button props. Focus management, dismissal, portal/layer behavior, and confirmation layout are owned by the modern composition. Tailwind utilities and Primer semantic tokens provide presentation.

## Migration notes

- Migrate `onClose` gesture handling to `onCancel`/`onConfirm` and controlled Root state.
- Migrate custom dialog markup to the exported compound parts where needed.
- Do not depend on legacy width/height or overlay class names.
- Remove `sx` and styled-system props.
