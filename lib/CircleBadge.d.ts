/// <reference types="hoist-non-react-statics" />
/// <reference types="react" />
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const CircleBadge: import("styled-components").StyledComponent<"div", any, {
    inline?: boolean | undefined;
    variant?: "small" | "medium" | "large" | undefined;
    size?: number | undefined;
} & SxProp, never>;
declare const CircleBadgeIcon: import("styled-components").StyledComponent<({ icon: IconComponent, ...rest }: {
    icon: import("react").ElementType<any>;
    color?: string | undefined;
} & import("@primer/octicons-react/dist/icons").IconProps) => JSX.Element, any, SxProp, never>;
export declare type CircleBadgeProps = ComponentProps<typeof CircleBadge>;
export declare type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, {
    inline?: boolean | undefined;
    variant?: "small" | "medium" | "large" | undefined;
    size?: number | undefined;
} & SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Icon: import("styled-components").StyledComponent<({ icon: IconComponent, ...rest }: {
        icon: import("react").ElementType<any>;
        color?: string | undefined;
    } & import("@primer/octicons-react/dist/icons").IconProps) => JSX.Element, any, SxProp, never>;
};
export default _default;
