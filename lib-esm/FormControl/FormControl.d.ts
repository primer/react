import React from 'react';
import { SxProp } from '../sx';
export declare type FormControlProps = {
    children?: React.ReactNode;
    /**
     * Whether the control allows user input
     */
    disabled?: boolean;
    /**
     * The unique identifier for this control. Used to associate the label, validation text, and caption text
     */
    id?: string;
    /**
     * If true, the user must specify a value for the input before the owning form can be submitted
     */
    required?: boolean;
    /**
     * The direction the content flows.
     * Vertical layout is used by default, and horizontal layout is used for checkbox and radio inputs.
     */
    layout?: 'horizontal' | 'vertical';
} & SxProp;
export interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
    captionId: string;
    validationMessageId: string;
}
declare const _default: React.ForwardRefExoticComponent<{
    children?: React.ReactNode;
    /**
     * Whether the control allows user input
     */
    disabled?: boolean | undefined;
    /**
     * The unique identifier for this control. Used to associate the label, validation text, and caption text
     */
    id?: string | undefined;
    /**
     * If true, the user must specify a value for the input before the owning form can be submitted
     */
    required?: boolean | undefined;
    /**
     * The direction the content flows.
     * Vertical layout is used by default, and horizontal layout is used for checkbox and radio inputs.
     */
    layout?: "horizontal" | "vertical" | undefined;
} & SxProp & React.RefAttributes<HTMLDivElement>> & {
    Caption: React.FC<React.PropsWithChildren<{
        id?: string | undefined;
    } & SxProp>>;
    Label: React.FC<React.PropsWithChildren<{
        htmlFor?: string | undefined;
        id?: string | undefined;
    } & {
        visuallyHidden?: boolean | undefined;
    } & SxProp>>;
    LeadingVisual: React.FC<React.PropsWithChildren<SxProp>>;
    Validation: React.FC<React.PropsWithChildren<import("./_FormControlValidation").FormControlValidationProps>>;
};
export default _default;
