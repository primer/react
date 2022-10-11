import { SegmentedControlButtonProps } from './SegmentedControlButton';
export declare const directChildLayoutAdjustments: {
    ':first-child': {
        marginLeft: string;
    };
    ':last-child': {
        marginRight: string;
    };
};
export declare const borderedSegment: {
    marginRight: string;
    ':after': {
        backgroundColor: string;
        content: string;
        position: string;
        right: string;
        top: number;
        bottom: number;
        width: string;
    };
};
export declare const getSegmentedControlButtonStyles: (props?: (Partial<Pick<SegmentedControlButtonProps, "children" | "selected">> & {
    isIconOnly?: boolean | undefined;
}) | undefined) => {
    '--segmented-control-button-inner-padding': string;
    '--segmented-control-button-bg-inset': string;
    '--segmented-control-outer-radius': any;
    backgroundColor: string;
    borderColor: string;
    borderRadius: string;
    borderWidth: number;
    color: string;
    cursor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string | number;
    height: string;
    width: string;
    '.segmentedControl-content': {
        alignItems: string;
        backgroundColor: string;
        borderColor: string;
        borderStyle: string;
        borderWidth: number;
        borderRadius: string;
        display: string;
        height: string;
        justifyContent: string;
        paddingLeft: string;
        paddingRight: string;
    };
    svg: {
        fill: string;
    };
    ':hover .segmentedControl-content': {
        backgroundColor: string | undefined;
    };
    ':active .segmentedControl-content': {
        backgroundColor: string | undefined;
    };
    ':focus:focus-visible:not(:last-child):after': {
        width: number;
    };
    '.segmentedControl-text': {
        ':after': {
            content: string;
            display: string;
            fontWeight: string;
            height: number;
            overflow: string;
            pointerEvents: string;
            userSelect: string;
            visibility: string;
        };
    };
    '@media (pointer: coarse)': {
        ':before': {
            content: string;
            position: string;
            left: number;
            right: number;
            transform: string;
            top: string;
            minHeight: string;
        };
    };
};
export declare const getSegmentedControlListItemStyles: () => {
    ':first-child': {
        marginLeft: string;
    };
    ':last-child': {
        marginRight: string;
    };
    display: string;
    position: string;
    flexGrow: number;
    marginTop: string;
    marginBottom: string;
    ':not(:last-child)': {
        marginRight: string;
        ':after': {
            backgroundColor: string;
            content: string;
            position: string;
            right: string;
            top: number;
            bottom: number;
            width: string;
        };
    };
};
