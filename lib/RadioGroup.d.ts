import React, { ChangeEvent } from 'react';
import { CheckboxOrRadioGroupProps } from './_CheckboxOrRadioGroup';
import { SxProp } from './sx';
declare type RadioGroupProps = {
    /**
     * An onChange handler that gets called when the selection changes
     */
    onChange?: (selected: string | null, e?: ChangeEvent<HTMLInputElement>) => void;
    /**
     * The name used to identify this group of radios
     */
    name: string;
} & CheckboxOrRadioGroupProps & SxProp;
export declare const RadioGroupContext: React.Context<{
    disabled?: boolean | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    name: string;
} | null>;
declare const _default: React.FC<React.PropsWithChildren<RadioGroupProps>> & {
    Caption: React.FC<React.PropsWithChildren<SxProp>>;
    Label: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel").CheckboxOrRadioGroupLabelProps>>;
    Validation: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation").CheckboxOrRadioGroupValidationProps>>;
};
export default _default;
