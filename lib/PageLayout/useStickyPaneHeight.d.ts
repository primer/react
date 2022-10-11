import React from 'react';
/**
 * Calculates the height of the sticky pane such that it always
 * fits into the viewport even when the header or footer are visible.
 */
export declare function useStickyPaneHeight(): {
    rootRef: React.RefObject<HTMLDivElement>;
    enableStickyPane: (top: string | number) => void;
    disableStickyPane: () => void;
    contentTopRef: (node?: Element | null | undefined) => void;
    contentBottomRef: (node?: Element | null | undefined) => void;
    stickyPaneHeight: string;
};
