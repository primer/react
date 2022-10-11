export declare type CharacterCoordinates = {
    /** Number of pixels from the origin down to the top edge of the character. */
    top: number;
    /** Number of pixels from the origin right to the left edge of the character. */
    left: number;
    /** Height of the character. */
    height: number;
};
/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the interior of the input (not adjusted for scroll).
 *
 * Adapted from https://github.com/koddsson/textarea-caret-position, which was itself
 * forked from https://github.com/component/textarea-caret-position.
 *
 * @param element The target input element.
 * @param index The index of the character to calculate.
 */
export declare function getCharacterCoordinates(element: HTMLTextAreaElement | HTMLInputElement, index: number): CharacterCoordinates;
/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the input element (adjusted for scroll). This includes horizontal
 * scroll in single-line inputs.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 */
export declare const getScrollAdjustedCharacterCoordinates: (input: HTMLTextAreaElement | HTMLInputElement, index: number) => CharacterCoordinates;
/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the document. Since this is relative to the document, it is also adjusted
 * for the input's scroll.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 */
export declare const getAbsoluteCharacterCoordinates: (input: HTMLTextAreaElement | HTMLInputElement, index: number) => CharacterCoordinates;
