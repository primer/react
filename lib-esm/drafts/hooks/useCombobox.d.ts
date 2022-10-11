export declare type ComboboxCommitEvent<T> = {
    /** The underlying `combobox-commit` event. */
    nativeEvent: Event & {
        target: HTMLElement;
    };
    /** The option that was committed. */
    option: T;
};
declare type UseComboboxSettings<T> = {
    /** When open, the combobox will start listening for keyboard events. */
    isOpen: boolean;
    /**
     * The list used to select items. This should usually be a Primer `ActionList`. The
     * list must contain items with `role="option"`.
     */
    listElement: HTMLOListElement | HTMLUListElement | null;
    /**
     * The input this belongs to. The input value is not controlled by this component, but
     * the element reference is used to bind keyboard events and attributes.
     */
    inputElement: HTMLInputElement | HTMLTextAreaElement | null;
    /** Called when the user applies the selected suggestion. */
    onCommit: (event: ComboboxCommitEvent<T>) => void;
    /**
     * The array of available options. `useCombobox` doesn't render the options, but it does
     * need to know what they are (for callbacks) and when they change (for binding events
     * and attributes).
     */
    options: Array<T>;
    /**
     * If `true`, suggestions will be applied with both `Tab` and `Enter`, instead of just
     * `Enter`. This may be expected behavior for users used to IDEs, but use caution when
     * hijacking browser tabbing capability.
     * @default false
     */
    tabInsertsSuggestions?: boolean;
    /**
     * By default, if the menu is open and the user presses `Enter` without pressing the
     * down arrow, the menu will close. To instead insert the first option in the list in
     * this case, enable this setting. Style the default option using
     * `[data-combobox-option-default]`.
     */
    defaultFirstOption?: boolean;
};
/**
 * Lightweight hook wrapper around the GitHub `Combobox` class from `@github/combobox-nav`.
 * With this hook, keyboard navigation through suggestions is automatically handled and
 * accessibility attributes are added.
 *
 * `useCombobox` will set nearly all necessary attributes by effect, but you **must** set
 * `role="option"` on list items in order for them to be 'seen' by the combobox. Style the
 * currently highlighted option with the `[aria-selected="true"]` selector.
 */
export declare const useCombobox: <T>({ isOpen, listElement: list, inputElement: input, onCommit: externalOnCommit, options, tabInsertsSuggestions, defaultFirstOption }: UseComboboxSettings<T>) => void;
export {};
