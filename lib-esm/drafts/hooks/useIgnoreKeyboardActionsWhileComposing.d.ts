import { CompositionEventHandler, KeyboardEventHandler } from 'react';
/**
 * If the user is composing text, we don't want to respond to
 * the `Enter` key to perform a typical activation
 *
 * Composing text is a special case where the user is inputting
 * text from IME (e.g. Japanese) and we don't want to save the
 * item upon receiving the enter key as that may be part of the
 * selection of the character into the input.
 *
 * issue: https://github.com/github/memex/issues/5680
 * related: https://github.com/github/memex/issues/5680
 * related: https://github.com/facebook/react/issues/3926
 *
 * @param onKeyDown: A keyboard handler callback to wrap with a callback which ignores `ENTER` while
 * composing.
 *
 * @returns props which should be spread onto an `<input>` element
 **/
export declare const useIgnoreKeyboardActionsWhileComposing: (onKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>) => {
    onCompositionStart: CompositionEventHandler<HTMLInputElement | HTMLDivElement | HTMLTextAreaElement>;
    onCompositionEnd: CompositionEventHandler<HTMLInputElement | HTMLDivElement | HTMLTextAreaElement>;
    onKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLDivElement | HTMLTextAreaElement>;
};
