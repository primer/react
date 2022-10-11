/// <reference types="react" />
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const StateLabelBase: import("styled-components").StyledComponent<"span", any, {
    variant?: "small" | "normal" | undefined;
    status?: "issueClosed" | "issueClosedNotPlanned" | "pullClosed" | "pullMerged" | "issueOpened" | "pullOpened" | "draft" | "issueDraft" | undefined;
} & SxProp, never>;
export declare type StateLabelProps = ComponentProps<typeof StateLabelBase>;
declare function StateLabel({ children, status, variant: variantProp, ...rest }: StateLabelProps): JSX.Element;
declare namespace StateLabel {
    var defaultProps: {
        variant: string;
    };
}
export default StateLabel;
