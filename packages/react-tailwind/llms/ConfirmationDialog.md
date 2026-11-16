# ConfirmationDialog

`ConfirmationDialog` asks a user to confirm or cancel a consequential action.

Import: `import {ConfirmationDialog} from '@primer/react-tailwind/ConfirmationDialog'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {ConfirmationDialog} from '@primer/react-tailwind'
;<ConfirmationDialog
  dangerous
  description="This action cannot be undone."
  title="Delete issue?"
  trigger={<button type="button">Delete</button>}
/>
```

Use a concise title that describes the consequence. The confirm action should be specific and visibly distinct from cancel.

The default confirmation is modal and exposes `role="alertdialog"` and `aria-modal="true"`. With `modal={false}` or `modal="trap-focus"`, outside pointer interactions remain available and the dialog is not exposed as modal. The latter still traps focus. Review the intended pattern and its assistive-technology behavior before using a non-modal confirmation.

The configuration renders a backdrop by default. With `modal="trap-focus"`, Base UI can leave the dialog open after an outside press even when the press reaches an outside control; a drag released elsewhere outside can still dismiss it. In a tested non-modal composition, moving focus to an outside button closed the dialog on mouse-down in Chromium. When compound parts omit the backdrop, Base UI 1.6 and 1.8 can also dismiss on mouse-down or touch movement before cancellation, potentially losing an unsaved draft. `disablePointerDismissal` keeps the tested dialogs open during outside interactions, but also disables focus-out dismissal and changes the expected interaction. Provide explicit cancel and confirm actions, and review outside dismissal and pointer cancellation with an accessibility specialist.

Use `ConfirmationDialog.Root` or `Dialog.Root` with the compound parts so they can reflect the root's modality. A raw Base UI root does not supply or reset that context: parts beneath it cannot infer its modality and may inherit an outer Primer root's mode. Configure their semantics and pointer hit testing explicitly in that composition.

Base UI normally connects an open confirmation trigger to the dialog with `aria-controls`. If a host policy requires omitting it, pass `aria-controls={undefined}` to `ConfirmationDialog.Trigger`, or to the config component's rendered trigger. This removes the explicit ID relationship; a custom renderer may override the prop. Verify the resulting behavior with the host's assistive technologies.

Long titles and action labels wrap, and the dialog can scroll when its content exceeds the available height. Verify custom content at the host's supported viewport sizes and text settings.

A confirmation opened inside another Primer floating surface uses the popover layer for both its backdrop and viewport. This relies on host stacking tokens and the nested portal order; check custom portal roots, clipping, focus, and dismissal in the host.

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## Props

- `cancelButtonContent`: `React.ReactNode` — Default `'Cancel'`. Label for the cancel button.
- `cancelButtonDisabled`: `boolean` — Default `false`. Prevents cancelling.
- `cancelButtonLoading`: `boolean` — Default `false`. Shows a spinner on the cancel button.
- `children`: `React.ReactNode`
- `confirmButtonContent`: `React.ReactNode` — Default `'Confirm'`. Label for the confirm button. Name the action rather than saying `OK`.
- `confirmButtonDisabled`: `boolean` — Default `false`. Prevents confirming, for when a precondition is not yet met.
- `confirmButtonLoading`: `boolean` — Default `false`. Shows a spinner on the confirm button while the action is in flight.
- `dangerous`: `boolean` — Default `false`. Styles confirmation as destructive and makes cancel the default focus.
- `description`: `React.ReactNode` — Supporting detail about what confirming will do.
- `finalFocus`: `boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => void | boolean | HTMLElement | null)` — What receives focus when the dialog closes.
- `height`: `DialogHeight` — Default `'auto'`. Height of the dialog: `small` (480px), `large` (640px), or `auto` to fit its content.
- `initialFocus`: `"cancel" | "confirm" | boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => void | boolean | HTMLElement | null)` — What receives focus when the dialog opens.
- `onCancel`: `(() => void)` — Called when the dialog is dismissed or the cancel button is activated.
- `onConfirm`: `(() => void)` — Called when the confirm button is activated.
- `title` (required): `React.ReactNode` — Question or statement the reader is confirming.
- `trigger`: `React.ReactElement` — Element that opens the dialog.
- `width`: `DialogWidth` — Default `'medium'`. Width of the dialog: `small` (296px), `medium` (320px), `large` (480px), `xlarge` (640px), or any CSS width.

## ConfirmationDialog.Root

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## ConfirmationDialog.Trigger

Forwards unrecognized props to Base UI's [`Dialog.Trigger`](https://base-ui.com/react/components/dialog#trigger), so it also accepts that part's props.

## ConfirmationDialog.Portal

Forwards unrecognized props to Base UI's [`Dialog.Portal`](https://base-ui.com/react/components/dialog#portal), so it also accepts that part's props.

## ConfirmationDialog.Backdrop

Forwards unrecognized props to Base UI's [`Dialog.Backdrop`](https://base-ui.com/react/components/dialog#backdrop), so it also accepts that part's props.

## ConfirmationDialog.Viewport

Forwards unrecognized props to Base UI's [`Dialog.Viewport`](https://base-ui.com/react/components/dialog#viewport), so it also accepts that part's props.

## ConfirmationDialog.Content

Forwards unrecognized props to Base UI's [`Dialog.Popup`](https://base-ui.com/react/components/dialog#popup), so it also accepts that part's props.

- `height`: `DialogHeight` — Default `'auto'`. Height of the dialog: `small` (480px), `large` (640px), or `auto` to fit its content.
- `width`: `DialogWidth` — Default `'medium'`. Width of the dialog: `small` (296px), `medium` (320px), `large` (480px), `xlarge` (640px), or any CSS width.

## ConfirmationDialog.Popup

Forwards unrecognized props to Base UI's [`Dialog.Popup`](https://base-ui.com/react/components/dialog#popup), so it also accepts that part's props.

- `height`: `DialogHeight` — Default `'auto'`. Height of the dialog: `small` (480px), `large` (640px), or `auto` to fit its content.
- `width`: `DialogWidth` — Default `'medium'`. Width of the dialog: `small` (296px), `medium` (320px), `large` (480px), `xlarge` (640px), or any CSS width.

## ConfirmationDialog.Title

Forwards unrecognized props to Base UI's [`Dialog.Title`](https://base-ui.com/react/components/dialog#title), so it also accepts that part's props.

## ConfirmationDialog.Description

Forwards unrecognized props to Base UI's [`Dialog.Description`](https://base-ui.com/react/components/dialog#description), so it also accepts that part's props.

## ConfirmationDialog.Close

Forwards unrecognized props to Base UI's [`Dialog.Close`](https://base-ui.com/react/components/dialog#close), so it also accepts that part's props.

## Differences from `@primer/react`

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
