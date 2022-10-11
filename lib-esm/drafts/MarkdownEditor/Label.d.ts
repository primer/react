import React, { FC } from 'react';
import { SxProp } from '../../sx';
declare type LabelProps = SxProp & {
    visuallyHidden?: boolean;
    children?: React.ReactNode;
};
export declare const Label: FC<LabelProps>;
export {};
