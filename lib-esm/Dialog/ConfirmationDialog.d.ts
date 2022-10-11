import React from 'react';
/**
 * Props to customize the ConfirmationDialog.
 */
export interface ConfirmationDialogProps {
    /**
     * Required. This callback is invoked when a gesture to close the dialog
     * is performed. The first argument indicates the gesture.
     */
    onClose: (gesture: 'confirm' | 'cancel' | 'close-button' | 'cancel' | 'escape') => void;
    /**
     * Required. The title of the ConfirmationDialog. This is usually a brief
     * question.
     */
    title: React.ReactNode;
    /**
     * The text to use for the cancel button. Default: "Cancel".
     */
    cancelButtonContent?: React.ReactNode;
    /**
     * The text to use for the confirm button. Default: "OK".
     */
    confirmButtonContent?: React.ReactNode;
    /**
     * The type of button to use for the confirm button. Default: Button.
     */
    confirmButtonType?: 'normal' | 'primary' | 'danger';
}
/**
 * A ConfirmationDialog is a special kind of dialog with more rigid behavior. It
 * is used to confirm a user action. ConfirmationDialogs always have exactly
 * two buttons: one to cancel the action and one to confirm it. No custom
 * rendering capabilities are provided for ConfirmationDialog.
 */
export declare const ConfirmationDialog: React.FC<React.PropsWithChildren<ConfirmationDialogProps>>;
export declare type ConfirmOptions = Omit<ConfirmationDialogProps, 'onClose'> & {
    content: React.ReactNode;
};
/**
 * This hook takes no parameters and returns an `async` function, `confirm`. When `confirm`
 * is called, it shows the confirmation dialog. When the dialog is dismissed, a promise is
 * resolved with `true` or `false` depending on whether or not the confirm button was used.
 */
export declare function useConfirm(): (options: ConfirmOptions) => Promise<boolean>;
