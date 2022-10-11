import { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
import React from 'react';
import { ActionListDividerProps, ActionListLeadingVisualProps, ActionListTrailingVisualProps } from '../ActionList';
import { SxProp } from '../sx';
export declare type NavListProps = {
    children: React.ReactNode;
} & SxProp & React.ComponentProps<'nav'>;
export declare type NavListItemProps = {
    children: React.ReactNode;
    href?: string;
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
} & SxProp;
export declare type NavListSubNavProps = {
    children: React.ReactNode;
} & SxProp;
export declare type NavListLeadingVisualProps = ActionListLeadingVisualProps;
export declare type NavListTrailingVisualProps = ActionListTrailingVisualProps;
export declare type NavListDividerProps = ActionListDividerProps;
export declare type NavListGroupProps = {
    children: React.ReactNode;
    title?: string;
} & SxProp;
export declare const NavList: React.ForwardRefExoticComponent<Pick<NavListProps, "key" | "sx" | keyof React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>> & {
    Item: PolymorphicForwardRefComponent<"a", NavListItemProps>;
    SubNav: {
        ({ children, sx: sxProp }: NavListSubNavProps): JSX.Element | null;
        displayName: string;
    };
    LeadingVisual: React.FC<React.PropsWithChildren<SxProp & React.HTMLAttributes<HTMLSpanElement>>>;
    TrailingVisual: React.FC<React.PropsWithChildren<SxProp & React.HTMLAttributes<HTMLSpanElement>>>;
    Divider: React.FC<React.PropsWithChildren<SxProp>>;
    Group: React.VFC<NavListGroupProps>;
};
