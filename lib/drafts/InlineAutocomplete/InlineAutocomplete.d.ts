import React from 'react';
import { BetterSystemStyleObject } from '../../sx';
import { ShowSuggestionsEvent, Suggestions, TextInputCompatibleChild, Trigger } from './types';
export declare type InlineAutocompleteProps = {
    /** Register the triggers that can cause suggestions to appear. */
    triggers: Array<Trigger>;
    /**
     * Called when a valid suggestion query is updated. This should be handled by setting the
     * `suggestions` prop accordingly.
     */
    onShowSuggestions: (event: ShowSuggestionsEvent) => void;
    /** Called when suggestions should be hidden. Set `suggestions` to `null` in this case. */
    onHideSuggestions: () => void;
    /**
     * The currently visible list of suggestions. If `loading`, a loading indicator will be
     * shown. If `null` or empty, the list will be hidden. Suggestion sort will be preserved.
     *
     * Typically, this should not contain more than five or so suggestions.
     */
    suggestions: Suggestions | null;
    /**
     * If `true`, suggestions will be applied with both `Tab` and `Enter`, instead of just
     * `Enter`. This may be expected behavior for users used to IDEs, but use caution when
     * hijacking browser tabbing capability.
     * @default false
     */
    tabInsertsSuggestions?: boolean;
    /**
     * The `AutocompleteTextarea` has a container for positioning the suggestions overlay.
     * This can break some layouts (ie, if the editor must expand with `flex: 1` to fill space)
     * so you can override container styles here. Usually this should not be necessary.
     * `position` may not be overriden.
     */
    sx?: Omit<BetterSystemStyleObject, 'position'>;
    /**
     * An `input` or `textarea` compatible component to extend. A compatible component is any
     * component that forwards a ref and props to an underlying `input` or `textarea` element,
     * including but not limited to `Input`, `TextArea`, `input`, `textarea`, `styled.input`,
     * and `styled.textarea`. If the child is not compatible, a runtime `TypeError` will be
     * thrown.
     */
    children: TextInputCompatibleChild;
};
/**
 * Shows suggestions to complete the current word/phrase the user is actively typing.
 */
declare const InlineAutocomplete: ({ triggers, suggestions, onShowSuggestions, onHideSuggestions, sx, children, tabInsertsSuggestions, ...forwardProps }: InlineAutocompleteProps & React.ComponentProps<'textarea' | 'input'>) => JSX.Element;
export default InlineAutocomplete;
