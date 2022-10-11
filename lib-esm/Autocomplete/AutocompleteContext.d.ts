/// <reference types="react" />
export declare const AutocompleteContext: import("react").Context<{
    activeDescendantRef: React.MutableRefObject<HTMLElement | null>;
    autocompleteSuggestion: string;
    id: string;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    inputValue: string;
    isMenuDirectlyActivated: boolean;
    scrollContainerRef: React.MutableRefObject<HTMLElement | null>;
    selectedItemLength: number;
    setAutocompleteSuggestion: (value: string) => void;
    setInputValue: (value: string) => void;
    setIsMenuDirectlyActivated: (value: boolean) => void;
    setSelectedItemLength: (value: number) => void;
    setShowMenu: (value: boolean) => void;
    showMenu: boolean;
} | null>;
