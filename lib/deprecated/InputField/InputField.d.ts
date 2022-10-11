import React from 'react';
import { ComponentProps } from '../../utils/types';
import { FormValidationStatus } from '../../utils/types/FormValidationStatus';
export interface Props<T = Record<string, FormValidationStatus>> {
    children?: React.ReactNode;
    /**
     * Whether the field is ready for user input
     */
    disabled?: boolean;
    /**
     * The unique identifier for this field. Used to associate the label, validation text, and caption text
     */
    id?: string;
    /**
     * Whether this field must have a value for the user to complete their task
     */
    required?: boolean;
    /**
     * A map of validation statuses and their associated validation keys. When one of the validation keys is passed to the `validationResult` prop,
     * the associated validation message will be rendered in the correct style
     */
    validationMap?: T;
    /**
     * The key of the validation message to show
     */
    validationResult?: keyof T;
}
export interface InputFieldContext extends Pick<Props<Record<string, FormValidationStatus>>, 'disabled' | 'id' | 'required'> {
    captionId: string;
    validationMessageId: string;
}
/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
declare const InputField: <T extends Record<string, FormValidationStatus>>({ children, disabled, id: idProp, required, validationMap, validationResult }: Props<T>) => JSX.Element;
export declare type InputFieldComponentProps = ComponentProps<typeof InputField>;
declare const _default: (<T extends Record<string, FormValidationStatus>>({ children, disabled, id: idProp, required, validationMap, validationResult }: Props<T>) => JSX.Element) & {
    Caption: React.FC<{
        children?: React.ReactNode;
    }>;
    Label: React.FC<React.PropsWithChildren<import("./_InputFieldLabel").Props>>;
    Validation: React.FC<React.PropsWithChildren<import("./_InputFieldValidation").InputFieldValidationProps>>;
};
export default _default;
