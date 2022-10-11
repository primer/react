import React from 'react';
declare type ActiveDescendantOptions = {
    containerRef: React.RefObject<HTMLElement>;
};
export declare function useActiveDescendant({ containerRef }: ActiveDescendantOptions): [string, React.Dispatch<React.SetStateAction<string>>];
export declare function getNextFocusableElement(activeElement: HTMLElement, event: KeyboardEvent): HTMLElement | undefined;
export {};
