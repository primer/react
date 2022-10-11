/// <reference types="react" />
export type { MarkdownEditorHandle } from './MarkdownEditor';
declare const MarkdownEditor: import("react").ForwardRefExoticComponent<import("../..").SxProp & {
    value: string;
    onChange: (newMarkdown: string) => void;
    onRenderPreview: (markdown: string) => Promise<string>;
    children: import("react").ReactNode;
    disabled?: boolean | undefined;
    placeholder?: string | undefined;
    maxLength?: number | undefined;
    fullHeight?: boolean | undefined;
    'aria-describedby'?: string | undefined;
    viewMode?: import("./_ViewSwitch").MarkdownViewMode | undefined;
    onChangeViewMode?: ((newViewMode: import("./_ViewSwitch").MarkdownViewMode) => void) | undefined;
    onPrimaryAction?: (() => void) | undefined;
    minHeightLines?: number | undefined;
    maxHeightLines?: number | undefined;
    emojiSuggestions?: import("./suggestions/_useEmojiSuggestions").Emoji[] | undefined;
    mentionSuggestions?: import("./suggestions/_useMentionSuggestions").Mentionable[] | undefined;
    referenceSuggestions?: import("./suggestions/_useReferenceSuggestions").Reference[] | undefined;
    onUploadFile?: ((file: File) => Promise<import("./_useFileHandling").FileUploadResult>) | undefined;
    acceptedFileTypes?: import("./_useFileHandling").FileType[] | undefined;
    monospace?: boolean | undefined;
    required?: boolean | undefined;
    name?: string | undefined;
    savedReplies?: import("./_SavedReplies").SavedReply[] | undefined;
    pasteUrlsAsPlainText?: boolean | undefined;
} & import("react").RefAttributes<import("./MarkdownEditor").MarkdownEditorHandle>> & {
    /** REQUIRED: An accessible label for the editor. */
    Label: import("react").FC<import("../..").SxProp & {
        visuallyHidden?: boolean | undefined;
        children?: import("react").ReactNode;
    }>;
    /**
     * An optional custom toolbar. The toolbar should contain `ToolbarButton`s before
     * and/or after a `DefaultToolbarButtons` instance. To create groups of buttons, wrap
     * them in an unstyled `Box`.
     */
    Toolbar: {
        ({ children }: {
            children?: import("react").ReactNode;
        }): JSX.Element;
        displayName: string;
    };
    /**
     * A custom toolbar button. This takes `IconButton` props. Every toolbar button should
     * have an `aria-label` defined.
     */
    ToolbarButton: import("react").ForwardRefExoticComponent<Pick<import("../..").IconButtonProps, string | number | symbol> & import("react").RefAttributes<HTMLButtonElement>>;
    /**
     * The full set of default toolbar buttons. This is all the basic formatting tools in a
     * standardized order.
     */
    DefaultToolbarButtons: import("react").MemoExoticComponent<() => JSX.Element>;
    /**
     * Optionally define a set of custom buttons to show in the editor footer. Often if you
     * are defining custom buttons you should also wrap the editor in a `<form>`. This
     * component should only contain `ActionButton`s.
     */
    Actions: {
        ({ children }: {
            children?: import("react").ReactNode;
        }): JSX.Element;
        displayName: string; /**
         * An optional custom toolbar. The toolbar should contain `ToolbarButton`s before
         * and/or after a `DefaultToolbarButtons` instance. To create groups of buttons, wrap
         * them in an unstyled `Box`.
         */
    };
    /** A button to show in the editor footer. */
    ActionButton: import("react").ForwardRefExoticComponent<Pick<import("../..").ButtonProps, string | number | symbol> & import("react").RefAttributes<HTMLButtonElement>>;
};
export default MarkdownEditor;
export type { MarkdownEditorProps } from './MarkdownEditor';
export type { Emoji } from './suggestions/_useEmojiSuggestions';
export type { Mentionable } from './suggestions/_useMentionSuggestions';
export type { Reference } from './suggestions/_useReferenceSuggestions';
export type { FileUploadResult, FileType } from './_useFileHandling';
export type { SavedReply } from './_SavedReplies';
