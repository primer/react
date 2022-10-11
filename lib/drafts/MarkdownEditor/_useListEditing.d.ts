/// <reference types="react" />
import { SyntheticChangeEmitter } from '../hooks/useSyntheticChange';
declare type UseListEditingSettings = {
    emitChange: SyntheticChangeEmitter;
};
declare type UseListEditingResult = {
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
};
/**
 * Adapted from: https://github.com/github/github/blob/ef649172de6802a699638e22798396ca78d61dc8/app/assets/modules/github/behaviors/task-list.ts#L404
 *
 * Groups:
 *  0. Leading whitespace
 *  1. Delimeter
 *  2. Item number (optional)
 *     - Note that we don't have item letter - we don't do autocomplete for lettered lists like (a, b, c) or (i, ii, iii) because it's too complex
 *  3. Task box (optional)
 *  4. Everything following
 */
export declare const listItemRegex: RegExp;
export declare type ListItem = {
    leadingWhitespace: string;
    text: string;
    delimeter: '-' | '*' | number;
    taskBox: '[ ]' | '[x]' | null;
};
export declare const parseListItem: (line: string) => ListItem | null;
export declare const listItemToString: (item: ListItem) => string;
/**
 * Provides support for list editing in the Markdown editor. This includes inserting new
 * list items and auto-incrementing numeric lists.
 */
export declare const useListEditing: ({ emitChange }: UseListEditingSettings) => UseListEditingResult;
export {};
