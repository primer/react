import React, { HTMLAttributes } from 'react';
import { IconProps } from '@primer/octicons-react';
import { SxProp } from '../sx';
export declare type SegmentedControlIconButtonProps = {
    'aria-label': string;
    /** The icon that represents the segmented control item */
    icon: React.FunctionComponent<React.PropsWithChildren<IconProps>>;
    /** Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl. */
    selected?: boolean;
    /** Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render. */
    defaultSelected?: boolean;
} & SxProp & HTMLAttributes<HTMLButtonElement | HTMLLIElement>;
export declare const SegmentedControlIconButton: React.FC<React.PropsWithChildren<SegmentedControlIconButtonProps>>;
export default SegmentedControlIconButton;
