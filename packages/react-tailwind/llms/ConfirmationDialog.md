# ConfirmationDialog

`ConfirmationDialog` asks a user to confirm or cancel a consequential action.

Import: `import {ConfirmationDialog} from '@primer/react-tailwind/ConfirmationDialog'`

## Props

- `cancelButtonContent`: `React.ReactNode` — Default `'Cancel'`. Label for the cancel button.
- `cancelButtonDisabled`: `boolean` — Default `false`. Prevents cancelling.
- `cancelButtonLoading`: `boolean` — Default `false`. Shows a spinner on the cancel button.
- `children`: `React.ReactElement[]`
- `confirmButtonContent`: `React.ReactNode` — Default `'Confirm'`. Label for the confirm button. Name the action rather than saying `OK`.
- `confirmButtonDisabled`: `boolean` — Default `false`. Prevents confirming, for when a precondition is not yet met.
- `confirmButtonLoading`: `boolean` — Default `false`. Shows a spinner on the confirm button while the action is in flight.
- `dangerous`: `boolean` — Default `false`. Styles confirmation as destructive and makes cancel the default focus.
- `description`: `React.ReactNode` — Supporting detail about what confirming will do.
- `finalFocus`: `boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => void | boolean | HTMLElement | null)` — What receives focus when the dialog closes.
- `initialFocus`: `"cancel" | "confirm" | boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => void | boolean | HTMLElement | null)` — What receives focus when the dialog opens.
- `onCancel`: `(() => void)` — Called when the dialog is dismissed or the cancel button is activated.
- `onConfirm`: `(() => void)` — Called when the confirm button is activated.
- `title`: `React.ReactNode` — Question or statement the reader is confirming.
- `trigger`: `React.ReactElement` — Element that opens the dialog.

## Differences from `@primer/react`

- Migrate `onClose` gesture handling to `onCancel`/`onConfirm` and controlled Root state.
