import { To } from 'history';
import React from 'react';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const BreadcrumbsBase: import("styled-components").StyledComponent<"nav", any, SxProp, never>;
export declare type BreadcrumbsProps = React.PropsWithChildren<{
    className?: string;
} & SxProp>;
declare function Breadcrumbs({ className, children, sx: sxProp }: React.PropsWithChildren<BreadcrumbsProps>): JSX.Element;
declare namespace Breadcrumbs {
    var displayName: string;
}
declare const BreadcrumbsItem: import("styled-components").StyledComponent<"a", any, {
    to?: To | undefined;
    selected?: boolean | undefined;
} & SxProp, never>;
export declare type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>;
declare const _default: typeof Breadcrumbs & {
    Item: import("styled-components").StyledComponent<"a", any, {
        to?: To | undefined;
        selected?: boolean | undefined;
    } & SxProp, never>;
};
export default _default;
/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export declare const Breadcrumb: typeof Breadcrumbs & {
    Item: import("styled-components").StyledComponent<"a", any, {
        to?: To | undefined;
        selected?: boolean | undefined;
    } & SxProp, never>;
};
/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export declare type BreadcrumbProps = ComponentProps<typeof BreadcrumbsBase>;
/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export declare type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>;
