/// <reference types="react" />
import { SxProp } from '../../sx';
import { ComponentProps } from '../../utils/types';
declare const SelectMenuTabsBase: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare type SelectMenuTabsProps = ComponentProps<typeof SelectMenuTabsBase>;
declare const SelectMenuTabs: {
    ({ children, ...rest }: SelectMenuTabsProps): JSX.Element;
    displayName: string;
};
export default SelectMenuTabs;
