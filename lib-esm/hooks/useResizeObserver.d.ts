import { RefObject } from 'react';
export declare type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;
export interface ResizeObserverEntry {
    contentRect: DOMRectReadOnly;
}
export declare function useResizeObserver<T extends HTMLElement>(callback: ResizeObserverCallback, target?: RefObject<T>): void;
