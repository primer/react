import { EventHandler, SyntheticEvent } from 'react';
import { ShowSuggestionsEvent, Suggestion, TextInputCompatibleChild, Trigger } from './types';
/**
 * Calculate whether or not suggestions should be shown based on the given state of the
 * input. If they should be shown, returns the show event.
 */
export declare const calculateSuggestionsQuery: (triggers: Array<Trigger>, text: string, caretLocation: number) => ShowSuggestionsEvent | null;
export declare const getSuggestionValue: (suggestion: Suggestion) => string;
export declare const getSuggestionKey: (suggestion: Suggestion) => string;
/**
 * Replace a section of a string.
 */
export declare const replaceSlice: (original: string, [startInclusive, endExclusive]: [number, number], replacement: string) => string;
/**
 * Attempts to assert that the child element is of a supported type. This can't be enforced
 * by the type system so it has to be done as a runtime check. This isn't foolproof - a
 * component that forwards a ref to a correct element but does not forward event handlers
 * will not work. But it's the best we can reasonably do.
 */
export declare function requireChildrenToBeInput(child: React.ReactElement, childRef: React.RefObject<HTMLElement>): TextInputCompatibleChild;
/**
 * Combine several event handlers into one. The last handler in the list is called first
 * and no further handlers will be called if `event.preventDefault()` is called.
 */
export declare const augmentHandler: <E extends SyntheticEvent<Element, Event>>(...handlers: (((event: E) => void) | undefined)[]) => (event: E) => void;
