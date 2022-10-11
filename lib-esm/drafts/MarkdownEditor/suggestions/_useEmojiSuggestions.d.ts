import { UseSuggestionsHook } from '.';
export declare type Emoji = {
    /** Name (shortcode) of the emoji. Do not include the wrapping `:` symbols. */
    name: string;
    /** Unicode representation of the emoji. */
    character: string;
};
export declare const useEmojiSuggestions: UseSuggestionsHook<Emoji>;
