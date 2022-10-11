import React from 'react';
import { TextInputNonPassthroughProps } from './TextInput';
declare const TextInputInnerVisualSlot: React.FC<React.PropsWithChildren<{
    /** Whether the input is expected to ever show a loading indicator */
    hasLoadingIndicator: boolean;
    /** Whether the to show the loading indicator */
    showLoadingIndicator: TextInputNonPassthroughProps['loading'];
    /** Which side of this visual is being rendered */
    visualPosition: 'leading' | 'trailing';
}>>;
export default TextInputInnerVisualSlot;
