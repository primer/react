import React from 'react';
import { TextareaProps } from '../../Textarea';
import { Emoji } from './suggestions/_useEmojiSuggestions';
import { Mentionable } from './suggestions/_useMentionSuggestions';
import { Reference } from './suggestions/_useReferenceSuggestions';
interface MarkdownInputProps extends Omit<TextareaProps, 'onChange'> {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    disabled?: boolean;
    placeholder?: string;
    id: string;
    maxLength?: number;
    fullHeight?: boolean;
    isDraggedOver: boolean;
    emojiSuggestions?: Array<Emoji>;
    mentionSuggestions?: Array<Mentionable>;
    referenceSuggestions?: Array<Reference>;
    minHeightLines: number;
    maxHeightLines: number;
    monospace: boolean;
    pasteUrlsAsPlainText: boolean;
    /** Use this prop to control visibility instead of unmounting, so the undo stack and custom height are preserved. */
    visible: boolean;
}
export declare const MarkdownInput: React.ForwardRefExoticComponent<MarkdownInputProps & React.RefAttributes<HTMLTextAreaElement>>;
export {};
