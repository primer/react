import React from 'react';
import { SxProp } from './sx';
declare type Props = {
    /**
     * The unique identifier used to associate the caption with an input
     */
    id: string;
    /**
     * Whether the input associated with this caption is disabled
     */
    disabled?: boolean;
} & SxProp;
declare const InputCaption: React.FC<React.PropsWithChildren<Props>>;
export default InputCaption;
