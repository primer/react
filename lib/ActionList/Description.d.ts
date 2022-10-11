import React from 'react';
import { SxProp } from '../sx';
export declare type ActionListDescriptionProps = {
    /**
     * Secondary text style variations.
     *
     * - `"inline"` - Secondary text is positioned beside primary text.
     * - `"block"` - Secondary text is positioned below primary text.
     */
    variant?: 'inline' | 'block';
} & SxProp;
export declare const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>>;
