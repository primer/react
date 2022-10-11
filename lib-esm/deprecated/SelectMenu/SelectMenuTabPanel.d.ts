/// <reference types="react" />
import { SxProp } from '../../sx';
import { ComponentProps } from '../../utils/types';
declare const TabPanelBase: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare type SelectMenuTabPanelProps = {
    tabName?: string;
} & ComponentProps<typeof TabPanelBase>;
declare const TabPanel: {
    ({ tabName, className, children, ...rest }: SelectMenuTabPanelProps): JSX.Element;
    displayName: string;
};
export default TabPanel;
