# ConfirmationDialog

`ConfirmationDialog` asks a user to confirm or cancel a consequential action.

Import: `import {ConfirmationDialog} from '@primer/react-tailwind/ConfirmationDialog'`

## Props

- `cancelButtonContent`: `React.ReactNode` — Default `'Cancel'`.
- `cancelButtonDisabled`: `boolean` — Default `false`.
- `cancelButtonLoading`: `boolean` — Default `false`.
- `children`: `React.ReactNode`
- `confirmButtonContent`: `React.ReactNode` — Default `'Confirm'`.
- `confirmButtonDisabled`: `boolean` — Default `false`.
- `confirmButtonLoading`: `boolean` — Default `false`.
- `dangerous`: `boolean` — Default `false`.
- `description`: `React.ReactNode`
- `finalFocus`: `React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>['finalFocus']`
- `initialFocus`: `'cancel' | 'confirm' | React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>['initialFocus']`
- `onCancel`: `() => void`
- `onConfirm`: `() => void`
- `title`: `React.ReactNode`
- `trigger`: `React.ReactElement`

## Differences from `@primer/react`

- Migrate `onClose` gesture handling to `onCancel`/`onConfirm` and controlled Root state.

