import React from 'react';
import { GroupedListProps, ListPropsBase } from '../deprecated/ActionList/List';
import { TextInputProps } from '../TextInput';
import { SxProp } from '../sx';
export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase, SxProp {
    loading?: boolean;
    placeholderText: string;
    filterValue?: string;
    onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>;
    inputRef?: React.RefObject<HTMLInputElement>;
}
export declare function FilteredActionList({ loading, placeholderText, filterValue: externalFilterValue, onFilterChange, items, textInputProps, inputRef: providedInputRef, sx, ...listProps }: FilteredActionListProps): JSX.Element;
export declare namespace FilteredActionList {
    var displayName: string;
}
