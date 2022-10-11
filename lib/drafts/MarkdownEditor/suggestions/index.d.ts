import { Suggestion, Trigger } from '../../InlineAutocomplete';
export declare type UseSuggestionsHook<T> = (options: T[]) => {
    trigger: Trigger;
    calculateSuggestions: (query: string) => Suggestion[];
};
export declare const suggestionsCalculator: <T>(options: T[], score: (query: string, option: T) => number, toSuggestion: (option: T) => Suggestion) => (query: string) => Suggestion[];
