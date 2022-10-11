import React from 'react';
import { TextInputProps } from './TextInput';
import Token from './Token/Token';
import { TokenSizeKeys } from './Token/TokenBase';
declare type AnyReactComponent = React.ComponentType<React.PropsWithChildren<any>>;
export declare type TextInputWithTokensProps<TokenComponentType extends AnyReactComponent = typeof Token> = {
    /**
     * The array of tokens to render
     */
    tokens: TokenComponentType extends React.ComponentType<React.PropsWithChildren<infer TokenProps>> ? TokenProps[] : never;
    /**
     * The function that gets called when a token is removed
     */
    onTokenRemove: (tokenId: string | number) => void;
    /**
     * The component used to render each token
     */
    tokenComponent?: TokenComponentType;
    /**
     * The maximum height of the component. If the content in the input exceeds this height,
     * it will scroll vertically
     */
    maxHeight?: React.CSSProperties['maxHeight'];
    /**
     * Whether tokens should render inline horizontally. By default, tokens wrap to new lines.
     */
    preventTokenWrapping?: boolean;
    /**
     * The size of the tokens and text input
     */
    size?: TokenSizeKeys;
    /**
     * Whether the remove buttons should be rendered in the tokens
     */
    hideTokenRemoveButtons?: boolean;
    /**
     * The number of tokens to display before truncating
     */
    visibleTokenCount?: number;
} & Omit<TextInputProps, 'size'>;
declare const TextInputWithTokens: React.ForwardRefExoticComponent<{
    /**
     * The array of tokens to render
     */
    tokens: any[];
    /**
     * The function that gets called when a token is removed
     */
    onTokenRemove: (tokenId: string | number) => void;
    /**
     * The component used to render each token
     */
    tokenComponent?: AnyReactComponent | undefined;
    /**
     * The maximum height of the component. If the content in the input exceeds this height,
     * it will scroll vertically
     */
    maxHeight?: React.CSSProperties['maxHeight'];
    /**
     * Whether tokens should render inline horizontally. By default, tokens wrap to new lines.
     */
    preventTokenWrapping?: boolean | undefined;
    /**
     * The size of the tokens and text input
     */
    size?: TokenSizeKeys | undefined;
    /**
     * Whether the remove buttons should be rendered in the tokens
     */
    hideTokenRemoveButtons?: boolean | undefined;
    /**
     * The number of tokens to display before truncating
     */
    visibleTokenCount?: number | undefined;
} & Omit<TextInputProps, "size"> & React.RefAttributes<HTMLInputElement>>;
export default TextInputWithTokens;
