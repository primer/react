import React from 'react';
import { ButtonProps } from '../deprecated/Button';
import { SxProp } from '../sx';
/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */
export declare type DialogButtonProps = ButtonProps & {
    /**
     * The type of Button element to use
     */
    buttonType?: 'normal' | 'primary' | 'danger';
    /**
     * The Button's inner text
     */
    content: React.ReactNode;
    /**
     * If true, and if this is the only button with autoFocus set to true,
     * focus this button automatically when the dialog appears.
     */
    autoFocus?: boolean;
    /**
     * A reference to the rendered Button’s DOM node, used together with
     * `autoFocus` for `focusTrap`’s `initialFocus`.
     */
    ref?: React.RefObject<HTMLButtonElement>;
};
/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogProps {
    /**
     * Title of the Dialog. Also serves as the aria-label for this Dialog.
     */
    title?: React.ReactNode;
    /**
     * The Dialog's subtitle. Optional. Rendered below the title in smaller
     * type with less contrast. Also serves as the aria-describedby for this
     * Dialog.
     */
    subtitle?: React.ReactNode;
    /**
     * Provide a custom renderer for the dialog header. This content is
     * rendered directly into the dialog body area, full bleed from edge
     * to edge, top to the start of the body element.
     *
     * Warning: using a custom renderer may violate Primer UX principles.
     */
    renderHeader?: React.FunctionComponent<React.PropsWithChildren<DialogHeaderProps>>;
    /**
     * Provide a custom render function for the dialog body. This content is
     * rendered directly into the dialog body area, full bleed from edge to
     * edge, header to footer.
     *
     * Warning: using a custom renderer may violate Primer UX principles.
     */
    renderBody?: React.FunctionComponent<React.PropsWithChildren<DialogProps>>;
    /**
     * Provide a custom render function for the dialog footer. This content is
     * rendered directly into the dialog footer area, full bleed from edge to
     * edge, end of the body element to bottom.
     *
     * Warning: using a custom renderer may violate Primer UX principles.
     */
    renderFooter?: React.FunctionComponent<React.PropsWithChildren<DialogProps>>;
    /**
     * Specifies the buttons to be rendered in the Dialog footer.
     */
    footerButtons?: DialogButtonProps[];
    /**
     * This method is invoked when a gesture to close the dialog is used (either
     * an Escape key press or clicking the "X" in the top-right corner). The
     * gesture argument indicates the gesture that was used to close the dialog
     * (either 'close-button' or 'escape').
     */
    onClose: (gesture: 'close-button' | 'escape') => void;
    /**
     * Default: "dialog". The ARIA role to assign to this dialog.
     * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
     * @see https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
     */
    role?: 'dialog' | 'alertdialog';
    /**
     * The width of the dialog.
     * small: 296px
     * medium: 320px
     * large: 480px
     * xlarge: 640px
     */
    width?: DialogWidth;
    /**
     * The height of the dialog.
     * small: 296x480
     * large: 480x640
     * auto: variable based on contents
     */
    height?: DialogHeight;
}
/**
 * Props that are passed to a component that serves as a dialog header
 */
export interface DialogHeaderProps extends DialogProps {
    /**
     * ID of the element that will be used as the `aria-labelledby` attribute on the
     * dialog. This ID should be set to the element that renders the dialog's title.
     */
    dialogLabelId: string;
    /**
     * ID of the element that will be used as the `aria-describedby` attribute on the
     * dialog. This ID should be set to the element that renders the dialog's subtitle.
     */
    dialogDescriptionId: string;
}
declare const heightMap: {
    readonly small: "480px";
    readonly large: "640px";
    readonly auto: "auto";
};
declare const widthMap: {
    readonly small: "296px";
    readonly medium: "320px";
    readonly large: "480px";
    readonly xlarge: "640px";
};
export declare type DialogWidth = keyof typeof widthMap;
export declare type DialogHeight = keyof typeof heightMap;
/**
 * A dialog is a type of overlay that can be used for confirming actions, asking
 * for disambiguation, and presenting small forms. They generally allow the user
 * to focus on a quick task without having to navigate to a different page.
 *
 * Dialogs appear in the page after a direct user interaction. Don't show dialogs
 * on page load or as system alerts.
 *
 * Dialogs appear centered in the page, with a visible backdrop that dims the rest
 * of the window for focus.
 *
 * All dialogs have a title and a close button.
 *
 * Dialogs are modal. Dialogs can be dismissed by clicking on the close button,
 * pressing the escape key, or by interacting with another button in the dialog.
 * To avoid losing information and missing important messages, clicking outside
 * of the dialog will not close it.
 *
 * The sub components provided (e.g. Header, Title, etc.) are available for custom
 * renderers only. They are not intended to be used otherwise.
 */
export declare const Dialog: React.ForwardRefExoticComponent<DialogProps & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLDivElement>> & {
    Header: import("styled-components").StyledComponent<"div", any, {}, never>;
    Title: import("styled-components").StyledComponent<"h1", any, SxProp, never>;
    Subtitle: import("styled-components").StyledComponent<"h2", any, SxProp, never>;
    Body: import("styled-components").StyledComponent<"div", any, SxProp, never>;
    Footer: import("styled-components").StyledComponent<"div", any, SxProp, never>;
    Buttons: React.FC<React.PropsWithChildren<{
        buttons: DialogButtonProps[];
    }>>;
    CloseButton: React.FC<React.PropsWithChildren<{
        onClose: () => void;
    }>>;
};
export {};
