import React from 'react';
declare type TypeaheadOptions = {
    containerRef: React.RefObject<HTMLElement>;
    onFocusChange: (element: Element) => void;
};
export declare function useTypeahead({ containerRef, onFocusChange }: TypeaheadOptions): void;
export {};
