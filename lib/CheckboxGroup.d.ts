import React, { ChangeEvent } from 'react';
import { CheckboxOrRadioGroupProps } from './_CheckboxOrRadioGroup';
import { SxProp } from './sx';
import { CheckboxGroupContext } from './CheckboxGroupContext';
declare type CheckboxGroupProps = {
    /**
     * An onChange handler that gets called when any of the checkboxes change
     */
    onChange?: (selected: string[], e?: ChangeEvent<HTMLInputElement>) => void;
} & CheckboxOrRadioGroupProps & SxProp;
export { CheckboxGroupContext };
declare const _default: React.FC<React.PropsWithChildren<CheckboxGroupProps>> & {
    Caption: React.FC<React.PropsWithChildren<SxProp>>;
    Label: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel").CheckboxOrRadioGroupLabelProps>>;
    Validation: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation").CheckboxOrRadioGroupValidationProps>>;
};
export default _default;
