import { DOMAttributes } from 'react';
declare type DangerousHtmlContainer = Required<DOMAttributes<unknown>>['dangerouslySetInnerHTML'];
declare type CoreMarkdownViewerProps = {
    /** Show a loading spinner instead of content. */
    loading?: boolean;
    /**
     * Set the rendered HTML of the viewer. To prevent XSS, ensure that the source of this
     * HTML is trusted!
     */
    dangerousRenderedHTML: DangerousHtmlContainer;
    /**
     * Called when the user clicks a link element. This can be used to intercept the click
     * and provide custom routing. Note that this is a native HTML `MouseEvent` and not a
     * `React.ClickEvent`.
     */
    onLinkClick?: (event: MouseEvent) => void;
    openLinksInNewTab?: boolean;
};
export declare type InteractiveMarkdownViewerProps = CoreMarkdownViewerProps & {
    /**
     * The markdown the HTML was rendered from. This is not used for viewing, only as a source
     * for change events.
     */
    markdownValue: string;
    /**
     * Called when the user interacts and updates the Markdown. The rendered Markdown is
     * updated eagerly - if the request fails, a rejected Promise should be returned by
     * this handler. In that case, the viewer will revert the visual change.
     *
     * If the change is handled by an async API request (as it typically will be in production
     * code), the viewer should be `disabled` while the request is pending to avoid conflicts.
     * To allow users to check multiple boxes rapidly, the API request should be debounced (an
     * ideal debounce duration is about 1 second).
     */
    onChange: (markdown: string) => void | Promise<void>;
    /** Control whether interaction is disabled. */
    disabled?: boolean;
};
declare type NoninteractiveMarkdownViewerProps = CoreMarkdownViewerProps & {
    markdownValue?: undefined;
    onChange?: undefined;
    disabled?: undefined;
};
export declare type MarkdownViewerProps = NoninteractiveMarkdownViewerProps | InteractiveMarkdownViewerProps;
declare const MarkdownViewer: ({ dangerousRenderedHTML, loading, markdownValue, onChange: externalOnChange, disabled, onLinkClick, openLinksInNewTab }: MarkdownViewerProps) => JSX.Element;
export default MarkdownViewer;
