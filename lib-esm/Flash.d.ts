import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Flash: import("styled-components").StyledComponent<"div", any, {
    variant?: "success" | "danger" | "default" | "warning" | undefined;
    full?: boolean | undefined;
} & SxProp, never>;
export declare type FlashProps = ComponentProps<typeof Flash>;
export default Flash;
