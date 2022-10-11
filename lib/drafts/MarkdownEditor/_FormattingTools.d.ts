import React from 'react';
export declare type FormattingTools = {
    header: () => void;
    bold: () => void;
    italic: () => void;
    quote: () => void;
    code: () => void;
    link: () => void;
    unorderedList: () => void;
    orderedList: () => void;
    taskList: () => void;
    mention: () => void;
    reference: () => void;
};
/**
 * Renders an invisible `markdown-toolbar-element` that provides formatting actions to the
 * editor. This is a hacky way of using the library, but it allows us to use the built-in
 * behavior without having to actually display the inflexible toolbar element. It also means
 * we can still use the formatting tools even if the consumer hides the default toolbar
 * buttons (ie, by keyboard shortcut).
 */
export declare const FormattingTools: React.ForwardRefExoticComponent<{
    forInputId: string;
} & React.RefAttributes<FormattingTools>>;
