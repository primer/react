import React from 'react';
import { ComponentProps } from '../../utils/types';
declare const SelectMenuFilter: React.ForwardRefExoticComponent<{
    value?: string | undefined;
} & Omit<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>>, "monospace" | "maxWidth" | "minWidth" | "width" | "block" | "size" | "icon" | "sx" | "disabled" | "loading" | "variant" | "validationStatus" | "contrast" | "loaderPosition" | "leadingVisual" | "trailingVisual" | "trailingAction"> & {
    icon?: React.ComponentType<React.PropsWithChildren<{
        className?: string | undefined;
    }>> | undefined;
    loading?: boolean | undefined;
    loaderPosition?: "auto" | "leading" | "trailing" | undefined;
    leadingVisual?: string | React.ComponentType<React.PropsWithChildren<{
        className?: string | undefined;
    }>> | undefined;
    trailingVisual?: string | React.ComponentType<React.PropsWithChildren<{
        className?: string | undefined;
    }>> | undefined;
    trailingAction?: React.ReactElement<React.HTMLProps<HTMLButtonElement>, string | React.JSXElementConstructor<any>> | undefined;
} & Pick<import("../../_TextInputWrapper").StyledWrapperProps, "monospace" | "maxWidth" | "minWidth" | "width" | "block" | "size" | "sx" | "disabled" | "variant" | "validationStatus" | "contrast"> & React.RefAttributes<HTMLInputElement>>;
export declare type SelectMenuFilterProps = ComponentProps<typeof SelectMenuFilter>;
export default SelectMenuFilter;
