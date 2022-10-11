/// <reference types="react" />
import { SxProp } from '../../sx';
import { ComponentProps } from '../../utils/types';
declare const StyledHeader: import("styled-components").StyledComponent<"header", any, SxProp, never>;
export declare type SelectMenuHeaderProps = ComponentProps<typeof StyledHeader>;
declare const SelectMenuHeader: {
    ({ children, theme, ...rest }: SelectMenuHeaderProps): JSX.Element;
    displayName: string;
};
export default SelectMenuHeader;
