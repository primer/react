import React, { InputHTMLAttributes } from 'react';
import { SxProp } from './sx';
import { FormValidationStatus } from './utils/types/FormValidationStatus';
export declare type CheckboxProps = {
    /**
     * Apply indeterminate visual appearance to the checkbox
     */
    indeterminate?: boolean;
    /**
     * Apply inactive visual appearance to the checkbox
     */
    disabled?: boolean;
    /**
     * Forward a ref to the underlying input element
     */
    ref?: React.RefObject<HTMLInputElement>;
    /**
     * Indicates whether the checkbox must be checked
     */
    required?: boolean;
    /**
     * Only used to inform ARIA attributes. Individual checkboxes do not have validation styles.
     */
    validationStatus?: FormValidationStatus;
    /**
     * A unique value that is never shown to the user.
     * Used during form submission and to identify which checkbox inputs are selected
     */
    value?: string;
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'> & SxProp;
/**
 * An accessible, native checkbox component
 */
declare const Checkbox: React.ForwardRefExoticComponent<Pick<CheckboxProps, "sx" | keyof React.InputHTMLAttributes<HTMLInputElement> | "indeterminate" | "validationStatus"> & React.RefAttributes<HTMLInputElement>>;
export default Checkbox;
