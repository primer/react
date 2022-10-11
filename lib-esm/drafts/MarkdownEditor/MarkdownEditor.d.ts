import React from 'react';
import { FileType } from '../hooks/useUnifiedFileSelect';
import { SxProp } from '../../sx';
import { FileUploadResult } from './_useFileHandling';
import { MarkdownViewMode } from './_ViewSwitch';
import { SavedReply } from './_SavedReplies';
import { Emoji } from './suggestions/_useEmojiSuggestions';
import { Mentionable } from './suggestions/_useMentionSuggestions';
import { Reference } from './suggestions/_useReferenceSuggestions';
export declare type MarkdownEditorProps = SxProp & {
    /** Current value of the editor as a multiline markdown string. */
    value: string;
    /** Called when the value changes. */
    onChange: (newMarkdown: string) => void;
    /**
     * Accepts Markdown and returns rendered HTML. To prevent XSS attacks,
     * the HTML should be sanitized and/or come from a trusted source.
     */
    onRenderPreview: (markdown: string) => Promise<string>;
    children: React.ReactNode;
    /** Disable the editor and all related buttons. Users can still switch between preview & edit modes. */
    disabled?: boolean;
    /** Placeholder text to show when the editor is empty. By default, no placeholder will be shown. */
    placeholder?: string;
    /** Maximum number of characters the markdown can hold (includes formatting characters like `*`). */
    maxLength?: number;
    /**
     * Force the editor to take up the full height of the container and disallow resizing. Only
     * use when the container height is tall enough that the user will never want to expand the
     * input further, ie when it takes the full height of the viewport.
     */
    fullHeight?: boolean;
    /** ID of the describing element. */
    'aria-describedby'?: string;
    /** Optionally control the view mode. If uncontrolled, leave this `undefined`. */
    viewMode?: MarkdownViewMode;
    /** If `viewMode` is controlled, this will be called on change. */
    onChangeViewMode?: (newViewMode: MarkdownViewMode) => void;
    /**
     * Called when the user presses `Ctrl`/`Cmd` + `Enter`. Should almost always be wired to
     * the same event as clicking the primary `actionButton`.
     */
    onPrimaryAction?: () => void;
    /**
     * Minimum number of visible lines of text in the editor.
     * @default 5
     */
    minHeightLines?: number;
    /**
     * Maximum number of visible lines of text in the editor. Has no effect if `fullHeight = true`.
     * @default 35
     */
    maxHeightLines?: number;
    /** Array of all possible emojis to suggest. Leave `undefined` to disable emoji autocomplete. */
    emojiSuggestions?: Array<Emoji>;
    /** Array of all possible mention suggestions. Leave `undefined` to disable `@`-mention autocomplete. */
    mentionSuggestions?: Array<Mentionable>;
    /** Array of all possible references to suggest. Leave `undefined` to disable `#`-reference autocomplete. */
    referenceSuggestions?: Array<Reference>;
    /**
     * Uploads a file to a hosting service and returns the URL. If not provided, file uploads
     * will be disabled.
     */
    onUploadFile?: (file: File) => Promise<FileUploadResult>;
    /**
     * Array of allowed file types. If `onUploadFile` is defined but this array is not, all
     * file types will be accepted. You can still reject file types by rejecting the `onUploadFile`
     * promise, but setting this array provides a better user experience by preventing the
     * upload in the first place.
     */
    acceptedFileTypes?: FileType[];
    /** Control whether the editor font is monospace. */
    monospace?: boolean;
    /** Control whether the input is required. */
    required?: boolean;
    /** The name that will be given to the `textarea`. */
    name?: string;
    /** To enable the saved replies feature, provide an array of replies. */
    savedReplies?: SavedReply[];
    /**
     * Control whether URLs are pasted as plain text instead of as formatted links (if the
     * user has selected some text before pasting). Defaults to `false` (URLs will paste as
     * links). This should typically be controlled by user settings.
     *
     * Users can always toggle this behavior by holding `shift` when pasting.
     */
    pasteUrlsAsPlainText?: boolean;
};
declare const handleBrand: unique symbol;
export interface MarkdownEditorHandle {
    /** Focus on the markdown textarea (has no effect in preview mode). */
    focus: (options?: FocusOptions) => void;
    /** Scroll to the editor. */
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
    /**
     * This 'fake' member prevents other types from being assigned to this, thus
     * disallowing broader ref types like `HTMLTextAreaElement`.
     * @private
     */
    [handleBrand]: undefined;
}
export declare const MarkdownEditorSlot: React.FC<React.PropsWithChildren<{
    name: "Label" | "Toolbar" | "Actions";
    children: React.ReactNode;
}>>;
/**
 * Markdown textarea with controls & keyboard shortcuts.
 */
