import React, { RefObject } from 'react';
import { Theme } from '../ThemeProvider';
export declare const UnderlineNavContext: React.Context<{
    theme: Theme | undefined;
    setChildrenWidth: React.Dispatch<{
        text: string;
        width: number;
    }>;
    setNoIconChildrenWidth: React.Dispatch<{
        text: string;
        width: number;
    }>;
    selectedLink: RefObject<HTMLElement> | undefined;
    setSelectedLink: (ref: RefObject<HTMLElement>) => void;
    selectedLinkText: string;
    setSelectedLinkText: React.Dispatch<React.SetStateAction<string>>;
    setFocusedLink: React.Dispatch<React.SetStateAction<RefObject<HTMLElement> | null>>;
    selectEvent: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement> | null;
    afterSelect?: ((event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void) | undefined;
    variant: 'default' | 'small';
    loadingCounters: boolean;
    iconsVisible: boolean;
}>;
