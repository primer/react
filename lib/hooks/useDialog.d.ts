/// <reference types="react" />
declare type UseDialogParameters = {
    modalRef: React.RefObject<HTMLElement>;
    overlayRef: React.RefObject<HTMLElement>;
    isOpen?: boolean;
    onDismiss?: () => void;
    initialFocusRef?: React.RefObject<HTMLElement>;
    closeButtonRef?: React.RefObject<HTMLElement>;
    returnFocusRef?: React.RefObject<HTMLElement>;
};
declare function useDialog({ modalRef, overlayRef, isOpen, onDismiss, initialFocusRef, closeButtonRef }: UseDialogParameters): {
    getDialogProps: () => {
        onKeyDown: (event: any) => void;
    };
};
export default useDialog;
