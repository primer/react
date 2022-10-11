import React from 'react';
import { SxProp } from '../sx';
import { FormValidationStatus } from '../utils/types/FormValidationStatus';
export declare type CheckboxOrRadioGroupValidationProps = {
    /** Changes the visual style to match the validation status */
    variant: FormValidationStatus;
} & SxProp;
declare const CheckboxOrRadioGroupValidation: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupValidationProps>>;
export default CheckboxOrRadioGroupValidation;
