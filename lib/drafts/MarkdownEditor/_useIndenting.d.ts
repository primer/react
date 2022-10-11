/// <reference types="react" />
import { SyntheticChangeEmitter } from '../hooks/useSyntheticChange';
declare type UseIndentingSettings = {
    emitChange: SyntheticChangeEmitter;
};
declare type UseIndentingResult = {
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
};
/**
 * Provides functionality for indenting and dedenting selected lines in the Markdown editor.
 */
export declare const useIndenting: ({ emitChange }: UseIndentingSettings) => UseIndentingResult;
export {};
