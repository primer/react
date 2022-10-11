/// <reference types="react" />
import { TouchOrMouseEvent } from './useOnOutsideClick';
export declare type UseOverlaySettings = {
    ignoreClickRefs?: React.RefObject<HTMLElement>[];
    initialFocusRef?: React.RefObject<HTMLElement>;
    returnFocusRef: React.RefObject<HTMLElement>;
    onEscape: (e: KeyboardEvent) => void;
    onClickOutside: (e: TouchOrMouseEvent) => void;
    overlayRef?: React.RefObject<HTMLDivElement>;
    preventFocusOnOpen?: boolean;
};
export declare type OverlayReturnProps = {
    ref: React.RefObject<HTMLDivElement>;
};
export declare const useOverlay: ({ overlayRef: _overlayRef, returnFocusRef, initialFocusRef, onEscape, ignoreClickRefs, onClickOutside, preventFocusOnOpen }: UseOverlaySettings) => OverlayReturnProps;
