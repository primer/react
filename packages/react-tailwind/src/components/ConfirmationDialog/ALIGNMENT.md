# Alignment

## From: `@primer/react`

Legacy `ConfirmationDialog` is a single configuration component composed around the older `Dialog` implementation. It takes `onClose` gesture callbacks, `title`, children, `cancelButtonContent`, `confirmButtonContent`, `confirmButtonType`, loading flags, `overrideButtonFocus`, `width`, and `height`. Focus handling, dismissal, layering, and responsive positioning are supplied by the legacy dialog and overlay stack, with styled-system and CSS-module presentation.

## To: `@primer/react-tailwind`

Tailwind `ConfirmationDialog` provides a configuration component and `ConfirmationDialog.Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Content`, `Title`, `Description`, and `Close` parts. Base UI Dialog provides focus, modality, and dismissal behavior; the content defaults to `role="alertdialog"`. Unlike Base UI Alert Dialog, outside-press dismissal remains available.

Its config uses controlled state, `title`, `description`, `dangerous`, `onCancel`, `onConfirm`, an optional `trigger`, and loading or disabled button props. The composition owns focus management, dismissal, portal and layer behavior, and confirmation layout. Tailwind utilities and Primer semantic tokens provide presentation.

## Migration notes

- Migrate `onClose` gesture handling to `onCancel`/`onConfirm` and controlled Root state.
- Migrate custom dialog markup to the exported compound parts where needed.
- A confirmation portal nested in a Primer floating layer uses the popover layer for its backdrop and viewport. This is not a global stack manager: custom portal roots, clipping, and host stacking contexts still require integration checks.
- The default modal content exposes `aria-modal="true"`. `modal={false}` and `modal="trap-focus"` leave outside pointer interactions available and omit that attribute; the latter retains focus trapping. Use a Primer `ConfirmationDialog.Root` or `Dialog.Root` to supply modality to the parts. A raw Base UI root neither supplies nor resets that context, so parts may inherit an outer Primer root's mode; its semantics and pointer hit testing require explicit composition. Non-modal alert-dialog usage requires host accessibility review.
- The configuration renders a backdrop by default. In `trap-focus` mode, a Base UI backdrop can prevent outside-press dismissal even when the press reaches an outside control, though a drag released elsewhere outside can still dismiss. In a non-modal fixture, Chromium closed on mouse-down when focus left an input. When compound parts omit the backdrop, Base UI 1.6 and 1.8 can also dismiss on mouse-down or touch movement before cancellation and lose an unsaved draft. `disablePointerDismissal` also disables focus-out dismissal; it changes the interaction rather than preserving outside dismissal. Retain explicit actions and seek accessibility review.
- `width` and `height` keep upstream's dialog size scale; do not depend on legacy overlay class names.
- The centered dialog shrinks to fit narrow viewports. Titles and config action labels wrap, and overflowing content scrolls within the dialog.
- The footer buttons move focus between each other with the left and right arrows and Tab, as upstream's dialog footer does. Tabbing into the footer from outside lands on the nearest button.
- Remove `sx` and styled-system props.
- `ConfirmationDialog.Trigger` sets `aria-expanded` while the dialog is open (Base UI semantics), so a `Button` trigger shows its active background behind the backdrop. Upstream opens confirmations from a plain button, so visual comparisons differ only in that blended trigger fill.
- A host that prohibits `aria-controls` can explicitly omit it on `ConfirmationDialog.Trigger` or the config component's rendered trigger. This removes the trigger-to-dialog ID relationship and needs specialist and assistive-technology review; automated Chromium and WebKit checks do not establish spoken behavior.
