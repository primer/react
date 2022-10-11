/// <reference types="react" />
import { SxProp } from '../../sx';
import { ComponentProps } from '../../utils/types';
declare const StyledTab: import("styled-components").StyledComponent<"button", any, SxProp, never>;
export declare type SelectMenuTabProps = {
    tabName?: string;
    index?: number;
} & ComponentProps<typeof StyledTab>;
declare const SelectMenuTab: {
    ({ tabName, index, className, onClick, ...rest }: SelectMenuTabProps): JSX.Element;
    displayName: string;
};
export default SelectMenuTab;
