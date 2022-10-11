import React from 'react';
import { Props as InputFieldProps } from './InputField/InputField';
import { FormValidationStatus } from '../utils/types/FormValidationStatus';
export interface Props extends Pick<InputFieldProps, 'disabled' | 'id'> {
    /**
     * Styles the field to visually communicate the result of form validation
     */
    validationStatus?: FormValidationStatus;
}
declare const _default: React.FC<React.PropsWithChildren<Props>> & {
    Label: React.FC<{
        children?: React.ReactNode;
    }>;
    Caption: React.FC<{
        children?: React.ReactNode;
    }>;
    LeadingVisual: React.FC<{
        children?: React.ReactNode;
    }>;
};
/**
 * @deprecated Use `FormControl` instead. See https://primer.style/react/FormControl for more info
 */
export default _default;
