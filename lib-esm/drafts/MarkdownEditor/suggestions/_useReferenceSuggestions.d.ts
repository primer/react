import { UseSuggestionsHook } from '.';
export declare type Reference = {
    titleHtml: string;
    titleText: string;
    id: string;
    iconHtml?: string;
};
export declare const useReferenceSuggestions: UseSuggestionsHook<Reference>;
