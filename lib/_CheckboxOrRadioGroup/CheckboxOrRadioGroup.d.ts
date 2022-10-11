import React from 'react';
import { SxProp } from '../sx';
export declare type CheckboxOrRadioGroupProps = {
    /**
     * Used when associating the input group with a label other than `CheckboxOrRadioGroup.Label`
     */
    ['aria-labelledby']?: string;
    /**
     * Whether the input group allows user input
     */
    disabled?: boolean;
    /**
     * The unique identifier for this input group. Used to associate the label, validation text, and caption text.
     * You may want a custom ID to make it easier to select elements in integration tests.
     */
    id?: string;
    /**
     * If true, the user must make a selection before the owning form can be submitted
     */
    required?: boolean;
} & SxProp;
export declare type CheckboxOrRadioGroupContext = {
    validationMessageId?: string;
    captionId?: string;
} & CheckboxOrRadioGroupProps;
export type { CheckboxOrRadioGroupLabelProps } from './_CheckboxOrRadioGroupLabel';
declare const _default: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupProps>> & {
    Caption: React.FC<React.PropsWithChildren<SxProp>>;
    Label: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroupLabel").CheckboxOrRadioGroupLabelProps>>;
    Validation: React.FC<React.PropsWithChildren<import("./_CheckboxOrRadioGroupValidation").CheckboxOrRadioGroupValidationProps>>;
};
export default _default;
