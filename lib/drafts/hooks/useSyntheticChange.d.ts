/// <reference types="react" />
declare type UseSyntheticChangeSettings<Element extends HTMLTextAreaElement | HTMLInputElement = HTMLTextAreaElement | HTMLInputElement> = {
    /** Ref to the input element to change. */
    inputRef: React.RefObject<Element>;
    /**
     * A callback that will be triggered when the normal method of faking a synthetic event
     * fails. This should be the same function as the input's `onChange` handler.
     *
     * The ideal behavior is to simulate change as though a user had typed the value, which in
     * turn will call any change event handlers on the input. That doesn't work in all browsers,
     * so the fallback behavior is to call this handler with a simulated event.
     */
    fallbackEventHandler: React.ChangeEventHandler<Element>;
};
/**
 * A function that, when called, will simulate a synthetic change event on the bound input.
 * @param insertValue The value to insert.
 * @param replaceRange The range of text to replace. By default, text will be inserted
 * as though the user typed it, replacing any currently selected text.
 * @param newSelection Selection to apply after the change. By default, the caret will
 * be automatically adjusted based on the replaced text, moving it to the end of the inserted
 * text if it was inside the `replaceRange` before. Can be a single number for a caret location
 * or two numbers for a selection range.
 */
export declare type SyntheticChangeEmitter = (insertValue: string, replaceRange?: [startIndexInclusive: number, endIndexExclusive: number], newSelection?: number | [number, number]) => void;
/**
 * Returns a function that will synthetically change the input, attempting to maintain caret
 * position and undo history as though the user had typed using a keyboard.
 *
 * Will first attempt to use the non-standard browser `execCommmand` API to simulate a typing
 * action. Failing this (ie, in test environments or certain browsers), the fallback handler
 * will be called with a fake constructed `ChangeEvent` that looks like a real event.
 */
export declare const useSyntheticChange: ({ inputRef, fallbackEventHandler }: UseSyntheticChangeSettings) => SyntheticChangeEmitter;
export {};
