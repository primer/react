import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Link: import("styled-components").StyledComponent<"a", any, {
    hoverColor?: string | undefined;
    muted?: boolean | undefined;
    underline?: boolean | undefined;
} & SxProp, never>;
export declare type LinkProps = ComponentProps<typeof Link>;
export default Link;
