import React, { RefObject } from 'react';
export declare type SavedReply = {
    name: string;
    content: string;
};
export declare type SavedRepliesHandle = {
    openMenu: () => void;
};
declare type SavedRepliesContext = null | {
    onSelect: (savedReply: SavedReply) => void;
    savedReplies: SavedReply[];
    /** Ref to the button for clicking via keyboard shortcut. */
    ref: RefObject<SavedRepliesHandle>;
};
export declare const SavedRepliesContext: React.Context<SavedRepliesContext>;
export declare const SavedRepliesButton: () => JSX.Element;
export {};
