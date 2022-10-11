import React from 'react';
export declare type TouchOrMouseEvent = MouseEvent | TouchEvent;
export declare type UseOnOutsideClickSettings = {
    containerRef: React.RefObject<HTMLDivElement>;
    ignoreClickRefs?: React.RefObject<HTMLElement>[];
    onClickOutside: (e: TouchOrMouseEvent) => void;
};
export declare const useOnOutsideClick: ({ containerRef, ignoreClickRefs, onClickOutside }: UseOnOutsideClickSettings) => void;
