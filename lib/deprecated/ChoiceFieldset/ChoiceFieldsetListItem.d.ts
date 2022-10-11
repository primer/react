import React from 'react';
import { ComponentProps } from '../../utils/types';
export interface ChoiceFieldProps {
    /**
     * Whether the field is ready for user input
     */
    disabled?: boolean;
    /**
     * The unique identifier for this field. Used to associate the label, validation text, and caption text.
     * If an ID is not provided, one will be automatically generated.
     */
    id?: string;
    /**
     * The value that is being selected
     */
    value: string;
}
declare const ChoiceFieldsetListItem: React.FC<React.PropsWithChildren<ChoiceFieldProps>>;
export declare type ChoiceFieldComponentProps = ComponentProps<typeof ChoiceFieldsetListItem>;
declare const _default: React.FC<React.PropsWithChildren<ChoiceFieldProps>> & {
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
export default _default;