declare const MarkdownEditor: React.ForwardRefExoticComponent<SxProp & {
    /** Current value of the editor as a multiline markdown string. */
    value: string;
    /** Called when the value changes. */
    onChange: (newMarkdown: string) => void;
    /**
     * Accepts Markdown and returns rendered HTML. To prevent XSS attacks,
     * the HTML should be sanitized and/or come from a trusted source.
     */
    onRenderPreview: (markdown: string) => Promise<string>;
    children: React.ReactNode;
    /** Disable the editor and all related buttons. Users can still switch between preview & edit modes. */
    disabled?: boolean | undefined;
    /** Placeholder text to show when the editor is empty. By default, no placeholder will be shown. */
    placeholder?: string | undefined;
    /** Maximum number of characters the markdown can hold (includes formatting characters like `*`). */
    maxLength?: number | undefined;
    /**
     * Force the editor to take up the full height of the container and disallow resizing. Only
     * use when the container height is tall enough that the user will never want to expand the
     * input further, ie when it takes the full height of the viewport.
     */
    fullHeight?: boolean | undefined;
    /** ID of the describing element. */
    'aria-describedby'?: string | undefined;
    /** Optionally control the view mode. If uncontrolled, leave this `undefined`. */
    viewMode?: MarkdownViewMode | undefined;
    /** If `viewMode` is controlled, this will be called on change. */
    onChangeViewMode?: ((newViewMode: MarkdownViewMode) => void) | undefined;
    /**
     * Called when the user presses `Ctrl`/`Cmd` + `Enter`. Should almost always be wired to
     * the same event as clicking the primary `actionButton`.
     */
    onPrimaryAction?: (() => void) | undefined;
    /**
     * Minimum number of visible lines of text in the editor.
     * @default 5
     */
    minHeightLines?: number | undefined;
    /**
     * Maximum number of visible lines of text in the editor. Has no effect if `fullHeight = true`.
     * @default 35
     */
    maxHeightLines?: number | undefined;
    /** Array of all possible emojis to suggest. Leave `undefined` to disable emoji autocomplete. */
    emojiSuggestions?: Emoji[] | undefined;
    /** Array of all possible mention suggestions. Leave `undefined` to disable `@`-mention autocomplete. */
    mentionSuggestions?: Mentionable[] | undefined;
    /** Array of all possible references to suggest. Leave `undefined` to disable `#`-reference autocomplete. */
    referenceSuggestions?: Reference[] | undefined;
    /**
     * Uploads a file to a hosting service and returns the URL. If not provided, file uploads
     * will be disabled.
     */
    onUploadFile?: ((file: File) => Promise<FileUploadResult>) | undefined;
    /**
     * Array of allowed file types. If `onUploadFile` is defined but this array is not, all
     * file types will be accepted. You can still reject file types by rejecting the `onUploadFile`
     * promise, but setting this array provides a better user experience by preventing the
     * upload in the first place.
     */
    acceptedFileTypes?: FileType[] | undefined;
    /** Control whether the editor font is monospace. */
    monospace?: boolean | undefined;
    /** Control whether the input is required. */
    required?: boolean | undefined;
    /** The name that will be given to the `textarea`. */
    name?: string | undefined;
    /** To enable the saved replies feature, provide an array of replies. */
    savedReplies?: SavedReply[] | undefined;
    /**
     * Control whether URLs are pasted as plain text instead of as formatted links (if the
     * user has selected some text before pasting). Defaults to `false` (URLs will paste as
     * links). This should typically be controlled by user settings.
     *
     * Users can always toggle this behavior by holding `shift` when pasting.
     */
    pasteUrlsAsPlainText?: boolean | undefined;
} & React.RefAttributes<MarkdownEditorHandle>>;
export default MarkdownEditor;
