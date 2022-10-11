/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Timeline: import("styled-components").StyledComponent<"div", any, {
    clipSidebar?: boolean | undefined;
} & SxProp, never>;
declare const TimelineItem: import("styled-components").StyledComponent<"div", any, {
    condensed?: boolean | undefined;
} & SxProp, never>;
export declare type TimelineBadgeProps = {
    children?: React.ReactNode;
} & SxProp;
declare const TimelineBody: import("styled-components").StyledComponent<"div", any, SxProp, never>;
declare const TimelineBreak: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare type TimelineProps = ComponentProps<typeof Timeline>;
export declare type TimelineItemsProps = ComponentProps<typeof TimelineItem>;
export declare type TimelineBodyProps = ComponentProps<typeof TimelineBody>;
export declare type TimelineBreakProps = ComponentProps<typeof TimelineBreak>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, {
    clipSidebar?: boolean | undefined;
} & SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Item: import("styled-components").StyledComponent<"div", any, {
        condensed?: boolean | undefined;
    } & SxProp, never>;
    Badge: {
        (props: TimelineBadgeProps): JSX.Element;
        displayName: string;
    };
    Body: import("styled-components").StyledComponent<"div", any, SxProp, never>;
    Break: import("styled-components").StyledComponent<"div", any, SxProp, never>;
};
export default _default;
