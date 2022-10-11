import React from 'react';
import { FormValidationStatus } from '../../utils/types/FormValidationStatus';
export interface ChoiceFieldsetProps<T = Record<string, FormValidationStatus>> {
    children?: React.ReactNode;
    /**
     * Whether the fieldset is NOT ready for user input
     */
    disabled?: boolean;
    /**
     * The unique identifier for this fieldset. Used to associate the validation text with the fieldset
     * If an ID is not passed, one will be automatically generated
     */
    id?: string;
    /**
     * The unique identifier used to associate radio inputs with eachother
     * If a name is not passed and the fieldset renders radio inputs, a name will be automatically generated
     */
    name?: string;
    /**
     * The callback that is called when a user toggles a choice on or off
     */
    onSelect?: (selectedValues: string[]) => void;
    /**
     * Whether this field must have a value for the user to complete their task
     */
    required?: boolean;
    /**
     * The selected values
     */
    selected?: string[];
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
export interface ChoiceFieldsetContext extends ChoiceFieldsetProps {
    validationMessageId: string;
}
declare const Slot: React.FC<React.PropsWithChildren<{
    name: "Validation" | "Description" | "ChoiceList" | "Legend";
    children: React.ReactNode;
}>>;
export { Slot };
export type { ChoiceFieldsetListProps } from './ChoiceFieldsetList';
export type { ChoiceFieldsetLegendProps } from './ChoiceFieldsetLegend';
export type { ChoiceFieldProps } from './ChoiceFieldsetListItem';
declare const _default: (<T extends Record<string, FormValidationStatus>>({ children, disabled, id, name, onSelect, required, selected, validationMap, validationResult }: ChoiceFieldsetProps<T>) => JSX.Element) & {
    Description: React.FC<{
        children?: React.ReactNode;
    }>;
    Item: React.FC<React.PropsWithChildren<import("./ChoiceFieldsetListItem").ChoiceFieldProps>> & {
        Caption: React.FC<{
            children?: React.ReactNode;
        }>;
        Label: React.FC<{
            children?: React.ReactNode;
        }>;
        LeadingVisual: React.FC<{
            children?: React.ReactNode;
        }>;
    };
    Legend: React.FC<React.PropsWithChildren<import("./ChoiceFieldsetLegend").ChoiceFieldsetLegendProps>>;
    List: React.FC<React.PropsWithChildren<import("./ChoiceFieldsetList").ChoiceFieldsetListProps>>;
    Validation: React.FC<React.PropsWithChildren<import("./ChoiceFieldsetValidation").ChoiceFieldsetValidationProps>>;
};
/**
 * @deprecated Use `CheckboxGroup` or `RadioGroup` instead. See https://primer.style/react/CheckboxGroup and https://primer.style/react/RadioGroup for more info
 */
export default _default;
