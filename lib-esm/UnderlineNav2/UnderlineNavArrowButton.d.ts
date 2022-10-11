import React from 'react';
import { OnScrollWithButtonEventType } from './types';
declare const ArrowButton: ({ scrollValue, type, show, onScrollWithButton, "aria-label": ariaLabel }: {
    scrollValue: number;
    type: 'left' | 'right';
    show: boolean;
    onScrollWithButton: OnScrollWithButtonEventType;
    'aria-label'?: React.AriaAttributes['aria-label'];
}) => JSX.Element;
export { ArrowButton };
