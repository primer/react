import React from 'react';
import { Suggestions, TextInputElement } from './types';
declare type AutoCompleteSuggestionsProps = {
    suggestions: Suggestions | null;
    portalName?: string;
    top: number;
    left: number;
    onClose: () => void;
    onCommit: (suggestion: string) => void;
    inputRef: React.RefObject<TextInputElement>;
    visible: boolean;
    tabInsertsSuggestions: boolean;
};
/**
 * Renders an overlayed list at the given relative coordinates. Handles keyboard navigation
 * and accessibility concerns.
 */
declare const AutocompleteSuggestions: {
    ({ suggestions, portalName, top, left, onClose, onCommit: externalOnCommit, inputRef, visible, tabInsertsSuggestions }: AutoCompleteSuggestionsProps): JSX.Element;
    displayName: string;
};
export default AutocompleteSuggestions;
