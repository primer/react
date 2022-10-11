import { MaxWidthProps } from 'styled-system';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Truncate: import("styled-components").StyledComponent<"div", any, {
    title: string;
    inline?: boolean | undefined;
    expandable?: boolean | undefined;
} & MaxWidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.MaxWidth<import("styled-system").TLengthStyledSystem>> & SxProp, never>;
export declare type TruncateProps = ComponentProps<typeof Truncate>;
export default Truncate;
