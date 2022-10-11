import React from 'react';
import { SxProp } from '../sx';
export declare type Props = {
    /**
     * Whether the label should be visually hidden
     */
    visuallyHidden?: boolean;
} & SxProp;
declare const FormControlLabel: React.FC<React.PropsWithChildren<{
    htmlFor?: string;
    id?: string;
} & Props>>;
export default FormControlLabel;
