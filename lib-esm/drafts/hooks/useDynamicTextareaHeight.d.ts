import { SxProp } from '../../sx';
declare type UseDynamicTextareaHeightSettings = {
    minHeightLines: number;
    maxHeightLines: number;
    element: HTMLTextAreaElement | null;
    /** The current value of the input. */
    value: string;
};
/**
 * Calculates the optimal height of the textarea according to its content, automatically
 * resizing it as the user types. If the user manually resizes the textarea, their setting
 * will be respected.
 *
 * Returns an object to spread to the component's `sx` prop.
 *
 * NOTE: for the most accurate results, be sure that the `lineHeight` of the element is
 * explicitly set in CSS.
 */
export declare const useDynamicTextareaHeight: ({ minHeightLines, maxHeightLines, element, value }: UseDynamicTextareaHeightSettings) => SxProp['sx'];
export {};
