import React, { HTMLAttributes, ComponentPropsWithRef } from 'react';
import { IconProps } from '@primer/octicons-react';
import { SxProp } from '../sx';
export declare const StyledButton: import("styled-components").StyledComponent<"button", any, SxProp, never>;
export declare type VariantType = 'default' | 'primary' | 'invisible' | 'danger' | 'outline';
export declare type Size = 'small' | 'medium' | 'large';
/**
 * Remove styled-components polymorphic as prop, which conflicts with radix's
 */
declare type StyledButtonProps = Omit<ComponentPropsWithRef<typeof StyledButton>, 'as'>;
declare type ButtonA11yProps = {
    'aria-label': string;
    'aria-labelby'?: never;
} | {
    'aria-label'?: never;
    'aria-labelby': string;
};
export declare type ButtonBaseProps = {
    /**
     * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
     */
    variant?: VariantType;
    /**
     * Size of button and fontSize of text in button
     */
    size?: Size;
    /**
     * Items that are disabled can not be clicked, selected, or navigated through.
     */
    disabled?: boolean;
} & SxProp & HTMLAttributes<HTMLButtonElement> & StyledButtonProps;
export declare type ButtonProps = {
    /**
     * The leading icon comes before button content
     */
    leadingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>>;
    /**
     * The trailing icon comes after button content
     */
    trailingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>>;
    children: React.ReactNode;
} & ButtonBaseProps;
export declare type IconButtonProps = ButtonA11yProps & {
    icon: React.FunctionComponent<React.PropsWithChildren<IconProps>>;
} & ButtonBaseProps;
export declare type LinkButtonProps = {
    underline?: boolean;
    download?: string;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    rel?: string;
    target?: string;
    type?: string;
    referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy'];
};
export {};
