import React, { TextareaHTMLAttributes } from 'react';
import { FormValidationStatus } from './utils/types/FormValidationStatus';
import { SxProp } from './sx';
export declare const DEFAULT_TEXTAREA_ROWS = 7;
export declare const DEFAULT_TEXTAREA_COLS = 30;
export declare const DEFAULT_TEXTAREA_RESIZE = "both";
export declare type TextareaProps = {
    /**
     * Apply inactive visual appearance to the Textarea
     */
    disabled?: boolean;
    /**
     * Indicates whether the Textarea validation state
     */
    validationStatus?: FormValidationStatus;
    /**
     * Block
     */
    block?: boolean;
    /**
     * Allows resizing of the textarea
     */
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
} & TextareaHTMLAttributes<HTMLTextAreaElement> & SxProp;
/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
declare const Textarea: React.ForwardRefExoticComponent<{
    /**
     * Apply inactive visual appearance to the Textarea
     */
    disabled?: boolean | undefined;
    /**
     * Indicates whether the Textarea validation state
     */
    validationStatus?: FormValidationStatus | undefined;
    /**
     * Block
     */
    block?: boolean | undefined;
    /**
     * Allows resizing of the textarea
     */
    resize?: "none" | "both" | "horizontal" | "vertical" | undefined;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> & SxProp & React.RefAttributes<HTMLTextAreaElement>>;
export default Textarea;
