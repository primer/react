# ConfirmationDialog

`ConfirmationDialog` asks a user to confirm or cancel a consequential action.

Import: `import {ConfirmationDialog} from '@primer/react-tailwind/ConfirmationDialog'`

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
