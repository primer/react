import React from 'react';
import { StyledWrapperProps } from './_TextInputWrapper';
export declare type SelectProps = Omit<Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & Omit<StyledWrapperProps, 'variant'>, 'multiple' | 'hasLeadingVisual' | 'hasTrailingVisual' | 'as'>;
declare const _default: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>> & {
    Option: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptionElement> & {
        value: string;
    }>>;
    OptGroup: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptGroupElement>>>;
};
export default _default;
